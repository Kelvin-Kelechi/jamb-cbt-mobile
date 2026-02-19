import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Modal,
  FlatList,
  Text,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { myQuest } from "@/services/myquest";

export type SubjectOption = {
  subject: string;
  year: string;
  topic: string;
  count: number;
  shuffle: boolean;
  shuffleOptions: boolean;
};

type SelectContext = {
  field: "year" | "topic" | "count" | null;
  subject: string | null;
};

export type PastOptionsProps = {
  subjects: string[];
  mode?: string;
  onStart?: (options: SubjectOption[]) => void;
};

export default function PastOptions({
  subjects,
  mode,
  onStart,
}: PastOptionsProps) {
  // Enable smooth layout transitions on Android
  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const selectedSubjects: string[] = useMemo(() => subjects ?? [], [subjects]);
  const [exam, setExam] = useState<string>("JAMB");

  const [years, setYears] = useState<string[]>([]);
  const [options, setOptions] = useState<SubjectOption[]>([]);
  const [maxCounts, setMaxCounts] = useState<Record<string, number>>({});
  const [selectOpen, setSelectOpen] = useState<boolean>(false);
  const [selectItems, setSelectItems] = useState<string[]>([]);
  const [selectContext, setSelectContext] = useState<SelectContext>({
    field: null,
    subject: null,
  });

  // Load years once (JAMB by default)
  useEffect(() => {
    (async () => {
      try {
        const exams = await myQuest.getExamList();
        const list = exams?.data || [];
        const exam = list.includes("JAMB") ? "JAMB" : list[0];
        setExam(exam);
        const yearsRes = await myQuest.getExamYears(exam);
        const ys = (yearsRes?.data as any) || [];
        const normalized = ys.map((y: any) => String(y));
        setYears(normalized);
        const latest = normalized.length
          ? normalized[normalized.length - 1]
          : "2024";
        setOptions(
          selectedSubjects.map((sub) => ({
            subject: sub,
            year: latest,
            topic: "All Topic",
            count: 10,
            shuffle: false,
            shuffleOptions: false,
          }))
        );
        // Fetch real max counts per subject for the default latest year
        await Promise.all(
          selectedSubjects.map(async (sub) => {
            try {
              const res = await myQuest.getQuestions(exam, latest, sub, 1);
              const total = Number(res?.data?.pagination?.total ?? 0);
              if (Number.isFinite(total) && total > 0) {
                setMaxCounts((prev) => ({ ...prev, [sub]: total }));
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut
                );
                setOptions((prev) =>
                  prev.map((opt) =>
                    opt.subject === sub ? { ...opt, count: total } : opt
                  )
                );
              }
            } catch (e) {
              // keep count as-is if failed; user can still pick manually
              console.warn(
                "Failed to fetch initial question total for",
                sub,
                e
              );
            }
          })
        );
      } catch (e) {
        // use sensible defaults if API fails
        const latest = "2024";
        setExam("JAMB");
        setYears(["2020", "2021", "2022", "2023", latest]);
        setOptions(
          selectedSubjects.map((sub) => ({
            subject: sub,
            year: latest,
            topic: "All Topic",
            count: 10,
            shuffle: false,
            shuffleOptions: false,
          }))
        );
      }
    })();
  }, [selectedSubjects]);

  const openSelect = async (field: SelectContext["field"], subject: string) => {
    setSelectContext({ field, subject });
    if (field === "year") {
      setSelectItems(years);
      setSelectOpen(true);
      return;
    }
    if (field === "topic") {
      setSelectItems(["All Topic"]);
      setSelectOpen(true);
      return;
    }
    if (field === "count") {
      // Use cached max if available for instant UI; fetch in background to refresh
      const opt = options.find((o) => o.subject === subject);
      const year = opt?.year ?? years[years.length - 1];
      const currentMax = maxCounts[subject];
      const buildItems = (total: number) => {
        const items: string[] = [];
        const step = 10;
        if (total <= step) {
          items.push(String(total));
        } else {
          const capped = Math.floor(total / step) * step;
          for (let n = step; n <= capped; n += step) items.push(String(n));
          if (total % step !== 0) items.push(String(total));
        }
        return items;
      };
      if (Number.isFinite(currentMax) && currentMax > 0) {
        setSelectItems(buildItems(currentMax));
        setSelectOpen(true);
      } else {
        setSelectItems(["10", "20", "30", "40", "50", "60"]);
        setSelectOpen(true);
      }
      // Refresh max in background
      try {
        const res = await myQuest.getQuestions(exam, year, subject, 1);
        const total = Number(res?.data?.pagination?.total ?? 0);
        if (Number.isFinite(total) && total > 0) {
          setMaxCounts((prev) => ({ ...prev, [subject]: total }));
          setSelectItems(buildItems(total));
        }
      } catch (e) {
        console.warn("Failed to refresh question count:", e);
      }
      return;
    }
  };

  const applySelect = async (value: string) => {
    // Animate width change smoothly when selection updates
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // Capture current context before state resets
    const ctxField = selectContext.field;
    const ctxSubject = selectContext.subject;
    setOptions((prev) =>
      prev.map((opt) => {
        if (opt.subject !== selectContext.subject) return opt;
        if (selectContext.field === "year") return { ...opt, year: value };
        if (selectContext.field === "topic") return { ...opt, topic: value };
        if (selectContext.field === "count")
          return { ...opt, count: parseInt(value, 10) };
        return opt;
      })
    );
    setSelectOpen(false);
    setSelectContext({ field: null, subject: null });
    // If year changed, immediately recompute max and clamp count
    if (ctxField === "year" && ctxSubject) {
      try {
        const res = await myQuest.getQuestions(exam, value, ctxSubject, 1);
        const total = Number(res?.data?.pagination?.total ?? 0);
        if (Number.isFinite(total) && total > 0) {
          setMaxCounts((prev) => ({ ...prev, [ctxSubject]: total }));
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setOptions((prev) =>
            prev.map((opt) =>
              opt.subject === ctxSubject
                ? { ...opt, count: Math.min(opt.count || total, total) }
                : opt
            )
          );
        }
      } catch (e) {
        console.warn("Failed to fetch count for changed year:", e);
      }
    }
  };

  const toggleShuffle = (subject: string, type: "question" | "options") => {
    setOptions((prev) =>
      prev.map((opt) => {
        if (opt.subject !== subject) return opt;
        if (type === "question") return { ...opt, shuffle: !opt.shuffle };
        return { ...opt, shuffleOptions: !opt.shuffleOptions };
      })
    );
  };

  const start = () => {
    if (onStart) onStart(options);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {options.map((opt, idx) => (
          <View key={opt.subject + idx} style={styles.card}>
            <ThemedText style={styles.cardTitle}>{opt.subject}</ThemedText>
            <View style={styles.divider} />

            <View style={styles.row}>
              <ThemedText style={styles.rowLabel}>Year</ThemedText>
              <Pressable
                style={styles.select}
                onPress={() => openSelect("year", opt.subject)}
              >
                <ThemedText style={styles.selectText} numberOfLines={1}>
                  {opt.year}
                </ThemedText>
                <IconSymbol
                  size={14}
                  name="chevron.down"
                  color="#2A2A2A"
                  style={{ position: "absolute", right: 10, top: 15 }}
                />
              </Pressable>
            </View>

            <View style={styles.row}>
              <ThemedText style={styles.rowLabel}>Topics</ThemedText>
              <Pressable
                style={styles.select}
                onPress={() => openSelect("topic", opt.subject)}
              >
                <ThemedText style={styles.selectText} numberOfLines={1}>
                  {opt.topic}
                </ThemedText>
                <IconSymbol
                  size={14}
                  name="chevron.down"
                  color="#2A2A2A"
                  style={{ position: "absolute", right: 10, top: 15 }}
                />
              </Pressable>
            </View>

            <View style={styles.row}>
              <ThemedText style={styles.rowLabel}>No of Questions</ThemedText>
              <Pressable
                style={styles.select}
                onPress={() => openSelect("count", opt.subject)}
              >
                <ThemedText style={styles.selectText} numberOfLines={1}>
                  {String(opt.count)}
                </ThemedText>
                <IconSymbol
                  size={14}
                  name="chevron.down"
                  color="#2A2A2A"
                  style={{ position: "absolute", right: 10, top: 15 }}
                />
              </Pressable>
            </View>

            <View style={styles.shuffleContainer}>
              <Pressable
                style={styles.shuffleRow}
                onPress={() => toggleShuffle(opt.subject, "question")}
              >
                <View
                  style={[
                    styles.checkbox,
                    opt.shuffle && styles.checkboxChecked,
                  ]}
                >
                  {opt.shuffle && (
                    <IconSymbol size={14} name="checkmark" color="#FFFFFF" />
                  )}
                </View>
                <ThemedText style={styles.shuffleText}>
                  Shuffle Question
                </ThemedText>
              </Pressable>

              <Pressable
                style={styles.shuffleRow}
                onPress={() => toggleShuffle(opt.subject, "options")}
              >
                <View
                  style={[
                    styles.checkbox,
                    opt.shuffleOptions && styles.checkboxChecked,
                  ]}
                >
                  {opt.shuffleOptions && (
                    <IconSymbol size={14} name="checkmark" color="#FFFFFF" />
                  )}
                </View>
                <ThemedText style={styles.shuffleText}>
                  Shuffle Options
                </ThemedText>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footerSpacer} />
      <View style={styles.stickyFooter}>
        <Pressable
          accessibilityRole="button"
          style={styles.ctaBtn}
          onPress={start}
        >
          <Text style={styles.ctaText}>
            {mode === "exam" ? "Continue" : "Start Study"}
          </Text>
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={selectOpen}
        onRequestClose={() => setSelectOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <FlatList
              data={selectItems}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.modalItem}
                  onPress={() => applySelect(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </Pressable>
              )}
            />
            <Pressable
              style={styles.modalCancel}
              onPress={() => setSelectOpen(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  scrollContent: { gap: 12, paddingBottom: 120 },
  card: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    backgroundColor: "#e0ecdfff",
    borderColor: "#D3D3D3",
    gap: 10,
    marginTop: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#1B1B1B" },
  divider: { height: 1, backgroundColor: "#D3D3D3" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  rowLabel: { fontSize: 14, color: "#333", fontWeight: "600" },
  select: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingRight: 28, // reserve space for right-edge chevron
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 140, // 1) comfortable minimum width
    maxWidth: "70%", // 3) prevent exceeding viewport by capping relative to row width
    flexGrow: 0,
    flexShrink: 1,
    position: "relative", // allow absolute-positioned chevron at right edge
  },
  selectText: {
    fontSize: 14,
    color: "#1B1B1B",
    // 6) text overflow handling with single line; ellipsis handled by numberOfLines
  },
  shuffleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  shuffleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#6A6A6A",
    backgroundColor: "transparent",
  },
  checkboxChecked: { backgroundColor: "#2E7D32", borderColor: "#2E7D32" },
  shuffleText: { fontSize: 14, color: "#1B1B1B" },
  footerSpacer: { height: 95 },
  stickyFooter: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 30,
  },
  ctaBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    width: "86%",
    maxHeight: "60%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  modalItem: { paddingVertical: 10, paddingHorizontal: 8, borderRadius: 10 },
  modalItemText: { fontSize: 16, color: "#1B1B1B" },
  modalCancel: {
    marginTop: 8,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelText: { color: "#1B1B1B", fontWeight: "700" },
});

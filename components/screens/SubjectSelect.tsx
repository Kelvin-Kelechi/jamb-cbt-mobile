import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import { router } from "expo-router";
import ScreenContainer from "@/components/ui/ScreenContainer";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { myQuest } from "@/services/myquest";

type Mode = "study" | "exam";

type SubjectSelectProps = {
  mode: Mode;
  onSelect?: (subject: string) => void;
  onProceed?: (subjects: string[], mode: Mode) => void;
  onSelectedChange?: (subjects: string[]) => void;
};

// Subjects are fetched from MyQuest API using your API key.
// We default to the "JAMB" exam when available and pick the latest year.

export default function SubjectSelect({
  mode,
  onSelect,
  onProceed,
  onSelectedChange,
}: SubjectSelectProps) {
  const heading = mode === "study" ? "Past Question" : "Examine Yourself";
  const subtitle = "Select a subject you wish to study";
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [subjects, setSubjects] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const examsRes = await myQuest.getExamList();
        const exams = examsRes?.data || [];
        const preferredExam = exams.includes("JAMB") ? "JAMB" : exams[0];
        if (!preferredExam) throw new Error("No exams available");

        const yearsRes = await myQuest.getExamYears(preferredExam);
        const years = (yearsRes?.data as any) || [];
        const numericYears = years
          .map((y: any) =>
            typeof y === "string" ? parseInt(y, 10) : Number(y)
          )
          .filter((n: number) => !Number.isNaN(n));
        const latestYear = numericYears.length
          ? String(Math.max(...numericYears))
          : String(years[years.length - 1]);
        if (!latestYear) throw new Error("No years available");

        const subjRes = await myQuest.getSubjects(preferredExam, latestYear);
        let subjList = (subjRes?.data as any) || [];
        if (Array.isArray(subjList)) {
          subjList.sort((a: string, b: string) => {
            const aIsEnglish = a.toLowerCase().includes("use of english");
            const bIsEnglish = b.toLowerCase().includes("use of english");
            if (aIsEnglish && !bIsEnglish) return -1;
            if (!aIsEnglish && bIsEnglish) return 1;
            return 0;
          });
        }

        if (mounted) {
          setSubjects(Array.isArray(subjList) ? subjList : []);
          if (mode === "exam") {
            const english = subjList.find((s: string) =>
              s.toLowerCase().includes("use of english")
            );
            if (english) {
              setSelected((prev) => {
                const next = new Set(prev);
                next.add(english);
                return next;
              });
            }
          }
        }
      } catch (e: any) {
        console.warn("Subject load failed", e);
        if (mounted) setError(e?.message || "Failed to load subjects");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [mode]);

  const toggleSubject = (subject: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const isEnglish = subject.toLowerCase().includes("use of english");
      if (mode === "exam" && isEnglish) return next; // Prevent deselecting English in exam mode

      if (next.has(subject)) next.delete(subject);
      else next.add(subject);
      return next;
    });
    if (onSelect) onSelect(subject);
  };

  // Notify parent AFTER selection state updates to avoid setState during render
  React.useEffect(() => {
    onSelectedChange?.(Array.from(selected));
  }, [selected, onSelectedChange]);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        loading ? styles.centerContent : undefined,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {loading && <AnimatedLoader fullscreen size={48} type="spinner" />}
      {error && !loading && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.list}>
        {subjects.map((subject) => (
          <View key={subject}>
            <Pressable
              style={styles.brick}
              accessibilityLabel={`Select ${subject}`}
              onPress={() => toggleSubject(subject)}
            >
              <View style={styles.brickLeft}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconLetter}>
                    {subject.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text
                  style={styles.brickTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {subject}
                </Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  selected.has(subject) && styles.checkboxChecked,
                ]}
              >
                {selected.has(subject) && (
                  <IconSymbol size={16} name="checkmark" color="#FFFFFF" />
                )}
              </View>
            </Pressable>
            {mode === "exam" &&
              subject.toLowerCase().includes("use of english") && (
                <Text style={styles.compulsoryText}>
                  English languange is compulsory according to JAMB
                </Text>
              )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  backCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D3D3D3",
  },
  headerTextWrap: { flex: 1, alignItems: "center" },
  heading: { fontSize: 16, fontWeight: "700", color: "#000" },
  subtitle: { fontSize: 12, color: "#4A4A4A", marginTop: 2 },
  list: {
    gap: 12,
    marginTop: 8,
  },
  centerContent: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  errorText: { color: "#C62828", marginTop: 8 },
  brick: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    backgroundColor: "#e0ecdfff",
    borderColor: "#D3D3D3",
    flexWrap: "wrap",
  },
  brickLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  brickTitle: { fontSize: 16, fontWeight: "700", color: "#1B1B1B", flexShrink: 1, minWidth: 0 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLetter: { color: "#fff", fontSize: 18, fontWeight: "800" },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#6A6A6A",
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  compulsoryText: {
    width: "100%",
    fontSize: 12,
    color: "#D32F2F",
    marginTop: 4,
    marginLeft: 4,
    fontStyle: "italic",
  },
});

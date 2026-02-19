import React, { useEffect, useMemo, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, View, Pressable, Text, ScrollView } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useSavedQuestions } from "@/context/SavedQuestionsContext";
import { myQuest } from "@/services/myquest";
import type { SubjectOption } from "@/components/screens/PastOptions";
import { sampleQuestions } from "@/components/data/sampleQuestions";

type Question = {
  instruction?: string;
  question?: string;
  options?: string[];
  answer?: string;
  correction?: string;
};

export type PastStudyProps = {
  options: SubjectOption[];
  exam?: string;
  subjectIndex?: number;
  onSubjectChange?: (index: number) => void;
  page?: number;
  onChangePage?: (page: number) => void;
  onPaginationMetaChange?: (subject: string, totalPages: number) => void;
  mode?: string;
  onAnswersChange?: (answers: Record<string, string>) => void; // key: "subject-questionIndex", value: selected answer
  onQuestionsChange?: (questions: Array<{ subject: string; question: Question; globalIndex: string }>) => void;
};



export default function PastStudy({ options, exam = "JAMB", subjectIndex, onSubjectChange, page: controlledPage, onChangePage, onPaginationMetaChange, mode, onAnswersChange, onQuestionsChange }: PastStudyProps) {
  const subjects = useMemo(() => options.map((o) => o.subject), [options]);
  const [activeIdxInternal, setActiveIdxInternal] = useState(0);
  const [pageInternal, setPageInternal] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAnswer, setShowAnswer] = useState<Record<number, boolean>>({});
  const [showCorrection, setShowCorrection] = useState<Record<number, boolean>>(
    {}
  );
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [allQuestions, setAllQuestions] = useState<Array<{ subject: string; question: Question; globalIndex: string }>>([]);
  const { saveQuestion, removeQuestion, isSaved } = useSavedQuestions();

  const currentIdx = subjectIndex ?? activeIdxInternal;
  const activeSubject = subjects[currentIdx];
  const activeOpts = options.find((o) => o.subject === activeSubject);
  const page = controlledPage ?? pageInternal;

  useEffect(() => {
    setPageInternal(1);
    setShowAnswer({});
    setShowCorrection({});
    setCurrentQuestionIndex(0);
  }, [currentIdx]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const yr = activeOpts?.year || "2024";
        const res = await myQuest.getQuestions(exam, yr, activeSubject, page);
        const qData: any = res?.data?.questions || [];
        const normalized: Question[] = Array.isArray(qData)
          ? qData.map((q: any) => {
            const rawOptions = q?.options ?? q?.choices ?? [];
            const optionsArr = Array.isArray(rawOptions)
              ? rawOptions
              : rawOptions && typeof rawOptions === "object"
                ? Object.values(rawOptions)
                : [];
            return {
              instruction:
                q?.instruction || q?.question_instruction || undefined,
              question: q?.question || q?.text || undefined,
              options: optionsArr.map((v: any) => String(v)),
              answer: q?.answer || q?.correct || undefined,
              correction: q?.correction || q?.explanation || undefined,
            } as Question;
          })
          : [];
        const totalCount = (res as any)?.data?.pagination?.total ?? normalized.length;
        const pg = Math.max(1, Math.ceil(Number(totalCount || 0) / 10));
        if (!cancelled) {
          const start = (page - 1) * 10;
          const shouldSlice = normalized.length > 10 || (Number(totalCount || 0) > normalized.length);
          const pageItems = shouldSlice ? normalized.slice(start, start + 10) : normalized;
          const fallbackItems = sampleQuestions().slice(start, start + 10);
          setQuestions(pageItems.length ? pageItems : fallbackItems);
          setTotalPages(pg);
          if (activeSubject) onPaginationMetaChange?.(activeSubject, pg);
        }
      } catch {
        if (!cancelled) {
          const samples = sampleQuestions();
          const total = samples.length;
          const pg = Math.max(1, Math.ceil(total / 10));
          const start = (page - 1) * 10;
          setQuestions(samples.slice(start, start + 10));
          setTotalPages(pg);
          if (activeSubject) onPaginationMetaChange?.(activeSubject, pg);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [exam, activeSubject, activeOpts?.year, page]);

  // Shuffle utility function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Store original questions order
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // Update original questions when questions change from API
  useEffect(() => {
    if (questions.length > 0) {
      setOriginalQuestions(questions);
      // Reset shuffle seed when new questions are loaded
      setShuffleSeed(Date.now());
    }
  }, [questions.length, activeSubject, page]);

  // Compute displayed questions with shuffle applied
  const displayedQuestions = useMemo(() => {
    if (originalQuestions.length === 0) return [];

    let processed = [...originalQuestions];

    // Shuffle questions if enabled
    if (activeOpts?.shuffle) {
      processed = shuffleArray(processed);
    }

    // Shuffle options within each question if enabled
    if (activeOpts?.shuffleOptions) {
      processed = processed.map(q => ({
        ...q,
        options: q.options ? shuffleArray(q.options) : q.options,
      }));
    }

    return processed;
  }, [originalQuestions, activeOpts?.shuffle, activeOpts?.shuffleOptions, shuffleSeed]);

  // Track all questions for exam mode
  useEffect(() => {
    if (mode === "exam" && displayedQuestions.length > 0) {
      const questionsWithSubject = displayedQuestions.map((q, idx) => ({
        subject: activeSubject,
        question: q,
        globalIndex: `${activeSubject}-${(page - 1) * 10 + idx}`,
      }));

      setAllQuestions((prev) => {
        // Remove old questions from this subject/page and add new ones
        const filtered = prev.filter(
          (q) => !q.globalIndex.startsWith(`${activeSubject}-`)
        );
        return [...filtered, ...questionsWithSubject];
      });
    }
  }, [displayedQuestions, activeSubject, page, mode]);

  // Notify parent of questions changes
  useEffect(() => {
    if (mode === "exam" && onQuestionsChange) {
      onQuestionsChange(allQuestions);
    }
  }, [allQuestions, mode, onQuestionsChange]);

  // Notify parent of answers changes
  useEffect(() => {
    if (mode === "exam" && onAnswersChange) {
      const answersWithKeys: Record<string, string> = {};
      Object.entries(selectedAnswers).forEach(([idx, answer]) => {
        const globalIdx = `${activeSubject}-${idx}`;
        answersWithKeys[globalIdx] = answer;
      });
      onAnswersChange(answersWithKeys);
    }
  }, [selectedAnswers, activeSubject, mode, onAnswersChange]);

  const toggleAnswer = (idx: number) => {
    setShowAnswer((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };
  const toggleCorrection = (idx: number) => {
    setShowCorrection((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const selectOption = (questionIdx: number, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIdx]: option }));
  };

  const handleNext = () => {
    if (mode === "exam") {
      // Calculate current overall question number
      const currentOverallQuestionNum = (page - 1) * 10 + currentQuestionIndex + 1;
      // Get total questions selected for current subject
      const selectedCount = activeOpts?.count || 0;

      // Check if we've reached the selected count for this subject
      if (currentOverallQuestionNum >= selectedCount) {
        // Move to next subject if available
        if (currentIdx < subjects.length - 1) {
          const nextIdx = currentIdx + 1;
          onSubjectChange ? onSubjectChange(nextIdx) : setActiveIdxInternal(nextIdx);
          setCurrentQuestionIndex(0);
        }
        // Otherwise, we're at the end
        return;
      }

      // Navigate through questions within selected count
      if (currentQuestionIndex < displayedQuestions.length - 1) {
        // Move to next question in current page
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else if (page < totalPages) {
        // Load next page of current subject
        const next = page + 1;
        onChangePage ? onChangePage(next) : setPageInternal(next);
        setCurrentQuestionIndex(0);
      } else if (currentIdx < subjects.length - 1) {
        // Move to next subject
        const nextIdx = currentIdx + 1;
        onSubjectChange ? onSubjectChange(nextIdx) : setActiveIdxInternal(nextIdx);
        setCurrentQuestionIndex(0);
      }
    } else {
      // Study mode: just go to next page
      const next = Math.min(totalPages, page + 1);
      onChangePage ? onChangePage(next) : setPageInternal(next);
    }
  };

  const handlePrev = () => {
    if (mode === "exam") {
      // In exam mode, navigate backwards through all questions
      if (currentQuestionIndex > 0) {
        // Move to previous question in current page
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      } else if (page > 1) {
        // Load previous page of current subject
        const prev = page - 1;
        onChangePage ? onChangePage(prev) : setPageInternal(prev);
        setCurrentQuestionIndex(9); // Go to last question of previous page
      } else if (currentIdx > 0) {
        // Move to previous subject
        const prevIdx = currentIdx - 1;
        onSubjectChange ? onSubjectChange(prevIdx) : setActiveIdxInternal(prevIdx);
        // Will need to load last page of previous subject
      }
      // If at first question of first subject, button will be disabled
    } else {
      // Study mode: just go to previous page
      const prev = Math.max(1, page - 1);
      onChangePage ? onChangePage(prev) : setPageInternal(prev);
    }
  };
  return (
    <View style={styles.container}>
      {/* Subject Tabs */}
      <ThemedText type="subtitle" style={styles.headerTitle}>
        {activeSubject} {mode === "exam" && activeOpts && `(${(page - 1) * 10 + currentQuestionIndex + 1}/${activeOpts.count})`}
      </ThemedText>
      <View style={styles.tabsRow}>
        {subjects.map((s, i) => (
          <Pressable
            key={s + i}
            style={styles.tab}
            onPress={() => (onSubjectChange ? onSubjectChange(i) : setActiveIdxInternal(i))}
          >
            <ThemedText
              style={[styles.tabText, i === currentIdx && styles.tabTextActive]}
            >
              {s}
            </ThemedText>
            {i === currentIdx && <View style={styles.tabUnderline} />}
          </Pressable>
        ))}
      </View>

      {/* Questions */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {mode === "exam" ? (
          // Exam mode: Show one question at a time
          displayedQuestions.length > 0 && currentQuestionIndex < displayedQuestions.length ? (
            <View key={`q-${currentQuestionIndex}`} style={styles.card}>
              {displayedQuestions[currentQuestionIndex].instruction && (
                <View style={styles.instructionBox}>
                  <ThemedText style={styles.instructionTitle}>
                    Question Instruction
                  </ThemedText>
                  <ThemedText style={styles.instructionText}>
                    {displayedQuestions[currentQuestionIndex].instruction}
                  </ThemedText>
                </View>
              )}

              {displayedQuestions[currentQuestionIndex].question && (
                <View>
                  <View style={styles.questionHeader}>
                    <ThemedText style={styles.questionHeading}>
                      Question {(page - 1) * 10 + currentQuestionIndex + 1}
                    </ThemedText>
                    <View style={styles.iconsRow}>
                      <Pressable
                        onPress={() => {
                          const question = displayedQuestions[currentQuestionIndex];
                          const qId = `${activeSubject}-${activeOpts?.year}-${(page - 1) * 10 + currentQuestionIndex}`;
                          if (isSaved(qId)) {
                            removeQuestion(qId);
                          } else {
                            saveQuestion(
                              question,
                              activeSubject,
                              activeOpts?.year || "Unknown Year",
                              qId
                            );
                          }
                        }}
                      >
                        <FontAwesome
                          name={isSaved(`${activeSubject}-${activeOpts?.year}-${(page - 1) * 10 + currentQuestionIndex}`) ? "bookmark" : "bookmark-o"}
                          size={20}
                          color={isSaved(`${activeSubject}-${activeOpts?.year}-${(page - 1) * 10 + currentQuestionIndex}`) ? "#EF6C00" : "#666"}
                        />
                      </Pressable>
                      <FontAwesome name="flag-o" size={20} color="#666" />
                    </View>
                  </View>
                  <ThemedText style={styles.questionText}>
                    {displayedQuestions[currentQuestionIndex].question}
                  </ThemedText>
                </View>
              )}

              {(displayedQuestions[currentQuestionIndex].options || []).map((opt, i) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === opt;
                const optionLabel = String.fromCharCode(65 + i); // A, B, C, D...
                return (
                  <Pressable
                    key={`opt-${currentQuestionIndex}-${i}`}
                    style={[styles.optionRow, isSelected && styles.optionRowSelected, i === 0 && { marginTop: 12 }]}
                    onPress={() => selectOption(currentQuestionIndex, opt)}
                  >
                    <View style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      <Text style={[styles.optionLabelText, isSelected && styles.optionLabelTextSelected]}>
                        {optionLabel}
                      </Text>
                    </View>
                    <ThemedText style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {opt}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          ) : null
        ) : (
          // Study mode: Show all questions in a list
          questions.map((q, idx) => (
            <View key={`q-${idx}`} style={styles.card}>
              {q.instruction && (
                <View style={styles.instructionBox}>
                  <ThemedText style={styles.instructionTitle}>
                    Question Instruction
                  </ThemedText>
                  <ThemedText style={styles.instructionText}>
                    {q.instruction}
                  </ThemedText>
                </View>
              )}

              {q.question && (
                <View>
                  <View style={styles.questionHeader}>
                    <ThemedText style={styles.questionHeading}>
                      Question {(page - 1) * 10 + idx + 1}
                    </ThemedText>
                    <View style={styles.iconsRow}>
                      <FontAwesome name="bookmark-o" size={20} color="#666" />
                      <FontAwesome name="flag-o" size={20} color="#666" />
                    </View>
                  </View>
                  <ThemedText style={styles.questionText}>
                    {q.question}
                  </ThemedText>
                </View>
              )}

              {(q.options || []).map((opt, i) => {
                const optionLabel = String.fromCharCode(65 + i); // A, B, C, D...
                return (
                  <View key={`opt-${idx}-${i}`} style={[styles.optionRow, i === 0 && { marginTop: 12 }]}>
                    <View style={styles.optionLabel}>
                      <Text style={styles.optionLabelText}>{optionLabel}</Text>
                    </View>
                    <ThemedText style={styles.optionText}>{opt}</ThemedText>
                  </View>
                );
              })}

              <View style={styles.actionsRow}>
                <Pressable
                  style={styles.actionBtn}
                  onPress={() => toggleAnswer(idx)}
                >
                  <Text style={styles.actionText}>View Answer</Text>
                </Pressable>
                <Pressable
                  style={styles.actionBtn}
                  onPress={() => toggleCorrection(idx)}
                >
                  <Text style={styles.actionText}>View Correction</Text>
                </Pressable>
              </View>

              {showAnswer[idx] && q.answer && (
                <View style={styles.revealBox}>
                  <IconSymbol name="checkmark.circle" size={18} color="#2E7D32" />
                  <ThemedText style={styles.revealText}>
                    Answer: {q.answer}
                  </ThemedText>
                </View>
              )}
              {showCorrection[idx] && q.correction && (
                <View style={styles.revealBox}>
                  <IconSymbol name="info.circle" size={18} color="#2A2A2A" />
                  <ThemedText style={styles.revealText}>
                    {q.correction}
                  </ThemedText>
                </View>
              )}
            </View>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Pager */}
      <View style={styles.footerSpacer} />
      <View style={styles.pagerRow}>
        <Pressable
          style={[
            styles.pagerBtn,
            (mode === "exam"
              ? currentQuestionIndex === 0 && page <= 1 && currentIdx === 0
              : page <= 1) && styles.pagerDisabled
          ]}
          disabled={
            mode === "exam"
              ? currentQuestionIndex === 0 && page <= 1 && currentIdx === 0
              : page <= 1
          }
          onPress={handlePrev}
        >
          <Text style={styles.pagerText}>Prev</Text>
        </Pressable>
        <Pressable
          style={[
            styles.pagerBtn,
            (mode === "exam"
              ? (() => {
                const currentOverallQuestionNum = (page - 1) * 10 + currentQuestionIndex + 1;
                const selectedCount = activeOpts?.count || 0;
                const isLastOfSubject = currentOverallQuestionNum >= selectedCount;
                const isLastSubject = currentIdx >= subjects.length - 1;
                return isLastOfSubject && isLastSubject;
              })()
              : page >= totalPages) && styles.pagerDisabled
          ]}
          disabled={
            mode === "exam"
              ? (() => {
                const currentOverallQuestionNum = (page - 1) * 10 + currentQuestionIndex + 1;
                const selectedCount = activeOpts?.count || 0;
                const isLastOfSubject = currentOverallQuestionNum >= selectedCount;
                const isLastSubject = currentIdx >= subjects.length - 1;
                return isLastOfSubject && isLastSubject;
              })()
              : page >= totalPages
          }
          onPress={handleNext}
        >
          <Text style={styles.pagerText}>Next</Text>
        </Pressable>
        {mode !== "exam" && (
          <ThemedText style={styles.pageLabel}>
            Page: {page}/{totalPages}
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { textAlign: "center", marginTop: 8 },
  tabsRow: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 0,
    marginTop: 12,
  },
  tab: { paddingBottom: 6 },
  footerSpacer: { height: 95 },
  tabText: { fontSize: 16, color: "#6A6A6A" },
  tabTextActive: { color: "#1B1B1B", fontWeight: "700" },
  tabUnderline: { height: 2, backgroundColor: "#2E7D32", marginTop: 4 },
  scrollContent: { paddingHorizontal: 0, paddingBottom: 120, gap: 12 },
  card: {
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    backgroundColor: "#fff",
  },
  instructionBox: {
    backgroundColor: "#F3F6F9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  instructionTitle: { fontSize: 14, fontWeight: "700" },
  instructionText: { fontSize: 14, marginTop: 6 },
  questionHeading: { fontSize: 16, fontWeight: "800", marginBottom: 6 },
  questionText: { fontSize: 14, color: "#1B1B1B" },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  optionLabel: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#6A6A6A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#fff",
  },
  optionLabelSelected: {
    borderColor: "#2E7D32",
    backgroundColor: "#2E7D32",
  },
  optionLabelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6A6A6A",
  },
  optionLabelTextSelected: {
    color: "#fff",
  },
  optionText: { flex: 1, fontSize: 15, color: "#1B1B1B" },
  actionsRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: { color: "#fff", fontWeight: "700" },
  revealBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F8FFF8",
  },
  revealText: { color: "#1B1B1B" },
  pagerRow: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 35,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pagerBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    justifyContent: "center",
  },
  pagerDisabled: { opacity: 0.5 },
  pagerText: { color: "#fff", fontWeight: "700" },
  pageLabel: { marginLeft: 8 },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  iconsRow: {
    flexDirection: "row",
    gap: 16,
  },
  optionRowSelected: {
    backgroundColor: "#e8f5e9",
    borderColor: "#2E7D32",
  },
  optionTextSelected: {
    color: "#2E7D32",
    fontWeight: "600",
  },
});

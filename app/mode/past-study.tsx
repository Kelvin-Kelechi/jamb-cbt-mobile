import React, { useMemo, useRef, useState, useEffect } from "react";
import ScreenContainer from "@/components/ui/ScreenContainer";
import { StyleSheet, View, TouchableOpacity, Text, Pressable, Animated, Easing, ScrollView, Alert } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import PastStudy from "@/components/screens/PastStudy";
import type { SubjectOption } from "@/components/screens/PastOptions";
import Calculator from "@/components/Calculator";

export default function PastStudyPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ options?: string; mode?: string; timerEnabled?: string; duration?: string }>();
  const selectedOptions: SubjectOption[] = useMemo(() => {
    try {
      const o = params.options ? JSON.parse(String(params.options)) : [];
      return Array.isArray(o) ? (o as SubjectOption[]) : [];
    } catch {
      return [] as SubjectOption[];
    }
  }, [params.options]);

  const [subjectIdx, setSubjectIdx] = useState(0);
  const [page, setPage] = useState(1);
  const [pagesBySubject, setPagesBySubject] = useState<Record<string, number>>({});
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [calculatorVisible, setCalculatorVisible] = useState(false);
  const [currentQuestionNum, setCurrentQuestionNum] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [examQuestions, setExamQuestions] = useState<Array<{ subject: string; question: any; globalIndex: string }>>([]);
  const sheetY = useRef(new Animated.Value(600)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  const subjects = selectedOptions.map((o) => o.subject);

  // Initialize timer for exam mode
  useEffect(() => {
    if (params.mode === "exam" && params.timerEnabled === "true" && params.duration) {
      const duration = params.duration;
      let seconds = 0;

      // Parse duration string (e.g., "30 mins", "1 hour", "1 hr 30 mins")
      if (duration.includes("hour")) {
        const hourMatch = duration.match(/(\d+)\s*hour/);
        const minMatch = duration.match(/(\d+)\s*mins/);
        if (hourMatch) seconds += parseInt(hourMatch[1]) * 3600;
        if (minMatch) seconds += parseInt(minMatch[1]) * 60;
      } else if (duration.includes("hr")) {
        const hourMatch = duration.match(/(\d+)\s*hr/);
        const minMatch = duration.match(/(\d+)\s*mins/);
        if (hourMatch) seconds += parseInt(hourMatch[1]) * 3600;
        if (minMatch) seconds += parseInt(minMatch[1]) * 60;
      } else {
        const minMatch = duration.match(/(\d+)\s*mins/);
        if (minMatch) seconds = parseInt(minMatch[1]) * 60;
      }

      setTimeRemaining(seconds);
    }
  }, [params.mode, params.timerEnabled, params.duration]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  // Calculate total questions
  useEffect(() => {
    const total = selectedOptions.reduce((sum, opt) => sum + opt.count, 0);
    setTotalQuestions(total);
  }, [selectedOptions]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    // Calculate actual results based on user answers
    const subjectResults = selectedOptions.map((opt) => {
      const subjectQuestions = examQuestions.filter(q => q.subject === opt.subject);
      let score = 0;

      subjectQuestions.forEach((q) => {
        const userAnswer = userAnswers[q.globalIndex];
        if (userAnswer && userAnswer === q.question.answer) {
          score++;
        }
      });

      const percentage = opt.count > 0 ? Math.round((score / opt.count) * 100) : 0;

      return {
        subject: opt.subject,
        score,
        total: opt.count,
        percentage,
      };
    });

    // Prepare questions data for corrections screen
    const questionsData = examQuestions.map((q) => ({
      subject: q.subject,
      question: q.question.question || "",
      options: q.question.options || [],
      correctAnswer: q.question.answer || "",
      userAnswer: userAnswers[q.globalIndex],
      instruction: q.question.instruction,
      correction: q.question.correction,
    }));

    Alert.alert(
      "Submit Exam",
      "Are you sure you want to submit your exam?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          style: "destructive",
          onPress: () => {
            router.push({
              pathname: "/mode/exam-results",
              params: {
                results: JSON.stringify(subjectResults),
                questionsData: JSON.stringify(questionsData),
              },
            });
          }
        }
      ]
    );
  };

  const openSelector = () => {
    setSelectorOpen(true);
    Animated.parallel([
      Animated.timing(backdrop, { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(sheetY, { toValue: 0, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  };
  const closeSelector = () => {
    Animated.parallel([
      Animated.timing(backdrop, { toValue: 0, duration: 160, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.timing(sheetY, { toValue: 600, duration: 200, easing: Easing.in(Easing.quad), useNativeDriver: true }),
    ]).start(({ finished }) => finished && setSelectorOpen(false));
  };

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        {params.mode === "exam" && (
          <TouchableOpacity
            onPress={() => setCalculatorVisible(true)}
            style={styles.iconButton}
            accessibilityLabel="Open calculator"
          >
            <Ionicons name="calculator" size={24} color="#000" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={openSelector} style={styles.iconButton} accessibilityLabel="Open page selector">
          <Ionicons name="list" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <ThemedText type="title">
          {params.mode === "exam" ? "Exam" : "Study"}
        </ThemedText>
        {params.mode === "exam" && (
          <View style={styles.examControls}>
            {timeRemaining !== null && (
              <View style={styles.timerBadge}>
                <Ionicons name="time-outline" size={16} color="#fff" />
                <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
              </View>
            )}
            <Pressable style={styles.submitButtonCompact} onPress={handleSubmit}>
              <Text style={styles.submitButtonCompactText}>Submit</Text>
            </Pressable>
          </View>
        )}
      </View>
      <PastStudy
        options={selectedOptions}
        exam={"JAMB"}
        subjectIndex={subjectIdx}
        onSubjectChange={(i) => {
          setSubjectIdx(i);
          setPage(1);
        }}
        page={page}
        onChangePage={(p) => setPage(p)}
        onPaginationMetaChange={(subj, total) => setPagesBySubject((prev) => ({ ...prev, [subj]: total }))}
        mode={params.mode}
        onAnswersChange={setUserAnswers}
        onQuestionsChange={setExamQuestions}
      />

      {selectorOpen && (
        <Animated.View
          accessible
          accessibilityLabel="Page selector"
          style={[styles.backdrop, { opacity: backdrop }]}
        >
          <Pressable style={{ flex: 1 }} onPress={closeSelector} accessibilityLabel="Close selector" />
        </Animated.View>
      )}
      {selectorOpen && (
        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>
          <View style={styles.sheetHandle} />
          <ThemedText type="subtitle" style={{ textAlign: "center", marginBottom: 8 }}>Select Page</ThemedText>
          <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
            {subjects.map((s, i) => {
              const total = pagesBySubject[s] || 10;
              const pages = Array.from({ length: total }, (_, idx) => idx + 1);
              return (
                <View key={s + i} style={{ marginBottom: 12 }}>
                  <Text style={{ fontWeight: "700", marginBottom: 6 }}>{s}</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {pages.map((p) => (
                      <Pressable
                        key={s + "-" + p}
                        style={[styles.pageChip, subjectIdx === i && page === p && styles.pageChipActive]}
                        accessibilityLabel={`Go to ${s} page ${p}`}
                        onPress={() => {
                          setSubjectIdx(i);
                          setPage(p);
                          closeSelector();
                        }}
                      >
                        <Text style={styles.pageChipText}>{p}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </Animated.View>
      )}
      <Calculator visible={calculatorVisible} onClose={() => setCalculatorVisible(false)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, paddingTop: 0 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginBottom: 5, gap: 10 },
  backButton: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: "#000", alignItems: "center", justifyContent: "center" },
  iconButton: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: "#000", alignItems: "center", justifyContent: "center" },
  titleContainer: { flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "space-between" },
  examControls: { flexDirection: "row", alignItems: "center", gap: 8 },
  timerBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#2E7D32", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  timerText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  submitButtonCompact: { backgroundColor: "#d32f2f", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  submitButtonCompactText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  backdrop: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.35)" },
  sheet: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: 420 },
  sheetHandle: { width: 46, height: 5, borderRadius: 3, backgroundColor: "#D0D0D0", alignSelf: "center", marginBottom: 10 },
  pageChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, borderColor: "#D0D0D0" },
  pageChipActive: { backgroundColor: "#2E7D32" },
  pageChipText: { color: "#1B1B1B" },
});
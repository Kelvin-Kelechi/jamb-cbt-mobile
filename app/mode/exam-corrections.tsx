import React, { useMemo, useState } from "react";
import { StyleSheet, View, Text, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenContainer from "@/components/ui/ScreenContainer";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";

type QuestionWithAnswer = {
    subject: string;
    question: string;
    options: string[];
    correctAnswer: string;
    userAnswer?: string;
    instruction?: string;
    correction?: string;
};

export default function ExamCorrectionsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ questionsData?: string }>();

    const allQuestionsData: QuestionWithAnswer[] = useMemo(() => {
        try {
            return params.questionsData ? JSON.parse(String(params.questionsData)) : [];
        } catch {
            return [];
        }
    }, [params.questionsData]);

    // Group all questions by subject (show both correct and wrong)
    const questionsBySubject = useMemo(() => {
        const grouped: Record<string, QuestionWithAnswer[]> = {};
        allQuestionsData.forEach((q) => {
            if (!grouped[q.subject]) {
                grouped[q.subject] = [];
            }
            grouped[q.subject].push(q);
        });
        return grouped;
    }, [allQuestionsData]);

    const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const subjects = Object.keys(questionsBySubject);
    const currentSubject = subjects[currentSubjectIndex];
    const currentQuestions = questionsBySubject[currentSubject] || [];
    const currentQuestion = currentQuestions[currentQuestionIndex];

    const getOptionLabel = (index: number) => String.fromCharCode(65 + index); // A, B, C, D...

    const handleNext = () => {
        if (currentQuestionIndex < currentQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (currentSubjectIndex < subjects.length - 1) {
            setCurrentSubjectIndex(currentSubjectIndex + 1);
            setCurrentQuestionIndex(0);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else if (currentSubjectIndex > 0) {
            setCurrentSubjectIndex(currentSubjectIndex - 1);
            const prevSubject = subjects[currentSubjectIndex - 1];
            setCurrentQuestionIndex(questionsBySubject[prevSubject].length - 1);
        }
    };

    const isFirstQuestion = currentSubjectIndex === 0 && currentQuestionIndex === 0;
    const isLastQuestion = currentSubjectIndex === subjects.length - 1 &&
        currentQuestionIndex === currentQuestions.length - 1;

    // If no questions at all
    if (allQuestionsData.length === 0) {
        return (
            <ScreenContainer style={styles.container}>
                <View style={styles.headerRow}>
                    <Pressable
                        style={styles.backButton}
                        onPress={() => router.back()}
                        accessibilityLabel="Go back"
                    >
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </Pressable>
                </View>

                <View style={styles.titleContainer}>
                    <ThemedText type="title">Exam Corrections</ThemedText>
                </View>

                <View style={styles.emptyState}>
                    <Ionicons name="document-text-outline" size={80} color="#666" />
                    <Text style={styles.emptyTitle}>No Questions</Text>
                    <Text style={styles.emptyText}>
                        No questions available to review.
                    </Text>
                    <Pressable
                        style={styles.primaryButton}
                        onPress={() => router.push("/(tabs)")}
                    >
                        <Text style={styles.primaryButtonText}>Back to Home</Text>
                    </Pressable>
                </View>
            </ScreenContainer>
        );
    }

    // If current subject has no wrong questions, show message
    if (!currentQuestion || currentQuestions.length === 0) {
        return (
            <ScreenContainer style={styles.container}>
                <View style={styles.headerRow}>
                    <Pressable
                        style={styles.backButton}
                        onPress={() => router.back()}
                        accessibilityLabel="Go back"
                    >
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </Pressable>
                </View>

                <View style={styles.titleContainer}>
                    <ThemedText type="title">Corrections</ThemedText>
                </View>

                <ThemedText style={styles.subtitle}>
                    No questions in this subject
                </ThemedText>

                {/* Subject Tabs */}
                <View style={styles.tabsRow}>
                    {subjects.map((subject, index) => {
                        const subjectWrongCount = questionsBySubject[subject]?.length || 0;
                        return (
                            <Pressable
                                key={subject}
                                style={styles.tab}
                                onPress={() => {
                                    setCurrentSubjectIndex(index);
                                    setCurrentQuestionIndex(0);
                                }}
                            >
                                <View style={styles.tabContent}>
                                    <Text style={[
                                        styles.tabText,
                                        index === currentSubjectIndex && styles.tabTextActive
                                    ]}>
                                        {subject}
                                    </Text>
                                    {subjectWrongCount > 0 && (
                                        <View style={[
                                            styles.tabBadge,
                                            index === currentSubjectIndex && styles.tabBadgeActive
                                        ]}>
                                            <Text style={[
                                                styles.tabBadgeText,
                                                index === currentSubjectIndex && styles.tabBadgeTextActive
                                            ]}>
                                                {subjectWrongCount}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                {index === currentSubjectIndex && <View style={styles.tabUnderline} />}
                            </Pressable>
                        );
                    })}
                </View>

                <View style={styles.emptyState}>
                    <Ionicons name="document-text-outline" size={60} color="#666" />
                    <Text style={styles.emptySubtitle}>No Questions</Text>
                    <Text style={styles.emptyText}>
                        No questions available in {currentSubject}. Switch tabs to review other subjects.
                    </Text>
                </View>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer style={styles.container}>
            <View style={styles.headerRow}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                    accessibilityLabel="Go back"
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </Pressable>
            </View>

            <View style={styles.titleContainer}>
                <ThemedText type="title">Corrections</ThemedText>
            </View>

            <ThemedText style={styles.subtitle}>
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
            </ThemedText>

            {/* Subject Tabs */}
            <View style={styles.tabsRow}>
                {subjects.map((subject, index) => {
                    const subjectWrongCount = questionsBySubject[subject]?.length || 0;
                    return (
                        <Pressable
                            key={subject}
                            style={styles.tab}
                            onPress={() => {
                                setCurrentSubjectIndex(index);
                                setCurrentQuestionIndex(0);
                            }}
                        >
                            <View style={styles.tabContent}>
                                <Text style={[
                                    styles.tabText,
                                    index === currentSubjectIndex && styles.tabTextActive
                                ]}>
                                    {subject}
                                </Text>
                                {subjectWrongCount > 0 && (
                                    <View style={[
                                        styles.tabBadge,
                                        index === currentSubjectIndex && styles.tabBadgeActive
                                    ]}>
                                        <Text style={[
                                            styles.tabBadgeText,
                                            index === currentSubjectIndex && styles.tabBadgeTextActive
                                        ]}>
                                            {subjectWrongCount}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            {index === currentSubjectIndex && <View style={styles.tabUnderline} />}
                        </Pressable>
                    );
                })}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.questionCard}>
                    {/* Question Instruction */}
                    {currentQuestion.instruction && (
                        <View style={styles.instructionBox}>
                            <Text style={styles.instructionTitle}>Question Instruction</Text>
                            <Text style={styles.instructionText}>{currentQuestion.instruction}</Text>
                        </View>
                    )}

                    {/* Question Header */}
                    <View style={styles.questionHeader}>
                        <Text style={styles.questionNumber}>Question</Text>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: currentQuestion.userAnswer === currentQuestion.correctAnswer ? "#4CAF50" : "#F44336" }
                        ]}>
                            <Ionicons
                                name={currentQuestion.userAnswer === currentQuestion.correctAnswer ? "checkmark-circle" : "close-circle"}
                                size={16}
                                color="#fff"
                            />
                            <Text style={styles.statusText}>
                                {currentQuestion.userAnswer === currentQuestion.correctAnswer ? "Correct" : "Wrong"}
                            </Text>
                        </View>
                    </View>

                    {/* Question Text */}
                    <Text style={styles.questionText}>{currentQuestion.question}</Text>

                    {/* Options */}
                    <View style={styles.optionsContainer}>
                        {currentQuestion.options.map((option, optIndex) => {
                            const optionLabel = getOptionLabel(optIndex);
                            const isCorrectOption = option === currentQuestion.correctAnswer;
                            const isUserSelection = option === currentQuestion.userAnswer;
                            const isWrongSelection = isUserSelection && !isCorrectOption;

                            return (
                                <View
                                    key={`opt-${optIndex}`}
                                    style={[
                                        styles.optionRow,
                                        isCorrectOption && styles.optionRowCorrect,
                                        isWrongSelection && styles.optionRowWrong,
                                    ]}
                                >
                                    <View style={[
                                        styles.optionLabel,
                                        isCorrectOption && styles.optionLabelCorrect,
                                        isWrongSelection && styles.optionLabelWrong,
                                    ]}>
                                        <Text style={[
                                            styles.optionLabelText,
                                            (isCorrectOption || isWrongSelection) && styles.optionLabelTextHighlight,
                                        ]}>
                                            {optionLabel}
                                        </Text>
                                    </View>
                                    <Text style={[
                                        styles.optionText,
                                        isCorrectOption && styles.optionTextCorrect,
                                        isWrongSelection && styles.optionTextWrong,
                                    ]}>
                                        {option}
                                    </Text>
                                    {isCorrectOption && (
                                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                                    )}
                                    {isWrongSelection && (
                                        <Ionicons name="close-circle" size={20} color="#F44336" />
                                    )}
                                </View>
                            );
                        })}
                    </View>

                    {/* User Answer Summary - Only show for wrong answers */}
                    {currentQuestion.userAnswer !== currentQuestion.correctAnswer && (
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryText}>
                                Your answer: <Text style={styles.wrongAnswerText}>{currentQuestion.userAnswer || "Not answered"}</Text>
                            </Text>
                            <Text style={styles.summaryText}>
                                Correct answer: <Text style={styles.correctAnswerText}>{currentQuestion.correctAnswer}</Text>
                            </Text>
                        </View>
                    )}

                    {/* Correction/Explanation */}
                    {currentQuestion.correction && (
                        <View style={styles.correctionBox}>
                            <View style={styles.correctionHeader}>
                                <Ionicons name="information-circle" size={18} color="#2196F3" />
                                <Text style={styles.correctionTitle}>Explanation</Text>
                            </View>
                            <Text style={styles.correctionText}>{currentQuestion.correction}</Text>
                        </View>
                    )}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Footer Spacer */}
            <View style={styles.footerSpacer} />

            {/* Navigation Footer */}
            <View style={styles.footer}>
                <Pressable
                    style={[styles.navButton, isFirstQuestion && styles.navButtonDisabled]}
                    onPress={handlePrev}
                    disabled={isFirstQuestion}
                >
                    <Text style={styles.navButtonText}>Prev</Text>
                </Pressable>

                <View style={styles.progressIndicator}>
                    <Text style={styles.progressText}>
                        {currentQuestionIndex + 1} / {currentQuestions.length}
                    </Text>
                </View>

                {!isLastQuestion ? (
                    <Pressable
                        style={styles.navButton}
                        onPress={handleNext}
                    >
                        <Text style={styles.navButtonText}>Next</Text>
                    </Pressable>
                ) : (
                    <Pressable
                        style={styles.finishButton}
                        onPress={() => router.push("/(tabs)")}
                    >
                        <Text style={styles.finishButtonText}>Finish</Text>
                    </Pressable>
                )}
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, gap: 12, paddingTop: 0 },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 5,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#000",
        alignItems: "center",
        justifyContent: "center",
    },
    titleContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
        fontWeight: "600",
    },
    tabsRow: {
        flexDirection: "row",
        gap: 16,
        paddingHorizontal: 0,
        marginBottom: 12,
    },
    tab: {
        paddingBottom: 6,
    },
    tabText: {
        fontSize: 16,
        color: "#6A6A6A",
    },
    tabTextActive: {
        color: "#1B1B1B",
        fontWeight: "700",
    },
    tabUnderline: {
        height: 2,
        backgroundColor: "#2E7D32",
        marginTop: 4,
    },
    tabContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    tabBadge: {
        backgroundColor: "#E0E0E0",
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    tabBadgeActive: {
        backgroundColor: "#2E7D32",
    },
    tabBadgeText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#666",
    },
    tabBadgeTextActive: {
        color: "#fff",
    },
    scrollContent: { paddingBottom: 40 },
    footerSpacer: { height: 95 },
    subjectSection: {
        marginBottom: 24,
    },
    subjectTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1B1B1B",
        marginBottom: 12,
    },
    questionCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    instructionBox: {
        backgroundColor: "#F3F6F9",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    instructionTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: "#1B1B1B",
        marginBottom: 4,
    },
    instructionText: {
        fontSize: 13,
        color: "#666",
    },
    questionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    questionNumber: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1B1B1B",
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },
    questionText: {
        fontSize: 14,
        color: "#1B1B1B",
        marginBottom: 12,
        lineHeight: 20,
    },
    optionsContainer: {
        gap: 8,
        marginBottom: 12,
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#D3D3D3",
        backgroundColor: "#fff",
        gap: 10,
    },
    optionRowCorrect: {
        backgroundColor: "#E8F5E9",
        borderColor: "#4CAF50",
        borderWidth: 2,
    },
    optionRowWrong: {
        backgroundColor: "#FFEBEE",
        borderColor: "#F44336",
        borderWidth: 2,
    },
    optionLabel: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: "#6A6A6A",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    optionLabelCorrect: {
        borderColor: "#4CAF50",
        backgroundColor: "#4CAF50",
    },
    optionLabelWrong: {
        borderColor: "#F44336",
        backgroundColor: "#F44336",
    },
    optionLabelText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6A6A6A",
    },
    optionLabelTextHighlight: {
        color: "#fff",
    },
    optionText: {
        flex: 1,
        fontSize: 14,
        color: "#1B1B1B",
    },
    optionTextCorrect: {
        color: "#2E7D32",
        fontWeight: "600",
    },
    optionTextWrong: {
        color: "#C62828",
        fontWeight: "600",
    },
    correctionBox: {
        backgroundColor: "#E3F2FD",
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
    },
    correctionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 6,
    },
    correctionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1976D2",
    },
    correctionText: {
        fontSize: 13,
        color: "#1B1B1B",
        lineHeight: 18,
    },
    summaryBox: {
        marginTop: 12,
        padding: 10,
        backgroundColor: "#FFF3E0",
        borderRadius: 8,
        gap: 4,
    },
    summaryText: {
        fontSize: 13,
        color: "#1B1B1B",
    },
    wrongAnswerText: {
        color: "#D32F2F",
        fontWeight: "700",
    },
    correctAnswerText: {
        color: "#2E7D32",
        fontWeight: "700",
    },
    actionsSection: {
        gap: 12,
        marginTop: 12,
    },
    primaryButton: {
        backgroundColor: "#2E7D32",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    primaryButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    secondaryButton: {
        backgroundColor: "#fff",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#2E7D32",
    },
    secondaryButtonText: {
        color: "#2E7D32",
        fontSize: 16,
        fontWeight: "700",
    },
    footer: {
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 35,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    navButton: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#2E7D32",
        alignItems: "center",
        justifyContent: "center",
    },
    navButtonDisabled: {
        opacity: 0.5,
    },
    navButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    finishButton: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#1976D2",
        alignItems: "center",
        justifyContent: "center",
    },
    finishButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    progressIndicator: {
        paddingHorizontal: 12,
    },
    progressText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1B1B1B",
    },
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1B1B1B",
    },
    emptySubtitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1B1B1B",
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        lineHeight: 24,
    },
});

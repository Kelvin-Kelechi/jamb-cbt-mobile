import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Pressable, Alert, Text } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import ScreenContainer from "@/components/ui/ScreenContainer";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useSavedQuestions } from "@/context/SavedQuestionsContext";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function SavedQuestionsScreen() {
    const router = useRouter();
    const { savedQuestions, removeQuestion } = useSavedQuestions();
    const [showAnswer, setShowAnswer] = useState<Record<number, boolean>>({});
    const [showCorrection, setShowCorrection] = useState<Record<number, boolean>>({});

    // Theme colors
    const textColor = useThemeColor({}, "text");
    const textSecondary = useThemeColor({}, "textSecondary");
    const cardBg = useThemeColor({}, "card");
    const cardBorder = useThemeColor({}, "cardBorder");
    const instructionBg = useThemeColor({}, "instructionBg");
    const revealBg = useThemeColor({}, "revealBg");
    const primary = useThemeColor({}, "primary");
    const primaryLight = useThemeColor({}, "primaryLight");
    const secondary = useThemeColor({}, "secondary");
    const secondaryLight = useThemeColor({}, "secondaryLight");
    const error = useThemeColor({}, "error");
    const iconColor = useThemeColor({}, "icon");

    const handleRemove = (id: string) => {
        Alert.alert(
            "Remove Question",
            "Are you sure you want to remove this question from your saved list?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => removeQuestion(id),
                },
            ]
        );
    };

    const toggleAnswer = (idx: number) => {
        setShowAnswer((prev) => ({ ...prev, [idx]: !prev[idx] }));
    };

    const toggleCorrection = (idx: number) => {
        setShowCorrection((prev) => ({ ...prev, [idx]: !prev[idx] }));
    };

    const getOptionLabel = (index: number) => String.fromCharCode(65 + index); // A, B, C, D...

    return (
        <ScreenContainer style={styles.container}>
            <View style={styles.headerRow}>
                <Pressable
                    style={[styles.backButton, { borderColor: textColor }]}
                    onPress={() => router.back()}
                    accessibilityLabel="Go back"
                >
                    <Ionicons name="arrow-back" size={24} color={textColor} />
                </Pressable>
            </View>

            <View style={styles.titleContainer}>
                <ThemedText type="title">Saved Questions</ThemedText>
            </View>

            <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
                {savedQuestions.length} {savedQuestions.length === 1 ? "question" : "questions"} saved
            </ThemedText>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {savedQuestions.length === 0 ? (
                    <View style={styles.emptyState}>
                        <FontAwesome name="bookmark-o" size={80} color={iconColor} />
                        <ThemedText style={[styles.emptyText, { color: textSecondary }]}>No saved questions yet.</ThemedText>
                        <ThemedText style={[styles.emptySubText, { color: textSecondary }]}>
                            Tap the bookmark icon while studying to save questions here.
                        </ThemedText>
                    </View>
                ) : (
                    savedQuestions.map((item, idx) => (
                        <View key={item.id} style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                            {/* Question Header with Subject/Year Tags */}
                            <View style={styles.cardHeader}>
                                <View style={styles.tagContainer}>
                                    <View style={[styles.subjectTag, { backgroundColor: primaryLight }]}>
                                        <ThemedText style={[styles.subjectText, { color: primary }]}>{item.subject}</ThemedText>
                                    </View>
                                    <View style={[styles.yearTag, { backgroundColor: secondaryLight }]}>
                                        <ThemedText style={[styles.yearText, { color: secondary }]}>{item.year}</ThemedText>
                                    </View>
                                </View>
                                <Pressable onPress={() => handleRemove(item.id)} style={styles.removeButton}>
                                    <Ionicons name="trash-outline" size={20} color={error} />
                                </Pressable>
                            </View>

                            {/* Question Instruction */}
                            {item.question.instruction && (
                                <View style={[styles.instructionBox, { backgroundColor: instructionBg }]}>
                                    <ThemedText style={styles.instructionTitle}>
                                        Question Instruction
                                    </ThemedText>
                                    <ThemedText style={styles.instructionText}>
                                        {item.question.instruction}
                                    </ThemedText>
                                </View>
                            )}

                            {/* Question Text */}
                            {item.question.question && (
                                <View>
                                    <View style={styles.questionHeader}>
                                        <ThemedText style={styles.questionHeading}>
                                            Question {idx + 1}
                                        </ThemedText>
                                    </View>
                                    <ThemedText style={styles.questionText}>
                                        {item.question.question}
                                    </ThemedText>
                                </View>
                            )}

                            {/* Options */}
                            {(item.question.options || []).map((opt, i) => {
                                const optionLabel = getOptionLabel(i);
                                return (
                                    <View key={`opt-${idx}-${i}`} style={[
                                        styles.optionRow,
                                        { backgroundColor: cardBg, borderColor: cardBorder },
                                        i === 0 && { marginTop: 12 }
                                    ]}>
                                        <View style={[styles.optionLabel, { borderColor: textSecondary, backgroundColor: cardBg }]}>
                                            <Text style={[styles.optionLabelText, { color: textSecondary }]}>{optionLabel}</Text>
                                        </View>
                                        <ThemedText style={styles.optionText}>{opt}</ThemedText>
                                    </View>
                                );
                            })}

                            {/* Action Buttons */}
                            <View style={styles.actionsRow}>
                                <Pressable
                                    style={[styles.actionBtn, { backgroundColor: primary }]}
                                    onPress={() => toggleAnswer(idx)}
                                >
                                    <Text style={styles.actionText}>View Answer</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.actionBtn, { backgroundColor: primary }]}
                                    onPress={() => toggleCorrection(idx)}
                                >
                                    <Text style={styles.actionText}>View Correction</Text>
                                </Pressable>
                            </View>

                            {/* Answer Reveal */}
                            {showAnswer[idx] && item.question.answer && (
                                <View style={[styles.revealBox, { backgroundColor: revealBg }]}>
                                    <IconSymbol name="checkmark.circle" size={18} color={primary} />
                                    <ThemedText style={styles.revealText}>
                                        Answer: {item.question.answer}
                                    </ThemedText>
                                </View>
                            )}

                            {/* Correction Reveal */}
                            {showCorrection[idx] && item.question.correction && (
                                <View style={[styles.revealBox, { backgroundColor: revealBg }]}>
                                    <IconSymbol name="info.circle" size={18} color={textColor} />
                                    <ThemedText style={styles.revealText}>
                                        {item.question.correction}
                                    </ThemedText>
                                </View>
                            )}

                            {/* Saved Date Footer */}
                            <View style={[styles.cardFooter, { borderTopColor: cardBorder }]}>
                                <ThemedText style={[styles.dateText, { color: textSecondary }]}>
                                    Saved on {new Date(item.savedAt).toLocaleDateString()}
                                </ThemedText>
                            </View>
                        </View>
                    ))
                )}
                <View style={{ height: 40 }} />
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 12,
        paddingTop: 0,
    },
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
        alignItems: "center",
        justifyContent: "center",
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: "600",
    },
    scrollContent: {
        paddingBottom: 40,
        gap: 16,
    },
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 100,
        gap: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
    },
    emptySubText: {
        fontSize: 14,
        textAlign: "center",
        maxWidth: "80%",
    },
    card: {
        borderRadius: 14,
        padding: 20,
        borderWidth: 1,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    tagContainer: {
        flexDirection: "row",
        gap: 8,
    },
    subjectTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    subjectText: {
        fontSize: 12,
        fontWeight: "600",
    },
    yearTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    yearText: {
        fontSize: 12,
        fontWeight: "600",
    },
    removeButton: {
        padding: 4,
    },
    instructionBox: {
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
    },
    instructionTitle: {
        fontSize: 14,
        fontWeight: "700",
    },
    instructionText: {
        fontSize: 14,
        marginTop: 6,
    },
    questionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    questionHeading: {
        fontSize: 16,
        fontWeight: "800",
        marginBottom: 6,
    },
    questionText: {
        fontSize: 14,
        marginBottom: 4,
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 8,
    },
    optionLabel: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    optionLabelText: {
        fontSize: 16,
        fontWeight: "600",
    },
    optionText: {
        flex: 1,
        fontSize: 15,
    },
    actionsRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 12,
    },
    actionBtn: {
        flex: 1,
        height: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    actionText: {
        color: "#fff",
        fontWeight: "700",
    },
    revealBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 10,
        padding: 10,
        borderRadius: 10,
    },
    revealText: {
        flex: 1,
    },
    cardFooter: {
        borderTopWidth: 1,
        paddingTop: 12,
        marginTop: 12,
    },
    dateText: {
        fontSize: 12,
    },
});

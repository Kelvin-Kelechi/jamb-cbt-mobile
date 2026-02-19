import React from "react";
import { StyleSheet, View, Text, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenContainer from "@/components/ui/ScreenContainer";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";

type SubjectResult = {
    subject: string;
    score: number;
    total: number;
    percentage: number;
};

export default function ExamResultsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ results?: string; questionsData?: string }>();

    const results: SubjectResult[] = React.useMemo(() => {
        try {
            return params.results ? JSON.parse(String(params.results)) : [];
        } catch {
            return [];
        }
    }, [params.results]);

    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const totalQuestions = results.reduce((sum, r) => sum + r.total, 0);
    const overallPercentage = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

    const getGrade = (percentage: number) => {
        if (percentage >= 80) return { grade: "A", color: "#2E7D32" };
        if (percentage >= 70) return { grade: "B", color: "#388E3C" };
        if (percentage >= 60) return { grade: "C", color: "#FFA000" };
        if (percentage >= 50) return { grade: "D", color: "#F57C00" };
        return { grade: "F", color: "#D32F2F" };
    };

    const overallGrade = getGrade(overallPercentage);

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
                <ThemedText type="title">Exam Results</ThemedText>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Overall Score Card */}
                <View style={styles.overallCard}>
                    <Text style={styles.overallTitle}>Overall Score</Text>
                    <View style={styles.scoreCircle}>
                        <Text style={[styles.scorePercentage, { color: overallGrade.color }]}>
                            {overallPercentage}%
                        </Text>
                        <Text style={[styles.scoreGrade, { color: overallGrade.color }]}>
                            Grade {overallGrade.grade}
                        </Text>
                    </View>
                    <Text style={styles.scoreDetail}>
                        {totalScore} / {totalQuestions} questions correct
                    </Text>
                </View>

                {/* Subject Breakdown */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Subject Breakdown</Text>
                    {results.map((result, index) => {
                        const subjectGrade = getGrade(result.percentage);
                        return (
                            <View key={index} style={styles.subjectCard}>
                                <View style={styles.subjectHeader}>
                                    <Text style={styles.subjectName}>{result.subject}</Text>
                                    <View style={[styles.gradeBadge, { backgroundColor: subjectGrade.color }]}>
                                        <Text style={styles.gradeBadgeText}>{subjectGrade.grade}</Text>
                                    </View>
                                </View>
                                <View style={styles.subjectStats}>
                                    <View style={styles.statItem}>
                                        <Text style={styles.statLabel}>Score</Text>
                                        <Text style={styles.statValue}>
                                            {result.score}/{result.total}
                                        </Text>
                                    </View>
                                    <View style={styles.statItem}>
                                        <Text style={styles.statLabel}>Percentage</Text>
                                        <Text style={[styles.statValue, { color: subjectGrade.color }]}>
                                            {result.percentage}%
                                        </Text>
                                    </View>
                                </View>
                                {/* Progress Bar */}
                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            { width: `${result.percentage}%`, backgroundColor: subjectGrade.color },
                                        ]}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsSection}>
                    <Pressable
                        style={styles.primaryButton}
                        onPress={() => {
                            // Navigate to corrections screen
                            router.push({
                                pathname: "/mode/exam-corrections",
                                params: { questionsData: params.questionsData },
                            });
                        }}
                    >
                        <Ionicons name="book-outline" size={20} color="#fff" />
                        <Text style={styles.primaryButtonText}>Show Corrections</Text>
                    </Pressable>

                    <Pressable
                        style={styles.secondaryButton}
                        onPress={() => router.push("/mode/exam")}
                    >
                        <Text style={styles.secondaryButtonText}>Take Another Exam</Text>
                    </Pressable>

                    <Pressable
                        style={styles.tertiaryButton}
                        onPress={() => router.push("/(tabs)")}
                    >
                        <Text style={styles.tertiaryButtonText}>Back to Home</Text>
                    </Pressable>
                </View>
            </ScrollView>
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
    scrollContent: { paddingBottom: 40 },
    overallCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    overallTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#666",
        marginBottom: 16,
    },
    scoreCircle: {
        alignItems: "center",
        marginBottom: 12,
    },
    scorePercentage: {
        fontSize: 56,
        fontWeight: "bold",
    },
    scoreGrade: {
        fontSize: 24,
        fontWeight: "600",
        marginTop: 4,
    },
    scoreDetail: {
        fontSize: 16,
        color: "#666",
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 12,
        color: "#1B1B1B",
    },
    subjectCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    subjectHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    subjectName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1B1B1B",
    },
    gradeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    gradeBadgeText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
    },
    subjectStats: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 12,
    },
    statItem: {
        alignItems: "center",
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1B1B1B",
    },
    progressBar: {
        height: 8,
        backgroundColor: "#E0E0E0",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 4,
    },
    actionsSection: {
        gap: 12,
    },
    primaryButton: {
        flexDirection: "row",
        backgroundColor: "#2E7D32",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
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
    tertiaryButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    tertiaryButtonText: {
        color: "#666",
        fontSize: 16,
        fontWeight: "600",
    },
});

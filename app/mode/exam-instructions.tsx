import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Switch,
    Pressable,
    ScrollView,
    TouchableOpacity,
    Modal,
    FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "@/components/ui/ScreenContainer";
import { ThemedText } from "@/components/themed-text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";

const INSTRUCTIONS = [
    "Study questions without a time limit.",
    "Attempt questions and check the correct answers as you study.",
    "Take notes and share with friends for better success.",
];

const TIME_OPTIONS = [
    ...Array.from({ length: 11 }, (_, i) => `${(i + 1) * 5} mins`), // 5 mins to 55 mins
    "1 hour",
    "1 hr 15 mins",
    "1 hr 20 mins",
    "1 hr 30 mins",
    "1 hr 45 mins",
    "2 hours"
];

export default function ExamInstructionsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ options: string; mode: string }>();
    const [timerEnabled, setTimerEnabled] = useState(false);
    const [selectedTime, setSelectedTime] = useState("30m");
    const [modalVisible, setModalVisible] = useState(false);

    const handleStart = () => {
        router.push({
            pathname: "/mode/past-study",
            params: {
                options: params.options,
                mode: params.mode,
                timerEnabled: String(timerEnabled),
                duration: selectedTime,
            },
        });
    };

    return (
        <ScreenContainer style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.imageContainer}>
                    {/* Placeholder for vector image */}
                    <IconSymbol name="doc.text" size={100} color="#2E7D32" />
                </View>

                <View style={styles.instructionsContainer}>
                    <ThemedText type="title" style={styles.title}>
                        Instructions
                    </ThemedText>
                    {INSTRUCTIONS.map((instruction, index) => (
                        <View key={index} style={styles.instructionItem}>
                            <Text style={styles.bullet}>{index + 1}.</Text>
                            <ThemedText style={styles.instructionText}>
                                {instruction}
                            </ThemedText>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.timerContainer}>
                    <View style={styles.timerRow}>
                        <ThemedText style={styles.timerLabel}>Enable Timer</ThemedText>
                        <Switch
                            value={timerEnabled}
                            onValueChange={setTimerEnabled}
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={timerEnabled ? "#2E7D32" : "#f4f3f4"}
                        />
                    </View>
                    {timerEnabled && (
                        <Pressable
                            style={styles.timeSelect}
                            onPress={() => setModalVisible(true)}
                        >
                            <ThemedText style={styles.timeSelectText}>
                                Duration: {selectedTime}
                            </ThemedText>
                            <IconSymbol name="chevron.down" size={16} color="#2A2A2A" />
                        </Pressable>
                    )}
                </View>

                <Pressable style={styles.startButton} onPress={handleStart}>
                    <Text style={styles.startButtonText}>Start CBT Test</Text>
                </Pressable>
            </View>

            <Modal
                animationType="fade"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        <FlatList
                            data={TIME_OPTIONS}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setSelectedTime(item);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.modalItemText}>{item}</Text>
                                </Pressable>
                            )}
                        />
                        <Pressable
                            style={styles.modalCancel}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalCancelText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
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
        borderColor: "#000",
        alignItems: "center",
        justifyContent: "center",
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: "center",
        paddingBottom: 100,
    },
    imageContainer: {
        marginTop: 40,
        marginBottom: 40,
        alignItems: "center",
        justifyContent: "center",
        width: 200,
        height: 200,
        backgroundColor: "#e0ecdfff",
        borderRadius: 100,
    },
    instructionsContainer: {
        width: "100%",
        gap: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
    },
    instructionItem: {
        flexDirection: "row",
        gap: 8,
    },
    bullet: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2E7D32",
    },
    instructionText: {
        fontSize: 16,
        lineHeight: 24,
        flex: 1,
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 16,
        right: 16,
        gap: 20,
    },
    timerContainer: {
        gap: 12,
    },
    timerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#2E7D32",
    },
    timeSelect: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#D3D3D3",
    },
    timeSelectText: {
        fontSize: 16,
        color: "#1B1B1B",
    },
    timerLabel: {
        fontSize: 16,
        fontWeight: "600",
    },
    startButton: {
        height: 50,
        backgroundColor: "#2E7D32",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    startButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
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

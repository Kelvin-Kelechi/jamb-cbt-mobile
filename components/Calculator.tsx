import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    Modal,
    TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

type CalculatorProps = {
    visible: boolean;
    onClose: () => void;
};

export default function Calculator({ visible, onClose }: CalculatorProps) {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");

    const handlePress = (value: string) => {
        if (value === "=") {
            try {
                // eslint-disable-next-line no-eval
                const res = eval(input); // Basic evaluation for simplicity in this context
                setResult(String(res));
                setInput(String(res));
            } catch (e) {
                setResult("Error");
            }
        } else if (value === "C") {
            setInput("");
            setResult("");
        } else if (value === "DEL") {
            setInput((prev) => prev.slice(0, -1));
        } else {
            setInput((prev) => prev + value);
        }
    };

    const buttons = [
        ["C", "DEL", "%", "/"],
        ["7", "8", "9", "*"],
        ["4", "5", "6", "-"],
        ["1", "2", "3", "+"],
        [".", "0", "00", "="],
    ];

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <BlurView intensity={20} style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Calculator</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.displayContainer}>
                        <Text style={styles.displayText}>{input || "0"}</Text>
                        {result !== "" && result !== input && (
                            <Text style={styles.resultText}>{result}</Text>
                        )}
                    </View>

                    <View style={styles.buttonsContainer}>
                        {buttons.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.row}>
                                {row.map((btn) => (
                                    <Pressable
                                        key={btn}
                                        style={({ pressed }) => [
                                            styles.button,
                                            ["C", "DEL"].includes(btn) && styles.actionButton,
                                            ["/", "*", "-", "+", "=", "%"].includes(btn) &&
                                            styles.operatorButton,
                                            pressed && styles.buttonPressed,
                                        ]}
                                        onPress={() => handlePress(btn)}
                                    >
                                        <Text
                                            style={[
                                                styles.buttonText,
                                                ["C", "DEL"].includes(btn) && styles.actionButtonText,
                                                ["/", "*", "-", "+", "=", "%"].includes(btn) &&
                                                styles.operatorButtonText,
                                            ]}
                                        >
                                            {btn}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
        padding: 20,
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "100%",
        maxWidth: 400,
        height: "auto",
        aspectRatio: 0.8,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    displayContainer: {
        backgroundColor: "#f5f5f5",
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        alignItems: "flex-end",
        justifyContent: "center",
        height: 70,
    },
    displayText: {
        fontSize: 28,
        color: "#333",
        fontWeight: "600",
    },
    resultText: {
        fontSize: 18,
        color: "#888",
        marginTop: 5,
    },
    buttonsContainer: {
        flex: 1,
        gap: 4,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 4,
    },
    button: {
        flex: 1,
        aspectRatio: 1.4,
        backgroundColor: "#fff",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: "#eee",
    },
    actionButton: {
        backgroundColor: "#ffebee",
        borderColor: "#ffcdd2",
    },
    operatorButton: {
        backgroundColor: "#e8f5e9",
        borderColor: "#c8e6c9",
    },
    buttonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.96 }],
    },
    buttonText: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    actionButtonText: {
        color: "#d32f2f",
        fontSize: 14,
        fontWeight: "bold",
    },
    operatorButtonText: {
        color: "#2E7D32",
        fontWeight: "bold",
    },
});

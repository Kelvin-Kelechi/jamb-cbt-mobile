import React from "react";
import { StyleSheet, View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "@/components/ui/ScreenContainer";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function AppSettingsScreen() {
    const router = useRouter();
    const { themeMode, setThemeMode, isDark } = useTheme();
    const cardBg = useThemeColor({}, "card");
    const cardBorder = useThemeColor({}, "cardBorder");
    const textColor = useThemeColor({}, "text");
    const textSecondary = useThemeColor({}, "textSecondary");
    const primary = useThemeColor({}, "primary");

    const themeOptions = [
        { value: "light" as const, label: "Light", icon: "sunny" as const },
        { value: "dark" as const, label: "Dark", icon: "moon" as const },
        { value: "system" as const, label: "System", icon: "phone-portrait" as const },
    ];

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
                <ThemedText type="title">App Settings</ThemedText>
            </View>

            <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
                Customize your app experience
            </ThemedText>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Theme Section */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Appearance</ThemedText>
                    <ThemedText style={[styles.sectionDescription, { color: textSecondary }]}>
                        Choose how the app looks on your device
                    </ThemedText>

                    <View style={styles.themeOptions}>
                        {themeOptions.map((option) => (
                            <Pressable
                                key={option.value}
                                style={[
                                    styles.themeOption,
                                    {
                                        backgroundColor: cardBg,
                                        borderColor: themeMode === option.value ? primary : cardBorder,
                                        borderWidth: themeMode === option.value ? 2 : 1,
                                    }
                                ]}
                                onPress={() => setThemeMode(option.value)}
                            >
                                <View style={[
                                    styles.themeIconContainer,
                                    { backgroundColor: themeMode === option.value ? primary + "15" : cardBorder + "30" }
                                ]}>
                                    <Ionicons
                                        name={option.icon}
                                        size={28}
                                        color={themeMode === option.value ? primary : textSecondary}
                                    />
                                </View>
                                <Text style={[
                                    styles.themeLabel,
                                    { color: themeMode === option.value ? primary : textColor }
                                ]}>
                                    {option.label}
                                </Text>
                                {themeMode === option.value && (
                                    <View style={styles.checkmarkContainer}>
                                        <Ionicons name="checkmark-circle" size={20} color={primary} />
                                    </View>
                                )}
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Info Section */}
                <View style={[styles.infoCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                    <Ionicons name="information-circle" size={20} color={primary} />
                    <ThemedText style={[styles.infoText, { color: textSecondary }]}>
                        {themeMode === "system"
                            ? "The app will automatically switch between light and dark mode based on your device settings."
                            : `The app is currently using ${themeMode} mode.`
                        }
                    </ThemedText>
                </View>

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
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 6,
    },
    sectionDescription: {
        fontSize: 14,
        marginBottom: 16,
    },
    themeOptions: {
        flexDirection: "row",
        gap: 12,
    },
    themeOption: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        gap: 12,
        minHeight: 120,
        justifyContent: "center",
    },
    themeIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
    },
    themeLabel: {
        fontSize: 14,
        fontWeight: "600",
    },
    checkmarkContainer: {
        position: "absolute",
        top: 12,
        right: 12,
    },
    infoCard: {
        flexDirection: "row",
        gap: 12,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginTop: 8,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
});

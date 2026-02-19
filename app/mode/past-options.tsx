import React, { useMemo } from "react";
import ScreenContainer from "@/components/ui/ScreenContainer";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import PastOptions, { SubjectOption } from "@/components/screens/PastOptions";

export default function PastOptionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ subjects?: string; mode?: string }>();
  const selectedSubjects: string[] = useMemo(() => {
    try {
      const s = params.subjects ? JSON.parse(String(params.subjects)) : [];
      return Array.isArray(s) ? (s as string[]) : [];
    } catch {
      return [];
    }
  }, [params.subjects]);

  const handleStart = (options: SubjectOption[]) => {
    if (params.mode === "exam") {
      router.push({
        pathname: "/mode/exam-instructions",
        params: {
          options: JSON.stringify(options),
          mode: String(params.mode),
        },
      });
    } else {
      router.push({
        pathname: "/mode/past-study",
        params: {
          options: JSON.stringify(options),
          mode: String(params.mode || "study"),
        },
      });
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <ThemedText type="title">Past Question Options</ThemedText>
      </View>
      <ThemedText>Select the options below to continue</ThemedText>

      <PastOptions subjects={selectedSubjects} mode={String(params.mode || "")} onStart={handleStart} />
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
});
import React from "react";
import { StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import ScreenContainer from "@/components/ui/ScreenContainer";
import { ThemedText } from "@/components/themed-text";
import EditProfileScreen from "@/components/screens/EditProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function EditProfilePage() {
  const router = useRouter();

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
      <View style={styles.titleContainer}>
        <ThemedText type="title">Edit Profile</ThemedText>
      </View>
      <ThemedText style={{ color: "#555" }}>
        Update your account details below
      </ThemedText>
      <EditProfileScreen />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  titleContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});

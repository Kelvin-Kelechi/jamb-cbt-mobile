import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import ScreenContainer from "@/components/ui/ScreenContainer";
import { ThemedText } from "@/components/themed-text";
import { PasswordField } from "@/components/auth/PasswordField";
import { StrengthMeter } from "@/components/auth/StrengthMeter";
import { passwordStrength, isPasswordValid } from "@/utils/validation";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { AuthApi } from "@/services/api";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { state } = useAuth();
  const primary = useThemeColor({}, "primary");
  const cardBg = useThemeColor({}, "card");
  const cardBorder = useThemeColor({}, "cardBorder");
  const textSecondary = useThemeColor({}, "textSecondary");
  const textColor = useThemeColor({}, "text");

  const [oldPw, setOldPw] = useState("");
  const [nextPw, setNextPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => passwordStrength(nextPw), [nextPw]);
  const validNew = useMemo(() => isPasswordValid(nextPw), [nextPw]);
  const matchValid = useMemo(
    () => confirm.length > 0 && confirm === nextPw,
    [confirm, nextPw]
  );
  const canSubmit = useMemo(
    () => !!oldPw && validNew && matchValid && !loading,
    [oldPw, validNew, matchValid, loading]
  );

  const onSubmit = async () => {
    if (!canSubmit) return;
    try {
      setLoading(true);
      console.log("Auth state:", { hasToken: !!state.token, status: state.status });
      if (!state.token) {
        setLoading(false);
        Alert.alert("Not authenticated", "Please login again.");
        return;
      }
      if (nextPw === oldPw) {
        setLoading(false);
        Alert.alert(
          "Invalid password",
          "New password must be different from current."
        );
        return;
      }
      console.log("Attempting to change password...");
      console.log("Token length:", state.token.length);
      console.log("Old password length:", oldPw.length);
      console.log("New password length:", nextPw.length);
      await AuthApi.changePassword(state.token, oldPw, nextPw);
      console.log("Password changed successfully");
      setLoading(false);
      Alert.alert("Success", "Password updated successfully.");
      router.back();
    } catch (e: any) {
      console.error("Change password error:", e);
      setLoading(false);
      const code = e?.error;
      const msg =
        code === "INVALID_CREDENTIALS"
          ? "Current password is incorrect."
          : code === "INVALID_INPUT"
            ? "Invalid password input."
            : code === "NOT_FOUND"
              ? "Account not found."
              : code === "UNAUTHORIZED"
                ? "Session expired. Please login again."
                : code === "INVALID_TOKEN"
                  ? "Invalid session. Please login again."
                  : "Failed to update password: " + (e?.error || e?.message || "Unknown error");
      Alert.alert("Error", msg);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { borderColor: textColor }]}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <ThemedText type="title">Change Password</ThemedText>
        </View>
        <Text style={[styles.subtitle, { color: textSecondary }]}>
          Update your account password below
        </Text>

        <View style={styles.card}>
          <PasswordField
            label="Current Password"
            value={oldPw}
            onChangeText={setOldPw}
            placeholder="Enter current password"
            valid={oldPw.length > 0}
          />
          <PasswordField
            label="New Password"
            value={nextPw}
            onChangeText={setNextPw}
            placeholder="Enter new password"
            valid={
              nextPw.length === 0 ? undefined : validNew && nextPw !== oldPw
            }
            error={
              nextPw.length > 0 && nextPw === oldPw
                ? "New password must be different from current"
                : undefined
            }
          />
          {/* <StrengthMeter strength={strength} /> */}
          <PasswordField
            label="Confirm Password"
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Re-enter new password"
            valid={confirm.length === 0 ? undefined : matchValid}
            error={
              confirm.length > 0 && !matchValid
                ? "Passwords do not match"
                : undefined
            }
          />
        </View>

        <Pressable
          accessibilityRole="button"
          style={[
            styles.ctaBtn,
            { backgroundColor: primary },
            !canSubmit && styles.ctaDisabled,
          ]}
          onPress={onSubmit}
          disabled={!canSubmit}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.ctaText}>Update Password</Text>
          )}
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, gap: 12, paddingTop: 0 },
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
  titleContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  subtitle: { fontSize: 14, fontWeight: "600" },
  card: { gap: 8 },
  ctaBtn: { paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  ctaDisabled: { opacity: 0.6 },
});

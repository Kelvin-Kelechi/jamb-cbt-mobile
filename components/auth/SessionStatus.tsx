import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  ActivityIndicator,
  Modal,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { Colors, Fonts } from "@/constants/theme";
import { IconSymbol } from "@/components/ui/icon-symbol";

function maskCredential(user?: { email?: string; username?: string }) {
  const email = user?.email;
  const username = user?.username;
  if (email) {
    const [local, domain] = email.split("@");
    const shown = local.slice(0, Math.min(2, local.length));
    return `${shown}${local.length > 2 ? "***" : ""}@${domain}`;
  }
  if (username) {
    const shown = username.slice(0, Math.min(3, username.length));
    return `${shown}${username.length > 3 ? "***" : ""}`;
  }
  return "Guest";
}

function formatCountdown(ms?: number) {
  if (!ms || ms <= 0) return "Expired";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${String(rem).padStart(2, "0")}`;
}

function lastActiveText(ts?: number) {
  if (!ts) return "Unknown";
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export default function SessionStatus() {
  const { state, logout } = useAuth();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [everywhere, setEverywhere] = useState(true);
  const [loading, setLoading] = useState(false);

  const msRemaining = useMemo(
    () => (state.expiresAt ? state.expiresAt - Date.now() : undefined),
    [state.expiresAt]
  );
  const masked = useMemo(() => maskCredential(state.user), [state.user]);

  const statusColor =
    state.status === "authenticated"
      ? "#2F6F3E"
      : state.status === "expired"
      ? "#B00020"
      : "#808080";
  const statusIcon =
    state.status === "authenticated"
      ? "checkmark.seal.fill"
      : state.status === "expired"
      ? "exclamationmark.triangle.fill"
      : "person.fill.xmark";

  const onConfirmLogout = async () => {
    try {
      setLoading(true);
      await logout({
        allDevices: everywhere,
        password: password || undefined,
      });
      setConfirmOpen(false);
      setPassword("");
      setEverywhere(true);
      Alert.alert("Logged out", "Your session was terminated.");
      router.replace("/auth/login");
    } catch (e: any) {
      Alert.alert("Logout error", e?.error || "Unexpected error");
      router.replace("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: Colors.light.background }]}
    >
      <View style={styles.container} accessibilityRole="header">
        <View style={styles.left}>
          <IconSymbol name={statusIcon} color={statusColor} size={24} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.title}>
              {state.status === "authenticated"
                ? "Authenticated"
                : state.status === "expired"
                ? "Session expired"
                : "Unauthenticated"}
            </Text>
            <Text style={styles.sub}>{masked}</Text>
          </View>
        </View>
        <View style={styles.right}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Last active:</Text>
            <Text style={styles.metaValue}>
              {lastActiveText(state.lastActive)}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Timeout:</Text>
            <Text style={[styles.metaValue, { color: statusColor }]}>
              {formatCountdown(msRemaining)}
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Logout"
            onPress={() => setConfirmOpen(true)}
            style={styles.logoutBtn}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      </View>

      <Modal
        visible={confirmOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalDesc}>
              For security, please confirm your password to proceed.
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              style={styles.input}
              accessibilityLabel="Password"
            />
            <View style={styles.rowBetween}>
              <Text>Logout on all devices</Text>
              <Switch value={everywhere} onValueChange={setEverywhere} />
            </View>
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setConfirmOpen(false)}
                style={[styles.actionBtn, styles.cancelBtn]}
                accessibilityLabel="Cancel logout"
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={onConfirmLogout}
                style={[styles.actionBtn, styles.confirmBtn]}
                accessibilityLabel="Confirm logout"
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: "#fff" }}>Logout</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { minHeight: Platform.OS === "ios" ? 44 : 44 },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  left: { flexDirection: "row", alignItems: "center" },
  right: { alignItems: "flex-end" },
  title: { fontFamily: Fonts.rounded, fontSize: 16 },
  sub: { color: "#666" },
  metaRow: { flexDirection: "row", gap: 6 },
  metaLabel: { color: "#666" },
  metaValue: { fontFamily: Fonts.rounded },
  logoutBtn: {
    marginTop: 8,
    backgroundColor: "#B00020",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: "center",
  },
  logoutText: { color: "#fff", fontWeight: "600" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    width: "90%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontFamily: Fonts.rounded, fontSize: 18, marginBottom: 6 },
  modalDesc: { color: "#555", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: "center",
  },
  cancelBtn: { backgroundColor: "#eee" },
  confirmBtn: { backgroundColor: "#B00020" },
});

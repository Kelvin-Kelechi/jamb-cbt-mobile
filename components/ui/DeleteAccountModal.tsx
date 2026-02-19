import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { useThemeColor } from "@/hooks/use-theme-color";
import { PasswordField } from "@/components/auth/PasswordField";

type Props = {
  visible: boolean;
  onConfirm: (password: string) => void;
  onCancel: () => void;
  loading?: boolean;
};

export function DeleteAccountModal({
  visible,
  onConfirm,
  onCancel,
  loading,
}: Props) {
  const [password, setPassword] = useState("");
  const cardBg = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");

  const handleConfirm = () => {
    if (password.length >= 8) {
      onConfirm(password);
    }
  };

  const handleCancel = () => {
    setPassword("");
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={30} tint="dark" style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: cardBg }]}>
          <Text style={[styles.title, { color: textColor }]}>
            Delete Account
          </Text>
          <Text style={[styles.message, { color: textSecondary }]}>
            This action cannot be undone. All your data will be permanently
            deleted. Please enter your password to confirm.
          </Text>

          <PasswordField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            valid={password.length >= 8}
          />

          <View style={styles.buttons}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                styles.deleteButton,
                (loading || password.length < 8) && styles.buttonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={loading || password.length < 8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.deleteText}>Delete</Text>
              )}
            </Pressable>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
  },
  deleteButton: {
    backgroundColor: "#C62828",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  cancelText: {
    color: "#000",
    fontWeight: "600",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
});

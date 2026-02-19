import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { IconSymbolName } from "@/components/ui/icon-symbol";
import { LogoutModal } from "@/components/ui/LogoutModal";
import { DeleteAccountModal } from "@/components/ui/DeleteAccountModal";
import { useAuth } from "@/context/AuthContext";
import { AuthApi } from "@/services/api";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";

type BrickItem = {
  key: string;
  title: string;
  icon: IconSymbolName;
  iconColor: string;
  onPress?: () => void;
};

const items: BrickItem[] = [
  {
    key: "edit-profile",
    title: "Edit Profile",
    icon: "person.fill",
    iconColor: "#2E7D32",
    onPress: () => router.push("/auth/edit-profile"),
  },
  {
    key: "change-password",
    title: "Change Password",
    icon: "lock.fill",
    iconColor: "#1565C0",
    onPress: () => router.push("/auth/change-password"),
  },
  {
    key: "saved-questions",
    title: "Saved Questions",
    icon: "bookmark.fill",
    iconColor: "#EF6C00",
    onPress: () => router.push("/mode/saved-questions"),
  },
  {
    key: "activate-app",
    title: "Activate App",
    icon: "bolt.fill",
    iconColor: "#6A1B9A",
  },
  {
    key: "app-settings",
    title: "App Settings",
    icon: "gearshape.fill",
    iconColor: "#00897B",
    onPress: () => router.push("/settings/app-settings"),
  },
  {
    key: "logout",
    title: "Logout",
    icon: "rectangle.portrait.and.arrow.right",
    iconColor: "#D84315",
  },
  {
    key: "delete-account",
    title: "Delete Account",
    icon: "trash.fill",
    iconColor: "#C62828",
  },
];

export default function MenuBricks() {
  const { logout, state } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const cardBg = useThemeColor({}, "card");
  const cardBorder = useThemeColor({}, "cardBorder");
  const textColor = useThemeColor({}, "text");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout({ allDevices: false });
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleDeleteAccount = async (password: string) => {
    if (!state.token) return;
    setIsDeleting(true);
    try {
      await AuthApi.deleteAccount(state.token, password);
      Alert.alert(
        "Account Deleted",
        "Your account has been permanently deleted."
      );
      await logout({ allDevices: false });
      router.replace("/auth/login");
    } catch (error: any) {
      const msg =
        error?.error === "INVALID_CREDENTIALS"
          ? "Incorrect password"
          : error?.error === "INVALID_TOKEN" || error?.error === "UNAUTHORIZED"
          ? "Session expired. Please login again."
          : "Failed to delete account";
      Alert.alert("Error", msg);
      if (error?.error === "INVALID_TOKEN" || error?.error === "UNAUTHORIZED") {
        await logout({ allDevices: false });
        router.replace("/auth/login");
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleItemPress = (item: BrickItem) => {
    if (item.key === "logout") {
      setShowLogoutModal(true);
    } else if (item.key === "delete-account") {
      setShowDeleteModal(true);
    } else if (item.onPress) {
      item.onPress();
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.bricks}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <Pressable
            key={item.key}
            style={({ pressed }) => [
              styles.brick,
              {
                backgroundColor: cardBg,
                borderColor: cardBorder,
              },
              pressed && styles.brickPressed,
            ]}
            accessibilityLabel={item.title}
            onPress={() => handleItemPress(item)}
          >
            <View style={styles.brickLeft}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: item.iconColor + "15" },
                ]}
              >
                <IconSymbol size={22} name={item.icon} color={item.iconColor} />
              </View>
              <Text style={[styles.brickTitle, { color: textColor }]}>
                {item.title}
              </Text>
            </View>
            <IconSymbol size={20} name="chevron.right" color="#C7C7CC" />
          </Pressable>
        ))}
      </ScrollView>

      <LogoutModal
        visible={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        loading={isLoggingOut}
      />

      <DeleteAccountModal
        visible={showDeleteModal}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
        loading={isDeleting}
      />
    </>
  );
}

const styles = StyleSheet.create({
  bricks: {
    marginTop: 16,
    gap: 16,
    paddingBottom: 100,
  },
  brick: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  brickPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.995 }],
  },
  brickLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  brickTitle: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

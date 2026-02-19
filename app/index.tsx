import {
  StyleSheet,
  View,
  Pressable,
  Text,
  ScrollView,
  Image,
} from "react-native";
import ScreenContainer from "@/components/ui/ScreenContainer";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useRootNavigationState } from "expo-router";
import React, { useEffect } from "react";
import { Fonts } from "@/constants/theme";
// Removed duplicate router import to avoid naming collisions
import { FontAwesome } from "@expo/vector-icons";
const Illustration = require("../assets/images/illustration.png");

export default function WelcomeScreen() {
  const { state } = useAuth();
  const router = useRouter();
  const navState = useRootNavigationState();
  const isAuthenticated = state.status === "authenticated" && (!!state.expiresAt ? Date.now() < state.expiresAt : true) && !!state.token;

  useEffect(() => {
    if (!navState?.key) return; // wait until navigation is ready
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [navState?.key, isAuthenticated]);
  const goSignupGoogle = () =>
    router.push({
      pathname: "/auth/signup",
      params: { provider: "google" },
    } as any);
  const goSignupApple = () =>
    router.push({
      pathname: "/auth/signup",
      params: { provider: "apple" },
    } as any);
  const goSignupEmail = () => router.push("/auth/signup" as any);
  const goLogin = () => router.push("/auth/login" as any);

  const signupButtons = [
    {
      key: "google",
      label: "Sign up with Google",
      icon: "google" as const,
      onPress: goSignupGoogle,
      variant: "green" as const,
    },
    {
      key: "apple",
      label: "Sign up with Apple",
      icon: "apple" as const,
      onPress: goSignupApple,
      variant: "black" as const,
    },
    {
      key: "email",
      label: "Sign up with Email",
      icon: "envelope" as const,
      onPress: goSignupEmail,
      variant: "green" as const,
    },
  ];

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={Illustration}
          style={styles.illustration}
          resizeMode="contain"
          accessibilityLabel="Welcome illustration"
        />

        <Text style={styles.title}>Past Question</Text>
        <Text style={styles.subtitle}>
          Get acquainted with thousands of past Jamb questions to Ace your exam.
        </Text>

        {signupButtons.map(({ key, label, icon, onPress, variant }) => (
          <Pressable
            key={key}
            onPress={onPress}
            style={[
              styles.button,
              variant === "green" ? styles.greenButton : styles.blackButton,
            ]}
            accessibilityLabel={label}
          >
            <View style={styles.btnContent}>
              <FontAwesome name={icon} size={20} color="#fff" />
              <Text style={styles.buttonText}>{label}</Text>
            </View>
          </Pressable>
        ))}

        <Pressable
          onPress={goLogin}
          accessibilityLabel="Already registered? Login"
          style={styles.loginLink}
        >
          <Text style={styles.loginText}>Already registered? Login</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  illustration: {
    width: "100%",
    maxWidth: 350,
    height: 250,
    marginBottom: 32,
    marginTop: 82,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 62,
    paddingHorizontal: 16,
  },
  button: {
    width: "100%",
    maxWidth: 560,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  // topMargin: { marginTop: 5 },
  greenButton: { backgroundColor: "#2F6F3E" },
  blackButton: { backgroundColor: "#000" },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  loginLink: { marginTop: 12 },
  loginText: { color: "#666", fontSize: 14, textAlign: "center" },
});

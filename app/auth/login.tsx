import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import ScreenContainer from "@/components/ui/ScreenContainer";
import { router } from "expo-router";
import { InputField } from "@/components/auth/InputField";
import { PasswordField } from "@/components/auth/PasswordField";
import { isEmail } from "@/utils/validation";
import { AuthApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();

  const idValid = isEmail(identifier);
  const passwordValid = password.length >= 8;

  const onSubmit = async () => {
    try {
      setLoading(true);
      console.log("Attempting login with:", identifier);
      const data = await AuthApi.login(identifier, password);
      console.log("Login successful:", data);
      await setAuth({ token: data.token, user: data.user });
      Alert.alert("Success", "Logged in successfully");
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage = err?.error || err?.message || "Unexpected error occurred";
      Alert.alert("Login failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>
        Login to access your account and continue your journey.
      </Text>
      <InputField
        label="Email address"
        value={identifier}
        onChangeText={setIdentifier}
        placeholder="Enter your email address"
        valid={identifier ? idValid : undefined}
        error={identifier && !idValid ? "Invalid email format" : undefined}
      />
      <PasswordField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        valid={password ? passwordValid : undefined}
        error={password && !passwordValid ? "Minimum 8 characters" : undefined}
      />
      <Pressable
        onPress={() => router.push("/auth/forgot-password" as any)}
        style={styles.link}
      >
        <Text>Forgot Password?</Text>
      </Pressable>

      <Pressable
        accessibilityLabel="Login"
        onPress={onSubmit}
        disabled={loading || !idValid || !passwordValid}
        style={[
          styles.button,
          (loading || !idValid || !passwordValid) && styles.buttonDisabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => router.push("/auth/signup" as any)}
        style={styles.link}
      >
        <Text>New here? Sign up</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#444",
    paddingHorizontal: 12,
  },
  link: { marginTop: 12, alignItems: "center" },
  button: {
    backgroundColor: "#2F6F3E",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

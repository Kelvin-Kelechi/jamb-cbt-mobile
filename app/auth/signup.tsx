import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import ScreenContainer from "@/components/ui/ScreenContainer";
import { router } from "expo-router";
import { InputField } from "@/components/auth/InputField";
import { PasswordField } from "@/components/auth/PasswordField";
import {
  isEmail,
  isUsername,
  passwordStrength,
  isPasswordValid,
} from "@/utils/validation";
import { AuthApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();

  const emailValid = isEmail(email);
  const pwValid = isPasswordValid(password);
  const matchValid = confirm.length > 0 && password === confirm;
  const firstValid =
    firstName.trim().length >= 2 && firstName.trim().length <= 30;
  const lastValid = lastName.trim().length >= 2 && lastName.trim().length <= 30;

  const onSubmit = async () => {
    try {
      setLoading(true);
      const data = await AuthApi.signup({
        firstName,
        lastName,
        email,
        password,
      });
      await setAuth({ token: data.token, user: data.user });
      Alert.alert("Success", "Account created");
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Signup failed", err?.error || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Welcome to LFX Educational Platform. Sign up to get started.
          </Text>
          <View style={styles.form}>
            <InputField
              label="First name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              valid={firstName ? firstValid : undefined}
              error={firstName && !firstValid ? "2–30 characters" : undefined}
            />
            <InputField
              label="Last name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              valid={lastName ? lastValid : undefined}
              error={lastName && !lastValid ? "2–30 characters" : undefined}
            />
            <InputField
              label="Email address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              valid={email ? emailValid : undefined}
              error={email && !emailValid ? "Invalid email format" : undefined}
            />
            <PasswordField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              valid={password ? pwValid : undefined}
              error={
                password && !pwValid
                  ? "Use 8+ chars, mixed case, number & symbol"
                  : undefined
              }
            />
            <PasswordField
              label="Confirm password"
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Re-enter your password"
              valid={confirm ? matchValid : undefined}
              error={
                confirm && !matchValid ? "Passwords must match" : undefined
              }
            />
            <Pressable
              accessibilityLabel="Sign Up"
              onPress={onSubmit}
              disabled={
                loading ||
                !emailValid ||
                !pwValid ||
                !matchValid ||
                !firstValid ||
                !lastValid
              }
              style={[
                styles.button,
                (loading ||
                  !emailValid ||
                  !pwValid ||
                  !matchValid ||
                  !firstValid ||
                  !lastValid) &&
                  styles.buttonDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </Pressable>
          </View>
          <Pressable
            onPress={() => router.push("/auth/login" as any)}
            style={styles.link}
          >
            <Text>Already registered? Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    // padding: 16,
  },
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    padding: 16,
  },

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
  form: {
    gap: 16,
  },
  button: {
    backgroundColor: "#2F6F3E",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    alignItems: "center",
  },
});

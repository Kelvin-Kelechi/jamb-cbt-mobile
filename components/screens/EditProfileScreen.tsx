import React from "react";
import { StyleSheet, View, Alert } from "react-native";
import { InputField } from "@/components/auth/InputField";
import { useAuth } from "@/context/AuthContext";
import { AuthApi } from "@/services/api";
import { Pressable, Text } from "react-native";

export default function EditProfileScreen() {
  const { state, setAuth } = useAuth();
  const initialName = state.user?.name || "";
  const parts = initialName.split(" ");
  const initialFirst = state.user?.firstName ?? (parts[0] || "");
  const initialLast = state.user?.lastName ?? (parts.slice(1).join(" ") || "");
  const [firstName, setFirstName] = React.useState(initialFirst);
  const [lastName, setLastName] = React.useState(initialLast);
  const [email, setEmail] = React.useState(state.user?.email || "");
  const [phone, setPhone] = React.useState(state.user?.phone || "");
  const [loading, setLoading] = React.useState(false);

  const onSave = async () => {
    if (!state.token) {
      Alert.alert("Not logged in", "Please log in to update your profile");
      return;
    }
    try {
      setLoading(true);
      const payload: any = {};
      if (firstName && firstName !== state.user?.firstName) payload.firstName = firstName;
      if (lastName && lastName !== state.user?.lastName) payload.lastName = lastName;
      if (email && email !== state.user?.email) payload.email = email;
      if (phone && phone !== state.user?.phone) payload.phone = phone;
      const composedName = `${firstName.trim()} ${lastName.trim()}`.trim();
      if (composedName && composedName !== state.user?.name) payload.name = composedName;
      const res = await AuthApi.updateProfile(state.token, payload);
      await setAuth({ token: state.token, user: res.user });
      Alert.alert("Profile updated", "Your changes have been saved.");
    } catch (e: any) {
      Alert.alert("Update failed", e?.error || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ marginTop: 8 }}>
      <InputField label="First Name" value={firstName} onChangeText={setFirstName} placeholder="Your first name" />
      <InputField label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Your last name" />
      <InputField label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" />
      <InputField label="Phone Number" value={phone} onChangeText={setPhone} placeholder="e.g. +234 801 234 5678" />

      <View style={styles.footer}>
        <Pressable style={[styles.saveBtn, loading && { opacity: 0.6 }]} onPress={onSave} disabled={loading} accessibilityRole="button">
          <Text style={styles.saveText}>{loading ? "Saving..." : "Save changes"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { marginTop: 16 },
  saveBtn: { height: 48, borderRadius: 12, backgroundColor: "#2E7D32", alignItems: "center", justifyContent: "center" },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
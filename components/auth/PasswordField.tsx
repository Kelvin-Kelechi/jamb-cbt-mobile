import React, { useState } from "react";
import { TextInput, View, Text, StyleSheet, Pressable } from "react-native";
import { Colors, Fonts } from "@/constants/theme";

interface Props {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  error?: string;
  valid?: boolean;
}

export function PasswordField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  valid,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={label}
      accessibilityHint={`Input field for ${label}`}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={{ position: "relative" }}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={!visible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            isFocused && styles.focused,
            valid === true
              ? styles.valid
              : valid === false
                ? styles.invalid
                : null,
          ]}
        />
        <Pressable
          accessibilityLabel="Toggle password visibility"
          onPress={() => setVisible((v) => !v)}
          style={styles.toggle}
        >
          <Text style={{ color: Colors.light.tint }}>
            {visible ? "Hide" : "Show"}
          </Text>
        </Pressable>
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontFamily: Fonts.rounded, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "transparent",
  },
  focused: { borderColor: "green", borderWidth: 2 },
  error: { color: "red", marginTop: 6 },
  valid: { borderColor: "green" },
  invalid: { borderColor: "red" },
  toggle: { position: "absolute", right: 12, top: 12 },
});

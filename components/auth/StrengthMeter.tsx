import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PasswordStrength } from '@/utils/validation';

export function StrengthMeter({ strength }: { strength: PasswordStrength }) {
  const colors = { weak: '#d9534f', medium: '#f0ad4e', strong: '#5cb85c' } as const;
  const labels = { weak: 'Weak', medium: 'Medium', strong: 'Strong' } as const;
  return (
    <View style={styles.container} accessibilityLabel={`Password strength ${labels[strength]}`}> 
      <View style={[styles.bar, { backgroundColor: colors[strength], width: strength === 'weak' ? '33%' : strength === 'medium' ? '66%' : '100%' }]} />
      <Text style={[styles.text, { color: colors[strength] }]}>{labels[strength]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 6 },
  bar: { height: 6, borderRadius: 6 },
  text: { marginTop: 4, fontWeight: 'bold' },
});
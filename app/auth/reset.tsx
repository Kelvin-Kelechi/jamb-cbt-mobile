import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import ScreenContainer from '@/components/ui/ScreenContainer';
import { useLocalSearchParams, router } from 'expo-router';
import { PasswordField } from '@/components/auth/PasswordField';
import { StrengthMeter } from '@/components/auth/StrengthMeter';
import { passwordStrength, isPasswordValid } from '@/utils/validation';
import { AuthApi } from '@/services/api';

export default function ResetPassword() {
  const params = useLocalSearchParams<{ email?: string; token?: string }>();
  const [email, setEmail] = useState(params.email || '');
  const [token, setToken] = useState(params.token || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = passwordStrength(password);
  const pwValid = isPasswordValid(password);
  const matchValid = confirm.length > 0 && confirm === password;

  const onSubmit = async () => {
    try {
      setLoading(true);
      await AuthApi.resetPassword(email, token, password);
      Alert.alert('Success', 'Password updated');
      router.push('/auth/login' as any);
    } catch (err: any) {
      Alert.alert('Error', err?.error || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={{ marginBottom: 8 }}>Email: {email}</Text>
      <Text style={{ marginBottom: 8 }}>Token: {token ? token.slice(0, 6) + '...' : ''}</Text>
      <PasswordField label="New password" value={password} onChangeText={setPassword} placeholder="Enter new password" valid={password ? pwValid : undefined} error={password && !pwValid ? 'Use 8+ chars, mixed case, number & symbol' : undefined} />
      <StrengthMeter strength={strength} />
      <PasswordField label="Confirm" value={confirm} onChangeText={setConfirm} placeholder="Re-enter new password" valid={confirm ? matchValid : undefined} error={confirm && !matchValid ? 'Passwords must match' : undefined} />
      <Pressable accessibilityLabel="Update" onPress={onSubmit} disabled={loading || !pwValid || !matchValid} style={[styles.button, (loading || !pwValid || !matchValid) && styles.buttonDisabled]}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update Password</Text>}
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  button: { backgroundColor: '#2F6F3E', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
import React, { useState } from 'react';
import { Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import ScreenContainer from '@/components/ui/ScreenContainer';
import { router } from 'expo-router';
import { InputField } from '@/components/auth/InputField';
import { isEmail } from '@/utils/validation';
import { AuthApi } from '@/services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const emailValid = isEmail(email);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await AuthApi.forgotPassword(email);
      Alert.alert('Check your email', 'If an account exists, a reset email was sent');
      router.push('/auth/login' as any);
    } catch (err: any) {
      Alert.alert('Error', err?.error || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <InputField label="Email address" value={email} onChangeText={setEmail} placeholder="Enter your email address" valid={email ? emailValid : undefined} error={email && !emailValid ? 'Invalid email format' : undefined} />
      <Pressable accessibilityLabel="Submit" onPress={onSubmit} disabled={loading || !emailValid} style={[styles.button, (loading || !emailValid) && styles.buttonDisabled]}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit</Text>}
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
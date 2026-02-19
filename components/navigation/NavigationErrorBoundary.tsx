import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: unknown };

export default class NavigationErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown) {
    // Intentionally minimal: avoid leaking details. Could log to monitoring here.
    console.warn('Navigation error boundary caught:', error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.fallback} accessible accessibilityLabel="Navigation error">
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.desc}>We couldn’t render this screen. Please try again.</Text>
          <Pressable onPress={this.handleReset} style={styles.button} accessibilityLabel="Retry rendering">
            <Text style={styles.buttonText}>Retry</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

const styles = StyleSheet.create({
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  desc: { color: '#666', marginBottom: 16, textAlign: 'center' },
  button: { backgroundColor: '#2F6F3E', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
});
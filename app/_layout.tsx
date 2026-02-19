import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/context/AuthContext';
import { SavedQuestionsProvider } from '@/context/SavedQuestionsContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import NavigationErrorBoundary from '@/components/navigation/NavigationErrorBoundary';

export const unstable_settings = {} as const;

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isDark } = useTheme();

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <SavedQuestionsProvider>
          <NavigationErrorBoundary>
            <Stack
              screenOptions={{
                contentStyle: { backgroundColor: isDark ? "#121212" : "#f1f7f1" }
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="auth/login" options={{ headerShown: false }} />
              <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
              <Stack.Screen
                name="auth/forgot-password"
                options={{ title: "Forgot Password" }}
              />
              <Stack.Screen
                name="auth/reset"
                options={{ title: "Reset Password" }}
              />
              <Stack.Screen
                name="auth/edit-profile"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="mode/study" options={{ headerShown: false }} />
              <Stack.Screen name="mode/exam" options={{ headerShown: false }} />
              <Stack.Screen
                name="mode/past-options"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="mode/past-study"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="mode/exam-instructions"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="mode/exam-results"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="mode/exam-corrections"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="mode/saved-questions"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="settings/app-settings"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="auth/change-password"
                options={{ headerShown: false }}
              />
            </Stack>
          </NavigationErrorBoundary>
          <StatusBar style={isDark ? "light" : "dark"} />
        </SavedQuestionsProvider>
      </AuthProvider>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

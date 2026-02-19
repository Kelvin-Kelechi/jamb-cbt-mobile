import React from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ScreenContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  /**
   * Safe area edges to apply. Defaults to top and bottom to avoid notch and home indicator.
   */
  edges?: ReadonlyArray<'top' | 'right' | 'bottom' | 'left'>;
  /** Pass-through theme overrides */
  lightColor?: string;
  darkColor?: string;
};

export function ScreenContainer({
  children,
  style,
  edges = ['top'],
  lightColor,
  darkColor,
}: ScreenContainerProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={edges}>
      <ThemedView style={[styles.container, style]} lightColor={lightColor} darkColor={darkColor}>
        {children}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
});

export default ScreenContainer;
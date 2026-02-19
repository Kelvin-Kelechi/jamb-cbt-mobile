import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as Haptics from "expo-haptics";

export default function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const activeColor = descriptors[state.routes[state.index].key].options.tabBarActiveTintColor ?? (colorScheme === "dark" ? "#7AE584" : "#2E7D32");
  const inactiveColor = descriptors[state.routes[state.index].key].options.tabBarInactiveTintColor ?? "#8A8A9E";
  const edgeColor = colorScheme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)";
  const surfaceColor = colorScheme === "dark" ? "rgba(18, 18, 18, 0.28)" : "rgba(255, 255, 255, 0.28)";
  const blob = useRef(new Animated.Value(0)).current;
  const focusValsRef = useRef<Record<string, Animated.Value>>({});
  const itemLayoutsRef = useRef<Record<string, { x: number; y: number; width: number; height: number }>>({});
  const contentLayoutsRef = useRef<Record<string, { x: number; width: number; y: number; height: number }>>({});
  const indicatorLeft = useRef(new Animated.Value(16)).current;
  const indicatorTop = useRef(new Animated.Value(12)).current;
  const indicatorSize = useRef(new Animated.Value(56)).current;

  useEffect(() => {
    state.routes.forEach((route, i) => {
      if (!focusValsRef.current[route.key]) {
        focusValsRef.current[route.key] = new Animated.Value(i === state.index ? 1 : 0);
      }
    });
  }, [state.routes]);

  useEffect(() => {
    blob.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(blob, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(blob, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, [state.index]);

  useEffect(() => {
    state.routes.forEach((route, i) => {
      const v = focusValsRef.current[route.key];
      if (!v) return;
      if (i === state.index) {
        Animated.spring(v, { toValue: 1, useNativeDriver: true, friction: 5, tension: 180 }).start();
      } else {
        Animated.timing(v, { toValue: 0, duration: 280, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
      }
    });
  }, [state.index]);

  useEffect(() => {
    const route = state.routes[state.index];
    const item = itemLayoutsRef.current[route.key];
    const content = contentLayoutsRef.current[route.key];
    const count = state.routes.length;
    const containerPad = 6;
    const rowWidthEstimate = 360;
    const itemWidthEstimate = rowWidthEstimate / Math.max(1, count);
    const fallbackContentWidth = Math.max(80, Math.min(itemWidthEstimate - 20, 160));
    const fallbackContentHeight = 48;
    const cx = item && content ? item.x + content.x + content.width / 2 + containerPad : 16 + (state.index * itemWidthEstimate) + itemWidthEstimate / 2;
    const cy = item && content ? item.y + content.y + content.height / 2 : 39;
    const baseSize = content ? Math.max(content.height, Math.min(content.width, 48)) : Math.max(fallbackContentHeight, Math.min(fallbackContentWidth, 48));
    const targetSize = Math.max(44, Math.min(baseSize + 16, 64));
    const targetLeft = cx - targetSize / 2;
    const targetTop = cy - targetSize / 2;

    Animated.spring(indicatorLeft, { toValue: targetLeft, useNativeDriver: false, friction: 5, tension: 180 }).start();
    Animated.spring(indicatorTop, { toValue: targetTop, useNativeDriver: false, friction: 5, tension: 180 }).start();
    Animated.sequence([
      Animated.timing(indicatorSize, { toValue: targetSize * 1.1, duration: 140, easing: Easing.out(Easing.quad), useNativeDriver: false }),
      Animated.timing(indicatorSize, { toValue: targetSize, duration: 220, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
    ]).start();
  }, [state.index, state.routes, indicatorLeft, indicatorTop, indicatorSize]);

  return (
    <View style={[styles.container, { borderColor: edgeColor, backgroundColor: surfaceColor }]}>
      <BlurView intensity={80} tint={colorScheme === "dark" ? "dark" : "light"} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={[edgeColor, "transparent", "transparent", edgeColor]} locations={[0, 0.15, 0.85, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={[edgeColor, "transparent", "transparent", edgeColor]} locations={[0, 0.15, 0.85, 1]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />

      <Animated.View style={[styles.indicator, { left: indicatorLeft, top: indicatorTop, width: indicatorSize, height: indicatorSize, borderRadius: 9999 }] }>
        <BlurView intensity={100} tint={colorScheme === "dark" ? "dark" : "light"} style={styles.activeBlur} />
        <LinearGradient colors={["rgba(255,255,255,0.18)", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.activeShine} />
        <Animated.View style={[styles.blob, { transform: [{ translateX: blob.interpolate({ inputRange: [0, 1], outputRange: [-18, 18] }) }] }]} />
        <Animated.View style={[styles.blobSmall, { transform: [{ translateX: Animated.multiply(blob.interpolate({ inputRange: [0, 1], outputRange: [-18, 18] }), -1) }] }]} />
      </Animated.View>

      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const rawLabel = options.tabBarLabel ?? options.title ?? route.name;
          const iconRenderer = options.tabBarIcon;
          const color = focused ? activeColor : inactiveColor;

          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          const onPressIn = () => {
            if (process.env.EXPO_OS === "ios") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          };

          const focusAnim = focusValsRef.current[route.key] || new Animated.Value(focused ? 1 : 0);
          const scaleIn = focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.05] });
          const translateY = focusAnim.interpolate({ inputRange: [0, 1], outputRange: [6, 0] });
          const padH = focused ? 22 : 16;
          const padV = focused ? 14 : 8;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              onPress={onPress}
              onPressIn={onPressIn}
              style={styles.item}
              onLayout={(e) => {
                const { x, y, width, height } = e.nativeEvent.layout;
                itemLayoutsRef.current[route.key] = { x, y, width, height };
              }}
            >
              <Animated.View
                style={[
                  styles.content,
                  {
                    paddingHorizontal: padH,
                    paddingVertical: padV,
                    transform: [{ scale: scaleIn }, { translateY }],
                    opacity: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }),
                  },
                ]}
                onLayout={(e) => {
                  const { x, y, width, height } = e.nativeEvent.layout;
                  contentLayoutsRef.current[route.key] = { x, width, y, height };
                }}
              >
                {typeof iconRenderer === "function" ? iconRenderer({ focused, color, size: 28 }) : null}
                {typeof rawLabel === "function"
                  ? rawLabel({ focused, color, position: "below-icon" as any, children: String(route.name) })
                  : <Text style={[styles.label, { color }]}>{String(rawLabel)}</Text>}

              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    marginHorizontal: 16,
    left: 16,
    right: 16,
    bottom: 18,
    height: 78,
    borderRadius: 36,
    overflow: "hidden",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
    letterSpacing: 0.2,
  },
  activeWrap: {
    position: "absolute",
    top: 12,
    bottom: 12,
    left: 18,
    right: 18,
    borderRadius: 28,
    overflow: "hidden",
  },
  activeBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
  },
  activeShine: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
  },
  indicator: {
    position: "absolute",
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.18)",
    top: 8,
    left: 32,
  },
  blobSmall: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.14)",
    bottom: 8,
    right: 32,
  },
});
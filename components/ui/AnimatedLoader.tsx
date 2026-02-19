import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

export type AnimatedLoaderProps = {
  size?: number;
  color?: string;
  style?: any;
  fullscreen?: boolean;
  type?: "spinner" | "dots";
};

export default function AnimatedLoader({ size = 28, color = "#2E7D32", style, fullscreen = false, type = "spinner" }: AnimatedLoaderProps) {
  const a1 = useRef(new Animated.Value(0)).current;
  const a2 = useRef(new Animated.Value(0)).current;
  const a3 = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (type === "dots") {
      const loop = (v: Animated.Value, delay: number) => {
        v.setValue(0);
        return Animated.loop(
          Animated.sequence([
            Animated.timing(v, { toValue: 1, duration: 520, delay, useNativeDriver: true }),
            Animated.timing(v, { toValue: 0, duration: 520, useNativeDriver: true }),
          ])
        );
      };
      const l1 = loop(a1, 0);
      const l2 = loop(a2, 160);
      const l3 = loop(a3, 320);
      l1.start();
      l2.start();
      l3.start();
      return () => {
        l1.stop();
        l2.stop();
        l3.stop();
      };
    } else {
      spin.setValue(0);
      const rot = Animated.loop(
        Animated.timing(spin, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true })
      );
      rot.start();
      return () => rot.stop();
    }
  }, [a1, a2, a3, spin, type]);

  const dotStyle = (v: Animated.Value) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
    transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.15] }) }],
  });

  const spinnerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: Math.max(2, Math.min(6, Math.floor(size * 0.12))),
    borderColor: "transparent",
    borderTopColor: color,
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }],
  } as const;

  return (
    <View style={[fullscreen ? styles.fullscreen : styles.row, style]}>
      {type === "dots" ? (
        <>
          <Animated.View style={dotStyle(a1)} />
          <Animated.View style={[dotStyle(a2), styles.dotGap]} />
          <Animated.View style={dotStyle(a3)} />
        </>
      ) : (
        <Animated.View style={spinnerStyle} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  dotGap: { marginHorizontal: 6 },
  fullscreen: { flex: 1, alignItems: "center", justifyContent: "center" },
});
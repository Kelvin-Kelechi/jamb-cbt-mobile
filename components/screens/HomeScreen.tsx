import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Animated,
  Easing,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ScreenContainer from "@/components/ui/ScreenContainer";
import { ModeSelectModal } from "@/components/ui/ModeSelectModal";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { IconSymbolName } from "@/components/ui/icon-symbol";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTheme } from "@/context/ThemeContext";

export type HomeScreenProps = {};

export default function HomeScreen(_: HomeScreenProps) {
  const { state } = useAuth();
  const fullName = state.user?.name || "";
  const firstName = fullName.trim().split(" ")[0] || "Guest";

  const textColor = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const cardBg = useThemeColor({}, "card");
  const { isDark } = useTheme();

  // Dynamic sub-greeting that updates on login/signup (auth status changes)
  const [subGreetingMsg, setSubGreetingMsg] = useState<string>("");

  const messages = useMemo(
    () => [
      "Welcome back! Let's keep the streak going.",
      "Great to see you again. Ready to smash your goals?",
      "You’ve got this — dive right in.",
      "New day, new wins. Let’s study smart.",
      "Let’s ace some questions today.",
      "Time to level up — let’s get started!",
      "Consistency is key — let’s make today count.",
      "Back at it! Let’s crush your study goals.",
      "Every session counts. Let’s do this!",
      "Focus mode: ON. You’re unstoppable.",
    ],
    [firstName],
  );

  useEffect(() => {
    if (state.status === "authenticated") {
      const idx = Math.floor(Math.random() * messages.length);
      setSubGreetingMsg(messages[idx]);
    } else {
      setSubGreetingMsg("Ready to learn and study today?");
    }
  }, [state.status, messages]);

  // Auto-sliding hero copy (title + subtitle) with animations
  const heroSlides: {
    title: string;
    subtitle: string;
    icon: IconSymbolName;
  }[] = useMemo(
    () => [
      {
        title: "JAMB CBT + WAEC Past Quetions",
        subtitle: "Over 60,000 real questions at your fingertips.",
        icon: "doc.text.fill",
      },
      {
        title: "One Time Device Activation",
        subtitle:
          "Valid for the life of your device. No monthly, quarterly or yearly payments",
        icon: "checkmark.seal.fill",
      },
      {
        title: "Study and Practice Anywhere",
        subtitle: "Access questions, answers and explanations 100% Offline",
        icon: "wifi.slash",
      },
    ],
    [firstName],
  );
  const [heroIndex, setHeroIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const heroParallax = useRef(new Animated.Value(0)).current;
  const greetIn = useRef(new Animated.Value(0)).current;
  const gridIns: Animated.Value[] = useMemo(
    () => new Array(6).fill(0).map(() => new Animated.Value(0)),
    [],
  );
  const shimmer = useRef(new Animated.Value(0)).current;
  const heroTilt = useRef(new Animated.Value(0)).current;
  const heroSkew = useRef(new Animated.Value(0)).current;
  const shineX = useRef(new Animated.Value(0)).current;
  const heroGlow = useRef(new Animated.Value(0)).current;
  const badgePulse = useRef(new Animated.Value(0)).current;
  const auroraX1 = useRef(new Animated.Value(-160)).current;
  const auroraX2 = useRef(new Animated.Value(360)).current;
  const [showModeModal, setShowModeModal] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(greetIn, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
        tension: 120,
      }),
      Animated.stagger(
        80,
        gridIns.map((v, i) =>
          Animated.spring(v, {
            toValue: 1,
            useNativeDriver: true,
            friction: 7 + i,
            tension: 120,
          }),
        ),
      ),
    ]).start();

    shimmer.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    badgePulse.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(badgePulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(badgePulse, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    auroraX1.setValue(-160);
    auroraX2.setValue(360);
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(auroraX1, {
            toValue: 420,
            duration: 7000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(auroraX1, {
            toValue: -160,
            duration: 0,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(auroraX2, {
            toValue: -160,
            duration: 7000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(auroraX2, {
            toValue: 360,
            duration: 0,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();

    const interval = setInterval(() => {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -15,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(heroTilt, {
            toValue: 1,
            duration: 250,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(heroTilt, {
            toValue: 0,
            duration: 250,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(heroSkew, {
            toValue: 1,
            duration: 250,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(heroSkew, {
            toValue: 0,
            duration: 250,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(shineX, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(shineX, {
            toValue: 0,
            duration: 0,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(heroGlow, {
            toValue: 1,
            duration: 220,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(heroGlow, {
            toValue: 0,
            duration: 320,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]).start(({ finished }) => {
        if (!finished) return;
        setHeroIndex((i) => (i + 1) % heroSlides.length);
        // Prepare next slide coming from left
        slideAnim.setValue(-20);
        // Animate in
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [fadeAnim, slideAnim, heroSlides.length, greetIn, gridIns, shimmer]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const v = Math.max(0, Math.min(y / 60, 1));
    heroParallax.setValue(v);
  };

  const quickLinks: {
    bg: string;
    icon: IconSymbolName;
    title: string;
    subtitle: string;
    badge?: string;
    badgeColor: string; // Made required for border color usage
    route?: string;
  }[] = [
    {
      bg: "#E8F5E9", // Light Green
      icon: "doc.text.fill",
      title: "Past\nQuestions",
      subtitle: "60k+ Questions",
      badge: "Popular",
      badgeColor: "#2E7D32",
    },
    {
      bg: "#E3F2FD", // Light Blue
      icon: "text.book.closed.fill",
      title: "Summary\nNote",
      subtitle: "Key points",
      badge: "Free",
      badgeColor: "#1565C0",
    },
    {
      bg: "#FFF8E1", // Light Amber
      icon: "book.fill",
      title: "Jamb\nSyllabus",
      subtitle: "Official Guide",
      badge: "Updated",
      badgeColor: "#FF8F00",
    },
    {
      bg: "#F3E5F5", // Light Purple
      icon: "rectangle.stack.fill",
      title: "Flash\nCards",
      subtitle: "Quick Memorization",
      badge: "New",
      badgeColor: "#7B1FA2",
      route: "/flashcards",
    },
    {
      bg: "#E0F7FA", // Cyan
      icon: "chart.bar.fill",
      title: "My\nPerformance",
      subtitle: "Track Progress",
      badge: "Stats",
      badgeColor: "#0097A7",
      route: "/performance",
    },
    {
      bg: "#FFEBEE", // Light Red
      icon: "checkmark.seal.fill",
      title: "Activate\nApp",
      subtitle: "Full Access",
      badge: "Premium",
      badgeColor: "#C62828",
    },
  ];

  return (
    <ScreenContainer>
      <Animated.View
        style={[
          styles.greetingHeader,
          {
            opacity: greetIn,
            transform: [
              {
                translateY: greetIn.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.greetingBlock}>
          <Text style={[styles.greeting, { color: textColor }]}>
            Hello, {firstName}
          </Text>
          <Text style={[styles.subGreeting, { color: textSecondary }]}>
            {subGreetingMsg}
          </Text>
        </View>
      </Animated.View>
      <ScrollView
        contentContainerStyle={styles.scroll}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* Hero card */}
        <Animated.View
          style={[
            styles.hero,
            {
              transform: [
                {
                  translateY: heroParallax.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }),
                },
                {
                  scale: heroParallax.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.98],
                  }),
                },
                {
                  rotateZ: heroTilt.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "2deg"],
                  }),
                },
                {
                  skewY: heroSkew.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "2deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={["#1B5E20", "#337f37ff", "#bafabcff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          />
          <Animated.View
            style={{
              position: "absolute",
              top: 6,
              bottom: 6,
              width: 200,
              borderRadius: 140,
              overflow: "hidden",
              transform: [{ translateX: auroraX1 }, { rotateZ: "18deg" }],
            }}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.05)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 180,
              borderRadius: 140,
              overflow: "hidden",
              transform: [{ translateX: auroraX2 }, { rotateZ: "-12deg" }],
            }}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.12)", "rgba(255,255,255,0.04)"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 140,
              borderRadius: 120,
              backgroundColor: "rgba(255,255,255,0.25)",
              transform: [
                {
                  translateX: shineX.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 420],
                  }),
                },
                { rotateZ: "15deg" },
              ],
            }}
          />
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: "rgba(255,255,255,0.12)",
                opacity: heroGlow,
                borderRadius: 16,
              },
            ]}
          />
          <Animated.View
            style={{
              position: "absolute",
              bottom: -20,
              right: -20,
              opacity: 0.15,
              transform: [
                { rotate: "-15deg" },
                {
                  scale: shimmer.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1],
                  }),
                },
              ],
            }}
          >
            <IconSymbol
              size={140}
              name={heroSlides[heroIndex].icon}
              color="#fff"
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.heroTextWrap,
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <Text style={styles.heroTitle}>{heroSlides[heroIndex].title}</Text>
            <Text style={styles.heroSubtitle}>
              {heroSlides[heroIndex].subtitle}
            </Text>
          </Animated.View>
          <View style={styles.heroFooter}>
            <View style={styles.activatePill}>
              <Animated.Text
                style={[
                  styles.activateText,
                  {
                    opacity: shimmer.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.75, 1],
                    }),
                  },
                ]}
              >
                Activate
              </Animated.Text>
            </View>
            <Animated.View
              style={[
                styles.checkBadge,
                {
                  transform: [
                    {
                      scale: badgePulse.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1.08],
                      }),
                    },
                  ],
                },
              ]}
            >
              <IconSymbol size={22} name="checkmark.seal.fill" color="#fff" />
            </Animated.View>
          </View>
        </Animated.View>

        {/* Sections */}
        {/* <Text style={styles.sectionTitle}>CBT Simulators</Text> */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Study Tools
        </Text>

        {/* Quick links grid */}
        <View style={styles.grid}>
          {quickLinks.map((item, index) => (
            <Animated.View
              key={index}
              style={[
                styles.card,
                {
                  backgroundColor: item.bg,
                  borderColor: item.badgeColor,
                  borderWidth: 1,
                  opacity: gridIns[index],
                  transform: [
                    {
                      translateY: gridIns[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Pressable
                style={styles.cardPressable}
                onPress={() => {
                  if (item.route) {
                    router.push(item.route as any);
                    return;
                  }
                  if (item.title.includes("Past")) {
                    setShowModeModal(true);
                  }
                }}
              >
                {/* Watermark Icon */}
                <View style={[styles.cardIconWatermark, { opacity: 0.08 }]}>
                  <IconSymbol
                    size={70}
                    name={item.icon}
                    color={item.badgeColor}
                  />
                </View>

                {/* Top Row: Icon + Badge */}
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.cardIconSmall,
                      { backgroundColor: "rgba(255,255,255,0.9)" },
                    ]}
                  >
                    <IconSymbol
                      size={18}
                      name={item.icon}
                      color={item.badgeColor}
                    />
                  </View>
                  {item.badge && (
                    <View
                      style={[
                        styles.cardBadge,
                        { backgroundColor: item.badgeColor },
                      ]}
                    >
                      <Text style={styles.cardBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                  <Text
                    style={styles.cardTitle}
                    adjustsFontSizeToFit
                    numberOfLines={2}
                    minimumFontScale={0.8}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={styles.cardSubtitle}
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    minimumFontScale={0.8}
                  >
                    {item.subtitle}
                  </Text>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
      <ModeSelectModal
        visible={showModeModal}
        onCancel={() => setShowModeModal(false)}
        onSelectStudy={() => {
          setShowModeModal(false);
          router.push("/mode/study");
        }}
        onSelectCBT={() => {
          setShowModeModal(false);
          router.push("/mode/exam");
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 120,
    gap: 16,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  greetingBlock: {
    marginBottom: 8,
    gap: 4,
  },
  greetingHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  subGreeting: {
    fontSize: 16,
    color: "#4A4A4A",
    fontWeight: "500",
  },

  actions: { flexDirection: "row", gap: 12 },
  actionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  hero: {
    borderRadius: 16,
    padding: 16,
    minHeight: 160,
    overflow: "hidden",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 28,
  },
  heroTextWrap: {
    gap: 4,
    minHeight: 60,
    justifyContent: "center",
  },
  heroSubtitle: {
    marginTop: 4,
    color: "#EAEAEA",
    fontWeight: "500",
  },
  heroFooter: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  activatePill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  activateText: { color: "#FFFFFF", fontWeight: "700" },
  checkBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "47%",
    height: 150,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardPressable: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
    gap: 36,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  cardBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
  cardIconWatermark: {
    position: "absolute",
    bottom: -10,
    right: -10,
    transform: [{ rotate: "-15deg" }],
  },
  cardContent: {
    justifyContent: "flex-end",
    gap: 2,
  },
  cardIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1A1A1A",
    lineHeight: 18,
  },
  cardSubtitle: {
    fontSize: 10,
    fontWeight: "500",
    color: "rgba(0,0,0,0.6)",
  },
});

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { flashcardsData } from "@/components/data/flashcardsData";
import { IconSymbol } from "@/components/ui/icon-symbol";
import ScreenContainer from "@/components/ui/ScreenContainer";
import { useThemeColor } from "@/hooks/use-theme-color";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

export default function FlashcardDeckScreen() {
  const { id } = useLocalSearchParams();
  const deckId = Array.isArray(id) ? id[0] : id;
  const deck = flashcardsData[deckId as string];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const cardBg = useThemeColor({}, "card");

  useEffect(() => {
    if (!deck) {
      router.back();
    }
  }, [deck]);

  if (!deck) return null;

  const currentCard = deck.cards[currentIndex];

  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentIndex < deck.cards.length - 1) {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIsFlipped(false);
        flipAnim.setValue(0);
        setCurrentIndex(currentIndex + 1);
        slideAnim.setValue(width);
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIsFlipped(false);
        flipAnim.setValue(0);
        setCurrentIndex(currentIndex - 1);
        slideAnim.setValue(-width);
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  return (
    <ScreenContainer>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: deck.title,
          headerTransparent: true,
          headerBlurEffect: "regular",
          headerTintColor: text,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
                padding: 8,
                marginLeft: -8,
              })}
            >
              <IconSymbol name="chevron.left" size={24} color={text} />
            </Pressable>
          ),
        }}
      />

      <View style={styles.container}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentIndex + 1) / deck.cards.length) * 100}%`,
                  backgroundColor: deck.color,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: textSecondary }]}>
            {currentIndex + 1} / {deck.cards.length}
          </Text>
        </View>

        {/* Card Area */}
        <View style={styles.cardArea}>
          <Pressable onPress={flipCard} style={styles.cardWrapper}>
            <Animated.View
              style={[
                styles.card,
                {
                  backgroundColor: cardBg,
                  transform: [
                    { translateX: slideAnim },
                    { rotateY: frontInterpolate },
                  ],
                  opacity: frontOpacity,
                  zIndex: isFlipped ? 0 : 1,
                },
              ]}
            >
              <LinearGradient
                colors={[deck.color + "10", deck.color + "05"]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.cardContent}>
                <Text style={[styles.topicLabel, { color: deck.color }]}>
                  {currentCard.topic}
                </Text>
                <Text style={[styles.questionText, { color: text }]}>
                  {currentCard.front}
                </Text>
                <View style={styles.tapHint}>
                  <IconSymbol
                    name="arrow.triangle.2.circlepath"
                    size={20}
                    color={textSecondary}
                  />
                  <Text style={[styles.tapText, { color: textSecondary }]}>
                    Tap to flip
                  </Text>
                </View>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.card,
                styles.cardBack,
                {
                  backgroundColor: deck.color, // Solid color for back
                  transform: [
                    { translateX: slideAnim },
                    { rotateY: backInterpolate },
                  ],
                  opacity: backOpacity,
                  zIndex: isFlipped ? 1 : 0,
                },
              ]}
            >
              <View style={styles.cardContent}>
                <Text style={styles.answerLabel}>Answer</Text>
                <Text style={styles.answerText}>{currentCard.back}</Text>
              </View>
            </Animated.View>
          </Pressable>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <Pressable
            onPress={prevCard}
            disabled={currentIndex === 0}
            style={[
              styles.controlBtn,
              {
                backgroundColor: cardBg,
                opacity: currentIndex === 0 ? 0.5 : 1,
              },
            ]}
          >
            <IconSymbol name="arrow.left" size={24} color={text} />
          </Pressable>

          <View style={styles.deckInfo}>
            <IconSymbol name={deck.icon as any} size={24} color={deck.color} />
            <Text style={[styles.deckTitle, { color: text }]}>
              {deck.title}
            </Text>
          </View>

          <Pressable
            onPress={nextCard}
            disabled={currentIndex === deck.cards.length - 1}
            style={[
              styles.controlBtn,
              {
                backgroundColor: deck.color,
                opacity: currentIndex === deck.cards.length - 1 ? 0.5 : 1,
              },
            ]}
          >
            <IconSymbol name="arrow.right" size={24} color="#fff" />
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  progressContainer: {
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  cardArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    position: "absolute",
    backfaceVisibility: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  cardBack: {
    // Overrides for back side
  },
  cardContent: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  topicLabel: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 24,
  },
  questionText: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 36,
  },
  tapHint: {
    position: "absolute",
    bottom: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    opacity: 0.6,
  },
  tapText: {
    fontSize: 14,
    fontWeight: "500",
  },
  answerLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 24,
  },
  answerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 32,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  deckInfo: {
    alignItems: "center",
    gap: 4,
  },
  deckTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
});

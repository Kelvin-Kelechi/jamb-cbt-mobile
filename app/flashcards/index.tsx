import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { Stack, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import ScreenContainer from "@/components/ui/ScreenContainer";

const { width } = Dimensions.get("window");

export default function FlashcardsScreen() {
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const textSecondary = useThemeColor({}, "textSecondary");

  // Mock data for flashcards
  const stats = {
    decksMastered: 12,
    cardsLearned: 850,
    streak: 5,
  };

  const categories = [
    {
      id: "math",
      title: "Mathematics",
      count: 120,
      color: "#4CAF50",
      icon: "function",
      mastery: 0.75,
    },
    {
      id: "eng",
      title: "English",
      count: 200,
      color: "#2196F3",
      icon: "textformat",
      mastery: 0.6,
    },
    {
      id: "phy",
      title: "Physics",
      count: 95,
      color: "#FF9800",
      icon: "bolt.fill",
      mastery: 0.45,
    },
    {
      id: "chem",
      title: "Chemistry",
      count: 110,
      color: "#F44336",
      icon: "flask.fill",
      mastery: 0.3,
    },
    {
      id: "bio",
      title: "Biology",
      count: 150,
      color: "#4DB6AC",
      icon: "leaf.fill",
      mastery: 0.55,
    },
    {
      id: "eco",
      title: "Economics",
      count: 80,
      color: "#795548",
      icon: "chart.pie.fill",
      mastery: 0.2,
    },
  ];

  return (
    <ScreenContainer>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Flashcards",
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Summary Card */}
        <View style={styles.summaryCard}>
          <LinearGradient
            colors={["#7B1FA2", "#4A148C"]} // Purple Gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBg}
          >
            <View style={styles.summaryContent}>
              <View>
                <Text style={styles.summaryLabel}>Total Learned</Text>
                <Text style={styles.summaryValue}>{stats.cardsLearned}</Text>
                <Text style={styles.summarySub}>Cards</Text>
              </View>
              <View style={styles.divider} />
              <View>
                <Text style={styles.summaryLabel}>Mastered</Text>
                <Text style={styles.summaryValue}>{stats.decksMastered}</Text>
                <Text style={styles.summarySub}>Decks</Text>
              </View>
              <View style={styles.divider} />
              <View>
                <Text style={styles.summaryLabel}>Streak</Text>
                <Text style={styles.summaryValue}>{stats.streak}</Text>
                <Text style={styles.summarySub}>Days</Text>
              </View>
            </View>

            {/* Decorative background icon */}
            <View style={styles.decorativeIcon}>
              <IconSymbol name="rectangle.stack.fill" size={120} color="rgba(255,255,255,0.1)" />
            </View>
          </LinearGradient>
        </View>

        {/* Categories Grid */}
        <Text style={[styles.sectionTitle, { color: text }]}>Subjects</Text>
        <View style={styles.grid}>
          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => router.push(`/flashcards/${cat.id}` as any)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: cardBg,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <View style={[styles.iconContainer, { backgroundColor: cat.color + "20" }]}>
                <IconSymbol name={cat.icon as any} size={24} color={cat.color} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: text }]}>{cat.title}</Text>
                <Text style={[styles.cardCount, { color: textSecondary }]}>
                  {cat.count} Cards
                </Text>
                
                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBg}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { width: `${cat.mastery * 100}%`, backgroundColor: cat.color }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.progressText, { color: textSecondary }]}>
                    {Math.round(cat.mastery * 100)}%
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  summaryCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 32,
    shadowColor: "#7B1FA2",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  gradientBg: {
    padding: 24,
    minHeight: 160,
    justifyContent: "center",
  },
  summaryContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
  summarySub: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  decorativeIcon: {
    position: "absolute",
    right: -20,
    bottom: -20,
    transform: [{ rotate: "-15deg" }],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  card: {
    width: (width - 56) / 2, // (screen width - padding*2 - gap) / 2
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardInfo: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  cardCount: {
    fontSize: 13,
    marginBottom: 12,
  },
  progressContainer: {
    gap: 6,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    fontWeight: "600",
  },
});

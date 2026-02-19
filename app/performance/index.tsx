import React, { useMemo } from "react";
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
import { BlurView } from "expo-blur";
import ScreenContainer from "@/components/ui/ScreenContainer";

const { width } = Dimensions.get("window");

export default function PerformanceScreen() {
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");

  // Mock data for performance stats
  const stats = {
    totalTests: 42,
    avgScore: 68,
    accuracy: 75,
    studyTime: "12h 30m",
  };

  const recentActivity = [
    {
      id: 1,
      subject: "Mathematics",
      score: 80,
      total: 100,
      date: "Today, 10:30 AM",
      mode: "Exam Mode",
    },
    {
      id: 2,
      subject: "Physics",
      score: 45,
      total: 60,
      date: "Yesterday",
      mode: "Study Mode",
    },
    {
      id: 3,
      subject: "English",
      score: 92,
      total: 100,
      date: "Jan 24",
      mode: "Exam Mode",
    },
  ];

  const subjects = [
    { name: "Mathematics", progress: 0.8, color: "#4CAF50" },
    { name: "English", progress: 0.65, color: "#2196F3" },
    { name: "Physics", progress: 0.45, color: "#FF9800" },
    { name: "Chemistry", progress: 0.3, color: "#F44336" },
  ];

  return (
    <ScreenContainer>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "My Performance",
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
            colors={["#0097A7", "#006064"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBg}
          />
          <View style={styles.summaryContent}>
            <View>
              <Text style={styles.summaryTitle}>Overall Progress</Text>
              <Text style={styles.summarySubtitle}>Keep pushing forward!</Text>
            </View>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{stats.avgScore}%</Text>
              <Text style={styles.scoreLabel}>Avg. Score</Text>
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <IconSymbol name="doc.text.fill" size={20} color="#E0F7FA" />
              <Text style={styles.statValue}>{stats.totalTests}</Text>
              <Text style={styles.statLabel}>Tests Taken</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <IconSymbol name="target" size={20} color="#E0F7FA" />
              <Text style={styles.statValue}>{stats.accuracy}%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <IconSymbol name="clock.fill" size={20} color="#E0F7FA" />
              <Text style={styles.statValue}>{stats.studyTime}</Text>
              <Text style={styles.statLabel}>Study Time</Text>
            </View>
          </View>
        </View>

        {/* Subject Performance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: text }]}>Subject Mastery</Text>
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            {subjects.map((sub, index) => (
              <View key={sub.name} style={styles.subjectRow}>
                <View style={styles.subjectHeader}>
                  <Text style={[styles.subjectName, { color: text }]}>{sub.name}</Text>
                  <Text style={[styles.subjectPercent, { color: sub.color }]}>
                    {Math.round(sub.progress * 100)}%
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${sub.progress * 100}%`, backgroundColor: sub.color },
                    ]}
                  />
                </View>
                {index < subjects.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: text }]}>Recent Activity</Text>
          <View style={styles.activityList}>
            {recentActivity.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  styles.activityCard,
                  { backgroundColor: cardBg, opacity: pressed ? 0.9 : 1 },
                ]}
              >
                <View style={[styles.activityIcon, { backgroundColor: "#E3F2FD" }]}>
                  <IconSymbol name="doc.text" size={24} color="#1565C0" />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={[styles.activitySubject, { color: text }]}>
                    {item.subject}
                  </Text>
                  <Text style={styles.activityMeta}>
                    {item.mode} • {item.date}
                  </Text>
                </View>
                <View style={styles.activityScore}>
                  <Text style={styles.scoreValue}>
                    {Math.round((item.score / item.total) * 100)}%
                  </Text>
                  <Text style={styles.scoreTotal}>
                    {item.score}/{item.total}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 24,
  },
  summaryCard: {
    borderRadius: 24,
    overflow: "hidden",
    padding: 20,
    minHeight: 180,
    shadowColor: "#0097A7",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  summaryContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  scoreCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
  scoreLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
    marginTop: -2,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 16,
    padding: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 4,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  subjectRow: {
    marginBottom: 16,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: "600",
  },
  subjectPercent: {
    fontSize: 14,
    fontWeight: "700",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginTop: 16,
  },
  activityList: {
    gap: 12,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
    gap: 4,
  },
  activitySubject: {
    fontSize: 16,
    fontWeight: "600",
  },
  activityMeta: {
    fontSize: 13,
    color: "#757575",
  },
  activityScore: {
    alignItems: "flex-end",
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0097A7",
  },
  scoreTotal: {
    fontSize: 12,
    color: "#9E9E9E",
  },
});

import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Entypo from "@expo/vector-icons/Entypo";
import GlassTabBar from "@/components/ui/GlassTabBar";
// Auth redirect handled in RootLayout to avoid loops

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const edgeColor =
    colorScheme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)";
  const surfaceColor =
    colorScheme === "dark"
      ? "rgba(18, 18, 18, 0.28)"
      : "rgba(255, 255, 255, 0.28)";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: colorScheme === "dark" ? "#7AE584" : "#2E7D32",
        tabBarInactiveTintColor: "#8A8A9E",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          textAlign: "center",
          marginTop: 4,
          letterSpacing: 0.2,
        },
        tabBarItemStyle: {
          borderRadius: 16,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
        },
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => <GlassTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="novels"
        options={{
          title: "Novels",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="book.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <Entypo name="menu" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

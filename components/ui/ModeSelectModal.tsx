import React from "react";
import { Modal, View, Text, Pressable, StyleSheet, Animated, Dimensions } from "react-native";
import { BlurView } from "expo-blur";
import { IconSymbol } from "@/components/ui/icon-symbol";

type ModeSelectModalProps = {
  visible: boolean;
  onCancel: () => void;
  onSelectStudy: () => void;
  onSelectCBT: () => void;
};

const { height: screenHeight } = Dimensions.get("window");

export function ModeSelectModal({ visible, onCancel, onSelectStudy, onSelectCBT }: ModeSelectModalProps) {
  const slideAnim = React.useRef(new Animated.Value(screenHeight)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdropPressable} onPress={onCancel}>
          <BlurView style={styles.backdropLayer} intensity={20} tint="light" />
          <View style={styles.backdropTint} />
        </Pressable>

        <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>Select Mode</Text>

          <View style={styles.options}>
            <Pressable style={styles.brick} accessibilityLabel="Study mode" onPress={onSelectStudy}>
              <View style={styles.brickLeft}>
                <View style={styles.iconCircle}>
                  <IconSymbol size={24} name="book.fill" color="#2E7D32" />
                </View>
                <View style={styles.brickTextWrap}>
                  <Text style={styles.brickTitle}>STUDY MODE</Text>
                  <Text style={styles.brickSubtitle}>study older past questions</Text>
                </View>
              </View>
              <IconSymbol size={22} name="chevron.right" color="#2A2A2A" />
            </Pressable>

            <Pressable style={styles.brick} accessibilityLabel="CBT exam mode" onPress={onSelectCBT}>
              <View style={styles.brickLeft}>
                <View style={styles.iconCircle}>
                  <IconSymbol size={24} name="laptopcomputer" color="#1565C0" />
                </View>
                <View style={styles.brickTextWrap}>
                  <Text style={styles.brickTitle}>CBT/EXAM MODE</Text>
                  <Text style={styles.brickSubtitle}>Test yourself in real exam situation</Text>
                </View>
              </View>
              <IconSymbol size={22} name="chevron.right" color="#2A2A2A" />
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdropPressable: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  backdropLayer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  backdropTint: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.25)" },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 60,

  },
  handle: { width: 40, height: 4, backgroundColor: "#E0E0E0", borderRadius: 2, alignSelf: "center", marginBottom: 16 },
  title: { fontSize: 18, fontWeight: "700", color: "#1B1B1B", textAlign: "center", marginBottom: 8 },

  options: { gap: 12 },
  brick: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    backgroundColor: "#e0ecdfff",
    borderColor: "#D3D3D3",
  },
  brickLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconCircle: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#000", alignItems: "center", justifyContent: "center" },
  brickTextWrap: { flexDirection: "column" },
  brickTitle: { fontSize: 14, fontWeight: "800", color: "#1B1B1B", letterSpacing: 0.5 },
  brickSubtitle: { fontSize: 12, color: "#2A2A2A", marginTop: 2 },
});
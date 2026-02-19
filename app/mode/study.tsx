import React from "react";
import SubjectSelect from "@/components/screens/SubjectSelect";
import ScreenContainer from "@/components/ui/ScreenContainer";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
  Text,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function StudyModePage() {
  const router = useRouter();
  const [selected, setSelected] = React.useState<string[]>([]);
  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <ThemedText type="title">Past Question</ThemedText>
      </View>
      <ThemedText>Select a subject you wish to study</ThemedText>
      <SubjectSelect mode="study" onSelectedChange={setSelected} />
      <View style={styles.footerSpacer} />
      <View style={styles.stickyFooter}>
        <Pressable
          accessibilityRole="button"
          style={[
            styles.proceedBtn,
            selected.length === 0 && styles.proceedDisabled,
          ]}
          disabled={selected.length === 0}
          onPress={() => {
            if (selected.length > 0) {
              router.push({
                pathname: "/mode/past-options",
                params: { subjects: JSON.stringify(selected), mode: "study" },
              });
            }
          }}
        >
          <Text style={styles.proceedText}>procceed</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 5,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  footerSpacer: { height: 86 },
  stickyFooter: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 50,
  },
  proceedBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    justifyContent: "center",
  },
  proceedDisabled: {
    opacity: 0.5,
  },
  proceedText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});

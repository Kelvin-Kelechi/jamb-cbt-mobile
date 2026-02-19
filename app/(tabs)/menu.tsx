import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import ScreenContainer from "@/components/ui/ScreenContainer";
import MenuBricks from "@/components/screens/MenuBricks";

export default function MenuScreen() {
  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText type="title">Menu</ThemedText>
      </View>
      <ThemedText>
        Manage your settings, account, and app preferences.
      </ThemedText>

      <MenuBricks />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

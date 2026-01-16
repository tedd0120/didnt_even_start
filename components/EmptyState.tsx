import { StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING } from "../lib/theme";

type Props = {
  title: string;
  subtitle: string;
};

export default function EmptyState({ title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.muted,
    textAlign: "center",
  },
});

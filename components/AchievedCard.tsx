import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AchievedItem } from "../types/models";
import { COLORS, RADIUS, SPACING } from "../lib/theme";
import { formatTimestamp } from "../lib/time";

type Props = {
  item: AchievedItem;
};

export default function AchievedCard({ item }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
        {item.pinned ? (
          <Feather name="bookmark" size={18} color={COLORS.accent} />
        ) : null}
      </View>
      <Text style={styles.time}>原本打算：{item.plannedAt}</Text>
      <Text style={styles.time}>达成时间：{formatTimestamp(item.achievedAt)}</Text>
      {item.reason ? <Text style={styles.reason}>{item.reason}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  time: {
    color: COLORS.muted,
  },
  reason: {
    color: COLORS.text,
  },
});

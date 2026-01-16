import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { GiveUpItem } from "../types/models";
import { COLORS, RADIUS, SPACING } from "../lib/theme";
import { formatTimestamp } from "../lib/time";

type Props = {
  item: GiveUpItem;
  onTogglePin: () => void;
  onMoveToAchieved: () => void;
  onDelete: () => void;
};

export default function GiveUpCard({
  item,
  onTogglePin,
  onMoveToAchieved,
  onDelete,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={onTogglePin} style={styles.pin}>
          <Feather
            name={item.pinned ? "bookmark" : "bookmark"}
            size={18}
            color={item.pinned ? COLORS.accent : COLORS.muted}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.time}>原本打算：{item.plannedAt}</Text>
      <Text style={styles.time}>记录时间：{formatTimestamp(item.createdAt)}</Text>
      {item.reason ? <Text style={styles.reason}>{item.reason}</Text> : null}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.action} onPress={onMoveToAchieved}>
          <Feather name="check-circle" size={16} color={COLORS.text} />
          <Text style={styles.actionText}>已达成</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={onDelete}>
          <Feather name="trash-2" size={16} color={COLORS.text} />
          <Text style={styles.actionText}>删除</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  time: {
    color: COLORS.muted,
  },
  reason: {
    color: COLORS.text,
  },
  pin: {
    paddingHorizontal: SPACING.xs,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  actionText: {
    color: COLORS.text,
    fontWeight: "600",
  },
});

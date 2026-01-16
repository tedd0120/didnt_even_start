import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { BadgeDefinition } from "../types/models";
import { COLORS, RADIUS, SPACING, TIER_COLORS } from "../lib/theme";

type Props = {
  badge: BadgeDefinition;
  unlocked: boolean;
};

const TIER_LABELS: Record<BadgeDefinition["tier"], string> = {
  bronze: "铜",
  silver: "银",
  gold: "金",
  platinum: "铂金",
  diamond: "钻石",
  "dark-matter": "暗物质",
};

export default function BadgeCard({ badge, unlocked }: Props) {
  const title = badge.hidden ? "？？？" : badge.title;
  const condition = badge.hidden ? "神秘条件" : badge.description;
  const muted = !unlocked;
  return (
    <View style={[styles.card, muted && styles.cardMuted]}>
      <View style={[styles.icon, muted && styles.iconMuted]}>
        <Feather
          name={badge.icon}
          size={22}
          color={muted ? COLORS.muted : COLORS.text}
        />
      </View>
      <View style={styles.text}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, muted && styles.textMuted]}>
            {title}
          </Text>
          <View
            style={[
              styles.tier,
              { backgroundColor: TIER_COLORS[badge.tier] },
              muted && styles.tierMuted,
            ]}
          >
            <Text style={styles.tierText}>{TIER_LABELS[badge.tier]}</Text>
          </View>
        </View>
        <Text style={[styles.subtitle, muted && styles.textMuted]}>
          {condition}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    gap: 4,
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  subtitle: {
    color: COLORS.muted,
  },
  tier: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 999,
  },
  tierMuted: {
    opacity: 0.6,
  },
  tierText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
  },
  textMuted: {
    color: COLORS.muted,
  },
  cardMuted: {
    opacity: 0.8,
  },
  iconMuted: {
    backgroundColor: COLORS.card,
  },
});

import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { BadgeDefinition } from "../types/models";
import { COLORS, RADIUS, SPACING } from "../lib/theme";

type Props = {
  badges: BadgeDefinition[];
  timestamp: string;
};

export default function BadgeSharePoster({ badges, timestamp }: Props) {
  return (
    <View style={styles.poster}>
      <Text style={styles.title}>躺平勋章海报</Text>
      <Text style={styles.meta}>{timestamp}</Text>
      <View style={styles.grid}>
        {badges.map((badge) => (
          <View key={badge.id} style={styles.badge}>
            <View style={styles.badgeIcon}>
              <Feather name={badge.icon} size={20} color={COLORS.text} />
            </View>
            <Text style={styles.badgeText}>
              {badge.hidden ? "？？？" : badge.title}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.footer}>甚至没有开始</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  poster: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  meta: {
    color: COLORS.muted,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
  },
  badge: {
    width: "45%",
    gap: SPACING.xs,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: COLORS.text,
  },
  footer: {
    textAlign: "right",
    color: COLORS.muted,
  },
});

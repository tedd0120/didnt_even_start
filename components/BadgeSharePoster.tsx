import { Feather } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import { BadgeDefinition } from "../types/models";
import { COLORS, RADIUS, SPACING } from "../lib/theme";

type Props = {
  badges: BadgeDefinition[];
  timestamp: string;
  showProfile?: boolean;
  avatarUri?: string;
  nickname?: string;
};

export default function BadgeSharePoster({
  badges,
  timestamp,
  showProfile,
  avatarUri,
  nickname,
}: Props) {
  return (
    <View style={styles.poster}>
      {showProfile ? (
        <View style={styles.profileRow}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
          <Text style={styles.nickname}>{nickname || "你"}</Text>
        </View>
      ) : null}
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
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
  },
  avatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
    backgroundColor: COLORS.background,
  },
  nickname: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  meta: {
    color: COLORS.muted,
    fontSize: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  badge: {
    width: "48%",
    gap: 4,
  },
  badgeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: COLORS.text,
    fontSize: 12,
  },
  footer: {
    textAlign: "right",
    color: COLORS.muted,
    fontSize: 12,
  },
});

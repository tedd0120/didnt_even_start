import { Image, StyleSheet, Text, View } from "react-native";
import PixelSprite from "./PixelSprite";
import { AtlasFrame, PIXEL_FRAMES } from "../lib/pixelAtlas";
import { COLORS, SPACING } from "../lib/theme";

type SpeciesSharePosterProps = {
  seaCount: number;
  skyCount: number;
  maxCount: number;
  timestamp: string;
  showProfile?: boolean;
  avatarUri?: string;
  nickname?: string;
};

const MAX_ICONS = 24;

export default function SpeciesSharePoster({
  seaCount,
  skyCount,
  maxCount,
  timestamp,
  showProfile,
  avatarUri,
  nickname,
}: SpeciesSharePosterProps) {
  const total = seaCount + skyCount;
  const seaIcons = Math.min(seaCount, MAX_ICONS / 2);
  const skyIcons = Math.min(skyCount, MAX_ICONS / 2);

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
      <View style={styles.header}>
        <Text style={styles.title}>双界树已解锁物种</Text>
        <Text style={styles.subtitle}>
          海底 {seaCount}/{maxCount} · 天空 {skyCount}/{maxCount}
        </Text>
      </View>
      <View style={styles.sections}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>海底</Text>
          <View style={styles.iconGrid}>
            {Array.from({ length: seaIcons }).map((_, index) => (
              <PixelSprite
                key={`sea-${index}`}
                frame={PIXEL_FRAMES.unknown as AtlasFrame}
                size={20}
                tintColor="#9BD9FF"
                style={styles.icon}
              />
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>天空</Text>
          <View style={styles.iconGrid}>
            {Array.from({ length: skyIcons }).map((_, index) => (
              <PixelSprite
                key={`sky-${index}`}
                frame={PIXEL_FRAMES.unknown as AtlasFrame}
                size={20}
                tintColor="#FFE08A"
                style={styles.icon}
              />
            ))}
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.total}>已发现 {total} 只</Text>
        <Text style={styles.time}>{timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  poster: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: 20,
    gap: SPACING.md,
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
  header: {
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
  },
  sections: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  section: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
  icon: {
    opacity: 0.9,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  total: {
    color: COLORS.text,
    fontWeight: "600",
  },
  time: {
    fontSize: 11,
    color: COLORS.muted,
  },
});

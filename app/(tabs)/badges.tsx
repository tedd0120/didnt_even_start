import { useCallback, useMemo, useRef, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import ViewShot from "react-native-view-shot";
import { Feather } from "@expo/vector-icons";
import BadgeCard from "../../components/BadgeCard";
import BadgeSharePoster from "../../components/BadgeSharePoster";
import PixelSprite from "../../components/PixelSprite";
import SpeciesSharePoster from "../../components/SpeciesSharePoster";
import { useGiveUps } from "../../hooks/useGiveUps";
import { useProfile } from "../../hooks/useProfile";
import { BADGES } from "../../lib/badges";
import { COLORS, SPACING } from "../../lib/theme";
import { AtlasFrame, PIXEL_FRAMES } from "../../lib/pixelAtlas";
import { loadSeaSpecies, loadSkySpecies } from "../../lib/storage";

export default function BadgeWallScreen() {
  const { unlockedBadges, unlockedBadgeIds, loading, reload } = useGiveUps();
  const { profile, updateProfile, reload: reloadProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [shareMode, setShareMode] = useState<"badges" | "species">("badges");
  const [seaSpecies, setSeaSpecies] = useState<string[]>([]);
  const [skySpecies, setSkySpecies] = useState<string[]>([]);
  const viewShotRef = useRef<ViewShot>(null);
  const timestamp = useMemo(
    () =>
      new Date().toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    []
  );

  useFocusEffect(
    useCallback(() => {
      reload();
      reloadProfile();
      loadSeaSpecies().then(setSeaSpecies);
      loadSkySpecies().then(setSkySpecies);
    }, [reload, reloadProfile])
  );

  const togglePosterProfile = (value: boolean) => {
    updateProfile({ ...profile, showOnPoster: value });
  };

  const handleShare = async () => {
    if (saving) {
      return;
    }
    if (shareMode === "badges" && unlockedBadges.length === 0) {
      Alert.alert("还没有勋章", "放弃一件事再来分享吧。");
      return;
    }
    if (shareMode === "species" && seaSpecies.length + skySpecies.length === 0) {
      Alert.alert("还没有物种", "先在双界树中解锁物种再来分享。");
      return;
    }
    setSaving(true);
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("无法保存", "请在设置中允许相册权限。");
        return;
      }
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) {
        Alert.alert("保存失败", "无法生成分享图片，请稍后再试。");
        return;
      }
      await MediaLibrary.createAssetAsync(uri);
      Alert.alert("已保存", "勋章拼图已保存到相册。");
    } catch (error) {
      Alert.alert("保存失败", "请稍后再试或检查相册权限。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={BADGES}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.shareSection}>
              <View style={styles.profileCard}>
                <View style={styles.profileInfo}>
                  {profile.avatarUri ? (
                    <Image
                      source={{ uri: profile.avatarUri }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder} />
                  )}
                  <View style={styles.profileText}>
                    <Text style={styles.profileName}>
                      {profile.nickname || "你"}
                    </Text>
                    <Text style={styles.profileHint}>勋章也需要主角</Text>
                  </View>
                </View>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>海报显示头像昵称</Text>
                  <Switch
                    value={profile.showOnPoster}
                    onValueChange={togglePosterProfile}
                    trackColor={{ true: COLORS.primary, false: COLORS.muted }}
                    thumbColor={COLORS.card}
                  />
                </View>
              </View>
              <View style={styles.speciesCard}>
                <View style={styles.speciesHeader}>
                  <Text style={styles.speciesTitle}>双界树已解锁物种</Text>
                  <View style={styles.speciesCount}>
                    <Text style={styles.speciesCountText}>
                      海底 {seaSpecies.length}/100
                    </Text>
                    <Text style={styles.speciesCountText}>
                      天空 {skySpecies.length}/100
                    </Text>
                  </View>
                </View>
                <View style={styles.speciesIcons}>
                  {Array.from({ length: Math.min(seaSpecies.length, 4) }).map(
                    (_, index) => (
                      <PixelSprite
                        key={`sea-${index}`}
                        frame={PIXEL_FRAMES.unknown as AtlasFrame}
                        size={18}
                        tintColor="#9BD9FF"
                      />
                    )
                  )}
                  {Array.from({ length: Math.min(skySpecies.length, 4) }).map(
                    (_, index) => (
                      <PixelSprite
                        key={`sky-${index}`}
                        frame={PIXEL_FRAMES.unknown as AtlasFrame}
                        size={18}
                        tintColor="#FFE08A"
                      />
                    )
                  )}
                </View>
              </View>
              <View style={styles.shareHeader}>
                <Text style={styles.shareTitle}>
                  {shareMode === "badges" ? "分享勋章拼图" : "分享物种拼图"}
                </Text>
                <View style={styles.shareActions}>
                  <View style={styles.shareToggle}>
                    <TouchableOpacity
                      style={[
                        styles.shareToggleButton,
                        shareMode === "badges" && styles.shareToggleActive,
                      ]}
                      onPress={() => setShareMode("badges")}
                    >
                      <Text style={styles.shareToggleText}>勋章</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.shareToggleButton,
                        shareMode === "species" && styles.shareToggleActive,
                      ]}
                      onPress={() => setShareMode("species")}
                    >
                      <Text style={styles.shareToggleText}>物种</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.shareButton,
                      (saving ||
                        (shareMode === "badges" && unlockedBadges.length === 0) ||
                        (shareMode === "species" &&
                          seaSpecies.length + skySpecies.length === 0)) &&
                        styles.shareButtonDisabled,
                    ]}
                    onPress={handleShare}
                    activeOpacity={0.9}
                    disabled={
                      saving ||
                      (shareMode === "badges" && unlockedBadges.length === 0) ||
                      (shareMode === "species" &&
                        seaSpecies.length + skySpecies.length === 0)
                    }
                  >
                    <Feather name="share-2" size={16} color={COLORS.text} />
                    <Text style={styles.shareButtonText}>
                      {saving ? "保存中..." : "一键保存"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
                {shareMode === "badges" ? (
                  <BadgeSharePoster
                    badges={unlockedBadges}
                    timestamp={timestamp}
                    showProfile={profile.showOnPoster}
                    avatarUri={profile.avatarUri}
                    nickname={profile.nickname}
                  />
                ) : (
                  <SpeciesSharePoster
                    seaCount={seaSpecies.length}
                    skyCount={skySpecies.length}
                    maxCount={100}
                    timestamp={timestamp}
                    showProfile={profile.showOnPoster}
                    avatarUri={profile.avatarUri}
                    nickname={profile.nickname}
                  />
                )}
              </ViewShot>
            </View>
          }
          renderItem={({ item }) => (
            <BadgeCard
              badge={item}
              unlocked={unlockedBadgeIds.includes(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  shareSection: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
    backgroundColor: COLORS.background,
  },
  profileText: {
    gap: 4,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  profileHint: {
    color: COLORS.muted,
    fontSize: 12,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchLabel: {
    color: COLORS.text,
    fontSize: 13,
  },
  speciesCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  speciesHeader: {
    gap: 6,
  },
  speciesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  speciesCount: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  speciesCountText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  speciesIcons: {
    flexDirection: "row",
    gap: SPACING.xs,
  },
  shareHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
  },
  shareActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  shareToggle: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    borderRadius: 999,
    padding: 4,
    gap: 4,
  },
  shareToggleButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 999,
  },
  shareToggleActive: {
    backgroundColor: COLORS.card,
  },
  shareToggleText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
  },
  shareButtonDisabled: {
    opacity: 0.7,
  },
  shareButtonText: {
    color: COLORS.text,
    fontWeight: "600",
  },
});

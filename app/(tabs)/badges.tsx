import { useCallback, useMemo, useRef, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
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
import { useGiveUps } from "../../hooks/useGiveUps";
import { BADGES } from "../../lib/badges";
import { COLORS, SPACING } from "../../lib/theme";

export default function BadgeWallScreen() {
  const { unlockedBadges, unlockedBadgeIds, loading, reload } = useGiveUps();
  const [saving, setSaving] = useState(false);
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
    }, [reload])
  );

  const handleShare = async () => {
    if (saving) {
      return;
    }
    if (unlockedBadges.length === 0) {
      Alert.alert("还没有勋章", "放弃一件事再来分享吧。");
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
              <View style={styles.shareHeader}>
                <Text style={styles.shareTitle}>分享勋章拼图</Text>
                <TouchableOpacity
                  style={[
                    styles.shareButton,
                    (saving || unlockedBadges.length === 0) &&
                      styles.shareButtonDisabled,
                  ]}
                  onPress={handleShare}
                  activeOpacity={0.9}
                  disabled={saving || unlockedBadges.length === 0}
                >
                  <Feather name="share-2" size={16} color={COLORS.text} />
                  <Text style={styles.shareButtonText}>
                    {saving ? "保存中..." : "一键保存"}
                  </Text>
                </TouchableOpacity>
              </View>
              <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
                <BadgeSharePoster badges={unlockedBadges} timestamp={timestamp} />
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
  shareButtonDisabled: {
    opacity: 0.7,
  },
  shareButtonText: {
    color: COLORS.text,
    fontWeight: "600",
  },
});

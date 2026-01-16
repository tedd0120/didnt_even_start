import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AchievedCard from "../../components/AchievedCard";
import EmptyState from "../../components/EmptyState";
import { useGiveUps } from "../../hooks/useGiveUps";
import { COLORS, SPACING } from "../../lib/theme";
import {
  loadAchievedSubtitleIndex,
  saveAchievedSubtitleIndex,
} from "../../lib/storage";

const SUBTITLES = [
  "本来想躺平，结果你站起来了。",
  "你这是偶发性努力。",
  "临时上进，不代表长期上进。",
  "今天的你，有点反常。",
  "这条完成了，算你赢。",
  "懒得很正常，但你做了。",
  "努力一下下，算你厉害。",
  "这不是内卷，是偶尔清醒。",
  "放弃过，完成才更好笑。",
  "你又背叛了躺平阵营。",
  "这份上进，记在案底。",
  "这次就当你醒了。",
];

export default function AchievedScreen() {
  const { achieved, loading, reload } = useGiveUps();
  const [subtitle, setSubtitle] = useState(SUBTITLES[0]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  useEffect(() => {
    const pickSubtitle = async () => {
      const lastIndex = await loadAchievedSubtitleIndex();
      const choices = SUBTITLES.filter(
        (_, index) => index !== (lastIndex ?? -1)
      );
      const next =
        choices[Math.floor(Math.random() * choices.length)] ?? SUBTITLES[0];
      const nextIndex = SUBTITLES.indexOf(next);
      setSubtitle(next);
      if (nextIndex >= 0) {
        await saveAchievedSubtitleIndex(nextIndex);
      }
    };
    pickSubtitle();
  }, []);

  const hasItems = useMemo(() => achieved.length > 0, [achieved.length]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>临时上进</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : hasItems ? (
        <FlatList
          data={achieved}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <AchievedCard item={item} />}
        />
      ) : (
        <EmptyState title="还没有上进记录" subtitle="等你哪天醒悟了再来。" />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
  },
  list: {
    padding: SPACING.lg,
    paddingTop: 0,
    gap: SPACING.md,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

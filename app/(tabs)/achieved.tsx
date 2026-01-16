import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  Animated,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { Feather, Ionicons } from "@expo/vector-icons";
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

const DELETE_MESSAGES = [
  "这条上进就当没发生。",
  "删了，继续躺。",
  "临时上进被撤回。",
  "这次努力先抹掉。",
  "清空一条上进记录。",
];

export default function AchievedScreen() {
  const { achieved, loading, reload, toggleAchievedPin, deleteAchieved } =
    useGiveUps();
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const animatingRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  useEffect(() => {
    const initSubtitle = async () => {
      const lastIndex = await loadAchievedSubtitleIndex();
      const index = lastIndex ?? 0;
      setSubtitleIndex(index);
    };
    initSubtitle();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (animatingRef.current) {
        return;
      }
      animatingRef.current = true;
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setSubtitleIndex((current) => {
          const nextIndex = (current + 1) % SUBTITLES.length;
          saveAchievedSubtitleIndex(nextIndex);
          return nextIndex;
        });
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          animatingRef.current = false;
        });
      });
    }, 10000);
    return () => clearInterval(timer);
  }, [fadeAnim]);

  const sortedAchieved = useMemo(() => {
    const pinned = achieved.filter((item) => item.pinned);
    const rest = achieved.filter((item) => !item.pinned);
    return [...pinned, ...rest];
  }, [achieved]);

  const hasItems = useMemo(
    () => sortedAchieved.length > 0,
    [sortedAchieved.length]
  );

  const handleDelete = (id: string) => {
    const text =
      DELETE_MESSAGES[Math.floor(Math.random() * DELETE_MESSAGES.length)];
    Alert.alert("确认删除？", text, [
      { text: "取消", style: "cancel" },
      {
        text: "删除",
        style: "destructive",
        onPress: () => {
          deleteAchieved(id);
        },
      },
    ]);
  };

  const renderActions = (itemId: string, pinned?: boolean) => (
    <View style={styles.actions}>
      <View style={styles.actionGroup}>
        <ActionButton
          label="置顶"
          icon="bookmark"
          color={pinned ? COLORS.muted : COLORS.accent}
          filled={!!pinned}
          onPress={() => toggleAchievedPin(itemId)}
        />
        <ActionButton
          label="删除"
          icon="trash-2"
          color="#E06B6B"
          onPress={() => handleDelete(itemId)}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
          {SUBTITLES[subtitleIndex]}
        </Animated.Text>
      </View>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : hasItems ? (
        <FlatList
          data={sortedAchieved}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderActions(item.id, item.pinned)}>
              <AchievedCard item={item} />
            </Swipeable>
          )}
        />
      ) : (
        <EmptyState title="还没有上进记录" subtitle="等你哪天醒悟了再来。" />
      )}
    </SafeAreaView>
  );
}

type ActionButtonProps = {
  label: string;
  icon: "bookmark" | "trash-2";
  color: string;
  filled?: boolean;
  onPress: () => void;
};

function ActionButton({ label, icon, color, filled, onPress }: ActionButtonProps) {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      {icon === "bookmark" ? (
        <Ionicons
          name={filled ? "bookmark" : "bookmark-outline"}
          size={16}
          color={COLORS.text}
        />
      ) : (
        <Feather name={icon} size={16} color={COLORS.text} />
      )}
      <Text style={[styles.actionText, { color }]}>{label}</Text>
    </TouchableOpacity>
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
  actions: {
    justifyContent: "center",
    paddingLeft: SPACING.lg,
  },
  actionGroup: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  actionButton: {
    backgroundColor: COLORS.card,
    borderRadius: 999,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

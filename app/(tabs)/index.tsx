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
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { Feather, Ionicons } from "@expo/vector-icons";
import GiveUpCard from "../../components/GiveUpCard";
import EmptyState from "../../components/EmptyState";
import PrimaryFab from "../../components/PrimaryFab";
import { useGiveUps } from "../../hooks/useGiveUps";
import { COLORS, SPACING } from "../../lib/theme";

const DELETE_MESSAGES = [
  "已清走，清爽了。",
  "先删了再说。",
  "这条躺平记录已下线。",
  "删了就别念了。",
  "清单少一条，压力少一点。",
  "删除成功，心情更空。",
  "这条先躺到回收站。",
  "你把它抹了。",
  "清空一条，放过自己。",
  "今天也不想记。",
];

const SUBTITLES = [
  "今天就先躺一会儿。",
  "列出来就算努力过了。",
  "先写下，后放下。",
  "不做也没关系。",
  "放弃也是一种安排。",
  "计划很多，力气很少。",
  "写了就当做了。",
  "慢慢来，先躺平。",
  "别急，清单还在。",
  "今天也不必逞强。",
];

export default function GiveUpListScreen() {
  const {
    giveUps,
    loading,
    reload,
    togglePin,
    moveToAchieved,
    deleteGiveUp,
  } = useGiveUps();
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const animatingRef = useRef(false);

  const sortedGiveUps = useMemo(() => {
    const pinned = giveUps.filter((item) => item.pinned);
    const rest = giveUps.filter((item) => !item.pinned);
    return [...pinned, ...rest];
  }, [giveUps]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

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
        setSubtitleIndex((current) => (current + 1) % SUBTITLES.length);
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

  const handleDelete = async (id: string) => {
    const text =
      DELETE_MESSAGES[Math.floor(Math.random() * DELETE_MESSAGES.length)];
    Alert.alert("确认删除？", text, [
      { text: "取消", style: "cancel" },
      {
        text: "删除",
        style: "destructive",
        onPress: () => {
          deleteGiveUp(id);
        },
      },
    ]);
  };

  const handleAchieved = (id: string) => {
    Alert.alert("真的达成了吗？", "这条要转到临时上进清单。", [
      { text: "再等等", style: "cancel" },
      { text: "确认达成", onPress: () => moveToAchieved(id) },
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
          onPress={() => togglePin(itemId)}
        />
        <ActionButton
          label="达成"
          icon="check-circle"
          color={COLORS.primary}
          onPress={() => handleAchieved(itemId)}
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
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : giveUps.length === 0 ? (
        <EmptyState
          title="今天先躺一会"
          subtitle="把你没开始的计划写下来，放过自己。"
        />
      ) : (
        <FlatList
          data={sortedGiveUps}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.header}>
              <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
                {SUBTITLES[subtitleIndex]}
              </Animated.Text>
            </View>
          }
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderActions(item.id, item.pinned)}>
              <GiveUpCard item={item} />
            </Swipeable>
          )}
        />
      )}
      <PrimaryFab onPress={() => router.push("/add")} />
    </SafeAreaView>
  );
}

type ActionButtonProps = {
  label: string;
  icon: "bookmark" | "check-circle" | "trash-2";
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
  list: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl * 2,
    gap: SPACING.md,
  },
  header: {
    paddingBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 14,
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

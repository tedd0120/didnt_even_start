import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
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

export default function GiveUpListScreen() {
  const {
    giveUps,
    loading,
    reload,
    togglePin,
    moveToAchieved,
    deleteGiveUp,
    restoreGiveUp,
  } = useGiveUps();
  const [undoItem, setUndoItem] = useState<
    null | { item: typeof giveUps[number]; text: string }
  >(null);
  const undoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    return () => {
      if (undoRef.current) {
        clearTimeout(undoRef.current);
      }
    };
  }, []);

  const handleDelete = async (id: string) => {
    const removed = await deleteGiveUp(id);
    if (!removed) {
      return;
    }
    if (undoRef.current) {
      clearTimeout(undoRef.current);
    }
    const text =
      DELETE_MESSAGES[Math.floor(Math.random() * DELETE_MESSAGES.length)];
    setUndoItem({ item: removed, text });
    undoRef.current = setTimeout(() => {
      setUndoItem(null);
    }, 4000);
  };

  const handleUndo = async () => {
    if (!undoItem) {
      return;
    }
    if (undoRef.current) {
      clearTimeout(undoRef.current);
      undoRef.current = null;
    }
    await restoreGiveUp(undoItem.item);
    setUndoItem(null);
  };

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
          renderItem={({ item }) => (
            <GiveUpCard
              item={item}
              onTogglePin={() => togglePin(item.id)}
              onMoveToAchieved={() => moveToAchieved(item.id)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}
      {undoItem ? (
        <View style={styles.undo}>
          <Text style={styles.undoText}>{undoItem.text}</Text>
          <TouchableOpacity style={styles.undoButton} onPress={handleUndo}>
            <Text style={styles.undoButtonText}>撤销</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <PrimaryFab onPress={() => router.push("/add")} />
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
    paddingBottom: SPACING.xl * 2,
    gap: SPACING.md,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  undo: {
    position: "absolute",
    left: SPACING.lg,
    right: SPACING.lg,
    bottom: 32,
    backgroundColor: COLORS.card,
    borderRadius: 999,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  undoText: {
    color: COLORS.text,
    flex: 1,
  },
  undoButton: {
    paddingHorizontal: SPACING.sm,
  },
  undoButtonText: {
    color: COLORS.accent,
    fontWeight: "600",
  },
});

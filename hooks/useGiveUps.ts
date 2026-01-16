import { useCallback, useEffect, useState } from "react";
import {
  loadAchieved,
  loadGiveUps,
  loadGiveUpTotalCount,
  loadUnlockedBadgeIds,
  saveAchieved,
  saveGiveUps,
  saveGiveUpTotalCount,
  saveUnlockedBadgeIds,
} from "../lib/storage";
import { BADGES, getNewlyUnlockedBadges } from "../lib/badges";
import { AchievedItem, BadgeDefinition, GiveUpItem } from "../types/models";

type AddInput = {
  title: string;
  reason?: string;
  plannedAt: string;
};

type AddResult = {
  item: GiveUpItem;
  newlyUnlocked: BadgeDefinition[];
};

export function useGiveUps() {
  const [giveUps, setGiveUps] = useState<GiveUpItem[]>([]);
  const [achieved, setAchieved] = useState<AchievedItem[]>([]);
  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const [items, achievedItems, badgeIds, storedTotal] = await Promise.all([
      loadGiveUps(),
      loadAchieved(),
      loadUnlockedBadgeIds(),
      loadGiveUpTotalCount(),
    ]);
    const inferredTotal = storedTotal ?? items.length + achievedItems.length;
    setGiveUps(items);
    setAchieved(achievedItems);
    setUnlockedBadgeIds(badgeIds);
    setTotalCount(inferredTotal);
    if (storedTotal === null) {
      await saveGiveUpTotalCount(inferredTotal);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addGiveUp = useCallback(
    async (input: AddInput): Promise<AddResult> => {
      const now = new Date();
      const plannedAt =
        input.plannedAt.trim() ||
        now.toLocaleString("zh-CN", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      const item: GiveUpItem = {
        id: `${Date.now()}`,
        title: input.title,
        reason: input.reason,
        plannedAt,
        createdAt: now.toISOString(),
        pinned: false,
      };
      const nextItems = [item, ...giveUps];
      const nextTotal = totalCount + 1;
      const newlyUnlocked = getNewlyUnlockedBadges(unlockedBadgeIds, nextTotal);
      const nextBadgeIds = [
        ...unlockedBadgeIds,
        ...newlyUnlocked.map((badge) => badge.id),
      ];
      setGiveUps(nextItems);
      setUnlockedBadgeIds(nextBadgeIds);
      setTotalCount(nextTotal);
      await Promise.all([
        saveGiveUps(nextItems),
        saveUnlockedBadgeIds(nextBadgeIds),
        saveGiveUpTotalCount(nextTotal),
      ]);
      return { item, newlyUnlocked };
    },
    [giveUps, totalCount, unlockedBadgeIds]
  );

  const togglePin = useCallback(
    async (id: string) => {
      const nextItems = giveUps.map((item) =>
        item.id === id ? { ...item, pinned: !item.pinned } : item
      );
      setGiveUps(nextItems);
      await saveGiveUps(nextItems);
    },
    [giveUps]
  );

  const moveToAchieved = useCallback(
    async (id: string) => {
      const target = giveUps.find((item) => item.id === id);
      if (!target) {
        return;
      }
      const nextGiveUps = giveUps.filter((item) => item.id !== id);
      const achievedItem: AchievedItem = {
        ...target,
        achievedAt: new Date().toISOString(),
      };
      const nextAchieved = [achievedItem, ...achieved];
      setGiveUps(nextGiveUps);
      setAchieved(nextAchieved);
      await Promise.all([saveGiveUps(nextGiveUps), saveAchieved(nextAchieved)]);
    },
    [achieved, giveUps]
  );

  const deleteGiveUp = useCallback(
    async (id: string): Promise<GiveUpItem | null> => {
      const target = giveUps.find((item) => item.id === id);
      if (!target) {
        return null;
      }
      const nextGiveUps = giveUps.filter((item) => item.id !== id);
      setGiveUps(nextGiveUps);
      await saveGiveUps(nextGiveUps);
      return target;
    },
    [giveUps]
  );

  const restoreGiveUp = useCallback(
    async (item: GiveUpItem) => {
      if (giveUps.some((existing) => existing.id === item.id)) {
        return;
      }
      const nextGiveUps = [item, ...giveUps];
      setGiveUps(nextGiveUps);
      await saveGiveUps(nextGiveUps);
    },
    [giveUps]
  );

  const unlockedBadges = BADGES.filter((badge) =>
    unlockedBadgeIds.includes(badge.id)
  );

  return {
    giveUps,
    achieved,
    unlockedBadgeIds,
    unlockedBadges,
    totalCount,
    loading,
    reload,
    addGiveUp,
    togglePin,
    moveToAchieved,
    deleteGiveUp,
    restoreGiveUp,
  };
}

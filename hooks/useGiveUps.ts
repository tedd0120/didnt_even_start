import { useCallback, useEffect, useState } from "react";
import {
  loadAchieved,
  loadAchievedTotalCount,
  loadGiveUps,
  loadGiveUpTotalCount,
  loadUnlockedBadgeIds,
  saveAchieved,
  saveAchievedTotalCount,
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
  const [achievedTotalCount, setAchievedTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const [
      items,
      achievedItems,
      badgeIds,
      storedTotal,
      storedAchievedTotal,
    ] = await Promise.all([
      loadGiveUps(),
      loadAchieved(),
      loadUnlockedBadgeIds(),
      loadGiveUpTotalCount(),
      loadAchievedTotalCount(),
    ]);
    const inferredTotal = storedTotal ?? items.length + achievedItems.length;
    const inferredAchievedTotal = storedAchievedTotal ?? achievedItems.length;
    setGiveUps(items);
    setAchieved(achievedItems);
    setUnlockedBadgeIds(badgeIds);
    setTotalCount(inferredTotal);
    setAchievedTotalCount(inferredAchievedTotal);
    if (storedTotal === null) {
      await saveGiveUpTotalCount(inferredTotal);
    }
    if (storedAchievedTotal === null) {
      await saveAchievedTotalCount(inferredAchievedTotal);
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
      const nextAchievedTotal = achievedTotalCount + 1;
      setGiveUps(nextGiveUps);
      setAchieved(nextAchieved);
      setAchievedTotalCount(nextAchievedTotal);
      await Promise.all([
        saveGiveUps(nextGiveUps),
        saveAchieved(nextAchieved),
        saveAchievedTotalCount(nextAchievedTotal),
      ]);
    },
    [achieved, giveUps, achievedTotalCount]
  );

  const deleteGiveUp = useCallback(
    async (id: string): Promise<boolean> => {
      const target = giveUps.find((item) => item.id === id);
      if (!target) {
        return false;
      }
      const nextGiveUps = giveUps.filter((item) => item.id !== id);
      setGiveUps(nextGiveUps);
      await saveGiveUps(nextGiveUps);
      return true;
    },
    [giveUps]
  );

  const toggleAchievedPin = useCallback(
    async (id: string) => {
      const nextAchieved = achieved.map((item) =>
        item.id === id ? { ...item, pinned: !item.pinned } : item
      );
      setAchieved(nextAchieved);
      await saveAchieved(nextAchieved);
    },
    [achieved]
  );

  const deleteAchieved = useCallback(
    async (id: string): Promise<boolean> => {
      const target = achieved.find((item) => item.id === id);
      if (!target) {
        return false;
      }
      const nextAchieved = achieved.filter((item) => item.id !== id);
      setAchieved(nextAchieved);
      await saveAchieved(nextAchieved);
      return true;
    },
    [achieved]
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
    achievedTotalCount,
    loading,
    reload,
    addGiveUp,
    togglePin,
    moveToAchieved,
    deleteGiveUp,
    toggleAchievedPin,
    deleteAchieved,
  };
}

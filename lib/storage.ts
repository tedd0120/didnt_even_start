import AsyncStorage from "@react-native-async-storage/async-storage";
import { AchievedItem, GiveUpItem } from "../types/models";

const GIVE_UPS_KEY = "@giveups";
const BADGES_KEY = "@badges";
const ACHIEVED_KEY = "@achieved";
const GIVE_UP_TOTAL_KEY = "@giveups_total";
const ACHIEVED_SUBTITLE_KEY = "@achieved_subtitle";

export async function loadGiveUps(): Promise<GiveUpItem[]> {
  const raw = await AsyncStorage.getItem(GIVE_UPS_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as GiveUpItem[];
  } catch {
    return [];
  }
}

export async function saveGiveUps(items: GiveUpItem[]): Promise<void> {
  await AsyncStorage.setItem(GIVE_UPS_KEY, JSON.stringify(items));
}

export async function loadAchieved(): Promise<AchievedItem[]> {
  const raw = await AsyncStorage.getItem(ACHIEVED_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as AchievedItem[];
  } catch {
    return [];
  }
}

export async function saveAchieved(items: AchievedItem[]): Promise<void> {
  await AsyncStorage.setItem(ACHIEVED_KEY, JSON.stringify(items));
}

export async function loadUnlockedBadgeIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(BADGES_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export async function saveUnlockedBadgeIds(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(BADGES_KEY, JSON.stringify(ids));
}

export async function loadGiveUpTotalCount(): Promise<number | null> {
  const raw = await AsyncStorage.getItem(GIVE_UP_TOTAL_KEY);
  if (!raw) {
    return null;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function saveGiveUpTotalCount(total: number): Promise<void> {
  await AsyncStorage.setItem(GIVE_UP_TOTAL_KEY, String(total));
}

export async function loadAchievedSubtitleIndex(): Promise<number | null> {
  const raw = await AsyncStorage.getItem(ACHIEVED_SUBTITLE_KEY);
  if (!raw) {
    return null;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function saveAchievedSubtitleIndex(index: number): Promise<void> {
  await AsyncStorage.setItem(ACHIEVED_SUBTITLE_KEY, String(index));
}

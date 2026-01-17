import AsyncStorage from "@react-native-async-storage/async-storage";
import { AchievedItem, GiveUpItem, Profile } from "../types/models";

const GIVE_UPS_KEY = "@giveups";
const BADGES_KEY = "@badges";
const ACHIEVED_KEY = "@achieved";
const GIVE_UP_TOTAL_KEY = "@giveups_total";
const ACHIEVED_TOTAL_KEY = "@achieved_total";
const ACHIEVED_SUBTITLE_KEY = "@achieved_subtitle";
const PROFILE_KEY = "@profile";
const SEA_SPECIES_KEY = "@dual_tree_sea_species";
const SKY_SPECIES_KEY = "@dual_tree_sky_species";

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

export async function loadAchievedTotalCount(): Promise<number | null> {
  const raw = await AsyncStorage.getItem(ACHIEVED_TOTAL_KEY);
  if (!raw) {
    return null;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function saveAchievedTotalCount(total: number): Promise<void> {
  await AsyncStorage.setItem(ACHIEVED_TOTAL_KEY, String(total));
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

export async function loadProfile(): Promise<Profile> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  if (!raw) {
    return { nickname: "你", showOnPoster: true };
  }
  try {
    const parsed = JSON.parse(raw) as Profile;
    return {
      nickname: parsed.nickname || "你",
      showOnPoster: parsed.showOnPoster ?? true,
      avatarUri: parsed.avatarUri,
    };
  } catch {
    return { nickname: "你", showOnPoster: true };
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function loadSeaSpecies(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(SEA_SPECIES_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export async function saveSeaSpecies(species: string[]): Promise<void> {
  await AsyncStorage.setItem(SEA_SPECIES_KEY, JSON.stringify(species));
}

export async function loadSkySpecies(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(SKY_SPECIES_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export async function saveSkySpecies(species: string[]): Promise<void> {
  await AsyncStorage.setItem(SKY_SPECIES_KEY, JSON.stringify(species));
}

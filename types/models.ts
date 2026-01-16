export type GiveUpItem = {
  id: string;
  title: string;
  reason?: string;
  plannedAt: string;
  createdAt: string;
  pinned?: boolean;
};

export type AchievedItem = GiveUpItem & {
  achievedAt: string;
};

export type BadgeDefinition = {
  id: string;
  title: string;
  description: string;
  threshold: number;
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond" | "dark-matter";
  hidden: boolean;
  icon:
    | "coffee"
    | "award"
    | "cloud"
    | "feather"
    | "sun"
    | "anchor"
    | "shield"
    | "star"
    | "zap"
    | "aperture"
    | "moon"
    | "triangle"
    | "hexagon"
    | "layers";
};

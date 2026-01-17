import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import PixelSprite from "../../components/PixelSprite";
import { useGiveUps } from "../../hooks/useGiveUps";
import { AtlasFrame, PIXEL_FRAMES } from "../../lib/pixelAtlas";
import {
  loadSeaSpecies,
  loadSkySpecies,
  saveSeaSpecies,
  saveSkySpecies,
} from "../../lib/storage";
import { COLORS, SPACING } from "../../lib/theme";

const METERS_PER_RECORD = 100;
const SPECIES_STEP = 100;
const MAX_HEIGHT = 10000;
const MAX_SPECIES = 100;
const MAX_ACTIVE_SPECIES = 3;
const MAX_MARKERS = 12;
const SKY_CLOUD_RANGE = [1, 2] as const;
const SKY_BIRD_RANGE = [1, 2] as const;
const SEA_FISH_RANGE = [1, 4] as const;
const SEA_BUBBLE_RANGE = [1, 5] as const;
const MAX_SEA_SEAWEED = 6;

const buildSpeciesName = (prefix: string, index: number) =>
  `${prefix}-${String(index).padStart(3, "0")}`;

type MovingSpriteConfig = {
  id: string;
  top: number;
  size: number;
  duration: number;
  delay: number;
  direction: "ltr" | "rtl";
  frame: AtlasFrame;
  tintColor?: string;
  opacity?: number;
  baseTop?: number;
  flapFrames?: AtlasFrame[];
};

type RisingSpriteConfig = {
  id: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
  frame: AtlasFrame;
  tintColor?: string;
  baseTop?: number;
  pulse?: boolean;
};

function MovingSprite({
  config,
  areaWidth,
}: {
  config: MovingSpriteConfig;
  areaWidth: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const [frameIndex, setFrameIndex] = useState(0);
  useEffect(() => {
    const sequence = Animated.sequence([
      Animated.delay(config.delay),
      Animated.timing(anim, {
        toValue: 1,
        duration: config.duration,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]);
    const loop = Animated.loop(sequence);
    loop.start();
    return () => loop.stop();
  }, [anim, config.delay, config.duration]);

  useEffect(() => {
    if (!config.flapFrames || config.flapFrames.length < 2) {
      return;
    }
    const timer = setInterval(() => {
      setFrameIndex((current) => (current + 1) % config.flapFrames!.length);
    }, 400 + Math.random() * 400);
    return () => clearInterval(timer);
  }, [config.flapFrames]);

  const startX =
    config.direction === "ltr" ? -config.size : areaWidth + config.size;
  const endX =
    config.direction === "ltr" ? areaWidth + config.size : -config.size;
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [startX, endX],
  });

  const spriteFrame =
    config.flapFrames && config.flapFrames.length > 0
      ? config.flapFrames[frameIndex % config.flapFrames.length]
      : config.frame;

  return (
    <Animated.View
      style={[
        styles.sprite,
        {
          top: (config.baseTop ?? 0) + config.top,
          opacity: config.opacity ?? 1,
          transform: [
            { translateX },
            { scaleX: config.direction === "rtl" ? -1 : 1 },
          ],
        },
      ]}
    >
      <PixelSprite
        frame={spriteFrame}
        size={config.size}
        tintColor={config.tintColor}
      />
    </Animated.View>
  );
}

function RisingSprite({
  config,
  areaHeight,
}: {
  config: RisingSpriteConfig;
  areaHeight: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const sequence = Animated.sequence([
      Animated.delay(config.delay),
      Animated.timing(anim, {
        toValue: 1,
        duration: config.duration,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]);
    const loop = Animated.loop(sequence);
    loop.start();
    return () => loop.stop();
  }, [anim, config.delay, config.duration]);

  useEffect(() => {
    if (!config.pulse) {
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [config.pulse, pulse]);

  const startY = areaHeight + config.size;
  const endY = -config.size;
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [startY, endY],
  });

  const scale = config.pulse
    ? pulse.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.1] })
    : 1;

  return (
    <Animated.View
      style={[
        styles.sprite,
        {
          left: config.left,
          top: config.baseTop ?? 0,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <PixelSprite
        frame={config.frame}
        size={config.size}
        tintColor={config.tintColor}
      />
    </Animated.View>
  );
}

function Seaweed({ left, top }: { left: number; top: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-4deg", "4deg"],
  });

  return (
    <Animated.View
      style={[
        styles.sprite,
        {
          left,
          top,
          transform: [{ rotate }],
        },
      ]}
    >
      <PixelSprite frame={PIXEL_FRAMES.seaweed as AtlasFrame} size={22} />
    </Animated.View>
  );
}

function Island({ placement }: { placement: "top" | "bottom" }) {
  return (
    <View
      style={[
        styles.island,
        placement === "top" ? { top: -6 } : { bottom: -6 },
      ]}
    >
      <View style={styles.islandHighlight} />
    </View>
  );
}

function UnlockMarkers({
  markers,
  direction,
}: {
  markers: { pos: number; meters: number }[];
  direction: "down" | "up";
}) {
  return (
    <View style={styles.markerLayer}>
      {markers.map((marker) => (
        <View
          key={`${direction}-${marker.meters}`}
          style={[
            styles.marker,
            direction === "down"
              ? { top: marker.pos }
              : { bottom: marker.pos },
          ]}
        >
          <View style={styles.markerDot} />
          <Text style={styles.markerText}>解锁 {marker.meters}m</Text>
        </View>
      ))}
    </View>
  );
}

export default function DualRealmTreeScreen() {
  const { totalCount, achievedTotalCount, loading, reload } = useGiveUps();
  const { width, height } = useWindowDimensions();
  const [seaSpecies, setSeaSpecies] = useState<string[]>([]);
  const [skySpecies, setSkySpecies] = useState<string[]>([]);
  const [speciesReady, setSpeciesReady] = useState(false);

  const sceneHeight = height;
  const halfHeight = sceneHeight / 2;
  const meterScale = sceneHeight / 300;
  const skyHeight = halfHeight + MAX_HEIGHT * meterScale;
  const seaHeight = halfHeight + MAX_HEIGHT * meterScale;
  const worldHeight = skyHeight + seaHeight;
  const sideWidth = width / 2;
  const markerScale = meterScale;

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  useEffect(() => {
    let active = true;
    const loadSpecies = async () => {
      const [sea, sky] = await Promise.all([
        loadSeaSpecies(),
        loadSkySpecies(),
      ]);
      if (!active) {
        return;
      }
      setSeaSpecies(sea);
      setSkySpecies(sky);
      setSpeciesReady(true);
    };
    loadSpecies();
    return () => {
      active = false;
    };
  }, []);

  const seaHeightMeters = totalCount * METERS_PER_RECORD;
  const skyHeightMeters = achievedTotalCount * METERS_PER_RECORD;

  const seaTargetCount = Math.min(
    Math.floor(seaHeightMeters / SPECIES_STEP),
    MAX_SPECIES
  );
  const skyTargetCount = Math.min(
    Math.floor(skyHeightMeters / SPECIES_STEP),
    MAX_SPECIES
  );

  useEffect(() => {
    if (!speciesReady) {
      return;
    }
    if (seaSpecies.length < seaTargetCount) {
      const next = [...seaSpecies];
      for (let i = seaSpecies.length; i < seaTargetCount; i += 1) {
        next.push(buildSpeciesName("深海未知生物", i + 1));
      }
      setSeaSpecies(next);
      saveSeaSpecies(next);
    }
  }, [seaSpecies, seaTargetCount, speciesReady]);

  useEffect(() => {
    if (!speciesReady) {
      return;
    }
    if (skySpecies.length < skyTargetCount) {
      const next = [...skySpecies];
      for (let i = skySpecies.length; i < skyTargetCount; i += 1) {
        next.push(buildSpeciesName("天穹未知生物", i + 1));
      }
      setSkySpecies(next);
      saveSkySpecies(next);
    }
  }, [skySpecies, skyTargetCount, speciesReady]);

  const seaDisplayHeight = Math.max(
    8,
    Math.round(Math.min(seaHeightMeters, MAX_HEIGHT) * meterScale)
  );
  const skyDisplayHeight = Math.max(
    8,
    Math.round(Math.min(skyHeightMeters, MAX_HEIGHT) * meterScale)
  );
  const seaTipY = skyHeight + seaDisplayHeight;
  const skyTipY = skyHeight - skyDisplayHeight;
  const seaCameraOffset = Math.round(sceneHeight / 2 - seaTipY);
  const skyCameraOffset = Math.round(sceneHeight / 2 - skyTipY);

  const seaVisibleTop = -seaCameraOffset;
  const seaVisibleBottom = seaVisibleTop + sceneHeight;
  const seaSeaVisibleStart = Math.max(skyHeight, seaVisibleTop);
  const seaSeaVisibleEnd = Math.min(worldHeight, seaVisibleBottom);
  const seaVisibleHeight = Math.max(0, seaSeaVisibleEnd - seaSeaVisibleStart);
  const seaBaseTop = seaSeaVisibleStart - skyHeight;

  const skyVisibleTop = -skyCameraOffset;
  const skyVisibleBottom = skyVisibleTop + sceneHeight;
  const skyVisibleHeight = Math.max(
    0,
    Math.min(skyHeight, skyVisibleBottom) - Math.max(0, skyVisibleTop)
  );
  const skyBaseTop = Math.max(0, skyVisibleTop);

  const buildMarkers = useCallback(
    (currentHeight: number) => {
      const cappedHeight = Math.min(currentHeight, MAX_HEIGHT);
      const totalMarkers = Math.floor(cappedHeight / SPECIES_STEP);
      const markers: { pos: number; meters: number }[] = [];
      const seen = new Set<number>();
      for (let index = 1; index <= totalMarkers; index += 1) {
        const heightValue = index * SPECIES_STEP;
        if (!seen.has(heightValue)) {
          seen.add(heightValue);
          markers.push({
            pos: Math.round(heightValue * markerScale),
            meters: heightValue,
          });
        }
      }
      return markers;
    },
    [markerScale]
  );

  const seaMarkers = useMemo(
    () => buildMarkers(seaHeightMeters),
    [buildMarkers, seaHeightMeters]
  );
  const skyMarkers = useMemo(
    () => buildMarkers(skyHeightMeters),
    [buildMarkers, skyHeightMeters]
  );

  const activeSeaSpecies = useMemo(() => {
    const count = Math.min(seaTargetCount, MAX_ACTIVE_SPECIES);
    const list = seaSpecies.slice(0, seaTargetCount);
    const pool = [...list];
    const pick: string[] = [];
    while (pick.length < count && pool.length > 0) {
      const index = Math.floor(Math.random() * pool.length);
      pick.push(pool.splice(index, 1)[0]);
    }
    return pick;
  }, [seaSpecies, seaTargetCount]);

  const activeSkySpecies = useMemo(() => {
    const count = Math.min(skyTargetCount, MAX_ACTIVE_SPECIES);
    const list = skySpecies.slice(0, skyTargetCount);
    const pool = [...list];
    const pick: string[] = [];
    while (pick.length < count && pool.length > 0) {
      const index = Math.floor(Math.random() * pool.length);
      pick.push(pool.splice(index, 1)[0]);
    }
    return pick;
  }, [skySpecies, skyTargetCount]);

  const skyMovers = useMemo(() => {
    const band = Math.max(skyVisibleHeight, halfHeight * 0.5);
    const movers: MovingSpriteConfig[] = [];
    const cloudCount =
      SKY_CLOUD_RANGE[0] +
      Math.floor(Math.random() * (SKY_CLOUD_RANGE[1] - SKY_CLOUD_RANGE[0] + 1));
    for (let i = 0; i < cloudCount; i += 1) {
      movers.push({
        id: `cloud-${i}`,
        top: 8 + Math.random() * (band * 0.6),
        size: 28 + Math.random() * 10,
        duration: 12000 + Math.random() * 4000,
        delay: Math.random() * 4000,
        direction: "ltr",
        frame: PIXEL_FRAMES.clouds[
          Math.floor(Math.random() * PIXEL_FRAMES.clouds.length)
        ],
        opacity: 0.9,
        baseTop: skyBaseTop,
      });
    }
    const birdCount =
      SKY_BIRD_RANGE[0] +
      Math.floor(Math.random() * (SKY_BIRD_RANGE[1] - SKY_BIRD_RANGE[0] + 1));
    for (let i = 0; i < birdCount; i += 1) {
      const birdIndex = Math.floor(Math.random() * PIXEL_FRAMES.birds.length);
      movers.push({
        id: `bird-${i}`,
        top: 16 + Math.random() * (band * 0.6),
        size: 20,
        duration: 9000 + Math.random() * 3000,
        delay: Math.random() * 4000,
        direction: "rtl",
        frame: PIXEL_FRAMES.birds[birdIndex],
        flapFrames: [
          PIXEL_FRAMES.birds[birdIndex],
          PIXEL_FRAMES.birds[(birdIndex + 1) % PIXEL_FRAMES.birds.length],
        ],
        baseTop: skyBaseTop,
      });
    }
    activeSkySpecies.forEach((_, index) => {
      movers.push({
        id: `sky-species-${index}`,
        top: 24 + Math.random() * (band * 0.7),
        size: 22,
        duration: 11000 + Math.random() * 3000,
        delay: Math.random() * 4000,
        direction: index % 2 === 0 ? "ltr" : "rtl",
        frame: PIXEL_FRAMES.unknown as AtlasFrame,
        tintColor: "#FFE08A",
        baseTop: skyBaseTop,
      });
    });
    return movers;
  }, [activeSkySpecies, halfHeight, skyBaseTop, skyVisibleHeight]);

  const seaMovers = useMemo(() => {
    const band = Math.max(seaVisibleHeight, halfHeight * 0.5);
    const movers: MovingSpriteConfig[] = [];
    const fishCount =
      SEA_FISH_RANGE[0] +
      Math.floor(Math.random() * (SEA_FISH_RANGE[1] - SEA_FISH_RANGE[0] + 1));
    for (let i = 0; i < fishCount; i += 1) {
      movers.push({
        id: `fish-${i}`,
        top: 20 + Math.random() * (band * 0.7),
        size: 22,
        duration: 9000 + Math.random() * 4000,
        delay: Math.random() * 4000,
        direction: i % 2 === 0 ? "ltr" : "rtl",
        frame: PIXEL_FRAMES.fishes[
          Math.floor(Math.random() * PIXEL_FRAMES.fishes.length)
        ],
        baseTop: seaBaseTop,
      });
    }
    activeSeaSpecies.forEach((_, index) => {
      movers.push({
        id: `sea-species-${index}`,
        top: 16 + Math.random() * (band * 0.7),
        size: 22,
        duration: 12000 + Math.random() * 4000,
        delay: Math.random() * 4000,
        direction: index % 2 === 0 ? "rtl" : "ltr",
        frame: PIXEL_FRAMES.unknown as AtlasFrame,
        tintColor: "#9BD9FF",
        baseTop: seaBaseTop,
      });
    });
    return movers;
  }, [activeSeaSpecies, halfHeight, seaBaseTop, seaVisibleHeight]);

  const seaBubbles = useMemo(() => {
    const bubbles: RisingSpriteConfig[] = [];
    const bubbleCount =
      SEA_BUBBLE_RANGE[0] +
      Math.floor(Math.random() * (SEA_BUBBLE_RANGE[1] - SEA_BUBBLE_RANGE[0] + 1));
    for (let i = 0; i < bubbleCount; i += 1) {
      bubbles.push({
        id: `bubble-${i}`,
        left: 8 + Math.random() * (sideWidth - 32),
        size: 16 + Math.random() * 6,
        duration: 6000 + Math.random() * 3000,
        delay: Math.random() * 4000,
        frame: PIXEL_FRAMES.bubbles[
          Math.floor(Math.random() * PIXEL_FRAMES.bubbles.length)
        ],
        tintColor: "#B3E6FF",
        baseTop: seaBaseTop,
        pulse: true,
      });
    }
    return bubbles;
  }, [sideWidth, seaBaseTop]);

  const seaweeds = useMemo(() => {
    const base = Math.max(seaBaseTop, 0);
    const band = Math.max(seaVisibleHeight, halfHeight * 0.4);
    return Array.from({ length: MAX_SEA_SEAWEED }, (_, index) => ({
      id: `seaweed-${index}`,
      left: 12 + index * 22 + Math.random() * 12,
      top: base + Math.max(0, band - 28),
    }));
  }, [halfHeight, seaBaseTop, seaVisibleHeight]);

  const ready = !loading && speciesReady;

  return (
    <SafeAreaView style={styles.container}>
      {!ready ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <View style={[styles.scene, { height: sceneHeight }]}>
          <View style={[styles.side, styles.leftSide]}>
            <View
              style={[
                styles.world,
                { height: worldHeight },
                { transform: [{ translateY: seaCameraOffset }] },
              ]}
            >
              <View style={[styles.skyArea, { height: skyHeight }]} />
              <View style={[styles.seaArea, { height: seaHeight }]}>
                <Island placement="top" />
                <View style={[styles.tree, { height: seaDisplayHeight }]} />
                {seaweeds.map((seaweed) => (
                  <Seaweed
                    key={seaweed.id}
                    left={seaweed.left}
                    bottom={seaweed.bottom}
                  />
                ))}
                {seaMovers.map((config) => (
                  <MovingSprite
                    key={config.id}
                    config={config}
                    areaWidth={sideWidth}
                  />
                ))}
                {seaBubbles.map((config) => (
                  <RisingSprite
                    key={config.id}
                    config={config}
                    areaHeight={Math.max(seaVisibleHeight, halfHeight)}
                  />
                ))}
                <UnlockMarkers markers={seaMarkers} direction="down" />
              </View>
              <View style={[styles.horizon, { top: skyHeight - 1 }]} />
            </View>
            <View style={styles.metrics}>
              <Text style={styles.metricLabel}>放弃树</Text>
              <Text style={styles.metricValue}>{seaHeightMeters} 米</Text>
              <Text style={styles.metricHint}>
                已发现 {Math.min(seaTargetCount, MAX_SPECIES)}/100
              </Text>
            </View>
          </View>
          <View style={[styles.side, styles.rightSide]}>
            <View
              style={[
                styles.world,
                { height: worldHeight },
                { transform: [{ translateY: skyCameraOffset }] },
              ]}
            >
              <View style={[styles.skyArea, { height: skyHeight }]}>
                <View
                  style={[styles.tree, styles.treeSky, { height: skyDisplayHeight }]}
                />
                <Island placement="bottom" />
                {skyMovers.map((config) => (
                  <MovingSprite
                    key={config.id}
                    config={config}
                    areaWidth={sideWidth}
                  />
                ))}
                <UnlockMarkers markers={skyMarkers} direction="up" />
              </View>
              <View style={[styles.seaArea, { height: seaHeight }]} />
              <View style={[styles.horizon, { top: skyHeight - 1 }]} />
            </View>
            <View style={styles.metrics}>
              <Text style={styles.metricLabel}>达成树</Text>
              <Text style={styles.metricValue}>{skyHeightMeters} 米</Text>
              <Text style={styles.metricHint}>
                已发现 {Math.min(skyTargetCount, MAX_SPECIES)}/100
              </Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scene: {
    flex: 1,
    backgroundColor: COLORS.card,
    flexDirection: "row",
  },
  side: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  leftSide: {
    borderRightWidth: 1,
    borderRightColor: "rgba(0,0,0,0.08)",
  },
  rightSide: {
    borderLeftWidth: 1,
    borderLeftColor: "rgba(0,0,0,0.08)",
  },
  skyArea: {
    backgroundColor: "#BDE5FF",
    overflow: "hidden",
  },
  seaArea: {
    backgroundColor: "#1F4E66",
    overflow: "hidden",
  },
  horizon: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  tree: {
    position: "absolute",
    left: "50%",
    width: 14,
    backgroundColor: "#4F7B55",
    top: 0,
    marginLeft: -7,
    borderRadius: 2,
  },
  treeSky: {
    top: undefined,
    bottom: 0,
    backgroundColor: "#6A9A72",
  },
  island: {
    position: "absolute",
    left: "50%",
    width: 52,
    height: 14,
    marginLeft: -26,
    backgroundColor: "#CDA86B",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B28B52",
  },
  islandHighlight: {
    position: "absolute",
    left: 8,
    top: 3,
    width: 20,
    height: 6,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  markerLayer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  world: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
  marker: {
    position: "absolute",
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  markerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  markerText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.85)",
  },
  metrics: {
    position: "absolute",
    top: SPACING.md,
    left: SPACING.sm,
    gap: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "600",
  },
  metricValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "700",
  },
  metricHint: {
    fontSize: 11,
    color: COLORS.muted,
  },
  sprite: {
    position: "absolute",
  },
});

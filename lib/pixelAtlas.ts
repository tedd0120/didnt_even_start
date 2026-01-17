export const PIXEL_ATLAS = require("../assets/pixel-atlas.png");

export const TILE_SIZE = 16;
export const ATLAS_COLUMNS = 10;
export const ATLAS_ROWS = 5;
export const ATLAS_WIDTH = TILE_SIZE * ATLAS_COLUMNS;
export const ATLAS_HEIGHT = TILE_SIZE * ATLAS_ROWS;

export type AtlasFrame = {
  x: number;
  y: number;
};

const frameAt = (index: number): AtlasFrame => ({
  x: index % ATLAS_COLUMNS,
  y: Math.floor(index / ATLAS_COLUMNS),
});

const rangeFrames = (start: number, count: number) =>
  Array.from({ length: count }, (_, index) => frameAt(start + index));

export const PIXEL_FRAMES = {
  clouds: rangeFrames(0, 10),
  birds: rangeFrames(10, 10),
  bubbles: rangeFrames(20, 10),
  seaweed: frameAt(30),
  fishes: rangeFrames(31, 10),
  unknown: frameAt(41),
} satisfies Record<string, AtlasFrame | AtlasFrame[]>;

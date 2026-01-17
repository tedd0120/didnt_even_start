import { Image, StyleProp, View, ViewStyle } from "react-native";
import {
  ATLAS_HEIGHT,
  ATLAS_WIDTH,
  AtlasFrame,
  PIXEL_ATLAS,
  TILE_SIZE,
} from "../lib/pixelAtlas";

type PixelSpriteProps = {
  frame: AtlasFrame;
  size?: number;
  tintColor?: string;
  style?: StyleProp<ViewStyle>;
};

export default function PixelSprite({
  frame,
  size = 24,
  tintColor,
  style,
}: PixelSpriteProps) {
  const scale = size / TILE_SIZE;
  const offsetX = frame.x * size;
  const offsetY = frame.y * size;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Image
        source={PIXEL_ATLAS}
        style={{
          width: ATLAS_WIDTH * scale,
          height: ATLAS_HEIGHT * scale,
          position: "absolute",
          left: -offsetX,
          top: -offsetY,
          tintColor,
        }}
      />
    </View>
  );
}

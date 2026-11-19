import { Image, View } from 'react-native';
import { clothesImages } from '../lib/clothesImages';

const RATIO = 338 / 936; // width ÷ height of every layer

// What the character wears when nothing else is equipped in that slot
const DEFAULTS: Record<string, string> = { bottom: 'bottom_sweats', top: 'top_tank' };

// Drawing order: later layers go on top of earlier ones
const LAYERS = ['bottom', 'top'];

export default function Character({ equipped = {}, height = 240 }: { equipped?: Record<string, string>; height?: number }) {
  const size = { width: height * RATIO, height };

  return (
    <View style={size}>
      {/* The body always goes first, at the bottom of the stack */}
      <Image source={clothesImages.body} style={[size, { position: 'absolute' }]} resizeMode="contain" />

      {/* Then each clothing slot, in LAYERS order */}
      {LAYERS.map((slot) => {
        const src = clothesImages[equipped[slot] ?? DEFAULTS[slot]];
        return src ? (
          <Image key={slot} source={src} style={[size, { position: 'absolute' }]} resizeMode="contain" />
        ) : null;
      })}
    </View>
  );
}
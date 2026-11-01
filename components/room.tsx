import React, { useState } from 'react';
import { View, Image, Pressable } from 'react-native';
import { roomImages } from '../lib/roomImages';

type Spot = { x: number; y: number; w: number; flip?: boolean; skew?: number };


const SPOTS: [string, Spot][] = [
  ['wall_left',  { x: 165, y: 258, w: 170 }],               
  ['wall_left2', { x: 812, y: 365, w: 80, skew: 26.57 }],   
  ['closet',     { x: 382, y: 300, w: 160 }],
  ['rug',        { x: 290, y: 445, w: 470 }],
  ['desk',       { x: 570, y: 455, w: 250 }],
  ['plant',      { x: 720, y: 530, w: 205 }],
  ['character',  { x: 420, y: 540, w: 230 }],
  ['bed',        { x: 130, y: 470, w: 360, flip: true }],
];

type Props = {
  equipped: Record<string, string>;
  closetOpen?: boolean;
  onClosetPress?: () => void;
};

export default function Room({ equipped, closetOpen, onClosetPress }: Props) {
  const [size, setSize] = useState(0);
  const k = size / 1024;

  const place = (key: string, spot: Spot) => {
    const src = roomImages[key];
    if (!src) return null;
    const res = Image.resolveAssetSource(src);
    if (!res) return null;
    const { width = 1, height = 1 } = res;
    const w = spot.w * k;
    const transform: any[] = [];
    if (spot.flip) transform.push({ scaleX: -1 });
    if (spot.skew) transform.push({ skewY: `${spot.skew}deg` });
    return {
      src,
      box: { position: 'absolute' as const, left: spot.x * k, top: spot.y * k, width: w, height: (w * height) / width },
      transform,
    };
  };

  return (
    <View style={{ width: '100%', aspectRatio: 1 }} onLayout={e => setSize(e.nativeEvent.layout.width)}>
      {size > 0 && (
        <>
          <Image source={roomImages[equipped.walls ?? 'bigroom_pink']} style={{ position: 'absolute', width: size, height: size }} />
          {SPOTS.map(([slot, spot]) => {
            const key = slot === 'closet' ? (closetOpen ? 'open_closet' : 'closed_closet')
                      : slot === 'character' ? (equipped.character ?? 'body_01')
                      : equipped[slot];
            const p = key && place(key, spot);
            if (!p) return null;
            const img = <Image source={p.src} style={{ width: '100%', height: '100%', transform: p.transform }} />;
            return slot === 'closet'
              ? <Pressable key={slot} onPress={onClosetPress} style={p.box}>{img}</Pressable>
              : <View key={slot} style={p.box}>{img}</View>;
          })}
        </>
      )}
    </View>
  );
}
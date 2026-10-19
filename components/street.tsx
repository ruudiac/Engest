import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, View, useWindowDimensions } from 'react-native';

const WALKERS = [
  {src: require('../assets/images/walker1.png'), sheetW: 540, cellW: 135, h: 219, duration: 16000, delay: 0 },
  {src: require('../assets/images/walker2.png'), sheetW: 544, cellW: 136, h: 228, duration: 20000, delay: 6000 },
  {src: require('../assets/images/walker3.png'), sheetW: 464, cellW: 116, h: 220, duration: 13000, delay: 11000 },
];

const TRAM = {src: require('../assets/images/trambc.png'), w: 1321, h: 453 };
const SKYLINE = { src: require('../assets/images/skyline.png'), w: 1200, h: 360 };

function Mover({ from, to, duration, delay, bottom, children }: any) {
  const x = useRef(new Animated.Value(from)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(x, { toValue: to, duration, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(x, { toValue: from, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [from, to]);
  return (
    <Animated.View style={{ position: 'absolute', left: 0, bottom, transform: [{ translateX: x }] }}>
      {children}
    </Animated.View>
  );
}

function Walker({ sheet, height }: any) {
  const scale = height / sheet.h;
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % 4), 160);
    return () => clearInterval(id);
  }, []);
  return (
    <View style={{ width: sheet.cellW * scale, height, overflow: 'hidden' }}>
      <Image
        source={sheet.src}
        style={{ width: sheet.sheetW * scale, height, transform: [{ translateX: -frame * sheet.cellW * scale }] }}
      />
    </View>
  );
}

export default function StreetStrip() {
  const { width } = useWindowDimensions();
  const tramH = 56;
  const tramW = (tramH * TRAM.w) / TRAM.h;
  const walkerH = 44;
  const skylineH = (width * SKYLINE.h) / SKYLINE.w;

  return (
    <View style={{ width, height: skylineH + 20, overflow: 'hidden' }}>
      {/* Skyline, furthest back */}
      <Image
        source={SKYLINE.src}
        style={{ position: 'absolute', left: 0, bottom: 20, width, height: skylineH }}
      />
      {/* Sleepers and rail */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 20, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 }}>
        {Array.from({ length: 28 }).map((_, i) => (
          <View key={i} style={{ width: 4, height: 8 }} className="bg-[#B784D6]" />
        ))}
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 24, height: 3 }} className="bg-[#543666]" />

      {/* Sidewalk */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 6 }} className="bg-[#D9C2EA]" />

      {/* Tram, on the rail */}
      <Mover from={-tramW} to={width} duration={9000} delay={4000} bottom={25}>
        <Image source={TRAM.src} style={{ width: tramW, height: tramH }} />
      </Mover>

      {/* Walkers, on the sidewalk in front */}
      {WALKERS.map((w, i) => (
        <Mover key={i} from={-40} to={width} duration={w.duration} delay={w.delay} bottom={2}>
          <Walker sheet={w} height={walkerH} />
        </Mover>
      ))}
    </View>
  );
}

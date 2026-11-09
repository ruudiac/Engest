import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { MAX_HEARTS } from '../lib/hearts';

const HEART = require('../assets/images/_-2-removebg-preview.png');

function Heart({ full}: { full: boolean }) {
  const scale = useRef( new Animated.Value(1)).current;
  const opacity = useRef( new Animated.Value(full ? 1 : 0.25)).current;
  const firstRender = useRef(true);

  useEffect(() => {
    if(firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (full) {
      opacity.setValue(1);
      return;
    }

    Animated.sequence([
      Animated.timing( scale, {toValue: 1.4, duration: 150, useNativeDriver: true}),
      Animated.parallel([
        Animated.timing(scale, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.25, duration: 300, useNativeDriver: true }),
    ]),
    ]).start();
  }, [full]);

return (
    <Animated.Image
      source={HEART}
      style={{ width: 28, height: 28, opacity, transform: [{ scale }] }}
      resizeMode="contain"
    />
  );
}

export default function HeartsBar({ hearts }: { hearts: number }) {
  return (
    <View className="flex-row items-center justify-center gap-1 rounded-full bg-[#E2BFF6] border border-[#543666] px-2 py-2"
      style={{
        width: 110,
        shadowColor: '#7F39A6',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
      }}>
      {Array.from({ length: MAX_HEARTS }).map((_, i) => (
        <Heart key={i} full={i < hearts} />
      ))}
    </View>
  );
}
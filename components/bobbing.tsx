import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export default function Bobbing({ children, distance = 4, duration = 1200 }: any) {
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(y, { toValue: -distance, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(y, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return <Animated.View style={{ transform: [{ translateY: y }] }}>{children}</Animated.View>;
}
import { useMemo } from 'react';
import { Image, Text, View } from 'react-native';
import Bobbing from './bobbing';

// Little facts shown while loading: Estonian first, English underneath
const TIPS = [
  { et: 'Eesti keeles on 14 käänet.', en: 'Estonian has 14 cases.' },
  { et: 'Õ on täht, mida enamikus keeltes pole.', en: 'Õ is a letter most languages don\'t have.' },
  { et: 'Eesti keeles pole sugu: "tema" on nii he kui she.', en: 'No gender: "tema" means both he and she.' },
  { et: 'Rõhk on peaaegu alati esimesel silbil.', en: 'Stress is almost always on the first syllable.' },
  { et: 'Eesti keeles pole tulevikuvormi.', en: 'Estonian has no future tense.' },
];

export default function LoadingScreen() {
  // Pick one tip when the screen appears (not on every re-render)
  const tip = useMemo(() => TIPS[Math.floor(Math.random() * TIPS.length)], []);

  return (
    <View className="flex-1 bg-[#EAD4F6] items-center justify-center px-8">
      <Bobbing distance={8} duration={700}>
        <Image source={require('../assets/images/wavinglogo.png')} style={{ width: 140, height: 140 }} resizeMode="contain" />
      </Bobbing>
      <Text className="font-pixel text-2xl text-[#543666] mt-4">Laen…</Text>

      <View className="mt-10 bg-[#F6E9FF] rounded-2xl px-5 py-3 border border-[#E2BFF6]">
        <Text className="font-inter text-xs text-[#875BA1] text-center mb-1">Kas sa teadsid?</Text>
        <Text className="font-inter font-bold text-base text-[#543666] text-center">{tip.et}</Text>
        <Text className="font-inter text-sm text-[#875BA1] text-center mt-1">{tip.en}</Text>
      </View>
    </View>
  );
}
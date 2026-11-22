import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, Text, View, LayoutAnimation, Pressable} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NewsList from '../../components/newsList';
import FactsList from '../../components/factsList';
import { useState } from 'react';

// The five sections of the Eesti tab, in display order
const SECTIONS = [
  { key: 'news',      et: 'Uudised',    en: 'News',            icon: 'newspaper' },
  { key: 'culture',   et: 'Kultuur',    en: 'Culture',         icon: 'musical-notes' },
  { key: 'places',    et: 'Kuhu minna', en: 'Places to go',    icon: 'map' },
  { key: 'transport', et: 'Liikumine',  en: 'Getting around',  icon: 'bus' },
  { key: 'society',   et: 'Ühiskond',   en: 'Society',         icon: 'business' },
] as const;

export default function Eesti() {
    // Which sections are open. News starts open, the rest closed.
  const [open, setOpen] = useState<Record<string, boolean>>({ news: true });

  const toggle = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen({ ...open, [key]: !open[key] });
  };
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#F1D4FF] px-6">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Title */}
        <Text className="font-pixel text-5xl text-[#543666] mt-4 text-center">Eesti</Text>
        <Text className="font-inter text-sm text-[#875BA1] text-center mb-6">
          Estonia · news, culture and everyday life
        </Text>
        {SECTIONS.map((s) => (
          <View key={s.key} className="mb-6">
            <Pressable onPress={() => toggle(s.key)} className="flex-row items-center gap-3 mb-3">
              <View className="w-10 h-10 rounded-full bg-[#E2BFF6] border border-[#543666] items-center justify-center">
                <Ionicons name={s.icon} size={20} color="#7F39A6" />
              </View>
              <View className="flex-1">
                <Text className="font-inter font-bold text-lg text-[#543666]">{s.et}</Text>
                <Text className="font-inter text-xs text-[#875BA1]">{s.en}</Text>
              </View>
              <Ionicons name={open[s.key] ? 'chevron-up' : 'chevron-down'} size={20} color="#7F39A6" />
            </Pressable>

            {open[s.key] && (s.key === 'news' ? <NewsList /> : <FactsList section={s.key} />)}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
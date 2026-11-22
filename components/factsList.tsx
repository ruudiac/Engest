import Ionicons from '@expo/vector-icons/Ionicons';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

// Is this card "in season" this month? Handles ranges over New Year too (Nov -> Jan)
const inSeason = (f: any) => {
  if (!f.season_from || !f.season_to) return false;
  const m = new Date().getMonth() + 1;
  return f.season_from <= f.season_to
    ? m >= f.season_from && m <= f.season_to
    : m >= f.season_from || m <= f.season_to;
};

export default function FactsList({ section }: { section: string }) {
  const [facts, setFacts] = useState<any[] | null>(null);

  useEffect(() => {
    supabase
      .from('facts')
      .select('*')
      .eq('section', section)
      .order('position')
      .then(({ data }) => {
        // In-season cards first, the rest keep their order
        const list = data ?? [];
        setFacts([...list.filter(inSeason), ...list.filter((f) => !inSeason(f))]);
      });
  }, [section]);

  if (!facts) {
    return (
      <View className="bg-white rounded-3xl border border-[#EBD5F7] py-8 items-center">
        <ActivityIndicator color="#7F39A6" />
      </View>
    );
  }

  if (facts.length === 0) {
    return (
      <View className="bg-white rounded-3xl border border-[#EBD5F7] px-4 py-6 items-center">
        <Text className="font-inter text-sm text-[#B48FCB]">Coming soon</Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {facts.map((f) => (
        <View key={f.id} className="bg-white rounded-3xl border border-[#EBD5F7] p-4">
          {inSeason(f) && (
            <View className="self-start rounded-full bg-[#E3F7D9] border border-[#6BBF59] px-2 py-0.5 mb-2">
              <Text className="font-inter font-bold text-xs text-[#2F6B22]">Right now</Text>
            </View>
          )}

          <Text className="font-inter font-bold text-base text-[#543666]">{f.title_et}</Text>
          <Text className="font-inter text-xs text-[#875BA1] mb-2">{f.title_en}</Text>
          <Text className="font-inter text-sm text-[#543666] leading-5">{f.body_en}</Text>

          {/* Estonian words from this topic */}
          {f.words?.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mt-3">
              {f.words.map((w: any) => (
                <View key={w.et} className="rounded-full bg-[#F3E6FA] px-3 py-1">
                  <Text className="font-inter text-xs text-[#543666]">
                    <Text className="font-bold">{w.et}</Text> · {w.en}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {f.link && (
            <Pressable
              onPress={() => WebBrowser.openBrowserAsync(f.link)}
              className="self-start flex-row items-center gap-1 mt-3"
            >
              <Text className="font-inter font-semibold text-sm text-[#7F39A6]">{f.link_label ?? 'Read more'}</Text>
              <Ionicons name="open-outline" size={14} color="#7F39A6" />
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );
}
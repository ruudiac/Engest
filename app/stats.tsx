import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingScreen from '../components/loadingScreen';
import ProgressChart from '../components/progressChart';
import { supabase } from '../lib/supabase';

// The skills, matching the quiz types we save
const SKILLS = [
  { key: 'et-en',   et: 'Lugemine',    en: 'Reading (ET → EN)' },
  { key: 'en-et',   et: 'Meenutamine', en: 'Recall (EN → ET)' },
  { key: 'listen',  et: 'Kuulamine',   en: 'Listening' },
  { key: 'picture', et: 'Pildid',      en: 'Pictures' },
  { key: 'case',    et: 'Käänded',     en: 'Cases' },
];

const MIN_ANSWERS = 5; // a skill needs this many answers before it gets a verdict

const MONTHS = ['jaan', 'veebr', 'märts', 'apr', 'mai', 'juuni', 'juuli', 'aug', 'sept', 'okt', 'nov', 'dets'];

// Badge look for a percentage
const badge = (pct: number) =>
  pct >= 80
    ? { box: 'bg-[#E3F7D9] border-[#6BBF59]', text: 'text-[#2F6B22]' }
    : pct >= 60
      ? { box: 'bg-[#FFF6D6] border-[#E8C547]', text: 'text-[#7A5B00]' }
      : { box: 'bg-[#FBE3EC] border-[#D9568A]', text: 'text-[#8A2350]' };

// Turns a timestamp into "2026-11-14", in the phone's own time zone
const dayKey = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;

export default function Stats() {
  const [rows, setRows] = useState<any[] | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setRows([]);
      const { data, error } = await supabase
        .from('answers')
        .select('quiz_type, correct, is_retry, answered_at, cards(word, translation)')
        .eq('user_id', user.id);
      if (error) console.log('stats load failed', error.message);
      setRows(data ?? []);
    };
    load();
  }, []);

  if (rows === null) return <LoadingScreen />;

  // ---------- All the calculations ----------

  // Only first tries count
  const first = rows.filter((r) => !r.is_retry);
  const pct = (list: any[]) => Math.round((list.filter((r) => r.correct).length / list.length) * 100);

  // Per skill: how many answers, and the percentage (if there are enough)
  const skills = SKILLS.map((s) => {
    const list = first.filter((r) => r.quiz_type === s.key);
    return { ...s, count: list.length, pct: list.length >= MIN_ANSWERS ? pct(list) : null };
  });

  // Strongest and weakest, among skills with enough answers
  const rated = skills.filter((s) => s.pct !== null).sort((a, b) => b.pct! - a.pct!);
  const best = rated[0];
  const worst = rated.length > 1 ? rated[rated.length - 1] : null;

  // Hardest words: count first-try misses per word
  const misses: Record<string, any> = {};
  for (const r of first) {
    if (r.correct || !r.cards) continue;
    const w = r.cards.word;
    misses[w] = misses[w] ?? { ...r.cards, n: 0 };
    misses[w].n++;
  }
  const hardest = Object.values(misses).sort((a: any, b: any) => b.n - a.n).slice(0, 5);

  // Group first tries by day, for the chart
  const byDay: Record<string, any[]> = {};
  for (const r of first) {
    const k = dayKey(r.answered_at);
    if (!byDay[k]) byDay[k] = [];
    byDay[k].push(r);
  }
  const days = Object.keys(byDay).sort().map((k) => {
    const [, m, d] = k.split('-').map(Number);
    return { label: `${d}. ${MONTHS[m - 1]}`, value: pct(byDay[k]) };
  });

  const values = days.map((d) => d.value);

  const earlier = values.slice(0, -3);
  const diff = earlier.length ? mean(values.slice(-3)) - mean(earlier) : 0;
  const trend = !earlier.length
    ? null
    : diff > 3
      ? { text: '↑ Tõuseb', color: 'text-[#2F6B22]' }
      : diff < -3
        ? { text: '↓ Langeb', color: 'text-[#C26A00]' }
        : { text: '→ Püsib', color: 'text-[#875BA1]' };

  // ---------- The screen ----------

  return (
    <SafeAreaView className="flex-1 bg-[#F1D4FF] px-6">
      <Pressable
        onPress={() => router.back()}
        className="self-start rounded-full bg-[#E2BFF6] border border-[#543666] px-2 py-2 mt-2"
      >
        <Ionicons name="caret-back" size={24} color="#7F39A6" />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="font-pixel text-3xl text-[#543666] mt-4">Minu edenemine</Text>
        <Text className="font-inter text-base text-[#875BA1] mb-5">My progress</Text>

        {first.length === 0 ? (
          <Text className="font-inter text-base text-[#543666]">
            No answers yet. Finish a quiz and your progress shows up here.
          </Text>
        ) : (
          <>
            {/* Overall */}
            <View className="bg-[#543666] rounded-3xl p-5 mb-4">
              <Text className="font-inter text-sm text-[#CF8DF5]">Kokku · Overall (first tries)</Text>
              <Text className="font-pixel text-5xl text-white mt-1">{pct(first)}%</Text>
              <Text className="font-inter text-sm text-[#CF8DF5] mt-1">{first.length} answers</Text>
            </View>

            {/* Progress over time */}
            <View className="bg-white rounded-3xl border border-[#EBD5F7] p-4 mb-4">
              <View className="flex-row items-end gap-2 mb-1">
                <Text className="font-inter text-xs font-bold tracking-widest text-[#875BA1]">ÕPPIMISE ARENG</Text>
                {trend && <Text className={`font-inter font-bold text-sm ${trend.color}`}>{trend.text}</Text>}
              </View>
              <Text className="font-inter text-xs text-[#875BA1] mb-2">
                Vahemik: <Text className="font-bold">{Math.min(...values)}% – {Math.max(...values)}%</Text> · {days.length} päeva
              </Text>

              {days.length >= 2 ? (
                <ProgressChart data={days} />
              ) : (
                <Text className="font-inter text-sm text-[#875BA1] py-6 text-center">
                  Come back tomorrow: the chart needs at least 2 days of answers.
                </Text>
              )}
            </View>

            {/* Summary sentence */}
            {best && (
              <Text className="font-inter text-base text-[#543666] mb-4 leading-6">
                Your strongest skill is <Text className="font-bold">{best.en}</Text>
                {worst ? (
                  <>
                    . Practise <Text className="font-bold">{worst.en}</Text> the most.
                  </>
                ) : '.'}
              </Text>
            )}

            {/* Per skill */}
            {skills.map((s) => {
              const b = s.pct !== null ? badge(s.pct) : null;
              return (
                <View key={s.key} className="bg-white rounded-2xl border border-[#EBD5F7] px-4 py-3 mb-3 flex-row items-center justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="font-inter font-bold text-base text-[#543666]">{s.et}</Text>
                    <Text className="font-inter text-xs text-[#875BA1]">{s.en} · {s.count} answers</Text>
                  </View>
                  {b ? (
                    <View className={`flex-row items-center gap-1 rounded-full border px-3 py-1 ${b.box}`}>
                      <Text className={`font-inter font-bold ${b.text}`}>{s.pct}%</Text>
                    </View>
                  ) : (
                    <Text className="font-inter text-xs text-[#B48FCB]">Not enough answers yet</Text>
                  )}
                </View>
              );
            })}

            {/* Hardest words */}
            {hardest.length > 0 && (
              <>
                <Text className="font-inter font-bold text-lg text-[#543666] mt-4">Rasked sõnad</Text>
                <Text className="font-inter text-sm text-[#875BA1] mb-3">Your hardest words</Text>
                {hardest.map((w: any) => (
                  <View key={w.word} className="bg-white rounded-2xl border border-[#EBD5F7] px-4 py-3 mb-2 flex-row items-center justify-between">
                    <View>
                      <Text className="font-inter font-bold text-base text-[#543666]">{w.word}</Text>
                      <Text className="font-inter text-xs text-[#875BA1]">{w.translation}</Text>
                    </View>
                    <Text className="font-inter text-sm text-[#8A2350]">missed {w.n}×</Text>
                  </View>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
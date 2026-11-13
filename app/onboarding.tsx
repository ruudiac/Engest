import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

// The three questions. "key" is the profile column the answer is saved to.
const STEPS = [
  {
    key: 'learning_reason',
    title: 'Miks sa eesti keelt õpid?',
    sub: 'Why are you learning Estonian?',
    options: [
      { value: 'work',   et: 'Töö',             en: 'Work' },
      { value: 'study',  et: 'Õpingud',         en: 'Studies' },
      { value: 'family', et: 'Pere ja sõbrad',  en: 'Family & friends' },
      { value: 'living', et: 'Tahan elada Eestis',     en: 'I want to live in Estonia' },
      { value: 'fun',    et: 'Huvi pärast',     en: 'Just for fun' },
    ],
  },
  {
    key: 'level',
    title: 'Kui hästi sa eesti keelt oskad?',
    sub: 'How well do you know Estonian?',
    options: [
      { value: 'none',   et: 'Üldse mitte',  en: 'Not at all' },
      { value: 'basics', et: 'Natuke',       en: 'A little' },
      { value: 'some',   et: 'Saan hakkama', en: 'I get by' },
      { value: 'speaking level',   et: 'Oskan suhelda', en: 'I can speak normally' },
    ],
  },
  {
    key: 'daily_goal',
    title: 'Mis on sinu päevane eesmärk?',
    sub: "What's your daily goal?",
    options: [
      { value: 5,  et: '5 minutit',  en: 'Casual' },
      { value: 10, et: '10 minutit', en: 'Regular' },
      { value: 15, et: '15 minutit', en: 'Serious' },
      { value: 20, et: '20 minutit', en: 'Intense' },
    ],
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);               // 0 = welcome, 1–3 = questions
  const [answers, setAnswers] = useState<any>({});
  const [saving, setSaving] = useState(false);

  // Save all answers to the profile, then go to the dashboard
  const finish = async (all: any) => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ ...all, onboarded: true })
        .eq('id', user.id);
      if (error) console.log('onboarding save failed', error.message);
    }
    router.replace('/(tabs)/dashboard' as any);
  };

  const choose = (key: string, value: any) => {
    const all = { ...answers, [key]: value };
    setAnswers(all);
    if (step === STEPS.length) finish(all);   // that was the last question
    else setStep(step + 1);
  };

  // Welcome screen
  if (step === 0) {
    return (
      <SafeAreaView className="flex-1 bg-[#EAD4F6] items-center justify-center px-6">
        <Image source={require('../assets/images/wavinglogo.png')} style={{ width: 220, height: 220 }} resizeMode="contain" />
        <Text className="font-pixel text-4xl text-[#543666] mt-4">Tere tulemast!</Text>
        <Text className="font-inter text-base text-[#875BA1] mt-1">Welcome to Engest</Text>
        <Text className="font-inter text-base text-[#543666] text-center mt-6">
          Paar küsimust, et õppimine sobiks just sulle.
        </Text>
        <Text className="font-inter text-sm text-[#875BA1] text-center mt-1">
          A few questions, so learning fits you.
        </Text>
        <Pressable onPress={() => setStep(1)} className="h-14 mt-10 px-10 rounded-2xl items-center justify-center bg-[#543666]">
          <Text className="font-inter font-semibold text-lg text-white">Alustame</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Question screens
  const q = STEPS[step - 1];
  return (
    <SafeAreaView className="flex-1 bg-[#EAD4F6] px-6">
      {/* Progress dots */}
      <View className="flex-row justify-center gap-2 mt-4">
        {STEPS.map((_, i) => (
          <View key={i} className={`h-2 w-8 rounded-full ${i < step ? 'bg-[#7F39A6]' : 'bg-[#E2BFF6]'}`} />
        ))}
      </View>

      <Image source={require('../assets/images/wavinglogo.png')} style={{ width: 120, height: 120, alignSelf: 'center', marginTop: 24 }} resizeMode="contain" />
      <Text className="font-inter font-bold text-2xl text-[#543666] text-center mt-4">{q.title}</Text>
      <Text className="font-inter text-base text-[#875BA1] text-center mt-1 mb-6">{q.sub}</Text>

      <View className="gap-3">
        {q.options.map((o) => (
          <Pressable
            key={String(o.value)}
            onPress={() => choose(q.key, o.value)}
            disabled={saving}
            className="rounded-2xl border-2 border-[#8934ba] bg-[#e4c6f5] px-5 py-3"
          >
            <Text className="font-inter font-bold text-lg text-[#543666]">{o.et}</Text>
            <Text className="font-inter text-sm text-[#875BA1]">{o.en}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}
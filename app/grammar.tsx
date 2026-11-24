import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CASES } from '../components/casesModal';
import LoadingScreen from '../components/loadingScreen';
import QuizMultipleChoice from '../components/quizMultipleChoice';
import { GRAMMAR } from '../lib/grammar';
import { supabase } from '../lib/supabase';

const PRACTICE_SIZE = 8; // how many sentences in the practice part

const inputStyle = {
  shadowColor: '#7F39A6',
  shadowOffset: { width: 1, height: 3 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 4,
};

// Shows a sentence with the **marked** word highlighted
function Highlight({ text }: { text: string }) {
  return (
    <Text className="font-inter text-lg text-[#543666]">
      {text.split('**').map((part, i) =>
        i % 2 === 1 ? (
          <Text key={i} className="font-bold text-[#7F39A6]">{part}</Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
}

export default function Grammar() {
  const { moduleId, lessonId } = useLocalSearchParams();
  const group = GRAMMAR[Number(lessonId)];

  const [lesson, setLesson] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]); // practice questions
  const [loading, setLoading] = useState(true);

  // step: -1 = intro, 0..(cases-1) = one case card each, cases.length = practice
  const [step, setStep] = useState(-1);
  const [index, setIndex] = useState(0); // which practice question
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => {
    const load = async () => {
      const minTime = new Promise((r) => setTimeout(r, 800));

      const { data: l } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', Number(moduleId))
        .eq('lesson_number', Number(lessonId))
        .single();

      // Practice: sentences for this lesson's cases, each with its card (for the forms)
      const keys = l?.case_keys ?? [];
      const { data: s } = await supabase
        .from('sentences')
        .select('*, cards(*)')
        .in('case_key', keys);

      const practice = (s ?? [])
        .filter((x: any) => x.cards?.cases)
        .sort(() => Math.random() - 0.5)
        .slice(0, PRACTICE_SIZE)
        .map((x: any) => ({ ...x.cards, sentences: [x], quizType: 'sentence' }));

      await minTime;
      setLesson(l);
      setItems(practice);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <LoadingScreen />;

  if (!lesson || !group) {
    return (
      <SafeAreaView className="flex-1 bg-[#F1D4FF] px-6 items-center justify-center">
        <Text className="font-inter text-lg text-[#543666] text-center">This lesson isn't ready yet.</Text>
        <Pressable onPress={() => router.back()} className="mt-4 px-6 py-3 rounded-2xl bg-[#543666]">
          <Text className="font-inter font-semibold text-white">Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const cases = group.cases;
  const firstTries = items.filter((i) => !i.retry).length;

  // Progress bar: intro + case cards + practice questions
  const totalSteps = 1 + cases.length + Math.max(items.length, 1);
  const doneSteps = step < cases.length ? step + 1 : 1 + cases.length + index;

  const finish = (finalMistakes: number) => {
    router.replace({
      pathname: '/complete',
      params: {
        mistakes: String(finalMistakes),
        // No practice sentences yet: count the case cards, so XP still works
        total: String(firstTries || cases.length),
        lessonId: String(lesson.lesson_number),
        moduleId: String(moduleId),
        moduleName: lesson.name,
      },
    });
  };

  const goNext = () => {
    // Last case card and no practice sentences: finish straight away
    if (step === cases.length - 1 && items.length === 0) return finish(0);
    setStep(step + 1);
  };

  const onPracticeNext = (wasCorrect: boolean, caseKey?: string) => {
    const item = items[index];
    const firstMistake = !wasCorrect && !item.retry;
    const finalMistakes = firstMistake ? mistakes + 1 : mistakes;

    supabase
      .from('answers')
      .insert({
        card_id: item.id,
        module_id: Number(moduleId),
        lesson_number: Number(lessonId),
        quiz_type: 'sentence',
        case_key: caseKey ?? null,
        correct: wasCorrect,
        is_retry: !!item.retry,
      })
      .then(({ error }) => {
        if (error) console.log('answer save failed', error.message);
      });

    // A wrong answer comes back once more at the end
    let list = items;
    if (!wasCorrect) {
      list = [...items, { ...item, retry: true }];
      setItems(list);
    }
    if (firstMistake) setMistakes(finalMistakes);

    if (index === list.length - 1) finish(finalMistakes);
    else setIndex(index + 1);
  };

  const c = step >= 0 && step < cases.length ? cases[step] : null;
  const info = c ? CASES.find((x) => x.key === c.key) : null;

  return (
    <SafeAreaView className="flex-1 bg-[#F1D4FF] px-6">
      {/* Header: back + progress */}
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={() => router.back()}
          className="rounded-full bg-[#E2BFF6] border border-[#543666] px-2 py-2"
          style={inputStyle}
        >
          <Ionicons name="caret-back" size={24} color="#7F39A6" />
        </Pressable>
        <View className="flex-1 h-5 border border-[#543666] bg-[#CF8DF5] rounded-full overflow-hidden">
          <View className="h-full bg-[#7F39A6]" style={{ width: `${(doneSteps / totalSteps) * 100}%` }} />
        </View>
      </View>

      <Text className="text-center text-3xl font-bold font-inter pt-4 text-[#543666]">{lesson.name}</Text>
      <Text className="text-center font-inter text-base text-[#875BA1]">Käänded · {lesson.subtitle}</Text>

      {/* ---------- Intro ---------- */}
      {step === -1 && (
        <>
          <ScrollView className="flex-1 mt-4" showsVerticalScrollIndicator={false}>
            <View className="bg-white rounded-3xl border border-[#EBD5F7] p-5">
              <Text className="font-inter font-bold text-xl text-[#543666] mb-2">{group.title}</Text>
              <Text className="font-inter text-base text-[#543666] leading-6">{group.intro}</Text>

              <Text className="font-inter font-bold text-xs tracking-widest text-[#875BA1] mt-5 mb-2">IN THIS LESSON</Text>
              {cases.map((x) => (
                <View key={x.key} className="flex-row items-center justify-between py-2 border-t border-[#F3E6FA]">
                  <Text className="font-inter font-semibold text-base text-[#543666]">{x.key}</Text>
                  <View className="rounded-xl bg-[#F3E6FA] px-3 py-1">
                    <Text className="font-pixel text-lg text-[#7F39A6]">{x.ending}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
          <Pressable onPress={() => setStep(0)} className="h-14 mt-4 mb-2 rounded-2xl flex-row items-center justify-center gap-2 bg-[#543666]">
            <Text className="font-inter font-semibold text-lg text-white">Start</Text>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </Pressable>
        </>
      )}

      {/* ---------- One case card ---------- */}
      {c && (
        <>
          <ScrollView className="flex-1 mt-4" showsVerticalScrollIndicator={false}>
            <View className="bg-white rounded-3xl border border-[#EBD5F7] p-5">
              <Text className="font-inter font-bold text-2xl text-[#543666] capitalize">{c.key}</Text>
              {info && (
                <Text className="font-inter text-sm text-[#875BA1]">{info.q} · {info.qEn}</Text>
              )}

              <View className="self-start rounded-2xl bg-[#543666] px-4 py-2 mt-4">
                <Text className="font-pixel text-3xl text-white">{c.ending}</Text>
              </View>

              <Text className="font-inter text-base text-[#543666] leading-6 mt-4">{c.explain}</Text>

              <Text className="font-inter font-bold text-xs tracking-widest text-[#875BA1] mt-5 mb-2">EXAMPLES</Text>
              {c.examples.map((e, i) => (
                <View key={i} className="rounded-2xl bg-[#F3E6FA] px-4 py-3 mb-2">
                  <Highlight text={e.et} />
                  <Text className="font-inter text-sm text-[#875BA1] mt-1">{e.en}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View className="flex-row gap-3 mt-4 mb-2">
            <Pressable onPress={() => setStep(step - 1)} className="h-14 px-5 rounded-2xl items-center justify-center bg-[#E2BFF6] border border-[#543666]">
              <Ionicons name="chevron-back" size={20} color="#543666" />
            </Pressable>
            <Pressable onPress={goNext} className="flex-1 h-14 rounded-2xl flex-row items-center justify-center gap-2 bg-[#543666]">
              <Text className="font-inter font-semibold text-lg text-white">
                {step < cases.length - 1 ? 'Next' : items.length ? 'Practice' : 'Finish'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </>
      )}

      {/* ---------- Practice ---------- */}
      {step === cases.length && items[index] && (
        <QuizMultipleChoice
          type="sentence"
          card={items[index]}
          flashcards={items}
          caseKeys={lesson.case_keys}
          speakWord={() => {}}
          onNext={onPracticeNext}
        />
      )}
    </SafeAreaView>
  );
}
import { currentHearts, loseHeart, MAX_HEARTS } from "@/lib/hearts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createAudioPlayer } from "expo-audio";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FlashcardMode from "../components/flashCardMode";
import QuizMultipleChoice from "../components/quizMultipleChoice";
import { images } from "../lib/images";
import { supabase } from "../lib/supabase";
import HeartsBar from "../components/heartsBar";
import MatchPairs from "../components/matchPairs";
import LoadingScreen from "../components/loadingScreen";
import { getHardWords } from "../lib/hardWords";
import { niceAlert } from "../components/niceAlert";
import { getLearnedCases } from "../lib/learnedCases";
import Highlight from "../components/highlight";

// Picks a random quiz type that this card can actually support
const pickQuizType = (c: any, prev: string, learned: string[]) => {
  const types = ['et-en', 'en-et']
  if (c.word_type === 'käändsõna' && c.cases && learned.some((k) => c.cases[k])) types.push('case')
  if (c.word_type === 'käändsõna' && c.cases && c.sentences?.length) types.push('sentence')
  if (c.word_type === 'pöördsõna' && c.conjugations) types.push('verb')
  if (c.has_audio) types.push('listen')
  if (c.image) types.push('picture')
  const options = types.filter((t) => t !== prev)
  return options[Math.floor(Math.random() * options.length)]
}

export default function Lesson() {
  "use no memo";
  const { moduleId, lessonId, review } = useLocalSearchParams();
  const isReview = review === "1";
  const [lesson, setLesson] = useState<any>(null);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [learnedCases, setLearnedCases] = useState<string[]>([]);
  const [showIntro, setShowIntro] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState("flashcard");
  const playerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [outOfHearts, setOutOfHearts] = useState<number | null>(null);

  const inputStyle = {
    shadowColor: "#7F39A6",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  };

  const cardStyle = {
    shadowColor: "#9B59B6",
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  };

  const [quizorder, setQuizOrder] = useState(flashcards);

  const card =
    mode === "quiz" ? quizorder[currentIndex] : flashcards[currentIndex];
  const notReady = !lesson || flashcards.length === 0;
  const total = mode === "quiz" ? quizorder.length : flashcards.length;

  useEffect(() => {
    // Keep the loading screen up for at least 1 second
    const minTime = new Promise((r) => setTimeout(r, 1000));

    const load = async () => {
      const learned = await getLearnedCases();
      setLearnedCases(learned);

      // Prepare a card: its image, and only sentences for cases the user has learned
      const prepare = (c: any) => ({
        ...c,
        image: images[c.image_key],
        sentences: (c.sentences ?? []).filter((s: any) => learned.includes(s.case_key)),
      });
      // Review: the user's hardest words, from any lesson
      if (isReview) {
        const ids = await getHardWords(10);
        const { data } = ids.length
          ? await supabase.from("cards").select("*, sentences(*)").in("id", ids)
          : { data: [] as any[] };
        await minTime;
        setLesson({ name: "Rasked sõnad", subtitle: "Your hardest words" });
        setFlashcards((data ?? []).map(prepare));
        setLoading(false);
        return;
      }

      // Normal lesson
      const { data } = await supabase
        .from("lessons")
        .select("*, cards(*, sentences(*))")
        .eq("module_id", Number(moduleId))
        .eq("lesson_number", Number(lessonId))
        .order("position", { referencedTable: "cards" })
        .single();

      await minTime;

      if (data) {
        setLesson(data);
        setFlashcards(data.cards.map(prepare));
      }
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: p } = await supabase
        .from("profiles")
        .select("hearts, hearts_updated_at, is_admin")
        .eq("id", user.id)
        .single();

      if (!p || p.is_admin) return;
      const h = currentHearts(p.hearts, p.hearts_updated_at);
      setHearts(h.hearts);
      if (h.hearts === 0 && !isReview) setOutOfHearts(h.nextInMs);
    };
    check();
  }, []);

  useEffect(() => {
    if (!card) return;

    const uri = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/audio/cards/${card.id}.mp3`;

    if (!playerRef.current) {
      playerRef.current = createAudioPlayer(uri);
    } else {
      playerRef.current.replace(uri);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.remove();
        playerRef.current = null;
      }
    };
  }, [card]);

  const speakWord = async (slow?: boolean) => {
    if (!card?.has_audio) return;
    try {
      const player = playerRef.current;
      if (player) {
        player.setPlaybackRate(slow === true ? 0.7 : 1, 'high');
        await player.seekTo(0);
        player.play();
      }
    } catch (error) {
      console.log("Speech error:", error);
    }
  };


  // Called the moment a wrong answer is tapped: only counts first-try mistakes.
  // Hearts are decided at the end of the quiz, from the score.
  const handleWrong = () => {
    if (card.retry || isReview) return;
    setMistakes(mistakes + 1);
  };

  const onQuizNext = async (wasCorrect: boolean, caseKey?: string) => {
    // Any card answered wrong goes back into the quiz queue, in a new quiz type
    let order = quizorder;

    if (!wasCorrect) {
      const last = quizorder[quizorder.length - 1];
      order = [...quizorder, { ...card, retry: true, quizType: pickQuizType(card, last.quizType, learnedCases) }];
      setQuizOrder(order);
    }

    // Save the answer (not for match pairs)
    if (card.quizType !== 'match') {
      supabase
        .from('answers')
        .insert({
          card_id: card.id,
          module_id: Number(moduleId),
          lesson_number: Number(lessonId),
          quiz_type: card.quizType,
          case_key: caseKey ?? null,
          correct: wasCorrect,
          is_retry: !!card.retry,
        })
        .then(({ error }) => {
          if (error) console.log('answer save failed', error.message);
        });
    }

    if (currentIndex === order.length - 1) {
      // Review: no lesson progress to save, just a well done and back
      if (isReview) {
        niceAlert(
          "Hästi tehtud!",
          `You practised ${flashcards.length} hard words. The ones you got right will move down your list.`,
          [{ text: "OK", onPress: () => router.back() }],
        );
        return;
      }
      const goComplete = () =>
        router.push({
          pathname: "/complete",
          params: {
            mistakes: String(mistakes),
            total: String(flashcards.length),
            lessonId: String(lesson.lesson_number),
            moduleId: String(moduleId),
            moduleName: lesson.name,
          },
        });

      // One heart per failed quiz: under 70% right on the first try
      const score = Math.round(((flashcards.length - mistakes) / flashcards.length) * 100);
      if (score < 70) {
        const left = await loseHeart();
        setHearts(left);
        niceAlert(
          "Üks süda läks",
          `You got ${score}% right on the first try. Under 70% costs one heart. Keep practising and you'll get it!`,
          [{ text: "OK", onPress: goComplete }],
        );
        return;
      }
      goComplete();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  if (outOfHearts !== null) {
    return (
      <SafeAreaView className="flex-1 bg-[#F1D4FF] px-6 items-center justify-center">
        <Image
          source={require("../assets/images/_-2-removebg-preview.png")}
          style={{ width: 72, height: 72, opacity: 0.35 }}
          resizeMode="contain"
        />
        <Text className="font-pixel text-3xl text-[#543666] mt-4">
          Südamed otsas!
        </Text>
        <Text className="font-inter text-base text-[#875BA1] text-center mt-2">
          You're out of hearts. Next one in {Math.ceil(outOfHearts / 60000)}{" "}
          min.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="h-14 mt-8 px-8 rounded-2xl items-center justify-center bg-[#543666]"
        >
          <Text className="text-lg font-semibold font-inter text-white">
            Back
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (notReady) {
  
    return (
      <SafeAreaView className="flex-1 bg-[#F1D4FF] px-6 items-center justify-center">
        <Text className="text-center text-lg font-inter mt-10 text-[#543666]">
          {isReview ? "No hard words right now. Nice work!" : "Not yet ready. Please check the lesson and flashcard data."}
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 px-4 py-2 bg-[#E2BFF6] border border-[#543666] rounded-full"
          style={inputStyle}
        >
          <Text className="font-pixel">Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }
  if (!card) {
    return <LoadingScreen />;
  }
    // "Hea teada" intro before the flashcards (only when the lesson has one)
  if (showIntro && lesson.intro && mode === "flashcard" && !isReview) {
    return (
      <SafeAreaView className="flex-1 bg-[#F1D4FF] px-6">
        <Pressable
          onPress={() => router.back()}
          className="self-start rounded-full bg-[#E2BFF6] border border-[#543666] px-2 py-2"
          style={inputStyle}
        >
          <Ionicons name="caret-back" size={24} color="#7F39A6" />
        </Pressable>

        <Text className="text-center text-3xl font-bold font-inter pt-4 text-[#543666]">{lesson.name}</Text>
        <Text className="text-center font-inter text-base text-[#875BA1]">
          Lesson {lesson.lesson_number} · {lesson.subtitle}
        </Text>

        <View className="flex-1 justify-center">
          <View className="bg-white rounded-3xl border border-[#EBD5F7] p-5" style={cardStyle}>
            <Text className="font-inter font-bold text-xs tracking-widest text-[#875BA1] mb-2">IN THIS LESSON</Text>
            <Text className="font-inter text-base text-[#543666] mb-3">{flashcards.length} words, including:</Text>
            <View className="flex-row flex-wrap gap-2 mb-5">
              {flashcards.slice(0, 4).map((c) => (
                <View key={c.id} className="rounded-full bg-[#F3E6FA] px-3 py-1">
                  <Text className="font-inter font-semibold text-sm text-[#543666]">{c.word}</Text>
                </View>
              ))}
            </View>

            <Text className="font-inter font-bold text-xs tracking-widest text-[#875BA1] mb-2">HEA TEADA · GOOD TO KNOW</Text>
            <Highlight text={lesson.intro} size="text-base" />
          </View>
        </View>

        <Pressable
          onPress={() => setShowIntro(false)}
          className="h-14 mb-4 rounded-2xl flex-row items-center justify-center gap-2 bg-[#543666]"
        >
          <Text className="font-inter font-semibold text-lg text-white">Start</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F1D4FF] px-6">
      <View className="flex-row items-center justify-between w-full">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center rounded-full bg-[#E2BFF6] border border-[#543666] px-2 py-2 mr-2"
          style={{ ...inputStyle }}
        >
          <Ionicons name="caret-back" size={24} color="#7F39A6" />
        </Pressable>
        {mode === "quiz" && !isReview && <HeartsBar hearts={hearts} />}
      </View>

      <Text className="text-right font-inter text-lg">
        {currentIndex + 1}/{total}
      </Text>

      <View className="w-full h-9 border border-[#543666] bg-[#CF8DF5] rounded-full overflow-hidden">
        <View
          style={{ width: `${(currentIndex / total) * 100}%` }}
          className="h-9 bg-[#7F39A6]"
        />
      </View>

            <Text className="text-center text-3xl font-bold font-inter pt-4 text-[#543666]">
        {lesson.name}
      </Text>
      <Text className="text-center font-inter text-base text-[#875BA1]">
        {lesson.lesson_number ? `Lesson ${lesson.lesson_number} · ${lesson.subtitle}` : lesson.subtitle}
      </Text>

      {mode === "flashcard" ? (
        <FlashcardMode
          card={card}
          currentIndex={currentIndex}
          flashcards={flashcards}
          speakWord={speakWord}
          onPrevious={() => setCurrentIndex(currentIndex - 1)}
                    onNext={() => {
            if (currentIndex === flashcards.length - 1) {
              let prev = ''
              const shuffled = [...flashcards]
                .sort(() => Math.random() - 0.5)
                .map((c) => {
                  const quizType = pickQuizType(c, prev, learnedCases)
                  prev = quizType
                  return { ...c, quizType }
                });
                if (flashcards.length >= 3) shuffled.push({ id: 'match', quizType: 'match' });
              setQuizOrder(shuffled);
              setCurrentIndex(0);
              setMode("quiz");
            } else {
              setCurrentIndex(currentIndex + 1);
            }
          }}
        />
            ) : card.quizType === "match" ? (
        <MatchPairs words={flashcards} onNext={onQuizNext} />
      ) : (
        <QuizMultipleChoice
          type={card.quizType}
          card={card}
          flashcards={quizorder}
          caseKeys={learnedCases}
          speakWord={speakWord}
          onNext={onQuizNext}
          onWrong={handleWrong}
        />
      )}
    </SafeAreaView>
  );
}

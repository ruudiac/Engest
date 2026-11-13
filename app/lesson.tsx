import { currentHearts, loseHeart, MAX_HEARTS } from "@/lib/hearts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
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

// Picks a random quiz type that this card can actually support
const pickQuizType = (c: any, prev: string) => {
  const types = ['et-en', 'en-et']
  if (c.cases) types.push('case')
  if (c.has_audio) types.push('listen')
  if (c.image) types.push('picture')
  const options = types.filter((t) => t !== prev)
  return options[Math.floor(Math.random() * options.length)]
}

export default function Lesson() {
  "use no memo";
  const { moduleId, lessonId } = useLocalSearchParams();
  const [lesson, setLesson] = useState<any>(null);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hearts, setHearts] = useState(MAX_HEARTS);

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
    setTimeout(() => {   // TEST ONLY: remove after
      supabase
        .from("lessons")
              .select("*, cards(*)")
      .eq("module_id", Number(moduleId))
      .eq("lesson_number", Number(lessonId))
      .order("position", { referencedTable: "cards" })
      .single()
      .then(({ data }) => {
        if (data) {
          setLesson(data);
          setFlashcards(
            data.cards.map((c: any) => ({ ...c, image: images[c.image_key] })),
          );
        }
        setLoading(false);
        });
    }, 3000);
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
      if (h.hearts === 0) setOutOfHearts(h.nextInMs);
    };
    check();
  }, []);

  useEffect(() => {
    if (!card) return;
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});

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

    const onQuizNext = async (wasCorrect: boolean, caseKey?: string) => {
            // a card counts as a mistake, costs a heart, only first time it is anwered wrong
            const firstMistake = !wasCorrect && !card.retry;
            const finalMistakes = firstMistake ? mistakes + 1 : mistakes;

            //anytime a card is answered wrong, goes back to the quiz queue, in a new quiz type
            let order = quizorder;

            if (!wasCorrect) {
              const last = quizorder[quizorder.length - 1];
              order = [...quizorder, { ...card, retry: true, quizType: pickQuizType(card, last.quizType) }];
              setQuizOrder(order);
            }

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

            if (firstMistake) {
              setMistakes(finalMistakes);
              const left = await loseHeart();
              setHearts(left);
              if (left === 0) {
                Alert.alert(
                  "Südamed otsas!",
                  "You're out of hearts. Come back in 30 minutes.",
                  [{ text: "OK", onPress: () => router.replace("/(tabs)/dashboard" as any) }],
                );
                return;
              }
            }

            if (currentIndex === order.length - 1) {
              router.push({
                pathname: "/complete",
                params: {
                  mistakes: String(finalMistakes),
                  total: String(flashcards.length),
                  lessonId: String(lesson.lesson_number),
                  moduleId: String(moduleId),
                  moduleName: lesson.name,
                },
              });
            } else {
              setCurrentIndex(currentIndex + 1);
            }
          }
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
          Not yet ready. Please check the lesson and flashcard data.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 px-4 py-2 bg-[#E2BFF6] border border-[#543666] rounded-full"
          style={inputStyle}
        >
          <Text className="font-pixel">Tagasi</Text>
        </Pressable>
      </SafeAreaView>
    );
  }
  if (!card) {
    return <LoadingScreen />;
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
        {mode === "quiz" && <HeartsBar hearts={hearts} />}
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
        {`${lesson.lesson_number}. tund · ${lesson.subtitle}`}
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
                  const quizType = pickQuizType(c, prev)
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
          speakWord={speakWord}
          onNext={onQuizNext}
        />
      )}
    </SafeAreaView>
  );
}

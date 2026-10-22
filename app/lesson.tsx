import Ionicons from '@expo/vector-icons/Ionicons';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FlashcardMode from '../components/flashCardMode';
import QuizMultipleChoice from '../components/quizMultipleChoice';
import { images } from '../lib/images';
import { supabase } from '../lib/supabase';
import { currentHearts, loseHeart } from '@/lib/hearts';

const estonianLetterNames: Record<string, string> = {
  'A': 'aa', 'B': 'bee', 'C': 'tsee', 'D': 'dee', 'E': 'ee',
  'F': 'eff', 'G': 'gee', 'H': 'haa', 'I': 'ii', 'J': 'jott',
  'K': 'kaa', 'L': 'ell', 'M': 'emm', 'N': 'enn', 'O': 'oo',
  'P': 'pee', 'Q': 'kuu', 'R': 'err', 'S': 'ess', 'Š': 'šaa',
  'Z': 'zett', 'Ž': 'žee', 'T': 'tee', 'U': 'uu', 'V': 'vee',
  'W': 'kaksisvee', 'Õ': 'õõ', 'Ä': 'ää', 'Ö': 'öö', 'Ü': 'üü',
  'X': 'iks', 'Y': 'igrek'
}

export default function Lesson() {
  const { moduleId, lessonId } = useLocalSearchParams();
  const [lesson, setLesson] = useState<any>(null);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState('flashcard');
  const playerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [outOfHearts, setOutOfHearts] = useState<number | null>(null);

  const inputStyle = {
    shadowColor: '#7F39A6',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  }

  const cardStyle = {
    shadowColor: '#9B59B6',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  }

  const [quizorder, setQuizOrder] = useState(flashcards);

  const card = mode === 'quiz' ? quizorder[currentIndex] : flashcards[currentIndex];
  const notReady =!lesson || flashcards.length === 0;

  useEffect(() => {
    supabase
      .from('lessons')
      .select('*, cards(*)')
      .eq('module_id', Number(moduleId))
      .eq('lesson_number', Number(lessonId))
      .order('position', { referencedTable: 'cards' })
      .single()
      .then(({ data }) => {
        if (data) {
          setLesson(data)
          setFlashcards(data.cards.map((c: any) => ({ ...c, image: images[c.image_key] })))
        }
        setLoading(false)
      })
  }, [])

  useEffect(() =>{

    const check = async () =>{
      const {data: { user }} = await supabase.auth.getUser()
      if (!user) return
      const {data: p} = await supabase
      .from('profiles')
      .select('hearts, hearts_updated_at, is_admin')
      .eq('id', user.id)
      .single()

      if (!p || p.is_admin) return
      const h = currentHearts(p.hearts, p.hearts_updated_at)
      if (h.hearts === 0) setOutOfHearts(h.nextInMs)
    }
  check()
  },[])
  
  useEffect(() => {
    if (!card) return

    
  
    const preload = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
        })
  
        const fileUri =
          (FileSystem as any).cacheDirectory +
          `speech_${card.letter}_${card.word}_v2.wav`

  
        const fileInfo = await (FileSystem as any).getInfoAsync(fileUri)
  
        if (!fileInfo.exists) {
  
          const text = card.letter
          ?  `${estonianLetterNames[card.letter.toUpperCase()] ?? card.letter}. ${card.word}.`
          :`${card.word}.`
  
          const response = await fetch(
            'https://api.tartunlp.ai/text-to-speech/v2',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                text,
                speaker: 'mari',
              }),
            }
          )
  
          const arrayBuffer = await response.arrayBuffer()
          const bytes = new Uint8Array(arrayBuffer)
  
          let binary = ''
  
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i])
          }
  
          const base64 = btoa(binary)
  
          await (FileSystem as any).writeAsStringAsync(
            fileUri,
            base64,
            { encoding: 'base64' }
          )
        }
  
        if (!playerRef.current) {
          playerRef.current = createAudioPlayer(fileUri)
        } else {
          playerRef.current.replace(fileUri)
        }
      } catch (error) {
        console.log('Preload error:', error)
      }
    }
  
    preload()
  
    return () => {
      if (playerRef.current) {
        playerRef.current.remove()
        playerRef.current = null
      }
    }
  }, [card])

  const speakWord = async () => {
    try {
      if (playerRef.current) {
        await playerRef.current.seekTo(0)
        playerRef.current.play()
      }
    } catch (error) {
      console.log('Speech error:', error)
    }
  }
  if (loading) {
    return <SafeAreaView className="flex-1 bg-[#F1D4FF]" />
  }
  if (outOfHearts !== null){
    return (
      <SafeAreaView className="flex-1 bg-[#F1D4FF] px-6 items-center justify-center">
        <Image source={require('../assets/images/_-2-removebg-preview.png')} style={{ width: 72, height: 72, opacity: 0.35 }} resizeMode="contain" />
        <Text className="font-pixel text-3xl text-[#543666] mt-4">Südamed otsas!</Text>
        <Text className="font-inter text-base text-[#875BA1] text-center mt-2">
          You're out of hearts. Next one in {Math.ceil(outOfHearts / 60000)} min.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="h-14 mt-8 px-8 rounded-2xl items-center justify-center bg-[#543666]"
        >
          <Text className="text-lg font-semibold font-inter text-white">Back</Text>
        </Pressable>
      </SafeAreaView>
    )
  }

  if (notReady) {
    return (
      <SafeAreaView className="flex-1 bg-[#F1D4FF] px-6 items-center justify-center">
        <Text className="text-center text-lg font-inter mt-10 text-[#543666]">
          Not yet ready. Please check the lesson and flashcard data.
        </Text>
        <Pressable onPress={ () => router.back()} className="mt-4 px-4 py-2 bg-[#E2BFF6] border border-[#543666] rounded-full" style ={inputStyle}>
          <Text className='font-pixel'>Tagasi</Text>
          </Pressable>
      </SafeAreaView>
    )
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
      </View>

      <Text className='text-right font-inter text-lg'>
        {currentIndex + 1}/{flashcards.length}
      </Text>

      <View className='w-full h-9 border border-[#543666] bg-[#CF8DF5] rounded-full overflow-hidden'>
        <View
          style={{ width: `${(currentIndex / flashcards.length) * 100}%` }}
          className="h-9 bg-[#7F39A6]"
        />
      </View>

      <Text className='text-center text-3xl font-bold font-inter pt-6 text-[#543666]'>
        {`Lesson ${lesson.lesson_number}: ${lesson.name}`}
      </Text>

      {mode === 'flashcard' ? (
        <FlashcardMode
          card={card}
          currentIndex={currentIndex}
          flashcards={flashcards}
          speakWord={speakWord}
          onPrevious={() => setCurrentIndex(currentIndex - 1)}
          
          onNext={() => {
            if (currentIndex === flashcards.length - 1) {
              const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
              setQuizOrder(shuffled)
              setCurrentIndex(0)
              setMode('quiz')
            } else {
              setCurrentIndex(currentIndex + 1)
            }
          }}
        />
      ) : (
        <QuizMultipleChoice
          card={card}
          flashcards={quizorder}
          speakWord={speakWord}
          onNext={async (wasCorrect: boolean) => {
            const finalMistakes = wasCorrect ? mistakes : mistakes + 1;

            if (!wasCorrect) {
              setMistakes(finalMistakes)
              const left = await loseHeart()
              if (left === 0){
                Alert.alert('Südamed on otsas!', 'You ran out of hearts! Come back in 30 minutes.', 
                [{text: 'OK', onPress: () => router.replace('/(tabs)/dashboard' as any)}
                ]) 
                return
              }
            }
            if (currentIndex === flashcards.length - 1) {
              router.push({
                pathname: '/complete',
                params: {
                  mistakes: String(finalMistakes),
                  total: String(flashcards.length),
                  lessonId: String(lesson.lesson_number),
                  moduleId: String(moduleId),
                  moduleName: lesson.name,
                },
              })
            } else {
              setCurrentIndex(currentIndex + 1)
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}

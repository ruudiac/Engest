import React, { useState, useMemo } from "react";
import { Pressable, Text, View, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { wordStyle, translationStyle, soundStyle } from './wordSize';
import { CASES } from './casesModal';


const QUIZ_CASES = ['sisseütlev', 'seesütlev', 'seestütlev', 'alaleütlev', 'alalütlev', 'alaltütlev', 'ilmaütlev', 'kaasaütlev'];

export default function QuizMultipleChoice({ card, flashcards, onNext, speakWord, type = 'et-en' }: any) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const answerKey = type === 'et-en' ? 'translation' : 'word'
  const caseInfo = useMemo(() => {
    if (type !== 'case') return null
    const usable = CASES.filter((c) => QUIZ_CASES.includes(c.key) && card.cases?.[c.key])
    return usable[Math.floor(Math.random() * usable.length)]
  }, [card, type])

  const answer = type === 'case' ? card.cases[caseInfo!.key] : card[answerKey]

  const options = useMemo(() => {

    const pool = type === 'case'
      ? Object.values(card.cases)
      : flashcards.map((f: any) => f[answerKey])

    const others = [...new Set(pool)]
      .filter((v) => v !== answer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)

    return [...others, answer].sort(() => Math.random() - 0.5)
  }, [card, type])

  const isCorrect = selectedAnswer === answer
  const showReveal = selectedAnswer !== null && !isCorrect

  const cardStyle = {
    shadowColor: '#9B59B6',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  }


  const getState = (option: string) => {
    if (!selectedAnswer) return 'idle'
    if (option === answer) return 'correct'          
    if (option === selectedAnswer) return 'wrong'              
    return 'dim'                                               
  }

  const styles: any = {
    idle:    { box: 'bg-[#e4c6f5] border-[#8934ba]', text: 'text-[#8934ba]' },
    correct: { box: 'bg-[#E3F7D9] border-[#6BBF59]', text: 'text-[#2F6B22]' },
    wrong:   { box: 'bg-[#FBE3EC] border-[#D9568A]', text: 'text-[#8A2350]' },
    dim:     { box: 'bg-[#FBF5FF] border-[#EBD5F7] opacity-40', text: 'text-[#543666]' },
  }

  return (
    <View className='flex-1'>

      <View className='bg-[#E2BFF6] rounded-3xl mt-6 items-center justify-center mb-7 px-6' style={{ height: 300, ...cardStyle }}>
        {showReveal ? (
          <>
    
            <Text className="font-inter text-s text-[#875BA1] mb-2 ">Vaatame korra veel</Text>
            {card.image && (
              <Image source={card.image} style={{ width: 100, height: 100 }} resizeMode="contain" />
            )}
            <Text allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit className="font-bold text-[#543666] font-inter text-center" style={wordStyle(card.word)}>
              {card.word}
            </Text>
            <Text className="font-inter text-xl text-[#875BA1] mt-1">{card.translation}</Text>
            {card.has_audio && (
              <Pressable onPress={speakWord} className="absolute top-4 left-4 mt-3 w-12 h-12 mb-2 rounded-full bg-[#F6E9FF] items-center justify-center">
                <Ionicons name="volume-high" size={24} color="#7F39A6" />
              </Pressable>
            )}
          </>
        ) : (
          <>

            {type === 'et-en' && (
              <Text allowFontScaling={false} className="font-bold text-[#543666] font-inter text-center" style={wordStyle(card.word)}>{card.word}</Text>
            )}
            {type === 'en-et' && (
              <Text allowFontScaling={false} className="font-bold text-[#543666] font-inter text-center" style={wordStyle(card.translation)}>{card.translation}</Text>
            )}
            {type === 'picture' && (
              <Image source={card.image} style={{ width: 220, height: 220 }} resizeMode="contain" />
            )}
            {(type === 'et-en' || type === 'listen') && card.has_audio && (
              <Pressable onPress={speakWord} className={`${type === 'listen' ? 'w-24 h-24' : 'mt-4 w-12 h-12'} rounded-full bg-[#F6E9FF] items-center justify-center`}>
                <Ionicons name="volume-high" size={type === 'listen' ? 48 : 24} color="#7F39A6" />
              </Pressable>
            )}
                        {type === 'case' && (
              <>
                <Text className="font-inter text-lg text-[#875BA1]">{card.word}</Text>
                <Text className="font-bold text-3xl text-[#543666] font-inter text-center mt-2">
                  {caseInfo!.en.replaceAll('___', card.translation.toLowerCase())}
                </Text>
                <Text className="font-inter text-sm text-[#B48FCB] mt-2">
                  {caseInfo!.key} · {caseInfo!.q}
                </Text>
              </>
            )}
          </>
        )}
      </View>

      {/* Answer options */}
      <View className='gap-3'>
        {options.map((option: string) => {
          const state = getState(option)
          return (
            <Pressable
              key={option}
                onPress={() => {
                setSelectedAnswer(option)
                if (option !== answer && card.has_audio) speakWord()
              }}
              disabled={selectedAnswer !== null}
              className={`h-16 rounded-2xl border-2 px-5 flex-row items-center justify-center ${styles[state].box}`}
            >
              <Text className={`font-inter font-bold text-xl ${styles[state].text}`}>{option}</Text>
              {state === 'correct' && <Ionicons name="checkmark-circle" size={26} color="#6BBF59" />}
              {state === 'wrong' && <Ionicons name="close-circle" size={26} color="#D9568A" />}
            </Pressable>
          )
        })}
      </View>

      {/* Next */}
      {selectedAnswer && (
        <Pressable
          onPress={() => {
            setSelectedAnswer(null)
            onNext(isCorrect, caseInfo?.key)
          }}
          className='h-14 mt-6 rounded-2xl flex-row items-center justify-center gap-2 bg-[#543666]'
          style={{ shadowColor: '#543666', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }}
        >
          <Text className='font-inter font-semibold text-lg text-white'>Next</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </Pressable>
      )}
    </View>
  )
}
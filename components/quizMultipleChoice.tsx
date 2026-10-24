import React, { useState, useMemo } from "react";
import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { wordStyle, translationStyle, soundStyle } from './wordSize';

export default function QuizMultipleChoice({ card, flashcards, onNext, speakWord }: any) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const options = useMemo(() => {
    const others = flashcards
      .filter((f: any) => f.translation !== card.translation)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map((f: any) => f.translation)

    return [...others, card.translation].sort(() => Math.random() - 0.5)
  }, [card])

  const isCorrect = selectedAnswer === card.translation

  const cardStyle = {
    shadowColor: '#9B59B6',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  }


  const getState = (option: string) => {
    if (!selectedAnswer) return 'idle'
    if (option === card.translation) return 'correct'          
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
      {/* Word card */}
      <View className='bg-[#E2BFF6] rounded-3xl mt-6 items-center justify-center mb-7 px-6' style={{ height: 300, ...cardStyle }}>
      <Text allowFontScaling={false} className="font-bold text-[#543666] font-inter text-center" style={wordStyle(card.word)}>{card.word}</Text>
        <Pressable onPress={speakWord} className="mt-4 w-12 h-12 rounded-full bg-[#F6E9FF] items-center justify-center">
          <Ionicons name="volume-high" size={24} color="#7F39A6" />
        </Pressable>
      </View>

      {/* Answer options */}
      <View className='gap-3'>
        {options.map((option: string) => {
          const state = getState(option)
          return (
            <Pressable
              key={option}
              onPress={() => setSelectedAnswer(option)}
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
            onNext(isCorrect)
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
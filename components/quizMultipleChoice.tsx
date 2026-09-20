import React, { useState, useMemo } from "react";
import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function QuizMultipleChoice({ card, flashcards, onNext, speakWord }: any) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const options = useMemo(() => {
    const others = flashcards
      .filter((f: any) => f.translation !== card.translation)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((f: any) => f.translation)
    
    return [...others, card.translation].sort(() => Math.random() - 0.5)
  }, [card])

  const isCorrect = selectedAnswer === card.translation

  const cardStyle = {
    shadowColor: '#9B59B6',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,}

  return (
    <View className='flex-1'>
      
      
      <View className='bg-[#E2BFF6] rounded-3xl p-8 m-2 items-center justify-center mb-7' style={{ minHeight: 160, ...cardStyle }}>
        <Text className='text-6xl font-bold text-[#543666] font-inter'>{card.word}</Text>
        <Pressable onPress={speakWord} className="mt-3"><Ionicons name="volume-high" size={32} color="#543666" /></Pressable>
      </View>

      
      <View className='flex-1 mt-6 gap-2'>
    
        {options.map((option: string) => (
          <Pressable
            key={option}
            onPress={() => setSelectedAnswer(option)}
            disabled={selectedAnswer !== null}
            className='rounded-full border py-3 px-6'
            style={{
              backgroundColor: selectedAnswer === option
                ? isCorrect ? '#02F25D' : '#FF2424'
                : '#E2BFF6',
              borderColor: '#543666'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text className='text-center font-inter font-bold text-2xl text-[#543666]'>{option}</Text>
            {selectedAnswer && option === selectedAnswer && isCorrect && <Text className="text-2xl"> ✓</Text>}
            {selectedAnswer && option === selectedAnswer && !isCorrect && <Text className="text-2xl"> ✗</Text>}
            {selectedAnswer && option !== selectedAnswer && option === card.translation && <Text className="text-2xl"> ✓</Text>}
            </View>
          </Pressable>
        ))}
      </View>

    
      {selectedAnswer && (
  <Pressable
    onPress={() => {
        setSelectedAnswer(null)  
        onNext(isCorrect)}}
    className='rounded-full py-4 mb-4'
    style={{ backgroundColor: isCorrect ? '#02F25D' : '#FF2424'}}
  >
    <Text className='text-center font-inter font-bold text-2xl text-[#543666]'>Next</Text>
  </Pressable>
)}
</View>
  )
}
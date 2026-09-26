import React, { useState } from "react";
import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function FlashcardMode({ card, currentIndex, flashcards, speakWord, onNext, onPrevious }:  any) {

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
  return (
    <View className='flex-1'>
    <View className='bg-[#E2BFF6] rounded-3xl m-2 p-4 pb-14 flex-1 p-8 ' style={cardStyle}>

    <Pressable onPress={speakWord}>
      <Ionicons name="volume-high" size={32} color="#543666" />
    </Pressable>

    {card.etter ?(
      <>
      <Text allowFontScaling={false} className='text-8xl text-center font-bold text-[#543666] font-inter mt-7'>{card.letter}</Text>
      <Text allowFontScaling={false} className='mt-3 text-6xl font-inter text-center text-[#875BA1] font-bold'>{card.word}</Text>
      </>
    ) : (
      <Text allowFontScaling={false} className='text-5xl text-center font-bold text-[#543666] font-inter mt-7'>{card.word}</Text>
    )}

    <Text allowFontScaling={false} className='mt-3 text-[#CF8DF5] text-4xl text-center font.bold font-inter'>{card.translation}</Text>
    
    
  
    </View>
    <View className="flex-row gap-5 flex-1 items-center w-full">
      <Pressable style={inputStyle} disabled={currentIndex === 0} className=" flex-1 rounded-full bg-[#E2BFF6] border border-[#543666] py-3" onPress={onPrevious} ><Text className='text-center font-pixel text-2xl' >Previous</Text></Pressable>
      <Pressable style={inputStyle} className="rounded-full bg-[#E2BFF6] border border-[#543666] flex-1 py-3" onPress={onNext}><Text className='text-center font-pixel text-2xl'>{currentIndex === flashcards.length - 1 ? 'Start Quiz' : 'Next'}</Text></Pressable>
    </View>
  

  </View>
  )
}
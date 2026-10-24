import React, {useState} from 'react';
import { Pressable, Text, View, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import CasesModal from './casesModal';
import { wordStyle, translationStyle, soundStyle } from './wordSize';

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

  const [casesOpen, setCasesOpen] = useState(false);
  
  return (
    <View className='flex-1'> 

    <View className='bg-[#E2BFF6] rounded-3xl m-8 p-6 pb-10 flex-1' style={cardStyle}>
    

    <Pressable onPress={speakWord} className="mt-4 w-12 h-12 rounded-full bg-[#F6E9FF] items-center justify-center">
      <Ionicons name="volume-high" size={24} color="#7F39A6" />
    </Pressable>

    {card.sound ? (
     <View className="self-center mt-6 rounded-3xl bg-[#F6E9FF] border-2 border-[#CF8DF5] items-center justify-center"
       style={{ minWidth: 96, height: 96, paddingHorizontal: 20 }}>
       <Text allowFontScaling={false} className="font-inter font-bold text-[#7F39A6]" style={soundStyle(card.sound)}>
         {card.sound}
       </Text>
     </View>
   ) : (
     <View>
       <Image source={card.image} style={{ width: 250, height: 100 }} resizeMode="contain" />
     </View>
   )}
            <Text allowFontScaling={false} className="mt-3 font-inter text-center text-[#875BA1] font-bold" style={wordStyle(card.word)}>{card.word}</Text>
            <Text allowFontScaling={false} className="mt-3 text-[#CF8DF5] text-center font-inter" style={translationStyle(card.translation)}>{card.translation}</Text>

        <Pressable onPress= {() => setCasesOpen (!casesOpen) }
        className={`flex-row items-center self-center mt-4 px-5 py-2 rounded-full gap-2 ${
          casesOpen ? 'bg-[#543666]' : 'bg-[#F6E9FF]'
        }`}>
          <Text className={`text-base font-semibold font-inter ${
            casesOpen ? 'text-[#F6E9FF]' : 'text-[#7F39A6]'}`}>
              Käänded
          </Text>
          <Ionicons
            name={casesOpen ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={casesOpen ? '#F6E9FF' : '#7F39A6'}/>
        </Pressable>
    </View>
    
{/* Buttons */}
<View className="flex-row gap-3 mx-8 mb-8">
  <Pressable
    onPress={onPrevious}
    disabled={currentIndex === 0}
    className={`flex-1 h-14 rounded-2xl flex-row items-center justify-center gap-2 bg-[#F6E9FF] ${
      currentIndex === 0 ? 'opacity-40' : ''
    }`}
  >
    <Ionicons name="chevron-back" size={20} color="#7F39A6" />
    <Text className="text-lg font-semibold font-inter text-[#7F39A6]">Previous</Text>
  </Pressable>

  <Pressable
    onPress={onNext}
    className="flex-1 h-14 rounded-2xl flex-row items-center justify-center gap-2 bg-[#543666]"
    style={{ shadowColor: '#543666', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }}
  >
    <Text className="text-lg font-semibold font-inter text-white">
      {currentIndex === flashcards.length - 1 ? 'Start Quiz' : 'Next'}
    </Text>
    <Ionicons
      name={currentIndex === flashcards.length - 1 ? 'play' : 'chevron-forward'}
      size={20}
      color="#FFFFFF"
    />
  </Pressable>
</View>

    <CasesModal card={card} visible={casesOpen} onClose={() => setCasesOpen(false)} />
  </View>
  )
}


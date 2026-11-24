import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import CasesModal from './casesModal';
import { wordStyle, translationStyle, soundStyle } from './wordSize';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ConjugationsModal from './conjugationsModal';

// Word classes: Estonian name + a short English explanation
const WORD_TYPES: Record<string, { et: string; en: string }> = {
  'käändsõna': { et: 'käändsõna', en: 'changes its ending' },
  'pöördsõna': { et: 'pöördsõna', en: 'verb' },
  'muutumatu': { et: 'muutumatu', en: "doesn't change" },
};

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

    const type = WORD_TYPES[card.word_type];
  const isVerb = card.word_type === 'pöördsõna' && card.conjugations;

  // Which forms button this word gets: Pöörded for verbs, Käänded for words with cases, none otherwise
  const formsLabel = isVerb ? 'Pöörded' : card.cases ? 'Käänded' : null;

    // Has this learner ever opened the forms? Saved on the phone, so it survives restarts.
  const [seenForms, setSeenForms] = useState(() => {
    try { return localStorage.getItem('seenForms') === '1'; } catch { return false; }
  });

  // Gentle pulse on the forms button until the learner has opened it once
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!formsLabel || seenForms) {
      pulse.setValue(1);
      return;
    }
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [formsLabel, seenForms]);

  const openForms = () => {
    setCasesOpen(true);
    if (!seenForms) {
      setSeenForms(true);
      try { localStorage.setItem('seenForms', '1'); } catch {}
    }
  };
  
  return (
    <View className='flex-1'> 

    <View className='bg-[#E2BFF6] rounded-3xl m-8 p-6 pb-10 flex-1 justify-center' style={cardStyle}>
    
    {card.has_audio && (
    <Pressable onPress={() => speakWord()} className="absolute top-6 left-6 w-12 h-12 rounded-full bg-[#F6E9FF] items-center justify-center z-10">
      <Ionicons name="volume-high" size={24} color="#7F39A6" />
    </Pressable>
    )}
    {card.has_audio && (
  <Pressable onPress={() => speakWord(true)} className="absolute top-20 left-6 w-12 h-12 rounded-full bg-[#F6E9FF] items-center justify-center z-10">
    <MaterialCommunityIcons name="snail" size={24} color="#7F39A6" />
  </Pressable>
)}

    {card.sound && (
  <View className="self-center mt-0 mx-14 rounded-3xl bg-[#F6E9FF] border-2 border-[#CF8DF5] items-center justify-center"
    style={{ minWidth: 80, height: 80, paddingHorizontal: 20 }}>
    <Text allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit className="font-inter font-bold text-[#7F39A6]" style={soundStyle(card.sound)}>
  {card.sound}
</Text>
  </View>
)}
{card.image && (
  <Image source={card.image} style={{ width: 250, height: 75, alignSelf: 'center', marginTop: 12 }} resizeMode="contain" />
)}
            <Text allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit className="mt-3 font-inter text-center text-[#875BA1] font-bold" style={wordStyle(card.word)}>{card.word}</Text>
            <Text allowFontScaling={false} className="mt-3 text-[#CF8DF5] text-center font-inter" style={translationStyle(card.translation)}>
              {card.translation}</Text>
            {type && (
        <Text className="text-center font-inter text-xs text-[#B48FCB] mt-1">
          {type.et} · {type.en}
        </Text>
      )}
                    {formsLabel && (
        <View className="items-center mt-4">
          {/* Hint, only until the forms have been opened once */}
          {!seenForms && (
            <View className="rounded-xl bg-white px-3 py-1 mb-2">
              <Text className="font-inter text-xs text-[#543666]">Tap to see all forms of this word</Text>
            </View>
          )}

          <Animated.View style={{ transform: [{ scale: pulse }] }}>
            <Pressable
              onPress={openForms}
              className="flex-row items-center gap-3 rounded-2xl bg-[#543666] px-5 py-3"
              style={inputStyle}
            >
              <Ionicons name="grid" size={20} color="#F6E9FF" />
              <View>
                <Text className="font-inter font-semibold text-base text-white">How this word changes</Text>
                <Text className="font-inter text-xs text-[#CF8DF5]">{formsLabel}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#F6E9FF" />
            </Pressable>
          </Animated.View>
        </View>
      )}
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
    {isVerb ? (
      <ConjugationsModal card={card} visible={casesOpen} onClose={() => setCasesOpen(false)} />
    ) : (
      <CasesModal card={card} visible={casesOpen} onClose={() => setCasesOpen(false)} />
    )}
  </View>
  )
}


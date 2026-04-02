import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from "react";
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { flashcardsData, lessonsData } from '../app/data/lessons';






export default function Lesson() {
  const { moduleId, lessonId } = useLocalSearchParams();
  const lesson = (lessonsData as any)[Number(moduleId)]?.find((l: any) => l.id === Number(lessonId));
  

  const flashcards = (flashcardsData as any)[Number(lessonId)] ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const [mode, setMode] = useState('flashcard');

  
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
const card = flashcards[currentIndex];

const speakWord = async () => {

  await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
  try {
    const response = await fetch('https://api.tartunlp.ai/text-to-speech/v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: `${card.letter}, ${card.word}`, speaker: 'mari' })
    });



    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
let binary = '';
for (let i = 0; i < bytes.byteLength; i++) {
  binary += String.fromCharCode(bytes[i]);
}
const base64 = btoa(binary);
    const fileUri = (FileSystem as any).cacheDirectory + 'speech.wav';
    
    await (FileSystem as any).writeAsStringAsync(fileUri, base64, {
      encoding: 'base64'
    });
    
    const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
    console.log('Sound created:', sound);
    await sound.playAsync();
  } catch (error) {
    console.log('Speech error:', error);
  }

};

  return (
    <SafeAreaView className="flex-1 bg-[#F1D4FF] px-6" >
      <View className="flex-row items-center justify-between w-full">
      <Pressable onPress={ () => router.back()} className="flex-row items-center  rounded-full bg-[#E2BFF6] border border-[#543666] px-2 py-2 mr-2 " style={{ ...inputStyle }}>
        <Ionicons name="caret-back" size={24} color="#7F39A6" /></Pressable>
      </View>

        <Text className='text-right mt-5 font-pixel text-lg'>{currentIndex + 1}/{flashcards.length}</Text>
        <View className='w-full h-9 border border-[#543666] bg-[#CF8DF5] rounded-full mt-2 mb-9 overflow-hidden'>
    <View style={{width: `${(currentIndex / flashcards.length) * 100}%`}} className="h-9 bg-[#7F39A6]"> 
    </View>
  </View>
      <Text className='text-center text-3xl font-bold font-inter mt-5 mb-6 text-[#543666]'>{`Lesson ${lesson.id}: ${lesson.name}`}</Text>

      {mode === 'flashcard' ? (
        <View className='flex-1'>
          <View className='bg-[#E2BFF6] rounded-3xl m-2 p-4 pb-14 flex-1 p-8 ' style={cardStyle}>
          <Pressable onPress={speakWord}>
  <Ionicons name="volume-high" size={32} color="#543666" />
</Pressable><Text allowFontScaling={false} className='text-8xl text-center font-bold text-[#543666] font-inter mt-7'>{card.letter}</Text>
          <Text allowFontScaling={false} className='mt-3 text-6xl font-inter  text-center text-[#875BA1] font-bold'>{card.word}</Text>
          <Text allowFontScaling={false} className='mt-3 text-[#CF8DF5] text-4xl text-center font-bold font-inter'>{card.translation}</Text>
          </View>
          <View className="flex-row gap-5 flex-1 items-center w-full">
            <Pressable style={inputStyle} disabled={currentIndex === 0} className=" flex-1 rounded-full bg-[#E2BFF6] border border-[#543666] py-3" onPress ={() => setCurrentIndex(currentIndex - 1)} ><Text className='text-center font-pixel text-2xl' >Previous</Text></Pressable>
            <Pressable style={inputStyle} disabled={currentIndex === flashcards.length - 1} className="rounded-full bg-[#E2BFF6] border border-[#543666] flex-1 py-3" onPress ={() => setCurrentIndex(currentIndex + 1)} ><Text className='text-center font-pixel text-2xl'>Next</Text></Pressable>
          </View>
        
  
        </View>
) : (
  <View>{/* quiz content */}</View>
)}
    </SafeAreaView>
  );
}
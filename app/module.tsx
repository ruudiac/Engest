import { View, Text, FlatList, Pressable, Image } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Foundation from '@expo/vector-icons/Foundation';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from '../lib/supabase'
import { images } from '../lib/images'
import HeartsBar from '../components/heartsBar';
import { getHearts, MAX_HEARTS } from '../lib/hearts';


export default function Module() {
  const { id, name } = useLocalSearchParams(); 
  const [lessons, setLessons] = useState<any[]>([])
  const [done, setDone] = useState<number[]>([]);
  const completedCount = done.length;
  const [mod, setMod] = useState<any>(null);

  useEffect(() => {
    supabase
      .from('modules')
      .select('name, subtitle')
      .eq('id', Number(id))
      .single()
      .then(({ data }) => setMod(data));
  }, [id]);

  const [hearts, setHearts] = useState(MAX_HEARTS);


useFocusEffect(useCallback(() => {
  getHearts().then(setHearts);
}, []));

const inputStyle = {
  shadowColor: '#7F39A6',
  shadowOffset: { width: 1, height: 3 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 4,
}
useEffect(() => {
  supabase
    .from('lessons')
    .select('*')
    .eq('module_id', Number(id))
    .order('lesson_number')
    .then(({ data }) => { if (data) setLessons(data) })
}, [])

useFocusEffect(
  useCallback(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('progress')
        .select('lesson_number')
        .eq('user_id', user.id)
        .eq('module_id', Number(id));

     setDone((data ?? []).map((r) => r.lesson_number));
    };
    load();
  }, [id])
);
 
  // The first lesson that isn't done yet
  const nextNumber = lessons.find((l) => !done.includes(l.lesson_number))?.lesson_number;

return (
    <SafeAreaView className="flex-1 bg-[#EAD4F6] px-6">
      <View className="flex-row items-center justify-between w-full">
        <Pressable onPress={ () => router.push('/dashboard')} className="flex-row items-center  rounded-full bg-[#E2BFF6] border border-[#543666] px-2 py-2 mr-2 " style={{ ...inputStyle }}>
        <Ionicons name="caret-back" size={24} color="#7F39A6" /></Pressable>

                <HeartsBar hearts={hearts} />

  </View>
  <View className=' w-full items-center' >
          <Text className="font-pixel text-black text-2xl mt-4 w-full text-center">{mod?.subtitle}</Text>
        <Text className="font-inter text-[#875BA1] text-base w-full text-center">{`${id}. Module · ${mod?.name ?? ''}`}</Text>
      </View>
        <Text className="font-inter text-base text-[#543666] text-center mt-3">
        <Text className="font-bold">{completedCount}/{lessons.length}</Text> lessons completed · läbitud
      </Text>
      <View className="w-full h-5 border border-[#543666] bg-[#CF8DF5] rounded-full mt-2 overflow-hidden">
        <View
          className="h-full bg-[#7F39A6]"
          style={{ width: `${lessons.length ? (completedCount / lessons.length) * 100 : 0}%` }}
        />
      </View>
  <FlatList
  className='w-full mt-4'
   data={lessons}
   numColumns={1}
   keyExtractor={(item) => item.id.toString()}

   renderItem={({ item }) => {
     const isDone = done.includes(item.lesson_number);
     const isNext = item.lesson_number === nextNumber;
     return (
       <View style={{ alignItems: 'stretch', marginVertical: -1 }} className="flex-row">
         {/* Timeline: line + star (filled when the lesson is done) */}
         <View style={{ width: 50, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', marginVertical: -1 }}>
           <View style={{ position: 'absolute', top: 0, bottom: 0, width: 2, backgroundColor: '#543666' }} />
           <View className="rounded-full bg-[#E2BFF6] border border-[#543666] px-2 py-2" style={inputStyle}>
             <Foundation name="star" size={24} color={isDone ? '#7F39A6' : '#CF8DF5'} />
           </View>
         </View>

         <Pressable
           onPress={() => router.push({ pathname: '/lesson', params: { moduleId: id, lessonId: item.lesson_number } })}
           className={`rounded-3xl m-2 p-4 flex-1 flex-row items-center gap-3 border ${
             isNext ? 'bg-[#E2BFF6] border-[#543666] border-2' : isDone ? 'bg-[#F3E6FA] border-[#CF8DF5]' : 'bg-[#E2BFF6] border-[#875BA1]'
           }`}
           style={inputStyle}
         >
           {/* Lesson number */}
           <View className="w-12 h-12 rounded-2xl bg-[#F3DEFF] border border-[#543666] items-center justify-center">
             <Text className="font-pixel text-xl text-[#543666]">{item.lesson_number}</Text>
           </View>

           {/* Title */}
           <View className="flex-1">
             <Text className="font-inter font-bold text-lg text-[#543666]" numberOfLines={1}>{item.name}</Text>
             <Text className="font-inter text-sm text-[#875BA1]" numberOfLines={1}>{item.subtitle}</Text>
           </View>

           {/* Status */}
           {isDone ? (
             <View className="w-9 h-9 rounded-full bg-[#E3F7D9] border border-[#6BBF59] items-center justify-center">
               <Ionicons name="checkmark" size={20} color="#2F6B22" />
             </View>
           ) : isNext ? (
             <View className="w-9 h-9 rounded-full bg-[#543666] items-center justify-center">
               <Ionicons name="play" size={16} color="#FFFFFF" />
             </View>
           ) : (
             <Ionicons name="chevron-forward" size={20} color="#B48FCB" />
           )}
         </Pressable>
       </View>
     );
   }}
   >
  </FlatList>
  </SafeAreaView>


  );
}

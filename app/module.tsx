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
  const [completedCount, setCompletedCount] = useState(0)
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

      setCompletedCount(data?.length ?? 0);
    };
    load();
  }, [id])
);
 

return (
    <SafeAreaView className="flex-1 bg-[#EAD4F6] px-6">
      <View className="flex-row items-center justify-between w-full">
        <Pressable onPress={ () => router.push('/dashboard')} className="flex-row items-center  rounded-full bg-[#E2BFF6] border border-[#543666] px-2 py-2 mr-2 " style={{ ...inputStyle }}>
        <Ionicons name="caret-back" size={24} color="#7F39A6" /></Pressable>

                <HeartsBar hearts={hearts} />

  </View>
  <View className=' w-full items-center' >
          <Text className="font-pixel text-black text-2xl mt-4 w-full text-center">{mod?.subtitle}</Text>
        <Text className="font-inter text-[#875BA1] text-base w-full text-center">{`${id}. moodul · ${mod?.name ?? ''}`}</Text>
      </View>
      <View className='w-full'>
        <Text className='text-center font- mt-3 text-xl'>Completed</Text>
      </View>
      <View className='w-full h-5 border border-[#543666] bg-[#CF8DF5] rounded-full mt-2 overflow-hidden'>
      <Text className='text-center font-inter mt-3 text-xl'>{`${completedCount}/${lessons.length} läbitud`}</Text>
  </View>
  <FlatList
  className='w-full mt-4'
   data={lessons}
   numColumns={1}
   keyExtractor={(item) => item.id.toString()}
   renderItem={({ item }) => (
    <View style={{ alignItems: 'stretch', marginVertical: -1 }} className='flex-row'>
      <View style={{ width: 50, alignSelf: 'stretch', alignItems: 'center', justifyContent:'center', marginVertical: -1 }}>
      <View style={{
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#543666'
  }}></View>
          <View className="flex-row items-center  rounded-full bg-[#E2BFF6] border border-[#543666] px-2 py-2" style={{ ...inputStyle }}>
      <Foundation name="star" size={24} color="#CF8DF5" />
    </View>
    </View>
    
      <Pressable onPress={ () => router.push({ pathname: '/lesson', params: { moduleId: id, lessonId: item.lesson_number } })} className='bg-[#E2BFF6] border border-[#875BA1] rounded-3xl m-2 p-4 pb-14 flex-1 'style={{position: 'relative', ...inputStyle, }}>
        <Text className='text-center font-inter text-xl font-bold'>{item.name}</Text>
        <Text className='text-center font-inter text-s text-[#875BA1] font-bold mt-1'>
        {item.subtitle}
        </Text>
        <View style={{ position: 'absolute', bottom: 6, left: 8, width: 10, height: 90 }}>
        <Image source={images[item.icon_key]}/>
        </View>
        <View style={{ position: 'absolute', bottom: 6, right: 8, width: 80, height: 80 }}>
        <Image source={images[item.icon2_key]} />
        </View>
      </Pressable>
    </View>
  )}
   >
  </FlatList>
  </SafeAreaView>


  );
}

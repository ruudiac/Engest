import { View, Text, Pressable, Image, FlatList} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState } from "react";
import { supabase } from '../../lib/supabase'
import { images } from '../../lib/images'
import PixelProgress from '../../components/pixelProgress'


const moduleStyles = [
  {
    id: 1,
    iconSize: 55,
  },
  {
    id: 2,
    iconSize: 35,
  },
  {
    id: 3,
    iconSize: 60,
  },
  {
    id: 4,
    iconSize: 55,
  },
  {
    id: 5,
    iconSize: 55,
  },
  {
    id: 6,
    iconSize: 55,
  },
];

const level = () => {
  console.log("levels pressed");
}

const inputStyle = {
  shadowColor: '#7F39A6',
  shadowOffset: { width: 1, height: 3 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 4,
}




export default function Dashboard() {
  const [totalXP, setTotalXP] = useState(0)
  const [modules, setModules] = useState<any[]>([])
  const [completedCounts, setCompletedCounts] = useState<Record<number, number>>({})
  const currentLevel = Math.floor(totalXP / 100) + 1

  useEffect(() => {
    supabase
      .from('modules')
      .select('*, lessons(lesson_number)')
      .order('id')
      .then(({ data }) => { if (data) setModules(data) })
  }, [])

  useEffect(() => {
    const loadAllCompleted = async () => {
      const counts: Record<number, number> = {}
      for (const module of modules) {
        const lessons = module.lessons ?? []
        let count = 0
        for (const lesson of lessons) {
          const result = await AsyncStorage.getItem(`completed_${module.id}_${lesson.lesson_number}`)
          if (result === 'true') count++
        }
        counts[module.id] = count
      }
      setCompletedCounts(counts)
    }
    loadAllCompleted()
  }, [modules])
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#EAD4F6] items-center px-6">
    <View className=" flex-row items-center gap-5"> 
        <Text className=" flex-2 text-center font-pixel text-5xl mt-4">Dashboard</Text>
    </View>

    <View className="flex-row items-center justify-between w-full mt-2 mb-2">
  <Pressable onPress={level} className="flex-row items-center rounded-full bg-[#E2BFF6] border border-[#543666] px-2 py-2" style={{ width: 130, ...inputStyle }}>
    <View className="rounded-full bg-[#F3DEFF] border border-[#543666] overflow-hidden mr-2">
      <Image source={require('../../assets/images/star-removebg-preview.png')} style={{ width: 24, height: 24 }} resizeMode="contain"/>
    </View>
    <Text className="font-pixel text-black text-base">LEVEL: {currentLevel}</Text>
  </Pressable>

  <Pressable onPress={level} className="flex-row items-center justify-center rounded-full bg-[#E2BFF6] border border-[#543666] px-2 py-2" style={{ width: 110, ...inputStyle }}>
    <Image source={require('../../assets/images/_-2-removebg-preview.png')} style={{ width: 28, height: 28 }} resizeMode="contain"/>
    <Image source={require('../../assets/images/_-2-removebg-preview.png')} style={{ width: 28, height: 28 }} resizeMode="contain"/>
    <Image source={require('../../assets/images/_-2-removebg-preview.png')} style={{ width: 28, height: 28 }} resizeMode="contain"/>
  </Pressable>

  <Pressable onPress={level} className="flex-row items-center rounded-full bg-[#E2BFF6] border border-[#543666] px-2 py-2 gap-2" style={{ width: 100, ...inputStyle }}>
    <Image source={require('../../assets/images/moneystack.png')} style={{ width: 28, height: 28 }} resizeMode="contain"/>
    <Text className="font-pixel text-black text-base">100</Text>
  </Pressable>
</View>

<View className='w-full'>
    <Text className="font-pixel text-black text-3xl mr-5 mt-4 w-full text-left">
        Learning modules
      </Text>
    </View>

    <FlatList 
    contentContainerStyle={{ paddingBottom: 24 }}
    showsVerticalScrollIndicator={false}
    className='w-full'
    data={modules}
    numColumns={2}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <Pressable
        onPress={() => router.push({ pathname: '/module', params: { id: item.id, name: item.name } })}
        className='bg-[#E2BFF6] border border-[#543666] rounded-3xl m-2 p-4 flex-1 items-center'
        style={inputStyle}
      >
        <View style={{ width: 64, height: 64 }} className="items-center justify-center rounded-full bg-[#F3DEFF] border border-[#543666] overflow-hidden">
          <Image
            source={images[item.icon_key]}
            style={{
              width: moduleStyles.find(s => s.id === item.id)?.iconSize || 44,
              height: moduleStyles.find(s => s.id === item.id)?.iconSize || 44,
            }}
            resizeMode="contain"
          />
        </View>
        <Text className='font-pixel text-black text-base mt-3' numberOfLines={1}>{item.name}</Text>
        <Text className='font-pixel text-[#A35C83] text-xs' numberOfLines={1}>{item.subtitle}</Text>
        <View className="mt-auto pt-3 w-full">
          <PixelProgress total={item.lessons?.length ?? 0} done={completedCounts[item.id] ?? 0} />
        </View>
      </Pressable>
    )}/>

    </SafeAreaView>
  );
}

import { View, Text, Pressable, Image, FlatList} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState } from "react";
import { flashcardsData, lessonsData } from '../../app/data/lessons'


const modules = [
  {
    id: 1,
    name: "Grammar",
    subtitle:"Grammatika",
    subtitleSize: 10,
    progress: 0.5,
    icon: require('../../assets/images/_-removebg-preview.png'),
    iconSize: 55,
  },
  {
    id: 2,
    name: "Slang",
    subtitle:"Släng",
    progress: 0.9,
    icon: require('../../assets/images/smile.png'),
    iconSize: 28,
  },
  {
    id: 3,
    name: "Work",
    subtitle:"Töö",
    progress: 0.8,
    icon: require('../../assets/images/old_suitcase_icon_pixel_art_ai_Stock_Vector-removebg-preview.png'),
    iconSize: 55,
  },
  {
    id: 4,
    name: "Shopping",
    subtitle:"Ostlemine",
    progress: 0.1,
    icon: require('../../assets/images/shoppingcart.png'),
  },
  {
    id: 5,
    name: "Docs",
    subtitle:"Dokumendid",
    progress: 0.3,
    icon: require('../../assets/images/sheet.png'),
  },
  {
    id: 6,
    name: "Culture",
    subtitle:"Kultuur",
    progress: 0.7,
    icon: require('../../assets/images/tantsijad.png'),
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
  const [completedCounts, setCompletedCounts] = useState<Record<number, number>>({})
  const currentLevel = Math.floor(totalXP / 100) + 1
  useEffect(() => {
    const loadAllCompleted = async () => {
      const counts: Record<number, number> = {}
      for (const module of modules) {
        const lessons = (lessonsData as any)[module.id] ?? []
        let count = 0
        for (const lesson of lessons) {
          const result = await AsyncStorage.getItem(`completed_${module.id}_${lesson.id}`)
          if (result === 'true') count++
        }
        counts[module.id] = count
      }
      setCompletedCounts(counts)
    }
    loadAllCompleted()
  }, [])
  return (
    <SafeAreaView className="flex-1 bg-[#EAD4F6] items-center px-6">
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
    className='w-full'
    data={modules}
    numColumns={2}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <Pressable onPress={ () => router.push({ pathname: '/module', params: {id: item.id, name: item.name} })} className='bg-[#E2BFF6] border border-[#543666] rounded-3xl m-2 p-4 flex-1 mt-6'style={inputStyle}>
  <View className="flex-row items-center gap-2 mb-2 m-1">
  <View style={{ width: 54, height: 54 }} className="items-center justify-center rounded-full bg-[#F3DEFF] border border-[#543666] overflow-hidden mr-2">
  <Image source={item.icon} style={{ width: item.iconSize || 44, height: item.iconSize || 44 }} className="w-full h-full" resizeMode="contain" />
</View>
    <View className='flex-1 py-3'>
      <Text className='font-pixel text-black text-sm '>{item.name}</Text>
      <Text style={{ fontSize: item.subtitleSize || 10 }} className='font-pixel text-[#A35C83]'>
  {item.subtitle}
</Text>
    </View>
  </View>
  <View className='w-full h-5 border border-[#543666] bg-[#CF8DF5] rounded-full mt-2 overflow-hidden'>
    <View style={{width: (completedCounts[item.id] ?? 0) / ((flashcardsData as any)[item.id]?.length ?? 1) * 100}} className="h-5 bg-[#7F39A6]"/>
  </View>
</Pressable>
)}/>

    </SafeAreaView>
  );
}

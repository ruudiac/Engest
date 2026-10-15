import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Feather from '@expo/vector-icons/Feather';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Complete() {
  const { mistakes, total, moduleId, lessonId, moduleName } = useLocalSearchParams();

  const xp = Math.round((Number(total) - Number(mistakes)) / Number(total) * 25)
  const score = Math.round((Number(total) - Number(mistakes)) / Number(total) * 100)

  useEffect(() => {
    const saveXP = async () => {
      const current = await AsyncStorage.getItem('xp')
      const currentXP = current ? Number(current) : 0
      const newXP = currentXP + xp
      await AsyncStorage.setItem('xp', String(newXP))
      await AsyncStorage.setItem(`completed_${moduleId}_${lessonId}`, 'true')
    }
    saveXP()
  }, [])


  const inputStyle = {
    shadowColor: '#7F39A6',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  }
  return (
    <SafeAreaView className="flex-1 bg-[#F1D4FF] px-6">
      <View className="items-center">
        <Image source={require('../assets/images/flowerlogo.png')} style={{ width: 400, height: 400 }} />
      </View>
  
      <Text className="text-4xl font-bold text-[#543666] mt-4 text-center">Congratulations!</Text>
      <Text className="font-pixel text-2xl text-center text-[#675F5F] mb-6">You've completed the lesson.</Text>
  
      {/* Stats */}
      <View className="flex-row gap-3">
        <View className="flex-1 bg-[#FBF5FF] border-2 border-[#EBD5F7] rounded-3xl py-5 items-center gap-2">
          <View className="w-11 h-11 rounded-full bg-[#E2BFF6] items-center justify-center">
            <Ionicons name="flash" size={22} color="#7F39A6" />
          </View>
          <Text className="text-4xl font-pixel text-[#543666]">+{xp}</Text>
          <Text className="text-sm font-medium font-inter text-[#875BA1]">XP earned</Text>
        </View>
  
        <View className="flex-1 bg-[#FBF5FF] border-2 border-[#EBD5F7] rounded-3xl py-5 items-center gap-2">
          <View className="w-11 h-11 rounded-full bg-[#E2BFF6] items-center justify-center">
            <Ionicons name="ribbon" size={22} color="#7F39A6" />
          </View>
          <Text className="text-4xl font-pixel text-[#543666]">{score}%</Text>
          <Text className="text-sm font-medium font-inter text-[#875BA1]">Score</Text>
        </View>
      </View>
  
      {/* Back */}
      <Pressable
        onPress={() => router.push({ pathname: '/module', params: { id: moduleId, name: moduleName } })}
        className="h-14 mt-6 rounded-2xl flex-row items-center justify-center gap-2 bg-[#543666]"
        style={{ shadowColor: '#543666', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }}
      >
        <Text className="text-lg font-semibold font-inter text-white">Back to module</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  )}


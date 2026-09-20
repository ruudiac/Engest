import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Feather from '@expo/vector-icons/Feather';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
  <View className='items-center'>
    <Image source={require('../assets/images/flowerlogo.png')} style={{ width: 400, height: 400 }}/>
  </View>

<Text className="text-4xl font-bold text-[#543666] mt-4 text-center">Congratulations!</Text>
<Text className=" font-pixel text-2xl text-center text-[#675F5F] mb-4">You've completed the lesson.</Text>
<View className='flex-row m-5'>
  
<View className='bg-[#E2BFF6] rounded-3xl m-2 p-4 flex-1 border border-[#543666] border-2'>
  <View className='items-center'>
  <SimpleLineIcons name="energy" size={20} color="black" />
  </View>
  <Text className=" font-bold text-[#543666] mt-4 text-center">
 XP Earned: {xp}</Text>
</View>
<View className='bg-[#E2BFF6] rounded-3xl m-2 p-4 flex-1 border border-[#543666] border-2 '>
  <View className='items-center'>
  <Feather name="award" size={20} color="black" />
  </View>
  <Text className=" font-bold text-[#543666] mt-4 text-center">
  Score: {score}%</Text>
</View>
</View>
<View className="items-center">
      <Pressable
        onPress={() => router.push({ pathname: '/module', params: { id: moduleId, name: moduleName } })}
        className="flex-row items-center rounded-full bg-[#E2BFF6] border border-[#543666] px-5 py-6 w-full justify-center"
        style={{ ...inputStyle }}
      >
        <Text className="text-[#7F39A6] font-pixel text-2xl">Back to Module</Text>
        
      </Pressable>
    </View>

</SafeAreaView>


)}

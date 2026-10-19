import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from '@/lib/supabase';


export default function Complete() {
  const { mistakes, total, moduleId, lessonId, moduleName } = useLocalSearchParams();
  const [coinsEarned, setCoinsEarned] = useState<number | null>(null)

  const xp = Math.round((Number(total) - Number(mistakes)) / Number(total) * 25)
  const score = Math.round((Number(total) - Number(mistakes)) / Number(total) * 100)

  useEffect(() => {
    const save = async () => {

      const { data: { user }} = await supabase.auth.getUser()

      if (!user) return 
        const { data: existing } = await supabase
        .from('progress')
        .select('best_score')
        .eq('user_id', user.id)
        .eq('module_id', Number(moduleId))
        .eq('lesson_number', Number(lessonId))
        .maybeSingle()

        const { error: progressError } = await supabase.from('progress').upsert({
          user_id: user.id,
          module_id: Number(moduleId),
          lesson_number: Number(lessonId),
          best_score: Math.max(score, existing?.best_score ?? 0),
          completed_at: new Date().toISOString(),
        })
        if (progressError) console.log('progress save failed', progressError.message)

        const{ data: profile } = await supabase
        .from('profiles')
        .select('xp, coins')
        .eq('id', user.id)
        .single()

        const coinsEarned = (existing ? 2 : 10) + (score === 100 ? 5 : 0)
        setCoinsEarned(coinsEarned)

        const { error: xpError } = await supabase  
        .from('profiles')
        .update({ 
          xp: (profile?.xp ?? 0) + xp,
          coins: (profile?.coins ?? 0) + coinsEarned })
        .eq ('id', user.id)
        if (xpError) console.log('xp save failed', xpError.message)
      
    }
    save()
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

        <View className="flex-1 bg-[#FBF5FF] border-2 border-[#EBD5F7] rounded-3xl py-5 items-center gap-2">
          <View className="w-11 h-11 rounded-full bg-[#E2BFF6] items-center justify-center">
            <Image source={require('../assets/images/moneystack.png')} style={{ width: 26, height: 26 }} resizeMode="contain" />
          </View>
          <Text className="text-4xl font-pixel text-[#543666]">
            {coinsEarned === null ? '…' : `+${coinsEarned}`}
          </Text>
          <Text className="text-sm font-medium font-inter text-[#875BA1]">Coins</Text>
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


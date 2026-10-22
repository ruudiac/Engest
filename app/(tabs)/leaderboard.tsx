import { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from '../../lib/supabase';

// Gold, silver, bronze for places 1–3
const MEDALS = ['#F2C14E', '#C9C3D6', '#D99A6C'];

export default function Leaderboard() {
  const [top, setTop] = useState<any[]>([]);
  const [me, setMe] = useState<{ id: string; username: string; xp: number; rank: number } | null>(null);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        // Top 20 by XP
        const { data } = await supabase
          .from('profiles')
          .select('id, username, xp')
          .order('xp', { ascending: false })
          .limit(20);
        setTop(data ?? []);

        // My own rank = how many people have more XP than me, + 1
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: mine } = await supabase
          .from('profiles')
          .select('id, username, xp')
          .eq('id', user.id)
          .single();
        if (!mine) return;
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gt('xp', mine.xp);
        setMe({ ...mine, rank: (count ?? 0) + 1 });
      };
      load();
    }, [])
  );

  const Row = ({ rank, username, xp, isMe }: any) => {
    const medal = MEDALS[rank - 1];
    return (
      <View
        className={`flex-row items-center px-4 py-3 mb-2 rounded-2xl border-2 ${
          isMe ? 'bg-[#543666] border-[#543666]' : 'bg-[#FBF5FF] border-[#EBD5F7]'
        }`}
      >
        {/* Rank: a medal for the top 3, a number for the rest */}
        <View
          style={{ width: 36, height: 36, backgroundColor: medal ?? 'transparent' }}
          className="rounded-full items-center justify-center mr-3"
        >
          <Text className={`font-pixel text-lg ${isMe && !medal ? 'text-white' : 'text-[#543666]'}`}>{rank}</Text>
        </View>

        <View className="flex-1">
          <Text className={`font-pixel text-base ${isMe ? 'text-white' : 'text-[#543666]'}`} numberOfLines={1}>
            {username}{isMe ? ' (sina)' : ''}
          </Text>
          <Text className={`font-inter text-xs ${isMe ? 'text-[#CF8DF5]' : 'text-[#875BA1]'}`}>
            Level {Math.floor(xp / 100) + 1}
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          <Ionicons name="flash" size={16} color={isMe ? '#F3DEFF' : '#7F39A6'} />
          <Text className={`font-pixel text-lg ${isMe ? 'text-white' : 'text-[#543666]'}`}>{xp}</Text>
        </View>
      </View>
    );
  };

  const meInTop = me && top.some(p => p.id === me.id);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#EAD4F6] px-6">
      <Text className="font-pixel text-5xl text-center mt-4">Edetabel</Text>
      <Text className="font-inter text-sm text-center text-[#875BA1] mb-4">Leaderboard · total XP</Text>

      <FlatList
        data={top}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item, index }) => (
          <Row rank={index + 1} username={item.username} xp={item.xp} isMe={item.id === me?.id} />
        )}
        ListEmptyComponent={
          <Text className="font-inter text-center text-[#875BA1] mt-10">No learners yet.</Text>
        }
      />

      {/* Not in the top 20? Show my own row pinned at the bottom */}
      {me && !meInTop && (
        <View className="pt-2 pb-4 border-t border-[#D9C2EA]">
          <Row rank={me.rank} username={me.username} xp={me.xp} isMe />
        </View>
      )}
    </SafeAreaView>
  );
}
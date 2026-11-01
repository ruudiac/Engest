import { useCallback, useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from '../../lib/supabase';
import Bobbing from '../../components/bobbing';
import PixelProgress from '../../components/pixelProgress';
import Room from '../../components/room';


export default function Profile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [xp, setXp] = useState(0);
  const [lessonsDone, setLessonsDone] = useState(0);
  const [equipped, setEquipped] = useState<Record<string, string>>({});

  const loadRoom = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [{ data: items }, { data: mine }] = await Promise.all([
      supabase.from('items').select('id, slot, image_key, is_default'),
      supabase.from('user_items').select('item_id').eq('user_id', user.id).eq('equipped', true),
    ]);
    const map: Record<string, string> = {};
    items?.filter(i => i.is_default).forEach(i => (map[i.slot] = i.image_key));
    const ids = new Set(mine?.map(m => m.item_id));
    items?.filter(i => ids.has(i.id)).forEach(i => (map[i.slot] = i.image_key));
    setEquipped(map);
  };

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setEmail(user.email ?? '');

        const { data: profile } = await supabase
          .from('profiles')
          .select('username, xp')
          .eq('id', user.id)
          .single();
        setUsername(profile?.username ?? '');
        setXp(profile?.xp ?? 0);

        const { count } = await supabase
          .from('progress')
          .select('*', { count: 'exact', head: true });
        setLessonsDone(count ?? 0);
      };
      load();
      loadRoom();
    }, [])
  );

const level = Math.floor(xp/100) + 1;
const xpInLevel = xp % 100;

const logOut = () => {
  Alert.alert('Log out?', 'You can log back in later.', [
    {text: 'Cancel', style: 'cancel'},
    {text: 'Log out', style: 'destructive',
    onPress: async () => {
    await supabase.auth.signOut();
    router.replace('/login_signup' as any);
  },
},
]);
};

const Stat = ({icon, value, label}: any) =>(
  <View className="flex-1 bg-[#FBF5FF] border-2 border-[#EBD5F7] rounded-3xl py-4 items-center gap-1">
      <Ionicons name={icon} size={20} color="#7F39A6" />
      <Text className="text-3xl font-pixel text-[#543666]">{value}</Text>
      <Text className="text-xs font-medium font-inter text-[#875BA1]">{label}</Text>
    </View>
);

return (
  <SafeAreaView edges={['top']} className="flex-1 bg-[#EAD4F6] px-6">
    <Text className="font-pixel text-5xl text-center mt-4">
      Profile
    </Text>

    <View style={{ marginHorizontal: -24, marginTop: -10, marginBottom: -30 }}>
     <Room equipped={equipped} />
   </View>
   <View className="items-center">
     <Text className="font-pixel text-3xl text-[#543666]">{username}</Text>
     <Text className="font-inter text-sm text-[#875BA1]">{email}</Text>
   </View>

    <View className="flex-row gap-3 mt-6">
      <Stat icon="star" value={level} label="Level" />
      <Stat icon="flash" value={xp} label="Total XP" />
      <Stat icon="book" value={lessonsDone} label="Lessons" />
    </View>

    <Pressable
        onPress={logOut}
        className="h-14 mt-auto mb-6 rounded-2xl flex-row items-center justify-center gap-2 bg-[#FBE3EC] border-2 border-[#D9568A]"
      >
        <Ionicons name="log-out-outline" size={20} color="#8A2350" />
        <Text className="text-lg font-semibold font-inter text-[#8A2350]">Log out</Text>

      </Pressable>
  </SafeAreaView>
);

}
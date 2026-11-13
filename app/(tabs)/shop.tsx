import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View, Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { roomImages } from "../../lib/roomImages";
import { loadShop, buyItem, equipItem } from "../../lib/shop";
import { niceAlert } from "../../components/niceAlert";

export default function Shop() {
  const [items, setItems] = useState<any[]>([]);
  const [coins, setCoins] = useState<number>(0);

  const refresh = () => {
    loadShop().then((data) => {
      if (!data) return;
      setItems(data.items);
      setCoins(data.coins);
    });
  };

  useEffect(() => { refresh(); }, []);

  const onPress = (item: any) => {
    if (item.equipped) return;

    if (item.owned) {
      niceAlert(item.name, 'Kas soovid selle kasutusele võtta?', [
        { text: 'Tühista', style: 'cancel' },
        {
          text: 'Kasuta',
          onPress: () => {
            equipItem(item.id)
              .then(refresh)
              .catch((e) => niceAlert('Ei õnnestunud', e.message));
          },
        },
      ]);
      return;
    }

    if (coins < item.price) {
      niceAlert('Pole piisavalt kroone', `Vajad ${item.price - coins} rohkem kroone.`);
      return;
    }

    niceAlert(`Osta ${item.name}?`, `${item.price} krooni`, [
      { text: 'Tühista', style: 'cancel' },
      {
        text: 'Osta',
        onPress: async () => {
          try {
            await buyItem(item.id);
            refresh();
          } catch (e: any) {
            niceAlert('Ostmine ebaõnnestus', e.message);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F1D4FF] px-6">
            <View className="flex-row items-center justify-between mt-4 mb-4">
        <Text className="text-3xl font-bold font-inter text-[#543666]">Pood</Text>
        <View className="flex-row items-center gap-2 bg-white rounded-full px-3 py-1 border border-[#EBD5F7]">
          <Image source={require('../../assets/images/moneystack.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
          <Text className="font-pixel text-lg text-[#543666]">{coins}</Text>
        </View>
      </View>
            <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap -mx-1">
          {items.map((item) => (
            <Pressable key={item.id} onPress={() => onPress(item)} className="w-1/3 p-1">
              <View className="bg-white rounded-3xl border border-[#EBD5F7] items-center justify-between py-3" style={{ aspectRatio: 0.8 }}>
    
                {roomImages[item.image_key] ? (
                  <Image source={roomImages[item.image_key]} style={{ width: 64, height: 64 }} resizeMode="contain" />
                ) : (
                  <View className="rounded-xl bg-[#F6E9FF]" style={{ width: 64, height: 64 }} />
                )}


                <Text className="font-inter text-xs text-[#875BA1]" numberOfLines={1}>{item.name}</Text>
                {item.equipped ? (
                  <Text className="font-inter font-bold text-sm text-[#543666]">Kasutusel</Text>
                ) : item.owned ? (
                  <Text className="font-inter font-bold text-sm text-[#875BA1]">Olemas</Text>
                ) : (
                  <View className="flex-row items-center gap-1">
                    <Image source={require('../../assets/images/moneystack.png')} style={{ width: 20, height: 20 }} resizeMode="contain" />
                    <Text className="font-pixel text-base text-[#543666]">{item.price}</Text>
                  </View>
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

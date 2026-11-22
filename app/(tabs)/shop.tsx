import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View, Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ItemPreview from '../../components/itemPreview';
import { loadShop, buyItem, equipItem } from "../../lib/shop";
import { niceAlert } from "../../components/niceAlert";
import Character from '../../components/character';
import  Bi  from "../../components/bi";

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'top', label: 'Tops' },
  { key: 'bottom', label: 'Bottoms' },
];


export default function Shop() {
  const [items, setItems] = useState<any[]>([]);
  const [coins, setCoins] = useState<number>(0);
  const [tab, setTab] = useState('all');

  const refresh = () => {
    loadShop().then((data) => {
      if (!data) return;
      setItems(data.items);
      setCoins(data.coins);
    });
  };
    const shown = tab === 'all' ? items : items.filter((i) => i.slot === tab);
    
  const outfit: Record<string, string> = {};
  for (const i of items) if (i.equipped) outfit[i.slot] = i.image_key;
    const [preview, setPreview] = useState<any | null>(null);

  useEffect(() => { refresh(); }, []);

  

  const buy = async (item: any) => {
    try {
      await buyItem(item.id);
      refresh();
      // Keep the sheet open, now showing it as owned, so "Kasuta" is one tap away
      setPreview({ ...item, owned: true });
    } catch (e: any) {
      niceAlert('Ostmine ebaõnnestus', e.message);
    }
  };

  const equip = async (item: any) => {
    try {
      await equipItem(item.id);
      refresh();
      setPreview(null);
    } catch (e: any) {
      niceAlert('Ei õnnestunud', e.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F1D4FF] px-6">
      {/* Header: title + kroonid */}
      <View className="flex-row items-center justify-between mt-4 mb-4">
        <Bi et="Pood" en="Shop" />
        <View className="flex-row items-center gap-2 bg-white rounded-full px-3 py-1 border border-[#EBD5F7]">
          <Image source={require('../../assets/images/moneystack.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
          <Text className="font-pixel text-lg text-[#543666]">{coins}</Text>
        </View>
      </View>

      {/* Tabs: Kõik / Särgid / Püksid */}
      <View className="flex-row gap-2 mb-3">
        {TABS.map((t) => (
          <Pressable
            key={t.key}
            onPress={() => setTab(t.key)}
            className={`px-4 h-9 rounded-full items-center justify-center ${
              tab === t.key ? 'bg-[#543666]' : 'bg-[#EFE6F5]'
            }`}
          >
            <Text
              className={`font-inter font-semibold text-sm ${
                tab === t.key ? 'text-white' : 'text-[#543666]'
              }`}
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Grid of items (only the open tab's items) */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap -mx-1">
          {shown.map((item) => (
              <Pressable key={item.id} onPress={() => setPreview(item)} className="w-1/3 p-1">
              <View className="bg-white rounded-3xl border border-[#EBD5F7] items-center justify-between py-3" style={{ aspectRatio: 0.8 }}>
                {/* The item, worn by a mini character */}
                <Character equipped={{ [item.slot]: item.image_key }} height={72} />

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
        <ItemPreview
        item={preview}
        outfit={outfit}
        coins={coins}
        onClose={() => setPreview(null)}
        onBuy={buy}
        onEquip={equip}
      />
    </SafeAreaView>
  );
}

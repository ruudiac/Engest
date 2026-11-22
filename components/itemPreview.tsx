import { Image, Modal, Pressable, Text, View } from 'react-native';
import Character from './character';

type Props = {
  item: any | null;                 // the tapped item, or null when closed
  outfit: Record<string, string>;   // what the character wears now: { top: 'top_tank', bottom: 'bottom_sweats' }
  coins: number;
  onClose: () => void;
  onBuy: (item: any) => void;
  onEquip: (item: any) => void;
};

export default function ItemPreview({ item, outfit, coins, onClose, onBuy, onEquip }: Props) {
  if (!item) return null;

  // Try it on: current outfit, with this item swapped into its slot
  const tryOn = { ...outfit, [item.slot]: item.image_key };

  const missing = item.price - coins;

  // Which button to show
  let label = '';
  let disabled = false;
  let action = () => {};

  if (item.equipped) {
    label = 'Kasutusel';
    disabled = true;
  } else if (item.owned) {
    label = 'Kasuta';
    action = () => onEquip(item);
  } else if (missing > 0) {
    label = `Vajad ${missing} krooni veel`;
    disabled = true;
  } else {
    label = 'Osta';
    action = () => onBuy(item);
  }

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        {/* Dark backdrop: tap outside to close */}
        <Pressable onPress={onClose} className="absolute inset-0 bg-black/40" />

        {/* The sheet */}
        <View className="bg-white rounded-t-3xl px-6 pt-3 pb-10 items-center">
          <View className="w-10 h-1 rounded-full bg-[#EBD5F7] mb-3" />

          {/* Close button */}
          <Pressable onPress={onClose} hitSlop={12} className="absolute top-4 right-5">
            <Text className="font-inter text-xl text-[#875BA1]">✕</Text>
          </Pressable>

          <Text className="font-inter font-bold text-2xl text-[#543666] mb-1">{item.name}</Text>
          {item.owned ? (
            <Text className="font-inter text-sm text-[#875BA1] mb-4">Olemas</Text>
          ) : (
            <View className="flex-row items-center gap-1 mb-4">
              <Image source={require('../assets/images/moneystack.png')} style={{ width: 20, height: 20 }} resizeMode="contain" />
              <Text className="font-pixel text-lg text-[#543666]">{item.price}</Text>
            </View>
          )}

          {/* Big character wearing it */}
          <View className="w-full items-center bg-[#F1D4FF] rounded-3xl py-6 mb-5">
            <Character equipped={tryOn} height={260} />
          </View>

          {/* Main button */}
          <Pressable
            onPress={action}
            disabled={disabled}
            className={`w-full h-14 rounded-2xl items-center justify-center ${
              disabled ? 'bg-[#EFE6F5]' : 'bg-[#543666]'
            }`}
          >
            <Text className={`font-inter font-semibold text-base ${disabled ? 'text-[#875BA1]' : 'text-white'}`}>
              {label}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
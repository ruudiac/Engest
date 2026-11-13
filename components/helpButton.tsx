import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function HelpButton({ titleEt, titleEn, text }: { titleEt: string; titleEn: string; text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={10}
        className="w-7 h-7 rounded-full bg-[#F6E9FF] border border-[#CF8DF5] items-center justify-center"
      >
        <Text className="font-inter font-bold text-sm text-[#7F39A6]">?</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View className="flex-1 items-center justify-center px-8">
          {/* Dark backdrop: tap to close */}
          <Pressable className="absolute inset-0 bg-black/40" onPress={() => setOpen(false)} />

          <View className="w-full bg-[#FBF5FF] rounded-3xl p-6 border border-[#E2BFF6]">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="font-inter font-bold text-xl text-[#543666]">{titleEt}</Text>
                <Text className="font-inter text-sm text-[#875BA1]">{titleEn}</Text>
              </View>
              <Pressable onPress={() => setOpen(false)} hitSlop={10} className="w-8 h-8 rounded-full bg-[#F1D4FF] items-center justify-center">
                <Ionicons name="close" size={18} color="#543666" />
              </Pressable>
            </View>
            <Text className="font-inter text-base text-[#543666] mt-4 leading-6">{text}</Text>
          </View>
        </View>
      </Modal>
    </>
  );
}
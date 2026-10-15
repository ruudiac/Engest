import React, { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// All 14 cases in order, with the question word learners use to recognize them
const CASES = [
  { key: 'nimetav', q: 'mis?' },
  { key: 'omastav', q: 'mille?' },
  { key: 'osastav', q: 'mida?' },
  { key: 'sisseütlev', q: 'millesse?' },
  { key: 'seesütlev', q: 'milles?' },
  { key: 'seestütlev', q: 'millest?' },
  { key: 'alaleütlev', q: 'millele?' },
  { key: 'alalütlev', q: 'millel?' },
  { key: 'alaltütlev', q: 'millelt?' },
  { key: 'saav', q: 'milleks?' },
  { key: 'rajav', q: 'milleni?' },
  { key: 'olev', q: 'millena?' },
  { key: 'ilmaütlev', q: 'milleta?' },
  { key: 'kaasaütlev', q: 'millega?' },
];

export default function CasesModal({ card, visible, onClose }: any) {
  const [expanded, setExpanded] = useState(false);

  // Words without case data: render nothing instead of crashing
  if (!card?.cases) return null;

  const shown = expanded ? CASES : CASES.slice(0, 6);

  const close = () => {
    setExpanded(false); // next time it opens collapsed again
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      {/* Backdrop: tapping the dark area closes */}
      <Pressable className="flex-1 justify-end bg-black/40" onPress={close}>
        {/* Sheet: a Pressable without onPress catches taps so they don't reach the backdrop */}
        <Pressable className="bg-[#FBF5FF] rounded-t-3xl px-6 pt-3 pb-10">
          {/* Grab handle */}
          <View className="self-center w-10 h-1 rounded-full bg-[#E2BFF6] mb-4" />

          {/* Header: word + translation, close button */}
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-3xl font-bold font-inter text-[#543666]">{card.word}</Text>
              <Text className="text-base font-inter text-[#875BA1]">{card.translation}</Text>
            </View>
            <Pressable
              onPress={close}
              hitSlop={10}
              className="w-10 h-10 rounded-full bg-[#F1D4FF] items-center justify-center"
            >
              <Ionicons name="close" size={20} color="#543666" />
            </Pressable>
          </View>

          {/* Grid: 3 columns, wraps into rows by itself */}
          <View className="flex-row flex-wrap -mx-1">
            {shown.map(({ key, q }) => (
              <View key={key} className="w-1/3 p-1">
                <View className="bg-white rounded-2xl p-3 border border-[#EBD5F7]">
                  <Text className="text-xs font-medium font-inter text-[#875BA1] capitalize">{key}</Text>
                  <Text className="text-[10px] font-inter text-[#B48FCB]">{q}</Text>
                  <Text
                    className="text-base font-bold font-inter text-[#543666] mt-1"
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {card.cases[key]}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Show all / show less */}
          <Pressable
            onPress={() => setExpanded(!expanded)}
            className="self-center mt-4 px-5 py-2 rounded-full bg-[#F6E9FF] flex-row items-center gap-2"
          >
            <Text className="text-sm font-semibold font-inter text-[#7F39A6]">
              {expanded ? 'Näita vähem' : 'Näita kõiki 14'}
            </Text>
            <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color="#7F39A6" />
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
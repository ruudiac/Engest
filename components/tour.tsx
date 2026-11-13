import { useState } from 'react';
import { Dimensions, Image, Modal, Pressable, Text, View } from 'react-native';

const { height: H } = Dimensions.get('window');
const PAD = 8;                       
const DIM = 'rgba(0,0,0,0.55)';      

export default function Tour({ steps, onDone }: any) {
  const [i, setI] = useState(0);
  const step = steps[i];
  const last = i === steps.length - 1;

  
  const r = step.rect
    ? { x: step.rect.x - PAD, y: step.rect.y - PAD, w: step.rect.width + PAD * 2, h: step.rect.height + PAD * 2 }
    : null;

  
  const inTopHalf = r ? r.y + r.h < H / 2 : false;
  const bubblePos = !r
    ? { top: H / 2 - 120 }
    : inTopHalf
      ? { top: r.y + r.h + 16 }
      : { bottom: H - r.y + 16 };

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      {r ? (
        <>
          {/* Four dark pieces around the spotlight: above, below, left, right */}
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: r.y, backgroundColor: DIM }} />
          <View style={{ position: 'absolute', left: 0, right: 0, top: r.y + r.h, bottom: 0, backgroundColor: DIM }} />
          <View style={{ position: 'absolute', left: 0, width: r.x, top: r.y, height: r.h, backgroundColor: DIM }} />
          <View style={{ position: 'absolute', left: r.x + r.w, right: 0, top: r.y, height: r.h, backgroundColor: DIM }} />
          {/* Bright frame around the spotlight */}
          <View style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 24, borderWidth: 3, borderColor: '#F3DEFF' }} />
        </>
      ) : (
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: DIM }} />
      )}

      {/* Speech bubble with the mascot */}
      <View
        style={{ position: 'absolute', left: 24, right: 24, ...bubblePos }}
        className="bg-[#FBF5FF] rounded-3xl p-5 border border-[#E2BFF6]"
      >
        <View className="flex-row items-center gap-3">
          <Image source={require('../assets/images/wavinglogo.png')} style={{ width: 48, height: 48 }} resizeMode="contain" />
          <View className="flex-1">
            <Text className="font-inter font-bold text-lg text-[#543666]">{step.titleEt}</Text>
            <Text className="font-inter text-sm text-[#875BA1]">{step.titleEn}</Text>
          </View>
          <Text className="font-inter text-xs text-[#B48FCB]">{i + 1}/{steps.length}</Text>
        </View>

        <Text className="font-inter text-base text-[#543666] mt-3 leading-6">{step.text}</Text>

        <View className="flex-row justify-between items-center mt-4">
          <Pressable onPress={onDone} hitSlop={10}>
            <Text className="font-inter text-sm text-[#875BA1]">Jäta vahele</Text>
          </Pressable>
          <Pressable onPress={() => (last ? onDone() : setI(i + 1))} className="bg-[#543666] rounded-xl px-5 py-2">
            <Text className="font-inter font-semibold text-white">{last ? 'Alustame!' : 'Edasi'}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
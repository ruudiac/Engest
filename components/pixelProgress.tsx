import { View } from 'react-native';

export default function PixelProgress({ total, done }: { total: number; done: number }) {
  return (
    <View className="flex-row border-2 border-[#543666] bg-[#F3DEFF] p-[3px] gap-[3px]">
      {Array.from({ length: Math.max(total, 1) }).map((_, i) => (
        <View
          key={i}
          className={`flex-1 h-3 ${i < done ? 'bg-[#7F39A6]' : 'bg-[#E2BFF6]'}`}
          style={i < done ? { borderTopWidth: 2, borderTopColor: '#B784D6' } : undefined}
        />
      ))}
    </View>
  );
}
import { Text, View } from 'react-native';

// Estonian on top, English small underneath.
// align: 'left' (default) or 'center'
export default function Bi({ et, en, size = 'title', align = 'left' }: {
  et: string;
  en: string;
  size?: 'title' | 'section';
  align?: 'left' | 'center';
}) {
  const center = align === 'center' ? 'text-center' : '';
  return (
    <View>
      <Text className={`font-inter font-bold text-[#543666] ${size === 'title' ? 'text-3xl' : 'text-lg'} ${center}`}>
        {et}
      </Text>
      <Text className={`font-inter text-[#875BA1] ${size === 'title' ? 'text-sm' : 'text-xs'} ${center}`}>
        {en}
      </Text>
    </View>
  );
}
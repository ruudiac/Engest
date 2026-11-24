import { Text } from 'react-native';

// Shows text with the **marked** words highlighted
export default function Highlight({ text, size = 'text-lg' }: { text: string; size?: string }) {
  return (
    <Text className={`font-inter ${size} text-[#543666] leading-6`}>
      {text.split('**').map((part, i) =>
        i % 2 === 1 ? (
          <Text key={i} className="font-bold text-[#7F39A6]">{part}</Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
}
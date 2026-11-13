import { useMemo, useState } from 'react'
import { Pressable, Text, View, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function MatchPairs({ words, onNext}:any){
  const pairs = useMemo(() => [...words].sort(() => Math.random() - 0.5).slice(0, 4), []);
  const left = useMemo(() =>[...pairs].sort(() =>Math.random() - 0.5), [pairs]);
  const right = useMemo(() =>[...pairs].sort(() =>Math.random() - 0.5), [pairs]);

  const [pickLeft, setPickLeft] = useState<any>(null);
  const [pickRight, setPickRight] = useState<any>(null);
  const [matched, setMatched] = useState<any[]>([]);
  const [wrong, setWrong] = useState(false);

  const check = (l: any, r: any) => {
    if (l === null || r === null) return;
    if (l === r) {
      setMatched((m) => [...m, l]);
      setPickLeft(null);
      setPickRight(null);
    } else {
      setWrong(true);
      setTimeout(() => {
        setWrong(false);
        setPickLeft(null);
        setPickRight(null);
      }, 600);
    }
  };

  const tapLeft = (id: any) => {
    if (wrong || matched.includes(id)) return;
    setPickLeft(id);
    check(id, pickRight);
  };

  const tapRight = (id: any) => {
    if (wrong || matched.includes(id)) return;
    setPickRight(id);
    check(pickLeft, id);
  };

  const boxColor = (id: any, picked: boolean) => {
    if (matched.includes(id)) return 'bg-[#E3F7D9] border-[#6BBF59] opacity-50';
    if (picked && wrong) return 'bg-[#FBE3EC] border-[#D9568A]';
    if (picked) return 'bg-[#543666] border-[#543666]';
    return 'bg-[#e4c6f5] border-[#8934ba]';
  };
  const textColor = (id: any, picked: boolean) =>
    picked && !wrong && !matched.includes(id) ? 'text-white' : 'text-[#543666]';

  const done = matched.length === pairs.length;

  return (
    <View className="flex-1">
      <Text className="text-center font-inter text-lg text-[#875BA1] mt-6 mb-4">Leia paarid</Text>

      <View className="flex-row gap-3">
        {/* Estonian */}
        <View className="flex-1 gap-3">
          {left.map((c: any) => (
            <Pressable
              key={c.id}
              onPress={() => tapLeft(c.id)}
              className={`h-16 rounded-2xl border-2 items-center justify-center px-2 ${boxColor(c.id, pickLeft === c.id)}`}
            >
              <Text numberOfLines={1} adjustsFontSizeToFit className={`font-inter font-bold text-lg ${textColor(c.id, pickLeft === c.id)}`}>
                {c.word}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* English */}
        <View className="flex-1 gap-3">
          {right.map((c: any) => (
            <Pressable
              key={c.id}
              onPress={() => tapRight(c.id)}
              className={`h-16 rounded-2xl border-2 items-center justify-center px-2 ${boxColor(c.id, pickRight === c.id)}`}
            >
              <Text numberOfLines={1} adjustsFontSizeToFit className={`font-inter font-bold text-lg ${textColor(c.id, pickRight === c.id)}`}>
                {c.translation}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {done && (
        <Pressable
          onPress={() => onNext(true)}
          className="h-14 mt-6 rounded-2xl flex-row items-center justify-center gap-2 bg-[#543666]"
        >
          <Text className="font-inter font-semibold text-lg text-white">Next</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </Pressable>
      )}
    </View>
  );

}
import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

// The six persons, with English pronouns (and "to be" forms for verbs like "be late")
export const PERSONS = [
  { key: 'ma',  en: 'I',         be: 'am',  third: false },
  { key: 'sa',  en: 'you',       be: 'are', third: false },
  { key: 'ta',  en: 'he/she',    be: 'is',  third: true },
  { key: 'me',  en: 'we',        be: 'are', third: false },
  { key: 'te',  en: 'you (all)', be: 'are', third: false },
  { key: 'nad', en: 'they',      be: 'are', third: false },
];

// "To fix/To improve" -> "fix"
export const baseVerb = (translation: string) =>
  translation.split('/')[0].trim().replace(/^to\s+/i, '').toLowerCase();

// he/she form: learn -> learns, finish -> finishes, apply -> applies, fill out -> fills out
const thirdPerson = (verb: string) => {
  const [first, ...rest] = verb.split(' ');
  let f = first;
  if (f === 'have') f = 'has';
  else if (/(s|sh|ch|x|z|o)$/.test(f)) f += 'es';
  else if (/[^aeiou]y$/.test(f)) f = f.slice(0, -1) + 'ies';
  else f += 's';
  return [f, ...rest].join(' ');
};

// "I learn", "he/she learns", "I am late"
export const english = (verb: string, p: (typeof PERSONS)[number]) => {
  if (verb === 'be' || verb.startsWith('be ')) return `${p.en} ${p.be}${verb.slice(2)}`;
  return `${p.en} ${p.third ? thirdPerson(verb) : verb}`;
};

export default function ConjugationsModal({ card, visible, onClose }: any) {
  if (!card?.conjugations) return null;

  const verb = baseVerb(card.translation);
  const isBe = verb === 'be' || verb.startsWith('be ');
  const negativeEn = isBe ? `am not / isn't / aren't${verb.slice(2)}` : `don't / doesn't ${verb}`;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        {/* Backdrop: tap to close */}
        <Pressable className="absolute inset-0 bg-black/40" onPress={onClose} />

        <View className="bg-[#FBF5FF] rounded-t-3xl px-6 pt-3 pb-10 max-h-[90%]">
          <View className="self-center w-10 h-1 rounded-full bg-[#E2BFF6] mb-4" />

          {/* Header: word, translation, close */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-1 pr-3">
              <Text className="text-3xl font-bold font-inter text-[#543666]">{card.word}</Text>
              <Text className="text-base font-inter text-[#875BA1]">{card.translation}</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10} className="w-10 h-10 rounded-full bg-[#F1D4FF] items-center justify-center">
              <Ionicons name="close" size={20} color="#543666" />
            </Pressable>
          </View>

          <Text className="font-inter text-sm text-[#875BA1] mb-4">
            Verbs change their ending to show <Text className="font-bold">who</Text> does it.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* One row per person */}
            {PERSONS.map((p) => (
              <View key={p.key} className="bg-white rounded-2xl border border-[#EBD5F7] px-4 py-3 mb-2 flex-row items-center">
                <Text className="font-inter font-bold text-base text-[#B48FCB] w-12">{p.key}</Text>
                <View className="flex-1">
                  <Text className="font-inter font-bold text-lg text-[#543666]">{card.conjugations[p.key]}</Text>
                  <Text className="font-inter text-xs text-[#875BA1]">{english(verb, p)}</Text>
                </View>
              </View>
            ))}

            {/* The negative: the same for everyone */}
            <View className="bg-[#F6E9FF] rounded-2xl border border-[#CF8DF5] px-4 py-3 mt-2">
              <Text className="font-inter text-xs font-bold text-[#7F39A6]">EITUS · NEGATIVE</Text>
              <Text className="font-inter font-bold text-lg text-[#543666] mt-1">{card.conjugations.eitus}</Text>
              <Text className="font-inter text-xs text-[#875BA1]">
                {negativeEn}, the same for every person
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
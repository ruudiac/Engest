import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  LayoutAnimation,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

// All 14 cases in order, with the question word learners use to recognize them
export const CASES = [
  {
    key: "nimetav",
    q: "kes/mis?",
    qEn: "who/what?",
    en: "the ___ (basic form)",
  },
  {
    key: "omastav",
    q: "kelle/mille?",
    qEn: "whose/of what?",
    en: "the ___'s, of the ___",
  },
  {
    key: "osastav",
    q: "keda/mida?",
    qEn: "whom/what?",
    en: "there is no ___",
  },
  {
    key: "sisseütlev",
    q: "kellesse/millesse?",
    qEn: "into whom/what?",
    en: "into the ___",
  },
  {
    key: "seesütlev",
    q: "kelles/milles?",
    qEn: "in whom/what?",
    en: "in the ___",
  },
  {
    key: "seestütlev",
    q: "kellest/millest?",
    qEn: "out of whom/what?",
    en: "out of the ___",
  },
  {
    key: "alaleütlev",
    q: "kellele/millele?",
    qEn: "to whom/onto what?",
    en: "onto the ___",
  },
  {
    key: "alalütlev",
    q: "kellel/millel?",
    qEn: "who has?/on what?",
    en: "on the ___",
  },
  {
    key: "alaltütlev",
    q: "kellelt/millelt?",
    qEn: "from whom/off what?",
    en: "off the ___",
  },
  {
    key: "saav",
    q: "kelleks/milleks?",
    qEn: "(turn) into whom/what?",
    en: "becomes ___",
  },
  {
    key: "rajav",
    q: "kelleni/milleni?",
    qEn: "up to whom/what?",
    en: "up to the ___",
  },
  { key: "olev", q: "kellena/millena?", qEn: "as whom/what?", en: "as ___" },
  {
    key: "ilmaütlev",
    q: "kelleta/milleta?",
    qEn: "without whom/what?",
    en: "without ___",
  },
  {
    key: "kaasaütlev",
    q: "kellega/millega?",
    qEn: "with whom/what?",
    en: "with ___",
  },
];

export default function CasesModal({ card, visible, onClose }: any) {
  const [expanded, setExpanded] = useState(false);

  const [openKey, setOpenKey] = useState<string | null>(null); // which cell is opened up

  // Open a cell (or close it if it's already open), with a smooth size animation
  const toggleCell = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenKey(openKey === key ? null : key);
  };

  // Words without case data: render nothing instead of crashing
  if (!card?.cases) return null;

  // "Workplace/Job" -> "workplace" for the small cells; the open cell shows the full translation
  const short = card.translation.split("/")[0].trim().toLowerCase();
  const full = card.translation.toLowerCase();

  const shown = expanded ? CASES : CASES.slice(0, 6);

  const close = () => {
    setExpanded(false);
    setOpenKey(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={close}
    >
      <View className="flex-1 justify-end">
        {/* Backdrop: its own layer behind the sheet, tapping it closes */}
        <Pressable className="absolute inset-0 bg-black/40" onPress={close} />

        {/* The sheet */}
        <View className="bg-[#FBF5FF] rounded-t-3xl px-6 pt-3 pb-10 max-h-[90%]">
          {/* Grab handle */}
          <View className="self-center w-10 h-1 rounded-full bg-[#E2BFF6] mb-4" />

          {/* Header: word + translation, close button */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1 pr-3">
              <Text className="text-3xl font-bold font-inter text-[#543666]">
                {card.word}
              </Text>
              <Text className="text-base font-inter text-[#875BA1]">
                {card.translation}
              </Text>
            </View>
            <Pressable
              onPress={close}
              hitSlop={10}
              className="w-10 h-10 rounded-full bg-[#F1D4FF] items-center justify-center"
            >
              <Ionicons name="close" size={20} color="#543666" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Grid: 3 columns; a tapped cell opens up to full width */}
            <View className="flex-row flex-wrap -mx-1">
              {shown.map(({ key, q, qEn, en }) => {
                const isOpen = openKey === key;
                const forms = String(card.cases[key] ?? "").split(" / "); // some cases have 2 correct forms

                return (
                  <Pressable
                    key={key}
                    onPress={() => toggleCell(key)}
                    className={`${isOpen ? "w-full" : "w-1/3"} p-1`}
                  >
                    {isOpen ? (
                      /* Opened: everything about this case */
                      <View className="bg-[#543666] rounded-2xl p-4">
                        <Text className="text-xs font-inter font-bold tracking-widest text-[#CF8DF5] uppercase">
                          {key}
                        </Text>
                        <Text className="text-2xl font-bold font-inter text-white mt-1">
                          {forms.join(" / ")}
                        </Text>
                        <Text className="text-base font-inter text-[#F3DEFF] mt-1">
                          {en.replaceAll("___", full)}
                        </Text>
                        <Text className="text-sm font-inter text-[#CF8DF5] mt-2">
                          {q} · {qEn}
                        </Text>
                        {forms.length > 1 && (
                          <Text className="text-xs font-inter text-[#CF8DF5] mt-2">
                            Both forms are correct.
                          </Text>
                        )}
                      </View>
                    ) : (
                      /* Small: just the form, a short meaning and the case name */
                      <View className="bg-white rounded-2xl p-3 border border-[#EBD5F7]">
                        <Text
                          className="text-base font-bold font-inter text-[#543666]"
                          numberOfLines={1}
                          adjustsFontSizeToFit
                        >
                          {forms[0]}
                        </Text>
                        <Text
                          className="text-xs font-inter text-[#875BA1] mt-1"
                          numberOfLines={2}
                        >
                          {en.replaceAll("___", short)}
                        </Text>
                        <Text
                          className="text-[10px] font-inter text-[#B48FCB] mt-1"
                          numberOfLines={1}
                        >
                          {key}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>

            {/* Show all / show less */}
            <Pressable
              onPress={() => setExpanded(!expanded)}
              className="self-center mt-4 px-5 py-2 rounded-full bg-[#F6E9FF] flex-row items-center gap-2"
            >
              <Text className="text-sm font-semibold font-inter text-[#7F39A6]">
                {expanded ? "Näita vähem" : "Näita kõiki 14"}
              </Text>
              <Ionicons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={14}
                color="#7F39A6"
              />
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

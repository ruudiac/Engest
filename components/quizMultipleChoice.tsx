import React, { useState, useMemo } from "react";
import { Pressable, Text, View, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { wordStyle, translationStyle, soundStyle } from './wordSize';
import { CASES } from './casesModal';
import { PERSONS, baseVerb, english } from './conjugationsModal';


const QUIZ_CASES = ['sisseütlev', 'seesütlev', 'seestütlev', 'alaleütlev', 'alalütlev', 'alaltütlev', 'ilmaütlev', 'kaasaütlev'];

export default function QuizMultipleChoice({ card, flashcards, onNext, speakWord, type = 'et-en', onWrong }: any) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const answerKey = type === 'et-en' ? 'translation' : 'word'
  const caseInfo = useMemo(() => {
    if (type !== 'case') return null
    const usable = CASES.filter((c) => QUIZ_CASES.includes(c.key) && card.cases?.[c.key])
    return usable[Math.floor(Math.random() * usable.length)]
  }, [card, type])

    // Pöörded quiz: one random person for this card (chosen once per card)
  const personInfo = useMemo(() => {
    if (type !== 'verb') return null
    return PERSONS[Math.floor(Math.random() * PERSONS.length)]
  }, [card, type])
    // Sentence quiz: one random sentence for this card (chosen once per card)
  const sentence = useMemo(() => {
    if (type !== 'sentence') return null
    return card.sentences[Math.floor(Math.random() * card.sentences.length)]
  }, [card, type])

  // Fits a form into the sentence: capital letter only if the gap starts the sentence
  const fit = (form: string) => {
    const f = form.toLowerCase()
    return sentence?.et.startsWith('___') ? f[0].toUpperCase() + f.slice(1) : f
  }
    const answer =
    type === 'case' ? card.cases[caseInfo!.key]
    : type === 'verb' ? card.conjugations[personInfo!.key]
    : type === 'sentence' ? fit(card.cases[sentence!.case_key])
    : card[answerKey]

  const options = useMemo(() => {

        // Case/verb quiz: other forms of the same word. Otherwise: answers from other cards.
     const pool =
      type === 'case' ? Object.values(card.cases)
      : type === 'verb' ? PERSONS.map((p) => card.conjugations[p.key])
      : type === 'sentence' ? QUIZ_CASES.map((k) => card.cases[k]).filter(Boolean).map(fit)
      : flashcards.map((f: any) => f[answerKey])

    const others = [...new Set(pool)]
      .filter((v) => v !== answer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)

    return [...others, answer].sort(() => Math.random() - 0.5)
  }, [card, type])

  const isCorrect = selectedAnswer === answer
  const showReveal = selectedAnswer !== null && !isCorrect

  // After a miss: show the right form (case/verb questions) or the word (the others)
    const revealWord =
    type === 'case' ? answer
    : type === 'verb' ? `${personInfo!.key} ${answer}`
    : type === 'sentence' ? sentence!.et.replace('___', answer)
    : card.word
  const revealMeaning =
    type === 'case' ? `"${caseInfo!.en.replaceAll('___', card.translation.split('/')[0].trim().toLowerCase())}"`
    : type === 'verb' ? english(baseVerb(card.translation), personInfo!)
    : type === 'sentence' ? sentence!.en
    : card.translation

  const cardStyle = {
    shadowColor: '#9B59B6',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  }


  const getState = (option: string) => {
    if (!selectedAnswer) return 'idle'
    if (option === answer) return 'correct'          
    if (option === selectedAnswer) return 'wrong'              
    return 'dim'                                               
  }

  const styles: any = {
    idle:    { box: 'bg-[#e4c6f5] border-[#8934ba]', text: 'text-[#8934ba]' },
    correct: { box: 'bg-[#E3F7D9] border-[#6BBF59]', text: 'text-[#2F6B22]' },
    wrong:   { box: 'bg-[#FBE3EC] border-[#D9568A]', text: 'text-[#8A2350]' },
    dim:     { box: 'bg-[#FBF5FF] border-[#EBD5F7] opacity-40', text: 'text-[#543666]' },
  }

  return (
    <View className='flex-1'>

          <View className='bg-[#E2BFF6] rounded-3xl mt-4 items-center justify-center mb-5 px-6 flex-1' style={cardStyle}>
          {showReveal ? (
          <>
            <Text className="font-inter text-sm text-[#875BA1] mb-2">Vaatame veel kord · Let's look again</Text>
            {card.image && (
              <Image source={card.image} style={{ width: 100, height: 100 }} resizeMode="contain" />
            )}
            <Text allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit className="font-bold text-[#543666] font-inter text-center" style={wordStyle(revealWord)}>
              {revealWord}
            </Text>
                        <Text className="font-inter text-xl text-[#875BA1] mt-1">{revealMeaning}</Text>
            {(type === 'case' || type === 'sentence') && (
              <Text className="font-inter text-xs text-[#B48FCB] mt-1">{caseInfo?.key ?? sentence?.case_key}</Text>
            )}
            {card.has_audio && (
              <Pressable onPress={speakWord} className="absolute top-4 left-4 w-12 h-12 rounded-full bg-[#F6E9FF] items-center justify-center z-10">
                <Ionicons name="volume-high" size={24} color="#7F39A6" />
              </Pressable>
            )}
          </>
        ) : (
          <>

            {type === 'et-en' && (
                <Text allowFontScaling={false} className="font-bold text-[#543666] font-inter text-center" style={wordStyle(card.word)}>{card.word}</Text>
            )}
            {type === 'en-et' && (
              <Text allowFontScaling={false} className="font-bold text-[#543666] font-inter text-center" style={wordStyle(card.translation)}>{card.translation}</Text>
            )}
            {type === 'picture' && (
              <Image source={card.image} style={{ width: 220, height: 220 }} resizeMode="contain" />
            )}
            {(type === 'et-en' || type === 'listen') && card.has_audio && (
              <Pressable onPress={speakWord} className={`${type === 'listen' ? 'w-24 h-24' : 'mt-4 w-12 h-12'} rounded-full bg-[#F6E9FF] items-center justify-center`}>
                <Ionicons name="volume-high" size={type === 'listen' ? 48 : 24} color="#7F39A6" />
              </Pressable>
            )}
                          {type === 'case' && (
              <>
                <Text className="font-inter text-base text-[#875BA1] text-center">
                  Which form of{' '}
                  <Text className="font-bold text-[#543666]">{card.word.toLowerCase()}</Text>
                  {' '}means…
                </Text>
                <Text className="font-bold text-3xl text-[#543666] font-inter text-center mt-3">
                  "{caseInfo!.en.replaceAll('___', card.translation.split('/')[0].trim().toLowerCase())}"
                </Text>
                <Text className="font-inter text-xs text-[#B48FCB] text-center mt-4">
                  {caseInfo!.key} · {caseInfo!.q} ({caseInfo!.qEn})
                </Text>
              </>
            )}
            {type === 'verb' && (
              <>
                <Text className="font-inter text-base text-[#875BA1] text-center">Which form fits?</Text>
                <Text className="font-bold text-4xl text-[#543666] font-inter text-center mt-3">
                  {personInfo!.key} ___
                </Text>
                <Text className="font-inter text-sm text-[#875BA1] text-center mt-3">
                  {card.word.toLowerCase()} · {english(baseVerb(card.translation), personInfo!)}
                </Text>
              </>
            )}
             {type === 'sentence' && (
              <>
                <Text className="font-inter text-base text-[#875BA1] text-center">Fill in the gap</Text>
                <Text className="font-bold text-3xl text-[#543666] font-inter text-center mt-3">
                  {sentence!.et}
                </Text>
                <Text className="font-inter text-sm text-[#875BA1] text-center mt-3">
                  ({card.word.toLowerCase()}) · {sentence!.en}
                </Text>
              </>
            )}
          </>
        )}
      </View>

      {/* Answer options */}
      <View className='gap-3'>
        {options.map((option: string) => {
          const state = getState(option)
          return (
            <Pressable
              key={option}
                 onPress={() => {
                setSelectedAnswer(option)
                if (option !== answer) {
                  if (card.has_audio) speakWord()
                  onWrong?.()
                }
              }}
              disabled={selectedAnswer !== null}
              className={`h-16 rounded-2xl border-2 px-5 flex-row items-center justify-center ${styles[state].box}`}
            >
              <Text className={`font-inter font-bold text-xl ${styles[state].text}`}>{option}</Text>
              {state === 'correct' && <Ionicons name="checkmark-circle" size={26} color="#6BBF59" />}
              {state === 'wrong' && <Ionicons name="close-circle" size={26} color="#D9568A" />}
            </Pressable>
          )
        })}
      </View>

      <Pressable
        onPress={() => {
          setSelectedAnswer(null)
         onNext(isCorrect, caseInfo?.key ?? personInfo?.key ?? sentence?.case_key)
        }}
        disabled={!selectedAnswer}
        className='h-14 mt-5 mb-2 rounded-2xl flex-row items-center justify-center gap-2 bg-[#543666]'
        style={{
          opacity: selectedAnswer ? 1 : 0,
          shadowColor: '#543666', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
        }}
      >
        <Text className='font-inter font-semibold text-lg text-white'>Next</Text>
        <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
      </Pressable>
    </View>
  )
}
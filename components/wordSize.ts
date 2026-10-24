export function wordStyle(word: string) {
  const len = word.length
  if (len <= 7)  return { fontSize: 60, lineHeight: 80 }
  if (len <= 12) return { fontSize: 40, lineHeight: 54 }
  if (len <= 20) return { fontSize: 32, lineHeight: 44 }
  return { fontSize: 26, lineHeight: 36 }
}

export function translationStyle(text: string) {
  return text.length > 14 ? { fontSize: 22, lineHeight: 30 } : { fontSize: 34, lineHeight: 46 }
}

export function soundStyle(sound: string) {
  return sound.length <= 3 ? { fontSize: 44, lineHeight: 56 } : { fontSize: 26, lineHeight: 36 }
}
// The audio file name for a sentence. MUST match audioSlug() in scripts/generate-grammar-audio.mjs
export const audioSlug = (text: string) =>
  text
    .replace(/\*\*/g, '')
    .toLowerCase()
    .replace(/õ/g, 'o').replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u')
    .replace(/š/g, 's').replace(/ž/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
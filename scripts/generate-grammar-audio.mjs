// Makes an mp3 for every example sentence in lib/grammar.ts with ElevenLabs
// and uploads it to Supabase Storage (audio/grammar/<slug>.mp3).
// Run from the project root:
//   node --env-file=.env.local scripts/generate-grammar-audio.mjs
// Options:
//   --force    overwrite mp3s that already exist
// Sentences that already have an mp3 are skipped, so it's safe to run again after adding examples.

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const force = process.argv.includes('--force')

// Same voice and settings as the card audio (scripts/generate-audio.mjs)
const VOICE_ID = 'kWXj353oWuglsljFXgLz'
const MODEL_ID = 'eleven_v4'
const SPEED = 1.0 // a bit slower than single words: these are whole sentences
const BUCKET = 'audio'

const { EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, ELEVENLABS_API_KEY } = process.env
if (!EXPO_PUBLIC_SUPABASE_URL || !SUPABASE_SECRET_KEY || !ELEVENLABS_API_KEY) {
  console.error('Missing keys. Check that .env.local has EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY and ELEVENLABS_API_KEY.')
  process.exit(1)
}
const supabase = createClient(EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY)

// The file name for a sentence. MUST match audioSlug() in lib/audioSlug.ts
const audioSlug = (text) =>
  text
    .replace(/\*\*/g, '')
    .toLowerCase()
    .replace(/õ/g, 'o').replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u')
    .replace(/š/g, 's').replace(/ž/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

// 1. Find every  et: '...'  in lib/grammar.ts (the Estonian example sentences)
const source = readFileSync('lib/grammar.ts', 'utf8')
const sentences = [...source.matchAll(/et:\s*'((?:[^'\\]|\\.)*)'/g)]
  .map((m) => m[1].replace(/\\'/g, "'"))
const unique = [...new Set(sentences)]
console.log(`Found ${unique.length} example sentences.`)

// 2. Which mp3s exist already?
const { data: existing } = await supabase.storage.from(BUCKET).list('grammar', { limit: 1000 })
const done = new Set((existing ?? []).map((f) => f.name))

let made = 0, skipped = 0, failed = 0
for (const sentence of unique) {
  const text = sentence.replace(/\*\*/g, '') // read without the ** markers
  const file = `${audioSlug(sentence)}.mp3`
  if (done.has(file) && !force) { skipped++; continue }

  // 3. Ask ElevenLabs for the audio
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: { 'xi-api-key': ELEVENLABS_API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text, model_id: MODEL_ID, voice_settings: { speed: SPEED } }),
    }
  )
  if (!res.ok) {
    failed++
    console.log(`✗ "${text}": ElevenLabs ${res.status} ${await res.text()}`)
    if (res.status === 401 || res.status === 402) break // bad key or out of credits: stop
    continue
  }
  const audio = Buffer.from(await res.arrayBuffer())

  // 4. Upload it
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(`grammar/${file}`, audio, { contentType: 'audio/mpeg', upsert: true, cacheControl: '60' })
  if (error) { failed++; console.log(`✗ "${text}": upload ${error.message}`); continue }

  made++
  console.log(`✓ ${file}  "${text}"`)
  await new Promise((r) => setTimeout(r, 300)) // be gentle with the API
}

console.log(`\nDone: ${made} made, ${skipped} already existed, ${failed} failed (of ${unique.length}).`)

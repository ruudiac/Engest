// Makes an mp3 for every card with ElevenLabs and uploads it to Supabase Storage.
// Run from the project root:
//   node --env-file=.env.local scripts/generate-audio.mjs 1_1          ← only module 1, lesson 1
//   node --env-file=.env.local scripts/generate-audio.mjs              ← all cards
// Testing options (combine freely):
//   --id=3              only card 3
//   --model=eleven_v3   try another model
//   --speed=1.1         speak faster/slower (0.7–1.2)
//   --text="Nina."      say this text instead of the word (e.g. to test spelling tricks)
//   --force             overwrite an mp3 that already exists
// Cards that already have an mp3 are skipped (unless --force), so it's safe to run again.

import { createClient } from '@supabase/supabase-js'
import { mkdirSync, writeFileSync } from 'node:fs'

// Flags like --id=3 --model=eleven_v3 --force
const flags = Object.fromEntries(
  process.argv.slice(2).filter(a => a.startsWith('--')).map(a => {
    const [k, ...v] = a.slice(2).split('=')
    return [k, v.length ? v.join('=') : true]
  })
)

const VOICE_ID = 'kWXj353oWuglsljFXgLz'
const MODEL_ID = flags.model || 'eleven_v4'
const SPEED = flags.speed ? Number(flags.speed) : 1.15
const BUCKET = 'audio'

const { EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, ELEVENLABS_API_KEY } = process.env
if (!EXPO_PUBLIC_SUPABASE_URL || !SUPABASE_SECRET_KEY || !ELEVENLABS_API_KEY) {
  console.error('Missing keys. Check that .env.local has EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY and ELEVENLABS_API_KEY.')
  process.exit(1)
}

const supabase = createClient(EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY)
const only = process.argv.slice(2).find(a => !a.startsWith('--')) // e.g. "1_1"

// 1. All cards, with the module and lesson they belong to
const { data: cards, error } = await supabase
  .from('cards')
  .select('id, word, lessons(module_id, lesson_number)')
  .order('id')
if (error) { console.error('Could not read cards:', error.message); process.exit(1) }

const todo = cards.filter(c =>
  (!only || `${c.lessons.module_id}_${c.lessons.lesson_number}` === only) &&
  (!flags.id || String(c.id) === String(flags.id))
)

// 2. Which mp3s exist already?
const { data: existing } = await supabase.storage.from(BUCKET).list('cards', { limit: 1000 })
const done = new Set((existing ?? []).map(f => f.name))

let made = 0, skipped = 0, failed = 0
for (const card of todo) {
  const file = `${card.id}.mp3`
  if (done.has(file) && !flags.force) { skipped++; continue }

  // 3. Ask ElevenLabs for the audio
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: { 'xi-api-key': ELEVENLABS_API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({
        text: flags.text || card.word,
        model_id: MODEL_ID,
        ...(SPEED ? { voice_settings: { speed: SPEED } } : {}),
      }),
    }
  )
  if (!res.ok) {
    failed++
    console.log(`✗ ${card.id} "${card.word}": ElevenLabs ${res.status} ${await res.text()}`)
    if (res.status === 401 || res.status === 402) break // bad key or out of credits: stop
    continue
  }
  const audio = Buffer.from(await res.arrayBuffer())

  // When testing a single card, also save a local copy named after the settings
  if (flags.id) {
    mkdirSync('scripts/test-audio', { recursive: true })
    const label = flags.text ? String(flags.text).replace(/[^\p{L}\p{N}]+/gu, '-') : card.word
    const local = `scripts/test-audio/${card.id}_${label}_${MODEL_ID}_speed-${SPEED ?? 1}.mp3`
    writeFileSync(local, audio)
    console.log(`  saved local copy: ${local}`)
  }

  // 4. Upload it to Supabase Storage
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(`cards/${file}`, audio, { contentType: 'audio/mpeg', upsert: true, cacheControl: '60' })
  if (upErr) { failed++; console.log(`✗ ${card.id} "${card.word}": upload ${upErr.message}`); continue }

  made++
  console.log(`✓ ${card.id} "${flags.text || card.word}" (${MODEL_ID}${SPEED ? `, speed ${SPEED}` : ''})`)
  await new Promise(r => setTimeout(r, 300)) // be gentle with the API
}

console.log(`\nDone: ${made} made, ${skipped} already existed, ${failed} failed (of ${todo.length}).`)

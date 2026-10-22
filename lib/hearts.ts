import { supabase } from './supabase';

export const MAX_HEARTS = 3
const REFILL_MS = 30 * 60 * 1000 // 30 MIN

export function currentHearts (hearts: number, updatedAt: string){
  const start = new Date(updatedAt).getTime()
  const elapsed = Date.now() - start
  const refills = Math.floor(elapsed / REFILL_MS)
  const now = Math.min(MAX_HEARTS, hearts + refills)
  return {
    hearts: now,
    clockStart: start + refills * REFILL_MS,
    nextInMs: now >= MAX_HEARTS ? 0 : REFILL_MS - (elapsed % REFILL_MS),
  }
}

export async function loseHeart(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return MAX_HEARTS

  const { data: p } = await supabase
    .from('profiles')
    .select('hearts, hearts_updated_at, is_admin')
    .eq('id', user.id)
    .single()
  if (!p || p.is_admin) return MAX_HEARTS

  const { hearts, clockStart } = currentHearts(p.hearts, p.hearts_updated_at)
  const newHearts = Math.max(0, hearts - 1)

  await supabase
    .from('profiles')
    .update({
      hearts: newHearts,
   
      hearts_updated_at: new Date(hearts >= MAX_HEARTS ? Date.now() : clockStart).toISOString(),
    })
    .eq('id', user.id)

  return newHearts
}
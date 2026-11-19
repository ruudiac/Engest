import { supabase } from './supabase';

// The user's hardest words, as card ids (hardest first).
// Each first-try miss counts +2, each first-try correct answer −1,
// so a word leaves the list once it's been answered right a couple of times.
export async function getHardWords(limit = 10): Promise<number[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('answers')
    .select('card_id, correct')
    .eq('user_id', user.id)
    .eq('is_retry', false);

  const score: Record<number, number> = {};
  for (const r of data ?? []) {
    score[r.card_id] = (score[r.card_id] ?? 0) + (r.correct ? -1 : 2);
  }

  return Object.entries(score)
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => Number(id));
}
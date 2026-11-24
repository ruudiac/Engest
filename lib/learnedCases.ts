import { supabase } from './supabase';

// The cases this user has learned: the case_keys of every grammar lesson they've finished.
export async function getLearnedCases(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Both questions at the same time
  const [{ data: done }, { data: grammar }] = await Promise.all([
    supabase.from('progress').select('module_id, lesson_number').eq('user_id', user.id),
    supabase.from('lessons').select('module_id, lesson_number, case_keys').eq('kind', 'grammar'),
  ]);

  const finished = new Set((done ?? []).map((d) => `${d.module_id}_${d.lesson_number}`));

  return (grammar ?? [])
    .filter((g) => finished.has(`${g.module_id}_${g.lesson_number}`))
    .flatMap((g) => g.case_keys ?? []);
}
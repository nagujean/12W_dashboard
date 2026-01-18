import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// 사이클의 모든 목표 조회
export async function getGoals(supabase: SupabaseClient<Database>, cycleId: string) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('cycle_id', cycleId)
    .order('created_at', { ascending: true });

  return { data, error };
}

// 목표 생성
export async function createGoal(
  supabase: SupabaseClient<Database>,
  goal: {
    cycle_id: string;
    title: string;
    description?: string;
    target_date?: string | null;
    progress?: number;
  }
) {
  const { data, error } = await supabase
    .from('goals')
    .insert({
      cycle_id: goal.cycle_id,
      title: goal.title,
      description: goal.description ?? '',
      target_date: goal.target_date ?? null,
      progress: goal.progress ?? 0,
    })
    .select()
    .single();

  return { data, error };
}

// 목표 업데이트
export async function updateGoal(
  supabase: SupabaseClient<Database>,
  goalId: string,
  updates: {
    title?: string;
    description?: string;
    target_date?: string | null;
    progress?: number;
  }
) {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', goalId)
    .select()
    .single();

  return { data, error };
}

// 목표 삭제
export async function deleteGoal(supabase: SupabaseClient<Database>, goalId: string) {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId);

  return { error };
}

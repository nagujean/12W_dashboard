import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// 사이클의 모든 습관 조회 (완료 기록 포함)
export async function getHabits(supabase: SupabaseClient<Database>, cycleId: string) {
  const { data, error } = await supabase
    .from('habits')
    .select(`
      *,
      habit_completions (*)
    `)
    .eq('cycle_id', cycleId)
    .order('created_at', { ascending: true });

  return { data, error };
}

// 습관 생성
export async function createHabit(
  supabase: SupabaseClient<Database>,
  habit: {
    cycle_id: string;
    name: string;
    target_days_per_week?: number;
  }
) {
  const { data, error } = await supabase
    .from('habits')
    .insert({
      cycle_id: habit.cycle_id,
      name: habit.name,
      target_days_per_week: habit.target_days_per_week ?? 7,
    })
    .select()
    .single();

  return { data, error };
}

// 습관 업데이트
export async function updateHabit(
  supabase: SupabaseClient<Database>,
  habitId: string,
  updates: {
    name?: string;
    target_days_per_week?: number;
  }
) {
  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', habitId)
    .select()
    .single();

  return { data, error };
}

// 습관 삭제
export async function deleteHabit(supabase: SupabaseClient<Database>, habitId: string) {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId);

  return { error };
}

// 습관 완료 기록 추가
export async function addHabitCompletion(
  supabase: SupabaseClient<Database>,
  habitId: string,
  completedDate: string
) {
  const { data, error } = await supabase
    .from('habit_completions')
    .insert({
      habit_id: habitId,
      completed_date: completedDate,
    })
    .select()
    .single();

  return { data, error };
}

// 습관 완료 기록 삭제
export async function removeHabitCompletion(
  supabase: SupabaseClient<Database>,
  habitId: string,
  completedDate: string
) {
  const { error } = await supabase
    .from('habit_completions')
    .delete()
    .eq('habit_id', habitId)
    .eq('completed_date', completedDate);

  return { error };
}

// 습관 완료 토글
export async function toggleHabitCompletion(
  supabase: SupabaseClient<Database>,
  habitId: string,
  date: string,
  isCompleted: boolean
) {
  if (isCompleted) {
    return removeHabitCompletion(supabase, habitId, date);
  } else {
    return addHabitCompletion(supabase, habitId, date);
  }
}

import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// 사이클의 모든 일일 행동 조회
export async function getDailyActions(supabase: SupabaseClient<Database>, cycleId: string) {
  const { data, error } = await supabase
    .from('daily_actions')
    .select('*')
    .eq('cycle_id', cycleId)
    .order('date', { ascending: false });

  return { data, error };
}

// 특정 날짜의 일일 행동 조회
export async function getDailyActionsByDate(
  supabase: SupabaseClient<Database>,
  cycleId: string,
  date: string
) {
  const { data, error } = await supabase
    .from('daily_actions')
    .select('*')
    .eq('cycle_id', cycleId)
    .eq('date', date)
    .order('priority', { ascending: true });

  return { data, error };
}

// 일일 행동 생성
export async function createDailyAction(
  supabase: SupabaseClient<Database>,
  action: {
    cycle_id: string;
    title: string;
    completed?: boolean;
    date: string;
    priority?: 'high' | 'medium' | 'low';
  }
) {
  const { data, error } = await supabase
    .from('daily_actions')
    .insert({
      cycle_id: action.cycle_id,
      title: action.title,
      completed: action.completed ?? false,
      date: action.date,
      priority: action.priority ?? 'medium',
    })
    .select()
    .single();

  return { data, error };
}

// 일일 행동 업데이트
export async function updateDailyAction(
  supabase: SupabaseClient<Database>,
  actionId: string,
  updates: {
    title?: string;
    completed?: boolean;
    date?: string;
    priority?: 'high' | 'medium' | 'low';
  }
) {
  const { data, error } = await supabase
    .from('daily_actions')
    .update(updates)
    .eq('id', actionId)
    .select()
    .single();

  return { data, error };
}

// 일일 행동 삭제
export async function deleteDailyAction(supabase: SupabaseClient<Database>, actionId: string) {
  const { error } = await supabase
    .from('daily_actions')
    .delete()
    .eq('id', actionId);

  return { error };
}

// 일일 행동 완료 토글
export async function toggleDailyAction(
  supabase: SupabaseClient<Database>,
  actionId: string,
  completed: boolean
) {
  const { data, error } = await supabase
    .from('daily_actions')
    .update({ completed })
    .eq('id', actionId)
    .select()
    .single();

  return { data, error };
}

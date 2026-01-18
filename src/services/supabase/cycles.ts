import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// 모든 사이클 조회 (관련 데이터 포함)
export async function getCycles(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from('cycles')
    .select(`
      *,
      goals (*),
      weekly_tasks (*),
      daily_actions (*),
      habits (
        *,
        habit_completions (*)
      ),
      weekly_scores (
        *,
        lead_indicators (*)
      )
    `)
    .order('created_at', { ascending: false });

  return { data, error };
}

// 단일 사이클 조회
export async function getCycle(supabase: SupabaseClient<Database>, cycleId: string) {
  const { data, error } = await supabase
    .from('cycles')
    .select(`
      *,
      goals (*),
      weekly_tasks (*),
      daily_actions (*),
      habits (
        *,
        habit_completions (*)
      ),
      weekly_scores (
        *,
        lead_indicators (*)
      )
    `)
    .eq('id', cycleId)
    .single();

  return { data, error };
}

// 사이클 생성
export async function createCycle(
  supabase: SupabaseClient<Database>,
  cycle: {
    user_id: string;
    name: string;
    start_date: string;
    end_date: string;
    vision: string;
    current_week?: number;
    status?: 'active' | 'completed' | 'archived';
  }
) {
  const { data, error } = await supabase
    .from('cycles')
    .insert({
      user_id: cycle.user_id,
      name: cycle.name,
      start_date: cycle.start_date,
      end_date: cycle.end_date,
      vision: cycle.vision,
      current_week: cycle.current_week ?? 1,
      status: cycle.status ?? 'active',
    })
    .select()
    .single();

  return { data, error };
}

// 사이클 업데이트
export async function updateCycle(
  supabase: SupabaseClient<Database>,
  cycleId: string,
  updates: {
    name?: string;
    vision?: string;
    current_week?: number;
    status?: 'active' | 'completed' | 'archived';
  }
) {
  const { data, error } = await supabase
    .from('cycles')
    .update(updates)
    .eq('id', cycleId)
    .select()
    .single();

  return { data, error };
}

// 사이클 삭제
export async function deleteCycle(supabase: SupabaseClient<Database>, cycleId: string) {
  const { error } = await supabase
    .from('cycles')
    .delete()
    .eq('id', cycleId);

  return { error };
}

// 활성 사이클 목록 조회
export async function getActiveCycles(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from('cycles')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return { data, error };
}

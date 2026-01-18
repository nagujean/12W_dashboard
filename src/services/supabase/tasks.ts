import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// 사이클의 모든 주간 과제 조회
export async function getWeeklyTasks(supabase: SupabaseClient<Database>, cycleId: string) {
  const { data, error } = await supabase
    .from('weekly_tasks')
    .select('*')
    .eq('cycle_id', cycleId)
    .order('created_at', { ascending: true });

  return { data, error };
}

// 주간 과제 생성
export async function createWeeklyTask(
  supabase: SupabaseClient<Database>,
  task: {
    cycle_id: string;
    title: string;
    completed?: boolean;
    due_date?: string | null;
    goal_id?: string | null;
  }
) {
  const { data, error } = await supabase
    .from('weekly_tasks')
    .insert({
      cycle_id: task.cycle_id,
      title: task.title,
      completed: task.completed ?? false,
      due_date: task.due_date ?? null,
      goal_id: task.goal_id ?? null,
    })
    .select()
    .single();

  return { data, error };
}

// 주간 과제 업데이트
export async function updateWeeklyTask(
  supabase: SupabaseClient<Database>,
  taskId: string,
  updates: {
    title?: string;
    completed?: boolean;
    due_date?: string | null;
    goal_id?: string | null;
  }
) {
  const { data, error } = await supabase
    .from('weekly_tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();

  return { data, error };
}

// 주간 과제 삭제
export async function deleteWeeklyTask(supabase: SupabaseClient<Database>, taskId: string) {
  const { error } = await supabase
    .from('weekly_tasks')
    .delete()
    .eq('id', taskId);

  return { error };
}

// 과제 완료 토글
export async function toggleWeeklyTask(
  supabase: SupabaseClient<Database>,
  taskId: string,
  completed: boolean
) {
  const { data, error } = await supabase
    .from('weekly_tasks')
    .update({ completed })
    .eq('id', taskId)
    .select()
    .single();

  return { data, error };
}

import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// 사이클의 모든 주간 점수 조회 (선행 지표 포함)
export async function getWeeklyScores(supabase: SupabaseClient<Database>, cycleId: string) {
  const { data, error } = await supabase
    .from('weekly_scores')
    .select(`
      *,
      lead_indicators (*)
    `)
    .eq('cycle_id', cycleId)
    .order('week_number', { ascending: true });

  return { data, error };
}

// 특정 주차의 점수 조회
export async function getWeeklyScore(
  supabase: SupabaseClient<Database>,
  cycleId: string,
  weekNumber: number
) {
  const { data, error } = await supabase
    .from('weekly_scores')
    .select(`
      *,
      lead_indicators (*)
    `)
    .eq('cycle_id', cycleId)
    .eq('week_number', weekNumber)
    .single();

  return { data, error };
}

// 주간 점수 생성 또는 업데이트 (upsert)
export async function upsertWeeklyScore(
  supabase: SupabaseClient<Database>,
  score: {
    cycle_id: string;
    week_number: number;
    planned_tasks?: number;
    completed_tasks?: number;
    execution_rate?: number;
  }
) {
  const { data, error } = await supabase
    .from('weekly_scores')
    .upsert({
      cycle_id: score.cycle_id,
      week_number: score.week_number,
      planned_tasks: score.planned_tasks ?? 0,
      completed_tasks: score.completed_tasks ?? 0,
      execution_rate: score.execution_rate ?? 0,
    }, {
      onConflict: 'cycle_id,week_number',
    })
    .select()
    .single();

  return { data, error };
}

// 주간 점수 업데이트
export async function updateWeeklyScore(
  supabase: SupabaseClient<Database>,
  scoreId: string,
  updates: {
    planned_tasks?: number;
    completed_tasks?: number;
    execution_rate?: number;
  }
) {
  const { data, error } = await supabase
    .from('weekly_scores')
    .update(updates)
    .eq('id', scoreId)
    .select()
    .single();

  return { data, error };
}

// 선행 지표 생성
export async function createLeadIndicator(
  supabase: SupabaseClient<Database>,
  indicator: {
    weekly_score_id: string;
    name: string;
    target?: number;
    actual?: number;
    unit?: string;
  }
) {
  const { data, error } = await supabase
    .from('lead_indicators')
    .insert({
      weekly_score_id: indicator.weekly_score_id,
      name: indicator.name,
      target: indicator.target ?? 0,
      actual: indicator.actual ?? 0,
      unit: indicator.unit ?? '',
    })
    .select()
    .single();

  return { data, error };
}

// 선행 지표 업데이트
export async function updateLeadIndicator(
  supabase: SupabaseClient<Database>,
  indicatorId: string,
  updates: {
    name?: string;
    target?: number;
    actual?: number;
    unit?: string;
  }
) {
  const { data, error } = await supabase
    .from('lead_indicators')
    .update(updates)
    .eq('id', indicatorId)
    .select()
    .single();

  return { data, error };
}

// 선행 지표 삭제
export async function deleteLeadIndicator(supabase: SupabaseClient<Database>, indicatorId: string) {
  const { error } = await supabase
    .from('lead_indicators')
    .delete()
    .eq('id', indicatorId);

  return { error };
}

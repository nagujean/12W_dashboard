// 12주 법칙 관련 타입 정의

// Re-export User type from Supabase
export type { User } from '@supabase/supabase-js';

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
}

export interface WeeklyTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  goalId: string;
}

export interface DailyAction {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Habit {
  id: string;
  name: string;
  completedDates: string[];
  targetDaysPerWeek: number;
}

export interface WeeklyScore {
  weekNumber: number;
  plannedTasks: number;
  completedTasks: number;
  executionRate: number;
  leadIndicators: LeadIndicator[];
}

export interface LeadIndicator {
  id: string;
  name: string;
  target: number;
  actual: number;
  unit: string;
}

// 각 사이클이 자체 데이터를 포함하도록 확장
export interface TwelveWeekCycle {
  id: string;
  name: string; // 사이클 이름 (예: "2026 Q1", "건강 프로젝트")
  startDate: string;
  endDate: string;
  vision: string;
  goals: Goal[];
  currentWeek: number;
  weeklyScores: WeeklyScore[];
  weeklyTasks: WeeklyTask[];
  dailyActions: DailyAction[];
  habits: Habit[];
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
}

// 가이드 정보 타입
export interface GuideInfo {
  title: string;
  description: string;
  tip: string;
}

export const SECTION_GUIDES: Record<string, GuideInfo> = {
  vision: {
    title: '12주 비전 & 목표',
    description: '연간 목표의 함정을 피하세요. 12주를 1년처럼 긴박하게! 비전을 감정적으로 연결된 구체적 목표로 전환하세요.',
    tip: '1~3개의 핵심 목표만 설정하세요. 너무 많으면 집중력이 분산됩니다.'
  },
  weeklyPlan: {
    title: '주간 계획 (Weekly Plan)',
    description: '매주 월요일, 이번 주 핵심 행동을 정의하세요. 전술(Tactics)을 주간 단위로 쪼개는 것이 핵심입니다.',
    tip: '주간 계획은 목표 달성을 위한 구체적 행동이어야 합니다.'
  },
  dailyExecution: {
    title: '일일 실행 (Daily Execution)',
    description: '매일 아침 15분, 오늘의 핵심 3가지를 확인하세요. Performance Time을 지키는 것이 중요합니다.',
    tip: '가장 중요한 일을 하루 중 가장 에너지가 높은 시간에 배치하세요.'
  },
  weeklyScorecard: {
    title: '주간 점수판 (Weekly Scorecard)',
    description: '리드 지표가 결과를 예측합니다. 리드(선행) 지표는 행동, 래그(후행) 지표는 결과입니다.',
    tip: '실행률 85% 이상을 목표로 하세요. 이것이 성공의 기준입니다.'
  },
  weeklyAccountability: {
    title: '주간 회계 (Weekly Accountability)',
    description: '85% 실행률이 성공의 기준입니다. 실행률 = (완료 과제 / 계획 과제) × 100',
    tip: '매주 회고를 통해 무엇이 잘 되었고, 무엇을 개선해야 하는지 파악하세요.'
  },
  bufferWeek: {
    title: '13주차 리뷰 (Buffer Week)',
    description: '13주차는 리뷰와 다음 사이클 준비 시간입니다. 복기와 재설정의 시간으로 활용하세요.',
    tip: '다음 12주 사이클의 비전과 목표를 이 시간에 설정하세요.'
  }
};

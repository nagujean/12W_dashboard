import { TwelveWeekCycle } from '@/types';

export const mockCycle: TwelveWeekCycle = {
  id: 'cycle-1',
  name: '2026 Q1 생산성 향상',
  startDate: '2026-01-13',
  endDate: '2026-04-05',
  vision: '건강한 몸과 마음으로 최고의 성과를 내는 리더가 되기',
  currentWeek: 1,
  status: 'active',
  createdAt: '2026-01-13T00:00:00Z',
  goals: [
    {
      id: '1',
      title: '체중 5kg 감량',
      description: '건강한 식단과 규칙적인 운동으로 목표 체중 달성',
      targetDate: '2026-04-05',
      progress: 15
    },
    {
      id: '2',
      title: '새 프로젝트 MVP 완성',
      description: '12주 안에 핵심 기능이 동작하는 MVP 출시',
      targetDate: '2026-04-05',
      progress: 8
    },
    {
      id: '3',
      title: '독서 12권 완독',
      description: '주 1권씩 비즈니스/자기계발 도서 읽기',
      targetDate: '2026-04-05',
      progress: 8
    }
  ],
  weeklyScores: [
    {
      weekNumber: 1,
      plannedTasks: 10,
      completedTasks: 8,
      executionRate: 80,
      leadIndicators: [
        { id: '1', name: '운동 횟수', target: 5, actual: 4, unit: '회' },
        { id: '2', name: '코딩 시간', target: 20, actual: 18, unit: '시간' },
        { id: '3', name: '독서 시간', target: 5, actual: 3, unit: '시간' }
      ]
    }
  ],
  weeklyTasks: [
    { id: '1', title: '피그마 프로토타입 완성', completed: true, dueDate: '2026-01-17', goalId: '2' },
    { id: '2', title: '데이터베이스 스키마 설계', completed: true, dueDate: '2026-01-17', goalId: '2' },
    { id: '3', title: 'API 엔드포인트 정의', completed: false, dueDate: '2026-01-18', goalId: '2' },
    { id: '4', title: '주 3회 30분 이상 운동', completed: false, dueDate: '2026-01-19', goalId: '1' },
    { id: '5', title: '《원씽》 1-5장 읽기', completed: true, dueDate: '2026-01-19', goalId: '3' },
    { id: '6', title: '식단 기록 앱 설치 및 시작', completed: true, dueDate: '2026-01-15', goalId: '1' },
    { id: '7', title: '프로젝트 마일스톤 정의', completed: false, dueDate: '2026-01-18', goalId: '2' },
    { id: '8', title: '주간 회고 작성', completed: false, dueDate: '2026-01-19', goalId: '2' }
  ],
  dailyActions: [
    { id: '1', title: '30분 조깅', completed: true, date: '2026-01-16', priority: 'high' },
    { id: '2', title: 'API 설계 문서 작성', completed: false, date: '2026-01-16', priority: 'high' },
    { id: '3', title: '《원씽》 2장 읽기', completed: false, date: '2026-01-16', priority: 'medium' }
  ],
  habits: [
    { id: '1', name: '기상 후 물 한 잔', completedDates: ['2026-01-13', '2026-01-14', '2026-01-15', '2026-01-16'], targetDaysPerWeek: 7 },
    { id: '2', name: '30분 운동', completedDates: ['2026-01-13', '2026-01-15', '2026-01-16'], targetDaysPerWeek: 5 },
    { id: '3', name: '10분 명상', completedDates: ['2026-01-14', '2026-01-16'], targetDaysPerWeek: 7 },
    { id: '4', name: '저녁 8시 이후 금식', completedDates: ['2026-01-13', '2026-01-14', '2026-01-15'], targetDaysPerWeek: 6 },
    { id: '5', name: '30분 독서', completedDates: ['2026-01-13', '2026-01-14'], targetDaysPerWeek: 7 }
  ]
};

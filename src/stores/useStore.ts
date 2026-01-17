import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TwelveWeekCycle, WeeklyTask, DailyAction, Habit, Goal, WeeklyScore } from '@/types';
import { mockCycle } from '@/../mocks/data';

interface AppState {
  // 여러 사이클 관리
  cycles: TwelveWeekCycle[];
  currentCycleId: string | null;

  // 현재 사이클 가져오기
  getCurrentCycle: () => TwelveWeekCycle | null;

  // 사이클 CRUD
  createCycle: (name: string, vision: string, startDate: string) => string;
  selectCycle: (cycleId: string) => void;
  deleteCycle: (cycleId: string) => void;
  archiveCycle: (cycleId: string) => void;

  // 현재 사이클 업데이트
  updateVision: (vision: string) => void;
  updateCurrentWeek: (week: number) => void;
  updateCycleName: (name: string) => void;

  // 목표 CRUD
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  deleteGoal: (goalId: string) => void;

  // 주간 과제 CRUD
  toggleWeeklyTask: (taskId: string) => void;
  addWeeklyTask: (task: Omit<WeeklyTask, 'id'>) => void;
  updateWeeklyTask: (taskId: string, updates: Partial<WeeklyTask>) => void;
  deleteWeeklyTask: (taskId: string) => void;

  // 일일 행동 CRUD
  toggleDailyAction: (actionId: string) => void;
  addDailyAction: (action: Omit<DailyAction, 'id'>) => void;
  updateDailyAction: (actionId: string, updates: Partial<DailyAction>) => void;
  deleteDailyAction: (actionId: string) => void;

  // 습관 CRUD
  toggleHabit: (habitId: string, date: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates'>) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  deleteHabit: (habitId: string) => void;

  // 주간 점수 기록
  recordWeeklyScore: (weekNumber: number) => void;

  // 계산된 값들
  getWeeklyExecutionRate: () => number;

  // 데이터 초기화/리셋
  resetToMockData: () => void;
}

// 고유 ID 생성
const generateId = () => Math.random().toString(36).substring(2, 9);

// 현재 사이클 업데이트 헬퍼
const updateCurrentCycle = (
  cycles: TwelveWeekCycle[],
  currentCycleId: string | null,
  updater: (cycle: TwelveWeekCycle) => TwelveWeekCycle
): TwelveWeekCycle[] => {
  if (!currentCycleId) return cycles;
  return cycles.map(c => c.id === currentCycleId ? updater(c) : c);
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 초기 데이터
      cycles: [mockCycle],
      currentCycleId: mockCycle.id,

      // 현재 사이클 가져오기
      getCurrentCycle: () => {
        const { cycles, currentCycleId } = get();
        return cycles.find(c => c.id === currentCycleId) || null;
      },

      // 사이클 생성
      createCycle: (name, vision, startDate) => {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(end.getDate() + 84);

        const newCycle: TwelveWeekCycle = {
          id: generateId(),
          name,
          startDate,
          endDate: end.toISOString().split('T')[0],
          vision,
          goals: [],
          currentWeek: 1,
          weeklyScores: [],
          weeklyTasks: [],
          dailyActions: [],
          habits: [],
          status: 'active',
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          cycles: [...state.cycles, newCycle],
          currentCycleId: newCycle.id
        }));

        return newCycle.id;
      },

      // 사이클 선택
      selectCycle: (cycleId) => set({ currentCycleId: cycleId }),

      // 사이클 삭제
      deleteCycle: (cycleId) => set((state) => {
        const newCycles = state.cycles.filter(c => c.id !== cycleId);
        const newCurrentId = state.currentCycleId === cycleId
          ? (newCycles[0]?.id || null)
          : state.currentCycleId;
        return { cycles: newCycles, currentCycleId: newCurrentId };
      }),

      // 사이클 아카이브
      archiveCycle: (cycleId) => set((state) => ({
        cycles: state.cycles.map(c =>
          c.id === cycleId ? { ...c, status: 'archived' as const } : c
        )
      })),

      // 비전 업데이트
      updateVision: (vision) => set((state) => ({
        cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => ({ ...c, vision }))
      })),

      // 현재 주차 업데이트
      updateCurrentWeek: (week) => set((state) => ({
        cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => ({
          ...c,
          currentWeek: Math.min(Math.max(1, week), 13)
        }))
      })),

      // 사이클 이름 업데이트
      updateCycleName: (name) => set((state) => ({
        cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => ({ ...c, name }))
      })),

      // 목표 CRUD
      addGoal: (goal) => set((state) => ({
        cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => ({
          ...c,
          goals: [...c.goals, { ...goal, id: generateId() }]
        }))
      })),

      updateGoal: (goalId, updates) => set((state) => ({
        cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => ({
          ...c,
          goals: c.goals.map(g => g.id === goalId ? { ...g, ...updates } : g)
        }))
      })),

      deleteGoal: (goalId) => set((state) => ({
        cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => ({
          ...c,
          goals: c.goals.filter(g => g.id !== goalId),
          weeklyTasks: c.weeklyTasks.filter(t => t.goalId !== goalId)
        }))
      })),

      // 주간 과제 CRUD
      toggleWeeklyTask: (taskId) => set((state) => ({
        cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => ({
          ...c,
          weeklyTasks: c.weeklyTasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          )
        }))
      })),

      addWeeklyTask: (task) => set((state) => ({
        cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => ({
          ...c,
          weeklyTasks: [...c.weeklyTasks, { ...task, id: generateId() }]
        }))
      })),

      updateWeeklyTask: (taskId, updates) => set((state) => ({
        cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => ({
          ...c,
          weeklyTasks: c.weeklyTasks.map(t =>
            t.id === taskId ? { ...t, ...updates } : t
          )
        }))
      })),

      deleteWeeklyTask: (taskId) => set((state) => ({
        cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => ({
          ...c,
          weeklyTasks: c.weeklyTasks.filter(t => t.id !== taskId)
        }))
      })),

      // 일일 행동 CRUD
      toggleDailyAction: (actionId) => set((state) => ({
        cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => ({
          ...c,
          dailyActions: c.dailyActions.map(a =>
            a.id === actionId ? { ...a, completed: !a.completed } : a
          )
        }))
      })),

      addDailyAction: (action) => set((state) => ({
        cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => ({
          ...c,
          dailyActions: [...c.dailyActions, { ...action, id: generateId() }]
        }))
      })),

      updateDailyAction: (actionId, updates) => set((state) => ({
        cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => ({
          ...c,
          dailyActions: c.dailyActions.map(a =>
            a.id === actionId ? { ...a, ...updates } : a
          )
        }))
      })),

      deleteDailyAction: (actionId) => set((state) => ({
        cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => ({
          ...c,
          dailyActions: c.dailyActions.filter(a => a.id !== actionId)
        }))
      })),

      // 습관 CRUD
      toggleHabit: (habitId, date) => set((state) => ({
        cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => ({
          ...c,
          habits: c.habits.map(h => {
            if (h.id !== habitId) return h;
            const hasDate = h.completedDates.includes(date);
            return {
              ...h,
              completedDates: hasDate
                ? h.completedDates.filter(d => d !== date)
                : [...h.completedDates, date]
            };
          })
        }))
      })),

      addHabit: (habit) => set((state) => ({
        cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => ({
          ...c,
          habits: [...c.habits, { ...habit, id: generateId(), completedDates: [] }]
        }))
      })),

      updateHabit: (habitId, updates) => set((state) => ({
        cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => ({
          ...c,
          habits: c.habits.map(h =>
            h.id === habitId ? { ...h, ...updates } : h
          )
        }))
      })),

      deleteHabit: (habitId) => set((state) => ({
        cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => ({
          ...c,
          habits: c.habits.filter(h => h.id !== habitId)
        }))
      })),

      // 주간 점수 기록
      recordWeeklyScore: (weekNumber) => set((state) => {
        const cycle = get().getCurrentCycle();
        if (!cycle) return state;

        const executionRate = get().getWeeklyExecutionRate();
        const completedTasks = cycle.weeklyTasks.filter(t => t.completed).length;

        const newScore: WeeklyScore = {
          weekNumber,
          plannedTasks: cycle.weeklyTasks.length,
          completedTasks,
          executionRate,
          leadIndicators: cycle.weeklyScores.find(s => s.weekNumber === weekNumber)?.leadIndicators || []
        };

        return {
          cycles: updateCurrentCycle(state.cycles, state.currentCycleId, c => {
            const existingIndex = c.weeklyScores.findIndex(s => s.weekNumber === weekNumber);
            const newScores = [...c.weeklyScores];
            if (existingIndex >= 0) {
              newScores[existingIndex] = newScore;
            } else {
              newScores.push(newScore);
            }
            return {
              ...c,
              weeklyScores: newScores.sort((a, b) => a.weekNumber - b.weekNumber)
            };
          })
        };
      }),

      // 실행률 계산
      getWeeklyExecutionRate: () => {
        const cycle = get().getCurrentCycle();
        if (!cycle || cycle.weeklyTasks.length === 0) return 0;
        const completed = cycle.weeklyTasks.filter(t => t.completed).length;
        return Math.round((completed / cycle.weeklyTasks.length) * 100);
      },

      // 데이터 리셋
      resetToMockData: () => set({
        cycles: [mockCycle],
        currentCycleId: mockCycle.id
      })
    }),
    {
      name: 'twelve-week-dashboard-storage',
      version: 2, // 버전 업
    }
  )
);

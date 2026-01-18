import { create } from 'zustand';
import { TwelveWeekCycle, WeeklyTask, DailyAction, Habit, Goal, WeeklyScore, LeadIndicator } from '@/types';
import { createClient } from '@/lib/supabase/client';
import * as cyclesService from '@/services/supabase/cycles';
import * as goalsService from '@/services/supabase/goals';
import * as tasksService from '@/services/supabase/tasks';
import * as actionsService from '@/services/supabase/actions';
import * as habitsService from '@/services/supabase/habits';
import * as scoresService from '@/services/supabase/scores';
import type { User } from '@supabase/supabase-js';

interface AppState {
  // 사용자 상태
  user: User | null;

  // 데이터 상태
  cycles: TwelveWeekCycle[];
  currentCycleId: string | null;

  // 로딩/에러 상태
  loading: boolean;
  error: string | null;

  // 사용자 설정
  setUser: (user: User | null) => void;

  // 현재 사이클 가져오기
  getCurrentCycle: () => TwelveWeekCycle | null;

  // 데이터 로드
  fetchCycles: () => Promise<void>;

  // 사이클 CRUD (async)
  createCycle: (name: string, vision: string, startDate: string) => Promise<string | null>;
  selectCycle: (cycleId: string) => void;
  deleteCycle: (cycleId: string) => Promise<void>;
  archiveCycle: (cycleId: string) => Promise<void>;

  // 현재 사이클 업데이트
  updateVision: (vision: string) => Promise<void>;
  updateCurrentWeek: (week: number) => Promise<void>;
  updateCycleName: (name: string) => Promise<void>;

  // 목표 CRUD
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  updateGoal: (goalId: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;

  // 주간 과제 CRUD
  toggleWeeklyTask: (taskId: string) => Promise<void>;
  addWeeklyTask: (task: Omit<WeeklyTask, 'id'>) => Promise<void>;
  updateWeeklyTask: (taskId: string, updates: Partial<WeeklyTask>) => Promise<void>;
  deleteWeeklyTask: (taskId: string) => Promise<void>;

  // 일일 행동 CRUD
  toggleDailyAction: (actionId: string) => Promise<void>;
  addDailyAction: (action: Omit<DailyAction, 'id'>) => Promise<void>;
  updateDailyAction: (actionId: string, updates: Partial<DailyAction>) => Promise<void>;
  deleteDailyAction: (actionId: string) => Promise<void>;

  // 습관 CRUD
  toggleHabit: (habitId: string, date: string) => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates'>) => Promise<void>;
  updateHabit: (habitId: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;

  // 주간 점수 기록
  recordWeeklyScore: (weekNumber: number) => Promise<void>;

  // 계산된 값들
  getWeeklyExecutionRate: () => number;

  // 에러/로딩 제어
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;

  // 데이터 초기화
  resetStore: () => void;
}

// DB 응답을 앱 타입으로 변환하는 헬퍼 함수들
function transformCycleFromDB(dbCycle: any): TwelveWeekCycle {
  return {
    id: dbCycle.id,
    name: dbCycle.name,
    startDate: dbCycle.start_date,
    endDate: dbCycle.end_date,
    vision: dbCycle.vision,
    currentWeek: dbCycle.current_week,
    status: dbCycle.status,
    createdAt: dbCycle.created_at,
    goals: (dbCycle.goals || []).map((g: any) => ({
      id: g.id,
      title: g.title,
      description: g.description || '',
      targetDate: g.target_date || '',
      progress: g.progress || 0,
    })),
    weeklyTasks: (dbCycle.weekly_tasks || []).map((t: any) => ({
      id: t.id,
      title: t.title,
      completed: t.completed,
      dueDate: t.due_date || '',
      goalId: t.goal_id || '',
    })),
    dailyActions: (dbCycle.daily_actions || []).map((a: any) => ({
      id: a.id,
      title: a.title,
      completed: a.completed,
      date: a.date,
      priority: a.priority,
    })),
    habits: (dbCycle.habits || []).map((h: any) => ({
      id: h.id,
      name: h.name,
      targetDaysPerWeek: h.target_days_per_week,
      completedDates: (h.habit_completions || []).map((c: any) => c.completed_date),
    })),
    weeklyScores: (dbCycle.weekly_scores || []).map((s: any) => ({
      weekNumber: s.week_number,
      plannedTasks: s.planned_tasks,
      completedTasks: s.completed_tasks,
      executionRate: s.execution_rate,
      leadIndicators: (s.lead_indicators || []).map((i: any) => ({
        id: i.id,
        name: i.name,
        target: i.target,
        actual: i.actual,
        unit: i.unit,
      })),
    })),
  };
}

// 현재 사이클 로컬 업데이트 헬퍼
const updateCurrentCycleLocal = (
  cycles: TwelveWeekCycle[],
  currentCycleId: string | null,
  updater: (cycle: TwelveWeekCycle) => TwelveWeekCycle
): TwelveWeekCycle[] => {
  if (!currentCycleId) return cycles;
  return cycles.map(c => c.id === currentCycleId ? updater(c) : c);
};

export const useStore = create<AppState>()((set, get) => ({
  // 초기 상태
  user: null,
  cycles: [],
  currentCycleId: null,
  loading: false,
  error: null,

  // 사용자 설정
  setUser: (user) => set({ user }),

  // 현재 사이클 가져오기
  getCurrentCycle: () => {
    const { cycles, currentCycleId } = get();
    return cycles.find(c => c.id === currentCycleId) || null;
  },

  // 사이클 데이터 로드
  fetchCycles: async () => {
    const { user } = get();
    if (!user) return;

    set({ loading: true, error: null });

    try {
      const supabase = createClient();
      const { data, error } = await cyclesService.getCycles(supabase);

      if (error) throw error;

      const transformedCycles = (data || []).map(transformCycleFromDB);

      set({
        cycles: transformedCycles,
        currentCycleId: transformedCycles[0]?.id || null,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  // 사이클 생성
  createCycle: async (name, vision, startDate) => {
    const { user } = get();
    if (!user) return null;

    set({ loading: true, error: null });

    try {
      const supabase = createClient();
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + 84);

      const { data, error } = await cyclesService.createCycle(supabase, {
        user_id: user.id,
        name,
        vision,
        start_date: startDate,
        end_date: end.toISOString().split('T')[0],
        current_week: 1,
        status: 'active',
      });

      if (error) throw error;
      if (!data) throw new Error('Failed to create cycle');

      // 새 사이클을 목록에 추가
      const newCycle: TwelveWeekCycle = {
        id: data.id,
        name: data.name,
        startDate: data.start_date,
        endDate: data.end_date,
        vision: data.vision,
        currentWeek: data.current_week,
        status: data.status,
        createdAt: data.created_at,
        goals: [],
        weeklyTasks: [],
        dailyActions: [],
        habits: [],
        weeklyScores: [],
      };

      set((state) => ({
        cycles: [newCycle, ...state.cycles],
        currentCycleId: newCycle.id,
        loading: false,
      }));

      return newCycle.id;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  // 사이클 선택
  selectCycle: (cycleId) => set({ currentCycleId: cycleId }),

  // 사이클 삭제
  deleteCycle: async (cycleId) => {
    set({ loading: true, error: null });

    try {
      const supabase = createClient();
      const { error } = await cyclesService.deleteCycle(supabase, cycleId);

      if (error) throw error;

      set((state) => {
        const newCycles = state.cycles.filter(c => c.id !== cycleId);
        const newCurrentId = state.currentCycleId === cycleId
          ? (newCycles[0]?.id || null)
          : state.currentCycleId;
        return { cycles: newCycles, currentCycleId: newCurrentId, loading: false };
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  // 사이클 아카이브
  archiveCycle: async (cycleId) => {
    set({ loading: true, error: null });

    try {
      const supabase = createClient();
      const { error } = await cyclesService.updateCycle(supabase, cycleId, {
        status: 'archived',
      });

      if (error) throw error;

      set((state) => ({
        cycles: state.cycles.map(c =>
          c.id === cycleId ? { ...c, status: 'archived' as const } : c
        ),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  // 비전 업데이트
  updateVision: async (vision) => {
    const { currentCycleId } = get();
    if (!currentCycleId) return;

    try {
      const supabase = createClient();
      const { error } = await cyclesService.updateCycle(supabase, currentCycleId, { vision });

      if (error) throw error;

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => ({ ...c, vision }))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 현재 주차 업데이트
  updateCurrentWeek: async (week) => {
    const { currentCycleId } = get();
    if (!currentCycleId) return;

    const validWeek = Math.min(Math.max(1, week), 13);

    try {
      const supabase = createClient();
      const { error } = await cyclesService.updateCycle(supabase, currentCycleId, {
        current_week: validWeek,
      });

      if (error) throw error;

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => ({
          ...c,
          currentWeek: validWeek
        }))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 사이클 이름 업데이트
  updateCycleName: async (name) => {
    const { currentCycleId } = get();
    if (!currentCycleId) return;

    try {
      const supabase = createClient();
      const { error } = await cyclesService.updateCycle(supabase, currentCycleId, { name });

      if (error) throw error;

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => ({ ...c, name }))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 목표 추가
  addGoal: async (goal) => {
    const { currentCycleId } = get();
    if (!currentCycleId) return;

    try {
      const supabase = createClient();
      const { data, error } = await goalsService.createGoal(supabase, {
        cycle_id: currentCycleId,
        title: goal.title,
        description: goal.description,
        target_date: goal.targetDate || null,
        progress: goal.progress,
      });

      if (error) throw error;
      if (!data) throw new Error('Failed to create goal');

      const newGoal: Goal = {
        id: data.id,
        title: data.title,
        description: data.description,
        targetDate: data.target_date || '',
        progress: data.progress,
      };

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => ({
          ...c,
          goals: [...c.goals, newGoal]
        }))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 목표 업데이트
  updateGoal: async (goalId, updates) => {
    try {
      const supabase = createClient();
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.targetDate !== undefined) dbUpdates.target_date = updates.targetDate || null;
      if (updates.progress !== undefined) dbUpdates.progress = updates.progress;

      const { error } = await goalsService.updateGoal(supabase, goalId, dbUpdates);

      if (error) throw error;

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => ({
          ...c,
          goals: c.goals.map(g => g.id === goalId ? { ...g, ...updates } : g)
        }))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 목표 삭제
  deleteGoal: async (goalId) => {
    try {
      const supabase = createClient();
      const { error } = await goalsService.deleteGoal(supabase, goalId);

      if (error) throw error;

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => ({
          ...c,
          goals: c.goals.filter(g => g.id !== goalId),
          weeklyTasks: c.weeklyTasks.filter(t => t.goalId !== goalId)
        }))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 주간 과제 토글
  toggleWeeklyTask: async (taskId) => {
    const cycle = get().getCurrentCycle();
    const task = cycle?.weeklyTasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const supabase = createClient();
      const { error } = await tasksService.toggleWeeklyTask(supabase, taskId, !task.completed);

      if (error) throw error;

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => ({
          ...c,
          weeklyTasks: c.weeklyTasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          )
        }))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 주간 과제 추가
  addWeeklyTask: async (task) => {
    const { currentCycleId } = get();
    if (!currentCycleId) return;

    try {
      const supabase = createClient();
      const { data, error } = await tasksService.createWeeklyTask(supabase, {
        cycle_id: currentCycleId,
        title: task.title,
        completed: task.completed,
        due_date: task.dueDate || null,
        goal_id: task.goalId || null,
      });

      if (error) throw error;
      if (!data) throw new Error('Failed to create task');

      const newTask: WeeklyTask = {
        id: data.id,
        title: data.title,
        completed: data.completed,
        dueDate: data.due_date || '',
        goalId: data.goal_id || '',
      };

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => ({
          ...c,
          weeklyTasks: [...c.weeklyTasks, newTask]
        }))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 주간 과제 업데이트
  updateWeeklyTask: async (taskId, updates) => {
    try {
      const supabase = createClient();
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate || null;
      if (updates.goalId !== undefined) dbUpdates.goal_id = updates.goalId || null;

      const { error } = await tasksService.updateWeeklyTask(supabase, taskId, dbUpdates);

      if (error) throw error;

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => ({
          ...c,
          weeklyTasks: c.weeklyTasks.map(t =>
            t.id === taskId ? { ...t, ...updates } : t
          )
        }))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 주간 과제 삭제
  deleteWeeklyTask: async (taskId) => {
    try {
      const supabase = createClient();
      const { error } = await tasksService.deleteWeeklyTask(supabase, taskId);

      if (error) throw error;

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => ({
          ...c,
          weeklyTasks: c.weeklyTasks.filter(t => t.id !== taskId)
        }))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 일일 행동 토글
  toggleDailyAction: async (actionId) => {
    const cycle = get().getCurrentCycle();
    const action = cycle?.dailyActions.find(a => a.id === actionId);
    if (!action) return;

    try {
      const supabase = createClient();
      const { error } = await actionsService.toggleDailyAction(supabase, actionId, !action.completed);

      if (error) throw error;

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => ({
          ...c,
          dailyActions: c.dailyActions.map(a =>
            a.id === actionId ? { ...a, completed: !a.completed } : a
          )
        }))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 일일 행동 추가
  addDailyAction: async (action) => {
    const { currentCycleId } = get();
    if (!currentCycleId) return;

    try {
      const supabase = createClient();
      const { data, error } = await actionsService.createDailyAction(supabase, {
        cycle_id: currentCycleId,
        title: action.title,
        completed: action.completed,
        date: action.date,
        priority: action.priority,
      });

      if (error) throw error;
      if (!data) throw new Error('Failed to create action');

      const newAction: DailyAction = {
        id: data.id,
        title: data.title,
        completed: data.completed,
        date: data.date,
        priority: data.priority,
      };

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => ({
          ...c,
          dailyActions: [...c.dailyActions, newAction]
        }))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 일일 행동 업데이트
  updateDailyAction: async (actionId, updates) => {
    try {
      const supabase = createClient();
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
      if (updates.date !== undefined) dbUpdates.date = updates.date;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;

      const { error } = await actionsService.updateDailyAction(supabase, actionId, dbUpdates);

      if (error) throw error;

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => ({
          ...c,
          dailyActions: c.dailyActions.map(a =>
            a.id === actionId ? { ...a, ...updates } : a
          )
        }))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 일일 행동 삭제
  deleteDailyAction: async (actionId) => {
    try {
      const supabase = createClient();
      const { error } = await actionsService.deleteDailyAction(supabase, actionId);

      if (error) throw error;

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => ({
          ...c,
          dailyActions: c.dailyActions.filter(a => a.id !== actionId)
        }))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 습관 토글
  toggleHabit: async (habitId, date) => {
    const cycle = get().getCurrentCycle();
    const habit = cycle?.habits.find(h => h.id === habitId);
    if (!habit) return;

    const isCompleted = habit.completedDates.includes(date);

    try {
      const supabase = createClient();

      if (isCompleted) {
        const { error } = await habitsService.removeHabitCompletion(supabase, habitId, date);
        if (error) throw error;
      } else {
        const { error } = await habitsService.addHabitCompletion(supabase, habitId, date);
        if (error) throw error;
      }

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => ({
          ...c,
          habits: c.habits.map(h => {
            if (h.id !== habitId) return h;
            return {
              ...h,
              completedDates: isCompleted
                ? h.completedDates.filter(d => d !== date)
                : [...h.completedDates, date]
            };
          })
        }))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 습관 추가
  addHabit: async (habit) => {
    const { currentCycleId } = get();
    if (!currentCycleId) return;

    try {
      const supabase = createClient();
      const { data, error } = await habitsService.createHabit(supabase, {
        cycle_id: currentCycleId,
        name: habit.name,
        target_days_per_week: habit.targetDaysPerWeek,
      });

      if (error) throw error;
      if (!data) throw new Error('Failed to create habit');

      const newHabit: Habit = {
        id: data.id,
        name: data.name,
        targetDaysPerWeek: data.target_days_per_week,
        completedDates: [],
      };

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => ({
          ...c,
          habits: [...c.habits, newHabit]
        }))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 습관 업데이트
  updateHabit: async (habitId, updates) => {
    try {
      const supabase = createClient();
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.targetDaysPerWeek !== undefined) dbUpdates.target_days_per_week = updates.targetDaysPerWeek;

      const { error } = await habitsService.updateHabit(supabase, habitId, dbUpdates);

      if (error) throw error;

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => ({
          ...c,
          habits: c.habits.map(h =>
            h.id === habitId ? { ...h, ...updates } : h
          )
        }))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 습관 삭제
  deleteHabit: async (habitId) => {
    try {
      const supabase = createClient();
      const { error } = await habitsService.deleteHabit(supabase, habitId);

      if (error) throw error;

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => ({
          ...c,
          habits: c.habits.filter(h => h.id !== habitId)
        }))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 주간 점수 기록
  recordWeeklyScore: async (weekNumber) => {
    const { currentCycleId } = get();
    const cycle = get().getCurrentCycle();
    if (!cycle || !currentCycleId) return;

    const executionRate = get().getWeeklyExecutionRate();
    const completedTasks = cycle.weeklyTasks.filter(t => t.completed).length;

    try {
      const supabase = createClient();
      const { data, error } = await scoresService.upsertWeeklyScore(supabase, {
        cycle_id: currentCycleId,
        week_number: weekNumber,
        planned_tasks: cycle.weeklyTasks.length,
        completed_tasks: completedTasks,
        execution_rate: executionRate,
      });

      if (error) throw error;

      const existingScore = cycle.weeklyScores.find(s => s.weekNumber === weekNumber);
      const newScore: WeeklyScore = {
        weekNumber,
        plannedTasks: cycle.weeklyTasks.length,
        completedTasks,
        executionRate,
        leadIndicators: existingScore?.leadIndicators || [],
      };

      set((state) => ({
        cycles: updateCurrentCycleLocal(state.cycles, state.currentCycleId, c => {
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
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 실행률 계산
  getWeeklyExecutionRate: () => {
    const cycle = get().getCurrentCycle();
    if (!cycle || cycle.weeklyTasks.length === 0) return 0;
    const completed = cycle.weeklyTasks.filter(t => t.completed).length;
    return Math.round((completed / cycle.weeklyTasks.length) * 100);
  },

  // 에러/로딩 제어
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),

  // 데이터 초기화
  resetStore: () => set({
    cycles: [],
    currentCycleId: null,
    loading: false,
    error: null,
  }),
}));

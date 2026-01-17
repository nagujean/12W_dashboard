import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TwelveWeekCycle, WeeklyTask, DailyAction, Habit, Goal, WeeklyScore } from '@/types';
import { mockCycle, mockWeeklyTasks, mockDailyActions, mockHabits } from '@/../mocks/data';

interface AppState {
  // 초기화 여부
  isInitialized: boolean;

  // 현재 12주 사이클
  cycle: TwelveWeekCycle;
  setCycle: (cycle: TwelveWeekCycle) => void;
  updateVision: (vision: string) => void;
  updateCurrentWeek: (week: number) => void;

  // 목표 CRUD
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  deleteGoal: (goalId: string) => void;

  // 주간 과제
  weeklyTasks: WeeklyTask[];
  toggleWeeklyTask: (taskId: string) => void;
  addWeeklyTask: (task: Omit<WeeklyTask, 'id'>) => void;
  updateWeeklyTask: (taskId: string, updates: Partial<WeeklyTask>) => void;
  deleteWeeklyTask: (taskId: string) => void;

  // 일일 행동
  dailyActions: DailyAction[];
  toggleDailyAction: (actionId: string) => void;
  addDailyAction: (action: Omit<DailyAction, 'id'>) => void;
  updateDailyAction: (actionId: string, updates: Partial<DailyAction>) => void;
  deleteDailyAction: (actionId: string) => void;
  clearDailyActions: () => void;

  // 습관 트래커
  habits: Habit[];
  toggleHabit: (habitId: string, date: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates'>) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  deleteHabit: (habitId: string) => void;

  // 주간 점수 기록
  recordWeeklyScore: (weekNumber: number) => void;

  // 계산된 값들
  getWeeklyExecutionRate: () => number;
  getGoalProgress: (goalId: string) => number;

  // 데이터 초기화/리셋
  resetToMockData: () => void;
  startNewCycle: (vision: string, startDate: string) => void;
}

// 고유 ID 생성
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isInitialized: true,

      // 현재 12주 사이클
      cycle: mockCycle,
      setCycle: (cycle) => set({ cycle }),

      updateVision: (vision) => set((state) => ({
        cycle: { ...state.cycle, vision }
      })),

      updateCurrentWeek: (week) => set((state) => ({
        cycle: { ...state.cycle, currentWeek: Math.min(Math.max(1, week), 13) }
      })),

      // 목표 CRUD
      addGoal: (goal) => set((state) => ({
        cycle: {
          ...state.cycle,
          goals: [...state.cycle.goals, { ...goal, id: generateId() }]
        }
      })),

      updateGoal: (goalId, updates) => set((state) => ({
        cycle: {
          ...state.cycle,
          goals: state.cycle.goals.map(g =>
            g.id === goalId ? { ...g, ...updates } : g
          )
        }
      })),

      deleteGoal: (goalId) => set((state) => ({
        cycle: {
          ...state.cycle,
          goals: state.cycle.goals.filter(g => g.id !== goalId)
        },
        weeklyTasks: state.weeklyTasks.filter(t => t.goalId !== goalId)
      })),

      // 주간 과제
      weeklyTasks: mockWeeklyTasks,

      toggleWeeklyTask: (taskId) => set((state) => ({
        weeklyTasks: state.weeklyTasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      })),

      addWeeklyTask: (task) => set((state) => ({
        weeklyTasks: [...state.weeklyTasks, { ...task, id: generateId() }]
      })),

      updateWeeklyTask: (taskId, updates) => set((state) => ({
        weeklyTasks: state.weeklyTasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      })),

      deleteWeeklyTask: (taskId) => set((state) => ({
        weeklyTasks: state.weeklyTasks.filter(task => task.id !== taskId)
      })),

      // 일일 행동
      dailyActions: mockDailyActions,

      toggleDailyAction: (actionId) => set((state) => ({
        dailyActions: state.dailyActions.map(action =>
          action.id === actionId ? { ...action, completed: !action.completed } : action
        )
      })),

      addDailyAction: (action) => set((state) => ({
        dailyActions: [...state.dailyActions, { ...action, id: generateId() }]
      })),

      updateDailyAction: (actionId, updates) => set((state) => ({
        dailyActions: state.dailyActions.map(action =>
          action.id === actionId ? { ...action, ...updates } : action
        )
      })),

      deleteDailyAction: (actionId) => set((state) => ({
        dailyActions: state.dailyActions.filter(action => action.id !== actionId)
      })),

      clearDailyActions: () => set({ dailyActions: [] }),

      // 습관 트래커
      habits: mockHabits,

      toggleHabit: (habitId, date) => set((state) => ({
        habits: state.habits.map(habit => {
          if (habit.id !== habitId) return habit;
          const hasDate = habit.completedDates.includes(date);
          return {
            ...habit,
            completedDates: hasDate
              ? habit.completedDates.filter(d => d !== date)
              : [...habit.completedDates, date]
          };
        })
      })),

      addHabit: (habit) => set((state) => ({
        habits: [...state.habits, { ...habit, id: generateId(), completedDates: [] }]
      })),

      updateHabit: (habitId, updates) => set((state) => ({
        habits: state.habits.map(habit =>
          habit.id === habitId ? { ...habit, ...updates } : habit
        )
      })),

      deleteHabit: (habitId) => set((state) => ({
        habits: state.habits.filter(habit => habit.id !== habitId)
      })),

      // 주간 점수 기록
      recordWeeklyScore: (weekNumber) => set((state) => {
        const executionRate = get().getWeeklyExecutionRate();
        const tasks = state.weeklyTasks;
        const completedTasks = tasks.filter(t => t.completed).length;

        const newScore: WeeklyScore = {
          weekNumber,
          plannedTasks: tasks.length,
          completedTasks,
          executionRate,
          leadIndicators: state.cycle.weeklyScores.find(s => s.weekNumber === weekNumber)?.leadIndicators || []
        };

        const existingIndex = state.cycle.weeklyScores.findIndex(s => s.weekNumber === weekNumber);
        const newScores = [...state.cycle.weeklyScores];

        if (existingIndex >= 0) {
          newScores[existingIndex] = newScore;
        } else {
          newScores.push(newScore);
        }

        return {
          cycle: {
            ...state.cycle,
            weeklyScores: newScores.sort((a, b) => a.weekNumber - b.weekNumber)
          }
        };
      }),

      // 계산된 값들
      getWeeklyExecutionRate: () => {
        const tasks = get().weeklyTasks;
        if (tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.completed).length;
        return Math.round((completed / tasks.length) * 100);
      },

      getGoalProgress: (goalId: string) => {
        const goal = get().cycle.goals.find(g => g.id === goalId);
        return goal?.progress ?? 0;
      },

      // 데이터 초기화
      resetToMockData: () => set({
        cycle: mockCycle,
        weeklyTasks: mockWeeklyTasks,
        dailyActions: mockDailyActions,
        habits: mockHabits
      }),

      // 새 12주 사이클 시작
      startNewCycle: (vision, startDate) => {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(end.getDate() + 84); // 12주 = 84일

        set({
          cycle: {
            id: generateId(),
            startDate,
            endDate: end.toISOString().split('T')[0],
            vision,
            goals: [],
            currentWeek: 1,
            weeklyScores: []
          },
          weeklyTasks: [],
          dailyActions: [],
          habits: []
        });
      }
    }),
    {
      name: 'twelve-week-dashboard-storage',
      version: 1,
    }
  )
);

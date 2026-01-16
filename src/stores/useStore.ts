import { create } from 'zustand';
import { TwelveWeekCycle, WeeklyTask, DailyAction, Habit } from '@/types';
import { mockCycle, mockWeeklyTasks, mockDailyActions, mockHabits } from '@/../mocks/data';

interface AppState {
  // 현재 12주 사이클
  cycle: TwelveWeekCycle;
  setCycle: (cycle: TwelveWeekCycle) => void;

  // 주간 과제
  weeklyTasks: WeeklyTask[];
  toggleWeeklyTask: (taskId: string) => void;

  // 일일 행동
  dailyActions: DailyAction[];
  toggleDailyAction: (actionId: string) => void;

  // 습관 트래커
  habits: Habit[];
  toggleHabit: (habitId: string, date: string) => void;

  // 계산된 값들
  getWeeklyExecutionRate: () => number;
  getGoalProgress: (goalId: string) => number;
}

export const useStore = create<AppState>((set, get) => ({
  // 초기 데이터 (목업)
  cycle: mockCycle,
  setCycle: (cycle) => set({ cycle }),

  weeklyTasks: mockWeeklyTasks,
  toggleWeeklyTask: (taskId) => set((state) => ({
    weeklyTasks: state.weeklyTasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
  })),

  dailyActions: mockDailyActions,
  toggleDailyAction: (actionId) => set((state) => ({
    dailyActions: state.dailyActions.map(action =>
      action.id === actionId ? { ...action, completed: !action.completed } : action
    )
  })),

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

  getWeeklyExecutionRate: () => {
    const tasks = get().weeklyTasks;
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  },

  getGoalProgress: (goalId: string) => {
    const goal = get().cycle.goals.find(g => g.id === goalId);
    return goal?.progress ?? 0;
  }
}));

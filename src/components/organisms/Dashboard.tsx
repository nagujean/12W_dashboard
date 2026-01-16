'use client';

import { useStore } from '@/stores/useStore';
import { VisionCard } from '@/components/molecules/VisionCard';
import { WeeklyPlanCard } from '@/components/molecules/WeeklyPlanCard';
import { DailyExecutionCard } from '@/components/molecules/DailyExecutionCard';
import { WeeklyScorecardCard } from '@/components/molecules/WeeklyScorecardCard';
import { HabitsCard } from '@/components/molecules/HabitsCard';
import { WeeklyProgressChart } from '@/components/molecules/WeeklyProgressChart';
import { weeklyExecutionData } from '@/../mocks/data';

export function Dashboard() {
  const cycle = useStore((state) => state.cycle);
  const weeklyTasks = useStore((state) => state.weeklyTasks);
  const dailyActions = useStore((state) => state.dailyActions);
  const habits = useStore((state) => state.habits);
  const getWeeklyExecutionRate = useStore((state) => state.getWeeklyExecutionRate);

  const currentWeekScore = cycle.weeklyScores.find(s => s.weekNumber === cycle.currentWeek);
  const executionRate = getWeeklyExecutionRate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">12주의 법칙</h1>
              <p className="text-sm text-gray-500">브라이언 P. 모건의 방법론 기반 생산성 대시보드</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">현재</p>
              <p className="text-lg font-bold text-blue-600">Week {cycle.currentWeek}</p>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 컬럼 */}
          <div className="lg:col-span-1 space-y-6">
            <VisionCard cycle={cycle} />
            <DailyExecutionCard actions={dailyActions} />
          </div>

          {/* 중앙 컬럼 */}
          <div className="lg:col-span-1 space-y-6">
            <WeeklyPlanCard tasks={weeklyTasks} />
            <HabitsCard habits={habits} />
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="lg:col-span-1 space-y-6">
            <WeeklyScorecardCard
              indicators={currentWeekScore?.leadIndicators || []}
              executionRate={executionRate}
            />
            <WeeklyProgressChart
              data={weeklyExecutionData}
              currentWeek={cycle.currentWeek}
            />
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-sm text-gray-400">
            "85%의 실행률이 당신을 성공으로 이끕니다" - 12주의 법칙
          </p>
        </div>
      </footer>
    </div>
  );
}

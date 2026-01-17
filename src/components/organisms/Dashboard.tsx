'use client';

import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { VisionCard } from '@/components/molecules/VisionCard';
import { WeeklyPlanCard } from '@/components/molecules/WeeklyPlanCard';
import { DailyExecutionCard } from '@/components/molecules/DailyExecutionCard';
import { WeeklyScorecardCard } from '@/components/molecules/WeeklyScorecardCard';
import { HabitsCard } from '@/components/molecules/HabitsCard';
import { WeeklyProgressChart } from '@/components/molecules/WeeklyProgressChart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RefreshCw, Plus, RotateCcw } from 'lucide-react';

export function Dashboard() {
  const [isNewCycleOpen, setIsNewCycleOpen] = useState(false);
  const [newVision, setNewVision] = useState('');
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);

  const cycle = useStore((state) => state.cycle);
  const weeklyTasks = useStore((state) => state.weeklyTasks);
  const dailyActions = useStore((state) => state.dailyActions);
  const habits = useStore((state) => state.habits);
  const getWeeklyExecutionRate = useStore((state) => state.getWeeklyExecutionRate);
  const startNewCycle = useStore((state) => state.startNewCycle);
  const resetToMockData = useStore((state) => state.resetToMockData);

  const currentWeekScore = cycle.weeklyScores.find(s => s.weekNumber === cycle.currentWeek);
  const executionRate = getWeeklyExecutionRate();

  // 12주 실행률 데이터 생성
  const weeklyExecutionData = Array.from({ length: 12 }, (_, i) => {
    const weekScore = cycle.weeklyScores.find(s => s.weekNumber === i + 1);
    return {
      week: i + 1,
      rate: weekScore?.executionRate || 0
    };
  });

  const handleStartNewCycle = () => {
    if (newVision.trim()) {
      startNewCycle(newVision.trim(), newStartDate);
      setIsNewCycleOpen(false);
      setNewVision('');
    }
  };

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
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">현재</p>
                <p className="text-lg font-bold text-blue-600">Week {cycle.currentWeek}</p>
              </div>
              <div className="flex gap-2">
                <Dialog open={isNewCycleOpen} onOpenChange={setIsNewCycleOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      새 사이클
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>새 12주 사이클 시작</DialogTitle>
                      <DialogDescription>
                        새로운 12주 사이클을 시작합니다. 기존 데이터는 초기화됩니다.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">비전 (12주 후 달성할 모습)</label>
                        <Input
                          placeholder="예: 건강한 몸과 마음으로 최고의 성과를 내는 리더가 되기"
                          value={newVision}
                          onChange={(e) => setNewVision(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">시작일</label>
                        <Input
                          type="date"
                          value={newStartDate}
                          onChange={(e) => setNewStartDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsNewCycleOpen(false)}>
                        취소
                      </Button>
                      <Button onClick={handleStartNewCycle} disabled={!newVision.trim()}>
                        시작하기
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetToMockData}
                  title="샘플 데이터로 리셋"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
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

'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/stores/useStore';
import { useAuthContext } from '@/providers/AuthProvider';
import { VisionCard } from '@/components/molecules/VisionCard';
import { WeeklyPlanCard } from '@/components/molecules/WeeklyPlanCard';
import { DailyExecutionCard } from '@/components/molecules/DailyExecutionCard';
import { WeeklyScorecardCard } from '@/components/molecules/WeeklyScorecardCard';
import { HabitsCard } from '@/components/molecules/HabitsCard';
import { WeeklyProgressChart } from '@/components/molecules/WeeklyProgressChart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Archive, FolderOpen, Menu, LogOut, Loader2, AlertCircle } from 'lucide-react';

export function Dashboard() {
  const [isNewCycleOpen, setIsNewCycleOpen] = useState(false);
  const [isCycleListOpen, setIsCycleListOpen] = useState(false);
  const [newCycleName, setNewCycleName] = useState('');
  const [newVision, setNewVision] = useState('');
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);

  const { user, signOut } = useAuthContext();

  const cycles = useStore((state) => state.cycles);
  const currentCycleId = useStore((state) => state.currentCycleId);
  const loading = useStore((state) => state.loading);
  const error = useStore((state) => state.error);
  const getCurrentCycle = useStore((state) => state.getCurrentCycle);
  const getWeeklyExecutionRate = useStore((state) => state.getWeeklyExecutionRate);
  const createCycle = useStore((state) => state.createCycle);
  const selectCycle = useStore((state) => state.selectCycle);
  const deleteCycle = useStore((state) => state.deleteCycle);
  const archiveCycle = useStore((state) => state.archiveCycle);
  const fetchCycles = useStore((state) => state.fetchCycles);
  const setUser = useStore((state) => state.setUser);
  const setError = useStore((state) => state.setError);

  // 사용자가 로그인하면 데이터 로드
  useEffect(() => {
    if (user) {
      setUser(user);
      fetchCycles();
    }
  }, [user, setUser, fetchCycles]);

  const cycle = getCurrentCycle();
  const executionRate = getWeeklyExecutionRate();

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  const handleDismissError = () => {
    setError(null);
  };

  const handleCreateCycle = async () => {
    if (newCycleName.trim() && newVision.trim()) {
      await createCycle(newCycleName.trim(), newVision.trim(), newStartDate);
      setIsNewCycleOpen(false);
      setNewCycleName('');
      setNewVision('');
    }
  };

  // 로딩 상태
  if (loading && cycles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-500">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 현재 사이클이 없으면 안내 메시지
  if (!cycle) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* 에러 알림 */}
        {error && (
          <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg flex items-start gap-3 max-w-md">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button onClick={handleDismissError} className="text-red-400 hover:text-red-600">
              ×
            </button>
          </div>
        )}

        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">12주의 법칙</h1>
            <p className="text-gray-500">
              {user?.email ? `${user.email}님, ` : ''}사이클이 없습니다. 새 사이클을 시작하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={() => setIsNewCycleOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                새 사이클 시작
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>

        {/* 새 사이클 다이얼로그 */}
        <Dialog open={isNewCycleOpen} onOpenChange={setIsNewCycleOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle>새 12주 사이클 시작</DialogTitle>
              <DialogDescription>
                새로운 12주 사이클을 만듭니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">사이클 이름</label>
                <Input
                  placeholder="예: 2026 Q1 건강 프로젝트"
                  value={newCycleName}
                  onChange={(e) => setNewCycleName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">비전</label>
                <Input
                  placeholder="12주 후 달성할 모습"
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
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsNewCycleOpen(false)} className="w-full sm:w-auto">
                취소
              </Button>
              <Button
                onClick={handleCreateCycle}
                disabled={!newCycleName.trim() || !newVision.trim() || loading}
                className="w-full sm:w-auto"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                시작하기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const currentWeekScore = cycle.weeklyScores.find(s => s.weekNumber === cycle.currentWeek);

  // 12주 실행률 데이터 생성
  const weeklyExecutionData = Array.from({ length: 12 }, (_, i) => {
    const weekScore = cycle.weeklyScores.find(s => s.weekNumber === i + 1);
    return {
      week: i + 1,
      rate: weekScore?.executionRate || 0
    };
  });

  const activeCycles = cycles.filter(c => c.status === 'active');
  const archivedCycles = cycles.filter(c => c.status === 'archived');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 에러 알림 */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg flex items-start gap-3 max-w-md">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button onClick={handleDismissError} className="text-red-400 hover:text-red-600">
            ×
          </button>
        </div>
      )}

      {/* 헤더 - 모바일 최적화 */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          {/* 상단 행: 로고 + 주차 + 메뉴 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">12주의 법칙</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* 주차 표시 + 버튼들 */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500 hidden sm:block">현재</p>
                <p className="text-base sm:text-lg font-bold text-blue-600">
                  Week {cycle.currentWeek}
                </p>
              </div>

              {/* 데스크톱: 모든 버튼 표시 */}
              <div className="hidden sm:flex gap-2">
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
                        새로운 12주 사이클을 만듭니다. 기존 사이클은 그대로 유지됩니다.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">사이클 이름</label>
                        <Input
                          placeholder="예: 2026 Q1 건강 프로젝트"
                          value={newCycleName}
                          onChange={(e) => setNewCycleName(e.target.value)}
                        />
                      </div>
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
                      <Button
                        onClick={handleCreateCycle}
                        disabled={!newCycleName.trim() || !newVision.trim() || loading}
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        시작하기
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={isCycleListOpen} onOpenChange={setIsCycleListOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" title="사이클 관리">
                      <FolderOpen className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>사이클 관리</DialogTitle>
                      <DialogDescription>
                        모든 사이클을 관리합니다. 사이클을 선택, 아카이브 또는 삭제할 수 있습니다.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
                      {activeCycles.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">활성 사이클</h4>
                          {activeCycles.map((c) => (
                            <div
                              key={c.id}
                              className={`flex items-center justify-between p-3 rounded-lg border ${
                                c.id === currentCycleId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                              }`}
                            >
                              <div className="flex-1 cursor-pointer" onClick={() => { selectCycle(c.id); setIsCycleListOpen(false); }}>
                                <p className="font-medium text-sm">{c.name}</p>
                                <p className="text-xs text-gray-500">Week {c.currentWeek} / 12</p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => archiveCycle(c.id)}
                                  title="아카이브"
                                  disabled={loading}
                                >
                                  <Archive className="w-4 h-4 text-gray-400" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => deleteCycle(c.id)}
                                  title="삭제"
                                  disabled={cycles.length === 1 || loading}
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {archivedCycles.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-500">아카이브된 사이클</h4>
                          {archivedCycles.map((c) => (
                            <div
                              key={c.id}
                              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 opacity-60"
                            >
                              <div className="flex-1 cursor-pointer" onClick={() => { selectCycle(c.id); setIsCycleListOpen(false); }}>
                                <p className="font-medium text-sm">{c.name}</p>
                                <p className="text-xs text-gray-400">{c.startDate} ~ {c.endDate}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => deleteCycle(c.id)}
                                title="삭제"
                                disabled={loading}
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>

              {/* 모바일: 메뉴 버튼 */}
              <Dialog open={isCycleListOpen} onOpenChange={setIsCycleListOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="sm:hidden h-9 w-9">
                    <Menu className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>사이클 관리</DialogTitle>
                  </DialogHeader>

                  {/* 모바일 메뉴 액션 버튼들 */}
                  <div className="flex gap-2 py-2 border-b">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => { setIsCycleListOpen(false); setIsNewCycleOpen(true); }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      새 사이클
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { handleSignOut(); setIsCycleListOpen(false); }}
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
                    {activeCycles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">활성 사이클</h4>
                        {activeCycles.map((c) => (
                          <div
                            key={c.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              c.id === currentCycleId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex-1 cursor-pointer min-w-0" onClick={() => { selectCycle(c.id); setIsCycleListOpen(false); }}>
                              <p className="font-medium text-sm truncate">{c.name}</p>
                              <p className="text-xs text-gray-500">Week {c.currentWeek} / 12</p>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => archiveCycle(c.id)}
                                disabled={loading}
                              >
                                <Archive className="w-4 h-4 text-gray-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => deleteCycle(c.id)}
                                disabled={cycles.length === 1 || loading}
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {archivedCycles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-500">아카이브된 사이클</h4>
                        {archivedCycles.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 opacity-60"
                          >
                            <div className="flex-1 cursor-pointer min-w-0" onClick={() => { selectCycle(c.id); setIsCycleListOpen(false); }}>
                              <p className="font-medium text-sm truncate">{c.name}</p>
                              <p className="text-xs text-gray-400">{c.startDate} ~ {c.endDate}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => deleteCycle(c.id)}
                              disabled={loading}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* 하단 행: 사이클 선택 (모바일에서는 전체 너비) */}
          <div className="mt-3 sm:mt-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2">
            <Select value={currentCycleId || ''} onValueChange={selectCycle}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="사이클 선택" />
              </SelectTrigger>
              <SelectContent>
                {activeCycles.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <div className="flex items-center gap-2">
                      <span>{c.name}</span>
                      {c.id === currentCycleId && (
                        <Badge variant="secondary" className="text-xs">현재</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* 새 사이클 다이얼로그 (모바일에서 접근 가능하도록) */}
      <Dialog open={isNewCycleOpen} onOpenChange={setIsNewCycleOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>새 12주 사이클 시작</DialogTitle>
            <DialogDescription>
              새로운 12주 사이클을 만듭니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">사이클 이름</label>
              <Input
                placeholder="예: 2026 Q1 건강 프로젝트"
                value={newCycleName}
                onChange={(e) => setNewCycleName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">비전</label>
              <Input
                placeholder="12주 후 달성할 모습"
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
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsNewCycleOpen(false)} className="w-full sm:w-auto">
              취소
            </Button>
            <Button
              onClick={handleCreateCycle}
              disabled={!newCycleName.trim() || !newVision.trim() || loading}
              className="w-full sm:w-auto"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              시작하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* 왼쪽 컬럼 */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <VisionCard cycle={cycle} />
            <DailyExecutionCard actions={cycle.dailyActions} />
          </div>

          {/* 중앙 컬럼 */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <WeeklyPlanCard tasks={cycle.weeklyTasks} />
            <HabitsCard habits={cycle.habits} />
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
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

      {/* 푸터 - 모바일 최적화 */}
      <footer className="bg-white border-t mt-4 sm:mt-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-0 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-400">
              "85%의 실행률이 당신을 성공으로 이끕니다"
            </p>
            <p className="text-xs text-gray-300">
              {cycle.name} · Week {cycle.currentWeek}/12
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

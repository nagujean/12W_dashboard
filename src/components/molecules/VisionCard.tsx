'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/atoms/SectionHeader';
import { Target, Calendar, Plus, Trash2, X, Edit2, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { TwelveWeekCycle, SECTION_GUIDES } from '@/types';
import { useStore } from '@/stores/useStore';

interface VisionCardProps {
  cycle: TwelveWeekCycle;
}

export function VisionCard({ cycle }: VisionCardProps) {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isEditingVision, setIsEditingVision] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [editedVision, setEditedVision] = useState(cycle.vision);

  const updateVision = useStore((state) => state.updateVision);
  const updateCurrentWeek = useStore((state) => state.updateCurrentWeek);
  const addGoal = useStore((state) => state.addGoal);
  const updateGoal = useStore((state) => state.updateGoal);
  const deleteGoal = useStore((state) => state.deleteGoal);

  // 사이클 변경 시 비전 입력 상태 동기화
  useEffect(() => {
    setEditedVision(cycle.vision);
  }, [cycle.id, cycle.vision]);

  const totalProgress = cycle.goals.length > 0
    ? Math.round(cycle.goals.reduce((sum, goal) => sum + goal.progress, 0) / cycle.goals.length)
    : 0;
  const weeksRemaining = 13 - cycle.currentWeek;

  const handleSaveVision = () => {
    if (editedVision.trim()) {
      updateVision(editedVision.trim());
      setIsEditingVision(false);
    }
  };

  const handleAddGoal = () => {
    if (newGoalTitle.trim()) {
      addGoal({
        title: newGoalTitle.trim(),
        description: '',
        targetDate: cycle.endDate,
        progress: 0
      });
      setNewGoalTitle('');
      setIsAddingGoal(false);
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-2 px-3 sm:px-6">
        <SectionHeader title="12주 비전 & 목표" guide={SECTION_GUIDES.vision} />
      </CardHeader>
      <CardContent className="space-y-4 px-3 sm:px-6">
        {/* 비전 */}
        <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          {isEditingVision ? (
            <div className="flex gap-2">
              <Input
                value={editedVision}
                onChange={(e) => setEditedVision(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveVision()}
                autoFocus
                className="text-base"
              />
              <Button size="icon" variant="ghost" onClick={handleSaveVision} className="h-9 w-9 flex-shrink-0">
                <Check className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setIsEditingVision(false)} className="h-9 w-9 flex-shrink-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div
              className="flex items-start justify-between gap-2 cursor-pointer active:opacity-70"
              onClick={() => setIsEditingVision(true)}
            >
              <p className="text-sm sm:text-base text-gray-700 font-medium italic flex-1">"{cycle.vision}"</p>
              <Edit2 className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            </div>
          )}
        </div>

        {/* 주차 정보 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9"
              onClick={() => updateCurrentWeek(cycle.currentWeek - 1)}
              disabled={cycle.currentWeek <= 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-1.5 text-gray-500 px-1">
              <Calendar className="w-4 h-4" />
              <span className="font-medium text-sm sm:text-base">Week {cycle.currentWeek} / 12</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9"
              onClick={() => updateCurrentWeek(cycle.currentWeek + 1)}
              disabled={cycle.currentWeek >= 13}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          <Badge variant={weeksRemaining <= 2 ? "destructive" : "secondary"} className="text-xs">
            {weeksRemaining > 0 ? `${weeksRemaining}주 남음` : '사이클 종료'}
          </Badge>
        </div>

        {/* 전체 진행률 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">전체 목표 진행률</span>
            <span className="font-semibold">{totalProgress}%</span>
          </div>
          <Progress value={totalProgress} className="h-2.5" />
        </div>

        {/* 핵심 목표 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              핵심 목표
            </h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setIsAddingGoal(!isAddingGoal)}
            >
              {isAddingGoal ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>

          {isAddingGoal && (
            <div className="flex gap-2">
              <Input
                placeholder="새 목표 입력..."
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                autoFocus
                className="text-base"
              />
              <Button size="sm" onClick={handleAddGoal} className="px-4">추가</Button>
            </div>
          )}

          <div className="space-y-2">
            {cycle.goals.map((goal) => (
              <div key={goal.id} className="p-3 bg-gray-50 rounded-lg group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 flex-1 font-medium">{goal.title}</span>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="opacity-0 group-hover:opacity-100 sm:opacity-0 active:opacity-100 transition-opacity p-1.5 hover:bg-red-100 rounded ml-2"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => updateGoal(goal.id, { progress: parseInt(e.target.value) })}
                    className="flex-1 h-2 cursor-pointer accent-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-600 w-10 text-right">{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>

          {cycle.goals.length === 0 && !isAddingGoal && (
            <p className="text-sm text-gray-400 text-center py-3">
              + 버튼을 눌러 12주 목표를 추가하세요
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

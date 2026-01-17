'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/atoms/SectionHeader';
import { CheckCircle2, Circle, Flame, Zap, Leaf, Plus, Trash2, X } from 'lucide-react';
import { DailyAction, SECTION_GUIDES } from '@/types';
import { useStore } from '@/stores/useStore';

interface DailyExecutionCardProps {
  actions: DailyAction[];
}

const priorityConfig = {
  high: { icon: Flame, color: 'text-red-500', bg: 'bg-red-50', label: '중요' },
  medium: { icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50', label: '보통' },
  low: { icon: Leaf, color: 'text-green-500', bg: 'bg-green-50', label: '낮음' }
};

export function DailyExecutionCard({ actions }: DailyExecutionCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('high');

  const toggleDailyAction = useStore((state) => state.toggleDailyAction);
  const addDailyAction = useStore((state) => state.addDailyAction);
  const deleteDailyAction = useStore((state) => state.deleteDailyAction);

  const completedCount = actions.filter(a => a.completed).length;
  const today = new Date().toISOString().split('T')[0];

  const handleAddAction = () => {
    if (newActionTitle.trim()) {
      addDailyAction({
        title: newActionTitle.trim(),
        completed: false,
        date: today,
        priority: newPriority
      });
      setNewActionTitle('');
      setIsAdding(false);
    }
  };

  return (
    <Card className="border-t-4 border-t-orange-400">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <SectionHeader title="오늘의 실행" guide={SECTION_GUIDES.dailyExecution} />
          <div className="flex items-center gap-2">
            <Badge variant={completedCount === actions.length && actions.length > 0 ? "default" : "secondary"}>
              {completedCount} / {actions.length}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsAdding(!isAdding)}
            >
              {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-500 mb-3">
          오늘 집중할 핵심 행동 (최대 3개 권장)
        </p>

        {isAdding && (
          <div className="space-y-2 mb-3 p-3 bg-gray-50 rounded-lg">
            <Input
              placeholder="오늘 할 일 입력..."
              value={newActionTitle}
              onChange={(e) => setNewActionTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddAction()}
              autoFocus
            />
            <div className="flex gap-2">
              {(['high', 'medium', 'low'] as const).map((p) => {
                const config = priorityConfig[p];
                return (
                  <Button
                    key={p}
                    variant={newPriority === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNewPriority(p)}
                    className="flex-1"
                  >
                    {config.label}
                  </Button>
                );
              })}
            </div>
            <Button size="sm" onClick={handleAddAction} className="w-full">추가</Button>
          </div>
        )}

        <ul className="space-y-2">
          {actions.map((action) => {
            const config = priorityConfig[action.priority];
            const Icon = config.icon;

            return (
              <li
                key={action.id}
                className={`flex items-center gap-3 p-3 rounded-lg group ${
                  action.completed ? 'bg-gray-50 opacity-60' : config.bg
                }`}
              >
                <button
                  onClick={() => toggleDailyAction(action.id)}
                  className="flex-shrink-0"
                >
                  {action.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                  )}
                </button>
                <span className={`text-sm flex-1 font-medium ${
                  action.completed ? 'line-through text-gray-400' : 'text-gray-700'
                }`}>
                  {action.title}
                </span>
                <Icon className={`w-4 h-4 ${action.completed ? 'text-gray-300' : config.color}`} />
                <button
                  onClick={() => deleteDailyAction(action.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </li>
            );
          })}
        </ul>

        {actions.length === 0 && !isAdding && (
          <p className="text-sm text-gray-400 text-center py-4">
            + 버튼을 눌러 오늘의 핵심 행동을 추가하세요
          </p>
        )}
      </CardContent>
    </Card>
  );
}

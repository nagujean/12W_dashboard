'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/atoms/SectionHeader';
import { CheckCircle2, Circle, Flame, Zap, Leaf } from 'lucide-react';
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
  const toggleDailyAction = useStore((state) => state.toggleDailyAction);
  const completedCount = actions.filter(a => a.completed).length;

  return (
    <Card className="border-t-4 border-t-orange-400">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <SectionHeader title="오늘의 실행" guide={SECTION_GUIDES.dailyExecution} />
          <Badge variant={completedCount === actions.length ? "default" : "secondary"}>
            {completedCount} / {actions.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-500 mb-3">
          오늘 집중할 핵심 행동 (최대 3개)
        </p>
        <ul className="space-y-2">
          {actions.map((action) => {
            const config = priorityConfig[action.priority];
            const Icon = config.icon;

            return (
              <li
                key={action.id}
                onClick={() => toggleDailyAction(action.id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  action.completed ? 'bg-gray-50 opacity-60' : config.bg
                }`}
              >
                {action.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                )}
                <span className={`text-sm flex-1 font-medium ${
                  action.completed ? 'line-through text-gray-400' : 'text-gray-700'
                }`}>
                  {action.title}
                </span>
                <Icon className={`w-4 h-4 ${action.completed ? 'text-gray-300' : config.color}`} />
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

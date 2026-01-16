'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/atoms/SectionHeader';
import { CheckCircle2, Circle } from 'lucide-react';
import { WeeklyTask, SECTION_GUIDES } from '@/types';
import { useStore } from '@/stores/useStore';

interface WeeklyPlanCardProps {
  tasks: WeeklyTask[];
}

export function WeeklyPlanCard({ tasks }: WeeklyPlanCardProps) {
  const toggleWeeklyTask = useStore((state) => state.toggleWeeklyTask);
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <SectionHeader title="주간 계획" guide={SECTION_GUIDES.weeklyPlan} />
          <Badge variant="outline">
            {completedCount} / {tasks.length} 완료
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              onClick={() => toggleWeeklyTask(task.id)}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all hover:bg-gray-50 ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
              )}
              <span className={`text-sm flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {task.title}
              </span>
              <span className="text-xs text-gray-400">{task.dueDate.slice(5)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

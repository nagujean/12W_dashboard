'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/atoms/SectionHeader';
import { CheckCircle2, Circle, Plus, Trash2, X } from 'lucide-react';
import { WeeklyTask, SECTION_GUIDES } from '@/types';
import { useStore } from '@/stores/useStore';

interface WeeklyPlanCardProps {
  tasks: WeeklyTask[];
}

export function WeeklyPlanCard({ tasks }: WeeklyPlanCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const toggleWeeklyTask = useStore((state) => state.toggleWeeklyTask);
  const addWeeklyTask = useStore((state) => state.addWeeklyTask);
  const deleteWeeklyTask = useStore((state) => state.deleteWeeklyTask);
  const getCurrentCycle = useStore((state) => state.getCurrentCycle);
  const cycle = getCurrentCycle();
  const goals = cycle?.goals || [];

  const completedCount = tasks.filter(t => t.completed).length;

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const today = new Date();
      const sunday = new Date(today);
      sunday.setDate(today.getDate() + (7 - today.getDay()));

      addWeeklyTask({
        title: newTaskTitle.trim(),
        completed: false,
        dueDate: sunday.toISOString().split('T')[0],
        goalId: goals[0]?.id || ''
      });
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <SectionHeader title="주간 계획" guide={SECTION_GUIDES.weeklyPlan} />
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {completedCount}/{tasks.length}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setIsAdding(!isAdding)}
            >
              {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        {isAdding && (
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="새 과제 입력..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              autoFocus
              className="text-base"
            />
            <Button size="sm" onClick={handleAddTask} className="px-4">추가</Button>
          </div>
        )}
        <ul className="space-y-1">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg group hover:bg-gray-50 active:bg-gray-100 ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <button
                onClick={() => toggleWeeklyTask(task.id)}
                className="flex-shrink-0 p-1"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </button>
              <span className={`text-sm flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {task.title}
              </span>
              <span className="text-xs text-gray-400 hidden sm:block">{task.dueDate.slice(5)}</span>
              <button
                onClick={() => deleteWeeklyTask(task.id)}
                className="opacity-0 group-hover:opacity-100 sm:opacity-0 active:opacity-100 transition-opacity p-1.5 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </li>
          ))}
        </ul>
        {tasks.length === 0 && !isAdding && (
          <p className="text-sm text-gray-400 text-center py-4">
            + 버튼을 눌러 이번 주 과제를 추가하세요
          </p>
        )}
      </CardContent>
    </Card>
  );
}

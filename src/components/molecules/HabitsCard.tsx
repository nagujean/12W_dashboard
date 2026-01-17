'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/atoms/SectionHeader';
import { Check, X, Plus, Trash2 } from 'lucide-react';
import { Habit } from '@/types';
import { useStore } from '@/stores/useStore';

interface HabitsCardProps {
  habits: Habit[];
}

// 이번 주 날짜 생성 (월-일)
function getWeekDays(): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

export function HabitsCard({ habits }: HabitsCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');

  const toggleHabit = useStore((state) => state.toggleHabit);
  const addHabit = useStore((state) => state.addHabit);
  const deleteHabit = useStore((state) => state.deleteHabit);

  const weekDays = getWeekDays();
  const today = new Date().toISOString().split('T')[0];

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit({
        name: newHabitName.trim(),
        targetDaysPerWeek: 7
      });
      setNewHabitName('');
      setIsAdding(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <SectionHeader title="습관 트래커" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsAdding(!isAdding)}
          >
            {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="새 습관 입력..."
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
              autoFocus
            />
            <Button size="sm" onClick={handleAddHabit}>추가</Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left font-medium text-gray-600 pb-2 pr-4">습관</th>
                {dayNames.map((day, i) => (
                  <th
                    key={day}
                    className={`text-center font-medium pb-2 w-8 ${
                      weekDays[i] === today ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    {day}
                  </th>
                ))}
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => (
                <tr key={habit.id} className="border-t group">
                  <td className="py-2 pr-4 text-gray-700">{habit.name}</td>
                  {weekDays.map((date) => {
                    const isCompleted = habit.completedDates.includes(date);
                    const isToday = date === today;
                    const isPast = date < today;

                    return (
                      <td key={date} className="text-center py-2">
                        <button
                          onClick={() => toggleHabit(habit.id, date)}
                          disabled={!isPast && !isToday}
                          className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-green-100 text-green-600'
                              : isToday
                              ? 'bg-blue-50 text-gray-300 hover:bg-blue-100'
                              : isPast
                              ? 'bg-red-50 text-red-300'
                              : 'bg-gray-50 text-gray-200'
                          } ${(isPast || isToday) ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4" />
                          ) : isPast ? (
                            <X className="w-3 h-3" />
                          ) : null}
                        </button>
                      </td>
                    );
                  })}
                  <td className="py-2">
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {habits.length === 0 && !isAdding && (
          <p className="text-sm text-gray-400 text-center py-4">
            + 버튼을 눌러 추적할 습관을 추가하세요
          </p>
        )}
      </CardContent>
    </Card>
  );
}

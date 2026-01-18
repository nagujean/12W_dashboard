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
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <SectionHeader title="습관 트래커" />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setIsAdding(!isAdding)}
          >
            {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        {isAdding && (
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="새 습관 입력..."
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
              autoFocus
              className="text-base"
            />
            <Button size="sm" onClick={handleAddHabit} className="px-4">추가</Button>
          </div>
        )}

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day, i) => (
            <div
              key={day}
              className={`text-center text-xs sm:text-sm font-medium py-1 ${
                weekDays[i] === today ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 습관 목록 */}
        <div className="space-y-3">
          {habits.map((habit) => (
            <div key={habit.id} className="border rounded-lg p-2 sm:p-3 group">
              {/* 습관 이름 + 삭제 버튼 */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 truncate flex-1">
                  {habit.name}
                </span>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="opacity-0 group-hover:opacity-100 sm:opacity-0 active:opacity-100 transition-opacity p-1.5 hover:bg-red-50 rounded ml-2"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>

              {/* 요일별 체크 버튼 */}
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((date) => {
                  const isCompleted = habit.completedDates.includes(date);
                  const isToday = date === today;
                  const isPast = date < today;

                  return (
                    <button
                      key={date}
                      onClick={() => toggleHabit(habit.id, date)}
                      disabled={!isPast && !isToday}
                      className={`aspect-square min-h-[36px] sm:min-h-[40px] rounded-lg flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : isToday
                          ? 'bg-blue-50 text-gray-300 hover:bg-blue-100 ring-2 ring-blue-200'
                          : isPast
                          ? 'bg-red-50 text-red-300'
                          : 'bg-gray-50 text-gray-200'
                      } ${(isPast || isToday) ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : isPast ? (
                        <X className="w-4 h-4" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
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

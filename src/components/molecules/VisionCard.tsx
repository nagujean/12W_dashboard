'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/atoms/SectionHeader';
import { Target, Calendar } from 'lucide-react';
import { TwelveWeekCycle, SECTION_GUIDES } from '@/types';

interface VisionCardProps {
  cycle: TwelveWeekCycle;
}

export function VisionCard({ cycle }: VisionCardProps) {
  const totalProgress = Math.round(
    cycle.goals.reduce((sum, goal) => sum + goal.progress, 0) / cycle.goals.length
  );
  const weeksRemaining = 12 - cycle.currentWeek + 1;

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-2">
        <SectionHeader title="12주 비전 & 목표" guide={SECTION_GUIDES.vision} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <p className="text-gray-700 font-medium italic">"{cycle.vision}"</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Week {cycle.currentWeek} / 12</span>
          </div>
          <Badge variant="secondary">{weeksRemaining}주 남음</Badge>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">전체 목표 진행률</span>
            <span className="font-semibold">{totalProgress}%</span>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <Target className="w-4 h-4" />
            핵심 목표
          </h4>
          {cycle.goals.map((goal) => (
            <div key={goal.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-700">{goal.title}</span>
              <div className="flex items-center gap-2">
                <Progress value={goal.progress} className="w-20 h-1.5" />
                <span className="text-xs text-gray-500 w-8">{goal.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

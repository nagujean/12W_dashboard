'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SectionHeader } from '@/components/atoms/SectionHeader';
import { SECTION_GUIDES } from '@/types';

interface WeeklyProgressChartProps {
  data: { week: number; rate: number }[];
  currentWeek: number;
}

export function WeeklyProgressChart({ data, currentWeek }: WeeklyProgressChartProps) {
  const maxRate = Math.max(...data.map(d => d.rate), 100);

  return (
    <Card>
      <CardHeader className="pb-2">
        <SectionHeader title="12주 실행률 추이" guide={SECTION_GUIDES.weeklyAccountability} />
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-1 h-32">
          {data.map((item) => {
            const height = item.rate > 0 ? (item.rate / maxRate) * 100 : 5;
            const isCurrent = item.week === currentWeek;
            const isPast = item.week < currentWeek;
            const meetsTarget = item.rate >= 85;

            return (
              <div
                key={item.week}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div className="relative w-full flex justify-center">
                  <div
                    className={`w-full max-w-6 rounded-t transition-all ${
                      isCurrent
                        ? 'bg-blue-500'
                        : isPast
                        ? meetsTarget
                          ? 'bg-green-400'
                          : 'bg-orange-400'
                        : 'bg-gray-200'
                    }`}
                    style={{ height: `${height}%`, minHeight: '4px' }}
                  />
                  {item.rate > 0 && (
                    <span className="absolute -top-5 text-[10px] text-gray-500">
                      {item.rate}%
                    </span>
                  )}
                </div>
                <span className={`text-[10px] ${isCurrent ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                  {item.week}
                </span>
              </div>
            );
          })}
        </div>
        {/* 85% 기준선 */}
        <div className="relative mt-2">
          <div className="absolute left-0 right-0 border-t-2 border-dashed border-green-300" style={{ bottom: '85%' }} />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Week</span>
            <span className="text-green-500">목표: 85%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

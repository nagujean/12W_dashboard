'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SectionHeader } from '@/components/atoms/SectionHeader';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LeadIndicator, SECTION_GUIDES } from '@/types';

interface WeeklyScorecardCardProps {
  indicators: LeadIndicator[];
  executionRate: number;
}

export function WeeklyScorecardCard({ indicators, executionRate }: WeeklyScorecardCardProps) {
  const getStatusIcon = (target: number, actual: number) => {
    const ratio = actual / target;
    if (ratio >= 1) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (ratio >= 0.7) return <Minus className="w-4 h-4 text-yellow-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const executionColor = executionRate >= 85 ? 'text-green-600' : executionRate >= 70 ? 'text-yellow-600' : 'text-red-600';

  return (
    <Card>
      <CardHeader className="pb-2">
        <SectionHeader title="주간 점수판" guide={SECTION_GUIDES.weeklyScorecard} />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 실행률 */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">주간 실행률</span>
            <span className={`text-2xl font-bold ${executionColor}`}>
              {executionRate}%
            </span>
          </div>
          <Progress
            value={executionRate}
            className="h-2"
          />
          <p className="text-xs text-gray-400 mt-2">
            목표: 85% 이상
          </p>
        </div>

        {/* 리드 지표 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">리드 지표 (선행 지표)</h4>
          {indicators.map((indicator) => (
            <div key={indicator.id} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(indicator.target, indicator.actual)}
                <span className="text-sm text-gray-700">{indicator.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">
                  {indicator.actual} / {indicator.target} {indicator.unit}
                </span>
                <div className="w-16 mt-1">
                  <Progress
                    value={Math.min((indicator.actual / indicator.target) * 100, 100)}
                    className="h-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

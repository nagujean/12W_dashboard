'use client';

import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { GuideInfo } from '@/types';

interface GuideTooltipProps {
  guide: GuideInfo;
}

export function GuideTooltip({ guide }: GuideTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <Info className="w-3 h-3 text-gray-500" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs p-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">{guide.title}</h4>
            <p className="text-xs text-gray-600">{guide.description}</p>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-blue-600">
                <span className="font-medium">Tip:</span> {guide.tip}
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

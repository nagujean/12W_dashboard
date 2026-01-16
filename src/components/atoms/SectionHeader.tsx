import { GuideTooltip } from './GuideTooltip';
import { GuideInfo } from '@/types';

interface SectionHeaderProps {
  title: string;
  guide?: GuideInfo;
}

export function SectionHeader({ title, guide }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {guide && <GuideTooltip guide={guide} />}
    </div>
  );
}

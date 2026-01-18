'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, Target, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-16 pb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            12주의 법칙
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            브라이언 P. 모건의 "12주의 법칙" 방법론을 기반으로 한
            개인 생산성 대시보드입니다. 12주를 1년처럼 집중하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                무료로 시작하기
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                로그인
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Target className="w-8 h-8 text-blue-600" />}
              title="비전 & 목표"
              description="감정적으로 연결된 1-3개의 핵심 목표를 설정하세요"
            />
            <FeatureCard
              icon={<Calendar className="w-8 h-8 text-green-600" />}
              title="주간 계획"
              description="목표를 주간 단위 행동으로 분해하세요"
            />
            <FeatureCard
              icon={<CheckCircle2 className="w-8 h-8 text-orange-600" />}
              title="일일 실행"
              description="매일 핵심 3가지 행동에 집중하세요"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-purple-600" />}
              title="주간 점수판"
              description="85% 실행률이 성공의 기준입니다"
            />
          </div>
        </div>

        {/* Quote Section */}
        <div className="py-16 text-center">
          <blockquote className="text-2xl italic text-gray-600 max-w-3xl mx-auto">
            "연간 목표의 함정을 피하세요. 12주를 1년처럼 긴박하게!"
          </blockquote>
          <p className="mt-4 text-gray-500">- 브라이언 P. 모건</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>&copy; 2026 12주의 법칙 대시보드</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

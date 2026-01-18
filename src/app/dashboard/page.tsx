'use client';

import { AuthGuard } from '@/components/atoms/AuthGuard';
import { Dashboard } from '@/components/organisms/Dashboard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}

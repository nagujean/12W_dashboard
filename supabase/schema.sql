-- 12주의 법칙 대시보드 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요

-- =====================
-- 테이블 생성
-- =====================

-- 사이클 테이블
CREATE TABLE IF NOT EXISTS cycles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  vision TEXT NOT NULL,
  current_week INTEGER DEFAULT 1 CHECK (current_week >= 1 AND current_week <= 13),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 목표 테이블
CREATE TABLE IF NOT EXISTS goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  target_date DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 주간 과제 테이블
CREATE TABLE IF NOT EXISTS weekly_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE NOT NULL,
  goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 일일 행동 테이블
CREATE TABLE IF NOT EXISTS daily_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  date DATE NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 습관 테이블
CREATE TABLE IF NOT EXISTS habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  target_days_per_week INTEGER DEFAULT 7 CHECK (target_days_per_week >= 1 AND target_days_per_week <= 7),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 습관 완료 기록 테이블
CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  completed_date DATE NOT NULL,
  UNIQUE(habit_id, completed_date)
);

-- 주간 점수 테이블
CREATE TABLE IF NOT EXISTS weekly_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE NOT NULL,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 13),
  planned_tasks INTEGER DEFAULT 0,
  completed_tasks INTEGER DEFAULT 0,
  execution_rate INTEGER DEFAULT 0 CHECK (execution_rate >= 0 AND execution_rate <= 100),
  UNIQUE(cycle_id, week_number)
);

-- 선행 지표 테이블
CREATE TABLE IF NOT EXISTS lead_indicators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  weekly_score_id UUID REFERENCES weekly_scores(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  target INTEGER DEFAULT 0,
  actual INTEGER DEFAULT 0,
  unit TEXT DEFAULT ''
);

-- =====================
-- 인덱스 생성 (성능 최적화)
-- =====================

CREATE INDEX IF NOT EXISTS idx_cycles_user_id ON cycles(user_id);
CREATE INDEX IF NOT EXISTS idx_cycles_status ON cycles(status);
CREATE INDEX IF NOT EXISTS idx_goals_cycle_id ON goals(cycle_id);
CREATE INDEX IF NOT EXISTS idx_weekly_tasks_cycle_id ON weekly_tasks(cycle_id);
CREATE INDEX IF NOT EXISTS idx_weekly_tasks_goal_id ON weekly_tasks(goal_id);
CREATE INDEX IF NOT EXISTS idx_daily_actions_cycle_id ON daily_actions(cycle_id);
CREATE INDEX IF NOT EXISTS idx_daily_actions_date ON daily_actions(date);
CREATE INDEX IF NOT EXISTS idx_habits_cycle_id ON habits(cycle_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON habit_completions(completed_date);
CREATE INDEX IF NOT EXISTS idx_weekly_scores_cycle_id ON weekly_scores(cycle_id);
CREATE INDEX IF NOT EXISTS idx_lead_indicators_weekly_score_id ON lead_indicators(weekly_score_id);

-- =====================
-- Row Level Security (RLS) 설정
-- =====================

-- RLS 활성화
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_indicators ENABLE ROW LEVEL SECURITY;

-- cycles: 본인 데이터만 접근 가능
CREATE POLICY "Users can view own cycles"
  ON cycles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cycles"
  ON cycles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cycles"
  ON cycles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cycles"
  ON cycles FOR DELETE
  USING (auth.uid() = user_id);

-- goals: 본인 사이클의 목표만 접근 가능
CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  USING (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  WITH CHECK (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  USING (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  USING (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

-- weekly_tasks: 본인 사이클의 과제만 접근 가능
CREATE POLICY "Users can view own weekly_tasks"
  ON weekly_tasks FOR SELECT
  USING (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own weekly_tasks"
  ON weekly_tasks FOR INSERT
  WITH CHECK (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own weekly_tasks"
  ON weekly_tasks FOR UPDATE
  USING (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own weekly_tasks"
  ON weekly_tasks FOR DELETE
  USING (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

-- daily_actions: 본인 사이클의 행동만 접근 가능
CREATE POLICY "Users can view own daily_actions"
  ON daily_actions FOR SELECT
  USING (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own daily_actions"
  ON daily_actions FOR INSERT
  WITH CHECK (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own daily_actions"
  ON daily_actions FOR UPDATE
  USING (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own daily_actions"
  ON daily_actions FOR DELETE
  USING (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

-- habits: 본인 사이클의 습관만 접근 가능
CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  USING (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own habits"
  ON habits FOR INSERT
  WITH CHECK (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  USING (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  USING (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

-- habit_completions: 본인 습관의 완료 기록만 접근 가능
CREATE POLICY "Users can view own habit_completions"
  ON habit_completions FOR SELECT
  USING (habit_id IN (
    SELECT h.id FROM habits h
    JOIN cycles c ON h.cycle_id = c.id
    WHERE c.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own habit_completions"
  ON habit_completions FOR INSERT
  WITH CHECK (habit_id IN (
    SELECT h.id FROM habits h
    JOIN cycles c ON h.cycle_id = c.id
    WHERE c.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own habit_completions"
  ON habit_completions FOR UPDATE
  USING (habit_id IN (
    SELECT h.id FROM habits h
    JOIN cycles c ON h.cycle_id = c.id
    WHERE c.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own habit_completions"
  ON habit_completions FOR DELETE
  USING (habit_id IN (
    SELECT h.id FROM habits h
    JOIN cycles c ON h.cycle_id = c.id
    WHERE c.user_id = auth.uid()
  ));

-- weekly_scores: 본인 사이클의 점수만 접근 가능
CREATE POLICY "Users can view own weekly_scores"
  ON weekly_scores FOR SELECT
  USING (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own weekly_scores"
  ON weekly_scores FOR INSERT
  WITH CHECK (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own weekly_scores"
  ON weekly_scores FOR UPDATE
  USING (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own weekly_scores"
  ON weekly_scores FOR DELETE
  USING (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()));

-- lead_indicators: 본인 주간 점수의 지표만 접근 가능
CREATE POLICY "Users can view own lead_indicators"
  ON lead_indicators FOR SELECT
  USING (weekly_score_id IN (
    SELECT ws.id FROM weekly_scores ws
    JOIN cycles c ON ws.cycle_id = c.id
    WHERE c.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own lead_indicators"
  ON lead_indicators FOR INSERT
  WITH CHECK (weekly_score_id IN (
    SELECT ws.id FROM weekly_scores ws
    JOIN cycles c ON ws.cycle_id = c.id
    WHERE c.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own lead_indicators"
  ON lead_indicators FOR UPDATE
  USING (weekly_score_id IN (
    SELECT ws.id FROM weekly_scores ws
    JOIN cycles c ON ws.cycle_id = c.id
    WHERE c.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own lead_indicators"
  ON lead_indicators FOR DELETE
  USING (weekly_score_id IN (
    SELECT ws.id FROM weekly_scores ws
    JOIN cycles c ON ws.cycle_id = c.id
    WHERE c.user_id = auth.uid()
  ));

// Supabase Database Types
// Generated types matching our database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      cycles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          start_date: string;
          end_date: string;
          vision: string;
          current_week: number;
          status: 'active' | 'completed' | 'archived';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          start_date: string;
          end_date: string;
          vision: string;
          current_week?: number;
          status?: 'active' | 'completed' | 'archived';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          start_date?: string;
          end_date?: string;
          vision?: string;
          current_week?: number;
          status?: 'active' | 'completed' | 'archived';
          created_at?: string;
        };
        Relationships: [];
      };
      goals: {
        Row: {
          id: string;
          cycle_id: string;
          title: string;
          description: string;
          target_date: string | null;
          progress: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          cycle_id: string;
          title: string;
          description?: string;
          target_date?: string | null;
          progress?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          cycle_id?: string;
          title?: string;
          description?: string;
          target_date?: string | null;
          progress?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'goals_cycle_id_fkey';
            columns: ['cycle_id'];
            isOneToOne: false;
            referencedRelation: 'cycles';
            referencedColumns: ['id'];
          }
        ];
      };
      weekly_tasks: {
        Row: {
          id: string;
          cycle_id: string;
          goal_id: string | null;
          title: string;
          completed: boolean;
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          cycle_id: string;
          goal_id?: string | null;
          title: string;
          completed?: boolean;
          due_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          cycle_id?: string;
          goal_id?: string | null;
          title?: string;
          completed?: boolean;
          due_date?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'weekly_tasks_cycle_id_fkey';
            columns: ['cycle_id'];
            isOneToOne: false;
            referencedRelation: 'cycles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'weekly_tasks_goal_id_fkey';
            columns: ['goal_id'];
            isOneToOne: false;
            referencedRelation: 'goals';
            referencedColumns: ['id'];
          }
        ];
      };
      daily_actions: {
        Row: {
          id: string;
          cycle_id: string;
          title: string;
          completed: boolean;
          date: string;
          priority: 'high' | 'medium' | 'low';
          created_at: string;
        };
        Insert: {
          id?: string;
          cycle_id: string;
          title: string;
          completed?: boolean;
          date: string;
          priority?: 'high' | 'medium' | 'low';
          created_at?: string;
        };
        Update: {
          id?: string;
          cycle_id?: string;
          title?: string;
          completed?: boolean;
          date?: string;
          priority?: 'high' | 'medium' | 'low';
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'daily_actions_cycle_id_fkey';
            columns: ['cycle_id'];
            isOneToOne: false;
            referencedRelation: 'cycles';
            referencedColumns: ['id'];
          }
        ];
      };
      habits: {
        Row: {
          id: string;
          cycle_id: string;
          name: string;
          target_days_per_week: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          cycle_id: string;
          name: string;
          target_days_per_week?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          cycle_id?: string;
          name?: string;
          target_days_per_week?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'habits_cycle_id_fkey';
            columns: ['cycle_id'];
            isOneToOne: false;
            referencedRelation: 'cycles';
            referencedColumns: ['id'];
          }
        ];
      };
      habit_completions: {
        Row: {
          id: string;
          habit_id: string;
          completed_date: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          completed_date: string;
        };
        Update: {
          id?: string;
          habit_id?: string;
          completed_date?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'habit_completions_habit_id_fkey';
            columns: ['habit_id'];
            isOneToOne: false;
            referencedRelation: 'habits';
            referencedColumns: ['id'];
          }
        ];
      };
      weekly_scores: {
        Row: {
          id: string;
          cycle_id: string;
          week_number: number;
          planned_tasks: number;
          completed_tasks: number;
          execution_rate: number;
        };
        Insert: {
          id?: string;
          cycle_id: string;
          week_number: number;
          planned_tasks?: number;
          completed_tasks?: number;
          execution_rate?: number;
        };
        Update: {
          id?: string;
          cycle_id?: string;
          week_number?: number;
          planned_tasks?: number;
          completed_tasks?: number;
          execution_rate?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'weekly_scores_cycle_id_fkey';
            columns: ['cycle_id'];
            isOneToOne: false;
            referencedRelation: 'cycles';
            referencedColumns: ['id'];
          }
        ];
      };
      lead_indicators: {
        Row: {
          id: string;
          weekly_score_id: string;
          name: string;
          target: number;
          actual: number;
          unit: string;
        };
        Insert: {
          id?: string;
          weekly_score_id: string;
          name: string;
          target?: number;
          actual?: number;
          unit?: string;
        };
        Update: {
          id?: string;
          weekly_score_id?: string;
          name?: string;
          target?: number;
          actual?: number;
          unit?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lead_indicators_weekly_score_id_fkey';
            columns: ['weekly_score_id'];
            isOneToOne: false;
            referencedRelation: 'weekly_scores';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Utility types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

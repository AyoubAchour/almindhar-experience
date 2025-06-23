export interface Database {
  public: {
    Tables: {
      user_onboarding_progress: {
        Row: {
          id: string;
          user_id: string;
          steps_completed: Record<number, boolean>;
          current_step: number;
          is_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          steps_completed?: Record<number, boolean>;
          current_step?: number;
          is_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          steps_completed?: Record<number, boolean>;
          current_step?: number;
          is_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

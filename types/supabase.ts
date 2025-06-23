export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          created_at: string
          full_name: string
          avatar_url: string | null
          preferences: string[]
          profile_complete: boolean
        }
        Insert: {
          id: string
          created_at?: string
          full_name: string
          avatar_url?: string | null
          preferences?: string[]
          profile_complete?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string
          avatar_url?: string | null
          preferences?: string[]
          profile_complete?: boolean
        }
      }
    }
  }
}

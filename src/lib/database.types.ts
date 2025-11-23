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
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          icon: string
          color: string
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string
          icon?: string
          color?: string
          order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          icon?: string
          color?: string
          order?: number
          created_at?: string
        }
      }
      tools: {
        Row: {
          id: string
          name: string
          description: string
          url: string
          category_id: string
          tags: string[]
          is_trending: boolean
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          url: string
          category_id: string
          tags?: string[]
          is_trending?: boolean
          order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          url?: string
          category_id?: string
          tags?: string[]
          is_trending?: boolean
          order?: number
          created_at?: string
        }
      }
    }
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      checklist_categories: {
        Row: {
          created_at: string | null
          created_by: string
          display_order: number | null
          icon_key: string | null
          id: string
          name: string
          trip_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          display_order?: number | null
          icon_key?: string | null
          id?: string
          name: string
          trip_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          display_order?: number | null
          icon_key?: string | null
          id?: string
          name?: string
          trip_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_categories_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          cabin_notes: string | null
          cabin_policy: string | null
          category_id: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_checked: boolean | null
          is_required: boolean | null
          name: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          cabin_notes?: string | null
          cabin_policy?: string | null
          category_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_checked?: boolean | null
          is_required?: boolean | null
          name: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          cabin_notes?: string | null
          cabin_policy?: string | null
          category_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_checked?: boolean | null
          is_required?: boolean | null
          name?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "checklist_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_split_members: {
        Row: {
          created_at: string | null
          expense_id: string
          id: string
          member_id: string
        }
        Insert: {
          created_at?: string | null
          expense_id: string
          id?: string
          member_id: string
        }
        Update: {
          created_at?: string | null
          expense_id?: string
          id?: string
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_split_members_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "trip_expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_split_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "trip_members"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      shopping_categories: {
        Row: {
          created_at: string | null
          created_by: string | null
          display_order: number | null
          icon_key: string | null
          id: string
          is_shared: boolean
          name: string
          trip_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          icon_key?: string | null
          id?: string
          is_shared?: boolean
          name: string
          trip_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          icon_key?: string | null
          id?: string
          is_shared?: boolean
          name?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_categories_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_items: {
        Row: {
          assignee_id: string | null
          category_id: string
          checked_by: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_checked: boolean | null
          name: string
          notes: string | null
          price: number | null
          quantity: number | null
          updated_at: string | null
        }
        Insert: {
          assignee_id?: string | null
          category_id: string
          checked_by?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_checked?: boolean | null
          name: string
          notes?: string | null
          price?: number | null
          quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          assignee_id?: string | null
          category_id?: string
          checked_by?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_checked?: boolean | null
          name?: string
          notes?: string | null
          price?: number | null
          quantity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_items_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "trip_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "shopping_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_checked_by_fkey"
            columns: ["checked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      template_categories: {
        Row: {
          category_type: string
          created_at: string | null
          display_order: number | null
          icon_key: string | null
          id: string
          name: string
          template_id: string
        }
        Insert: {
          category_type?: string
          created_at?: string | null
          display_order?: number | null
          icon_key?: string | null
          id?: string
          name: string
          template_id: string
        }
        Update: {
          category_type?: string
          created_at?: string | null
          display_order?: number | null
          icon_key?: string | null
          id?: string
          name?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_categories_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      template_items: {
        Row: {
          category_id: string
          created_at: string | null
          display_order: number | null
          id: string
          is_required: boolean | null
          name: string
          notes: string | null
          price: number | null
          quantity: number | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_required?: boolean | null
          name: string
          notes?: string | null
          price?: number | null
          quantity?: number | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_required?: boolean | null
          name?: string
          notes?: string | null
          price?: number | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "template_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "template_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      todo_categories: {
        Row: {
          created_at: string | null
          created_by: string | null
          display_order: number | null
          icon_key: string | null
          id: string
          is_shared: boolean
          name: string
          trip_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          icon_key?: string | null
          id?: string
          is_shared?: boolean
          name: string
          trip_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          icon_key?: string | null
          id?: string
          is_shared?: boolean
          name?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_categories_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      todo_item_assignees: {
        Row: {
          created_at: string | null
          id: string
          member_id: string
          todo_item_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          member_id: string
          todo_item_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          member_id?: string
          todo_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_item_assignees_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "trip_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_item_assignees_todo_item_id_fkey"
            columns: ["todo_item_id"]
            isOneToOne: false
            referencedRelation: "todo_items"
            referencedColumns: ["id"]
          },
        ]
      }
      todo_items: {
        Row: {
          category_id: string
          checked_by: string | null
          created_at: string | null
          created_by: string | null
          display_order: number | null
          due_date: string | null
          id: string
          is_checked: boolean | null
          name: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          category_id: string
          checked_by?: string | null
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          due_date?: string | null
          id?: string
          is_checked?: boolean | null
          name: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          checked_by?: string | null
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          due_date?: string | null
          id?: string
          is_checked?: boolean | null
          name?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "todo_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "todo_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_items_checked_by_fkey"
            columns: ["checked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_expenses: {
        Row: {
          amount: number
          amount_in_krw: number | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          day_number: number
          exchange_rate: number | null
          expense_category: string
          expense_date: string
          id: string
          is_shared: boolean
          notes: string | null
          paid_by: string | null
          payment_method: string | null
          schedule_id: string | null
          trip_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          amount_in_krw?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          day_number: number
          exchange_rate?: number | null
          expense_category: string
          expense_date: string
          id?: string
          is_shared?: boolean
          notes?: string | null
          paid_by?: string | null
          payment_method?: string | null
          schedule_id?: string | null
          trip_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          amount_in_krw?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          day_number?: number
          exchange_rate?: number | null
          expense_category?: string
          expense_date?: string
          id?: string
          is_shared?: boolean
          notes?: string | null
          paid_by?: string | null
          payment_method?: string | null
          schedule_id?: string | null
          trip_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_expenses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_expenses_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_expenses_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "trip_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_expenses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_flights: {
        Row: {
          airline: string
          arrival_airport: string
          created_at: string | null
          departure_airport: string
          flight_id: string
          flight_type: string
          id: string
          scheduled_date: string
          scheduled_time: string | null
          trip_id: string
        }
        Insert: {
          airline?: string
          arrival_airport?: string
          created_at?: string | null
          departure_airport?: string
          flight_id: string
          flight_type: string
          id?: string
          scheduled_date: string
          scheduled_time?: string | null
          trip_id: string
        }
        Update: {
          airline?: string
          arrival_airport?: string
          created_at?: string | null
          departure_airport?: string
          flight_id?: string
          flight_type?: string
          id?: string
          scheduled_date?: string
          scheduled_time?: string | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_flights_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_invitations: {
        Row: {
          created_at: string | null
          created_by: string
          expires_at: string | null
          id: string
          invite_code: string
          is_active: boolean | null
          trip_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          expires_at?: string | null
          id?: string
          invite_code: string
          is_active?: boolean | null
          trip_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          expires_at?: string | null
          id?: string
          invite_code?: string
          is_active?: boolean | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_invitations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_invitations_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_members: {
        Row: {
          id: string
          joined_at: string | null
          role: string
          trip_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: string
          trip_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: string
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_members_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_schedules: {
        Row: {
          category: string | null
          created_at: string | null
          day_number: number
          duration_minutes: number | null
          id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          place_address: string | null
          place_id: string
          place_name: string
          schedule_date: string
          start_time: string | null
          trip_id: string
          updated_at: string | null
          visit_order: number
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          day_number: number
          duration_minutes?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          place_address?: string | null
          place_id: string
          place_name: string
          schedule_date: string
          start_time?: string | null
          trip_id: string
          updated_at?: string | null
          visit_order: number
        }
        Update: {
          category?: string | null
          created_at?: string | null
          day_number?: number
          duration_minutes?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          place_address?: string | null
          place_id?: string
          place_name?: string
          schedule_date?: string
          start_time?: string | null
          trip_id?: string
          updated_at?: string | null
          visit_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "trip_schedules_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          budget: number | null
          companion_type: string | null
          companion_types: Json | null
          country_code: string | null
          created_at: string
          end_date: string | null
          id: string
          image_url: string | null
          memo: string | null
          region_id: string | null
          region_name: string | null
          start_date: string
          title: string
          trip_types: Json | null
          user_id: string | null
        }
        Insert: {
          budget?: number | null
          companion_type?: string | null
          companion_types?: Json | null
          country_code?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          memo?: string | null
          region_id?: string | null
          region_name?: string | null
          start_date: string
          title: string
          trip_types?: Json | null
          user_id?: string | null
        }
        Update: {
          budget?: number | null
          companion_type?: string | null
          companion_types?: Json | null
          country_code?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          memo?: string | null
          region_id?: string | null
          region_name?: string | null
          start_date?: string
          title?: string
          trip_types?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: {
        Args: { p_code: string }
        Returns: {
          out_trip_id: string
          out_trip_title: string
        }[]
      }
      create_trip_with_checklist: {
        Args: { p_categories: Json; p_items: Json; p_trip_data: Json }
        Returns: string
      }
      get_my_owned_trip_ids: { Args: never; Returns: string[] }
      get_my_trip_ids: { Args: never; Returns: string[] }
      get_trips_with_check_progress: {
        Args: { p_user_id: string }
        Returns: {
          checked_items: number
          end_date: string
          id: string
          progress_percentage: number
          region_name: string
          start_date: string
          title: string
          total_items: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

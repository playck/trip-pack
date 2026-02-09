export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4";
  };
  public: {
    Tables: {
      checklist_categories: {
        Row: {
          created_at: string | null;
          display_order: number | null;
          icon_key: string | null;
          id: string;
          name: string;
          trip_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          display_order?: number | null;
          icon_key?: string | null;
          id?: string;
          name: string;
          trip_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          display_order?: number | null;
          icon_key?: string | null;
          id?: string;
          name?: string;
          trip_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "checklist_categories_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      checklist_items: {
        Row: {
          cabin_notes: string | null;
          cabin_policy: string | null;
          category_id: string | null;
          created_at: string | null;
          display_order: number | null;
          id: string;
          is_checked: boolean | null;
          is_required: boolean | null;
          name: string;
          notes: string | null;
          updated_at: string | null;
        };
        Insert: {
          cabin_notes?: string | null;
          cabin_policy?: string | null;
          category_id?: string | null;
          created_at?: string | null;
          display_order?: number | null;
          id?: string;
          is_checked?: boolean | null;
          is_required?: boolean | null;
          name: string;
          notes?: string | null;
          updated_at?: string | null;
        };
        Update: {
          cabin_notes?: string | null;
          cabin_policy?: string | null;
          category_id?: string | null;
          created_at?: string | null;
          display_order?: number | null;
          id?: string;
          is_checked?: boolean | null;
          is_required?: boolean | null;
          name?: string;
          notes?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "checklist_items_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "checklist_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      checklist_templates: {
        Row: {
          checklist_data: Json;
          created_at: string | null;
          description: string | null;
          id: string;
          is_public: boolean | null;
          title: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          checklist_data: Json;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_public?: boolean | null;
          title: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          checklist_data?: Json;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_public?: boolean | null;
          title?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "checklist_templates_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          username: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          username?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      trip_expenses: {
        Row: {
          amount: number;
          amount_in_krw: number | null;
          created_at: string | null;
          currency: string | null;
          day_number: number;
          description: string | null;
          exchange_rate: number | null;
          expense_category: string;
          expense_date: string;
          id: string;
          merchant_name: string | null;
          notes: string | null;
          payment_method: string | null;
          receipt_url: string | null;
          schedule_id: string | null;
          trip_id: string;
          updated_at: string | null;
        };
        Insert: {
          amount: number;
          amount_in_krw?: number | null;
          created_at?: string | null;
          currency?: string | null;
          day_number: number;
          description?: string | null;
          exchange_rate?: number | null;
          expense_category: string;
          expense_date: string;
          id?: string;
          merchant_name?: string | null;
          notes?: string | null;
          payment_method?: string | null;
          receipt_url?: string | null;
          schedule_id?: string | null;
          trip_id: string;
          updated_at?: string | null;
        };
        Update: {
          amount?: number;
          amount_in_krw?: number | null;
          created_at?: string | null;
          currency?: string | null;
          day_number?: number;
          description?: string | null;
          exchange_rate?: number | null;
          expense_category?: string;
          expense_date?: string;
          id?: string;
          merchant_name?: string | null;
          notes?: string | null;
          payment_method?: string | null;
          receipt_url?: string | null;
          schedule_id?: string | null;
          trip_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "trip_expenses_schedule_id_fkey";
            columns: ["schedule_id"];
            isOneToOne: false;
            referencedRelation: "trip_schedules";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trip_expenses_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      trip_schedules: {
        Row: {
          category: string | null;
          created_at: string | null;
          day_number: number;
          duration_minutes: number | null;
          id: string;
          latitude: number | null;
          longitude: number | null;
          notes: string | null;
          place_address: string | null;
          place_id: string;
          place_name: string;
          schedule_date: string;
          start_time: string | null;
          trip_id: string;
          updated_at: string | null;
          visit_order: number;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          day_number: number;
          duration_minutes?: number | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          notes?: string | null;
          place_address?: string | null;
          place_id: string;
          place_name: string;
          schedule_date: string;
          start_time?: string | null;
          trip_id: string;
          updated_at?: string | null;
          visit_order: number;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          day_number?: number;
          duration_minutes?: number | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          notes?: string | null;
          place_address?: string | null;
          place_id?: string;
          place_name?: string;
          schedule_date?: string;
          start_time?: string | null;
          trip_id?: string;
          updated_at?: string | null;
          visit_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "trip_schedules_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      trips: {
        Row: {
          companion_type: string | null;
          companion_types: Json | null;
          country_code: string | null;
          created_at: string;
          end_date: string | null;
          id: string;
          region_id: string | null;
          region_name: string | null;
          start_date: string;
          title: string;
          trip_types: Json | null;
          user_id: string | null;
          budget: number | null;
        };
        Insert: {
          companion_type?: string | null;
          companion_types?: Json | null;
          country_code?: string | null;
          created_at?: string;
          end_date?: string | null;
          id?: string;
          region_id?: string | null;
          region_name?: string | null;
          start_date: string;
          title: string;
          trip_types?: Json | null;
          user_id?: string | null;
          budget?: number | null;
        };
        Update: {
          companion_type?: string | null;
          companion_types?: Json | null;
          country_code?: string | null;
          created_at?: string;
          end_date?: string | null;
          id?: string;
          region_id?: string | null;
          region_name?: string | null;
          start_date?: string;
          title?: string;
          trip_types?: Json | null;
          user_id?: string | null;
          budget?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "trips_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_trip_with_checklist: {
        Args: {
          p_trip_data: Json;
          p_categories: Json;
          p_items: Json;
        };
        Returns: string;
      };
      get_trips_with_check_progress: {
        Args: { p_user_id: string };
        Returns: {
          checked_items: number;
          end_date: string;
          id: string;
          progress_percentage: number;
          region_name: string;
          start_date: string;
          title: string;
          total_items: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

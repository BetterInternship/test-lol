export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: Database["public"]["Enums"]["dashboard_actions_enum"]
          company_id: string
          created_at: string
          details: string | null
          device_details: string | null
          id: string
          ip_address: string | null
          ok_response: boolean | null
          raw_request: Json | null
          raw_response: Json | null
          screen: Database["public"]["Enums"]["dashboard_screens_enum"]
          user_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["dashboard_actions_enum"]
          company_id: string
          created_at?: string
          details?: string | null
          device_details?: string | null
          id?: string
          ip_address?: string | null
          ok_response?: boolean | null
          raw_request?: Json | null
          raw_response?: Json | null
          screen: Database["public"]["Enums"]["dashboard_screens_enum"]
          user_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["dashboard_actions_enum"]
          company_id?: string
          created_at?: string
          details?: string | null
          device_details?: string | null
          id?: string
          ip_address?: string | null
          ok_response?: boolean | null
          raw_request?: Json | null
          raw_response?: Json | null
          screen?: Database["public"]["Enums"]["dashboard_screens_enum"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          id: string
          logo_path: string | null
          name: string
          updated_at: string
          url_slug: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo_path?: string | null
          name: string
          updated_at?: string
          url_slug?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_path?: string | null
          name?: string
          updated_at?: string
          url_slug?: string | null
        }
        Relationships: []
      }
      file_uploads: {
        Row: {
          affected_count: number | null
          company_id: string | null
          created_at: string
          error_list: string[] | null
          error_reason: string | null
          file_id: string | null
          file_name: string | null
          id: string
          progress: number
          status: Database["public"]["Enums"]["file_upload_status_enum"]
          uploaded_by: string | null
        }
        Insert: {
          affected_count?: number | null
          company_id?: string | null
          created_at?: string
          error_list?: string[] | null
          error_reason?: string | null
          file_id?: string | null
          file_name?: string | null
          id?: string
          progress?: number
          status?: Database["public"]["Enums"]["file_upload_status_enum"]
          uploaded_by?: string | null
        }
        Update: {
          affected_count?: number | null
          company_id?: string | null
          created_at?: string
          error_list?: string[] | null
          error_reason?: string | null
          file_id?: string | null
          file_name?: string | null
          id?: string
          progress?: number
          status?: Database["public"]["Enums"]["file_upload_status_enum"]
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_uploads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_uploads_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          birth_date: string | null
          civil_status: Database["public"]["Enums"]["civil_status_enum"] | null
          company_id: string | null
          coverage_end: string | null
          coverage_start: string | null
          created_at: string
          email: string | null
          email_verified: boolean | null
          employee_id: string | null
          first_name: string
          full_name: string | null
          hmo_member_id: string
          hmo_status:
            | Database["public"]["Enums"]["hmo_member_coverage_status"]
            | null
          id: string
          joined_at: string | null
          last_name: string
          member_type: Database["public"]["Enums"]["hmo_member_type"] | null
          middle_name: string | null
          mobile: string | null
          mobile_verified: boolean | null
          principal_hmo_member_id: string | null
          relationship_to_principal: string | null
          sex: Database["public"]["Enums"]["gender_enum"] | null
          updated_at: string
          uses_same_info_as_principal: boolean
        }
        Insert: {
          birth_date?: string | null
          civil_status?: Database["public"]["Enums"]["civil_status_enum"] | null
          company_id?: string | null
          coverage_end?: string | null
          coverage_start?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          employee_id?: string | null
          first_name: string
          full_name?: string | null
          hmo_member_id: string
          hmo_status?:
            | Database["public"]["Enums"]["hmo_member_coverage_status"]
            | null
          id?: string
          joined_at?: string | null
          last_name: string
          member_type?: Database["public"]["Enums"]["hmo_member_type"] | null
          middle_name?: string | null
          mobile?: string | null
          mobile_verified?: boolean | null
          principal_hmo_member_id?: string | null
          relationship_to_principal?: string | null
          sex?: Database["public"]["Enums"]["gender_enum"] | null
          updated_at?: string
          uses_same_info_as_principal?: boolean
        }
        Update: {
          birth_date?: string | null
          civil_status?: Database["public"]["Enums"]["civil_status_enum"] | null
          company_id?: string | null
          coverage_end?: string | null
          coverage_start?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          employee_id?: string | null
          first_name?: string
          full_name?: string | null
          hmo_member_id?: string
          hmo_status?:
            | Database["public"]["Enums"]["hmo_member_coverage_status"]
            | null
          id?: string
          joined_at?: string | null
          last_name?: string
          member_type?: Database["public"]["Enums"]["hmo_member_type"] | null
          middle_name?: string | null
          mobile?: string | null
          mobile_verified?: boolean | null
          principal_hmo_member_id?: string | null
          relationship_to_principal?: string | null
          sex?: Database["public"]["Enums"]["gender_enum"] | null
          updated_at?: string
          uses_same_info_as_principal?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_requests: {
        Row: {
          company_id: string
          created_at: string
          id: string
          personal_information_verification: Json
          reference_number: string | null
          rejection_reason: string | null
          required_documents: Json | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["request_review_status"]
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          personal_information_verification: Json
          reference_number?: string | null
          rejection_reason?: string | null
          required_documents?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["request_review_status"]
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          personal_information_verification?: Json
          reference_number?: string | null
          rejection_reason?: string | null
          required_documents?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["request_review_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pending_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pending_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      role_templates: {
        Row: {
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          template: Json
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          template: Json
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          template?: Json
        }
        Relationships: [
          {
            foreignKeyName: "role_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      service_form_settings: {
        Row: {
          company_id: string
          created_at: string
          id: string
          settings: Json
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          settings?: Json
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          settings?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_form_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          company_id: string
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          permissions: Json
          role: string
          status: Database["public"]["Enums"]["user_account_status"]
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          permissions?: Json
          role?: string
          status?: Database["public"]["Enums"]["user_account_status"]
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          permissions?: Json
          role?: string
          status?: Database["public"]["Enums"]["user_account_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      detailed_activity_logs: {
        Row: {
          action: Database["public"]["Enums"]["dashboard_actions_enum"] | null
          company: string | null
          details: string | null
          name: string | null
          ok_response: boolean | null
          role: string | null
          screen: Database["public"]["Enums"]["dashboard_screens_enum"] | null
          timestamp: string | null
        }
        Relationships: []
      }
      members_with_dependents: {
        Row: {
          birth_date: string | null
          civil_status: Database["public"]["Enums"]["civil_status_enum"] | null
          company_id: string | null
          coverage_end: string | null
          coverage_start: string | null
          created_at: string | null
          dependents_list: string[] | null
          email: string | null
          email_verified: boolean | null
          employee_id: string | null
          first_name: string | null
          full_name: string | null
          hmo_member_id: string | null
          hmo_status:
            | Database["public"]["Enums"]["hmo_member_coverage_status"]
            | null
          id: string | null
          last_name: string | null
          member_type: Database["public"]["Enums"]["hmo_member_type"] | null
          middle_name: string | null
          mobile: string | null
          mobile_verified: boolean | null
          principal_hmo_member_id: string | null
          principal_info: Json | null
          relationship_to_principal: string | null
          sex: Database["public"]["Enums"]["gender_enum"] | null
          updated_at: string | null
          uses_same_info_as_principal: boolean | null
        }
        Insert: {
          birth_date?: string | null
          civil_status?: Database["public"]["Enums"]["civil_status_enum"] | null
          company_id?: string | null
          coverage_end?: string | null
          coverage_start?: string | null
          created_at?: string | null
          dependents_list?: never
          email?: string | null
          email_verified?: boolean | null
          employee_id?: string | null
          first_name?: string | null
          full_name?: string | null
          hmo_member_id?: string | null
          hmo_status?:
            | Database["public"]["Enums"]["hmo_member_coverage_status"]
            | null
          id?: string | null
          last_name?: string | null
          member_type?: Database["public"]["Enums"]["hmo_member_type"] | null
          middle_name?: string | null
          mobile?: string | null
          mobile_verified?: boolean | null
          principal_hmo_member_id?: string | null
          principal_info?: never
          relationship_to_principal?: string | null
          sex?: Database["public"]["Enums"]["gender_enum"] | null
          updated_at?: string | null
          uses_same_info_as_principal?: boolean | null
        }
        Update: {
          birth_date?: string | null
          civil_status?: Database["public"]["Enums"]["civil_status_enum"] | null
          company_id?: string | null
          coverage_end?: string | null
          coverage_start?: string | null
          created_at?: string | null
          dependents_list?: never
          email?: string | null
          email_verified?: boolean | null
          employee_id?: string | null
          first_name?: string | null
          full_name?: string | null
          hmo_member_id?: string | null
          hmo_status?:
            | Database["public"]["Enums"]["hmo_member_coverage_status"]
            | null
          id?: string | null
          last_name?: string | null
          member_type?: Database["public"]["Enums"]["hmo_member_type"] | null
          middle_name?: string | null
          mobile?: string | null
          mobile_verified?: boolean | null
          principal_hmo_member_id?: string | null
          principal_info?: never
          relationship_to_principal?: string | null
          sex?: Database["public"]["Enums"]["gender_enum"] | null
          updated_at?: string | null
          uses_same_info_as_principal?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_member_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          verified_email_count: number
          verified_mobile_count: number
          active_member_count: number
          total_member_count: number
        }[]
      }
      get_my_company_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_upcoming_member_events: {
        Args: {
          p_company_id: string
          p_months_range?: number
          p_event_type_filter?: string
        }
        Returns: {
          event_id: string
          event_type: string
          member_name: string
          event_date: string
          details: string
          status: string
        }[]
      }
      has_permission: {
        Args: { permission_category: string; permission_action: string }
        Returns: boolean
      }
    }
    Enums: {
      civil_status_enum:
        | "Single"
        | "Married"
        | "Widowed"
        | "Separated"
        | "Divorced"
        | "Other"
        | "PreferNotToSay"
      dashboard_actions_enum: "GET" | "POST" | "PUT" | "DELETE"
      dashboard_screens_enum:
        | "overview"
        | "member-list"
        | "pending-request"
        | "service-form"
        | "bulk-import"
        | "access-management"
        | "settings"
        | "login"
        | "logout"
      file_upload_status_enum:
        | "Success"
        | "Failed"
        | "Pending"
        | "Processing"
        | "In Queue"
      gender_enum: "Male" | "Female" | "Other" | "PreferNotToSay"
      hmo_member_coverage_status: "Active" | "Inactive"
      hmo_member_type: "Principal" | "Dependent"
      request_review_status: "pending" | "approved" | "rejected"
      user_account_status: "active" | "inactive" | "pending"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      civil_status_enum: [
        "Single",
        "Married",
        "Widowed",
        "Separated",
        "Divorced",
        "Other",
        "PreferNotToSay",
      ],
      dashboard_actions_enum: ["GET", "POST", "PUT", "DELETE"],
      dashboard_screens_enum: [
        "overview",
        "member-list",
        "pending-request",
        "service-form",
        "bulk-import",
        "access-management",
        "settings",
        "login",
        "logout",
      ],
      file_upload_status_enum: [
        "Success",
        "Failed",
        "Pending",
        "Processing",
        "In Queue",
      ],
      gender_enum: ["Male", "Female", "Other", "PreferNotToSay"],
      hmo_member_coverage_status: ["Active", "Inactive"],
      hmo_member_type: ["Principal", "Dependent"],
      request_review_status: ["pending", "approved", "rejected"],
      user_account_status: ["active", "inactive", "pending"],
    },
  },
} as const

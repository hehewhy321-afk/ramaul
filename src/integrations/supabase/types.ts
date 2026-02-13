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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          category: string | null
          content: string
          content_ne: string | null
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          priority: Database["public"]["Enums"]["announcement_priority"] | null
          title: string
          title_ne: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          content_ne?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: Database["public"]["Enums"]["announcement_priority"] | null
          title: string
          title_ne?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          content_ne?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: Database["public"]["Enums"]["announcement_priority"] | null
          title?: string
          title_ne?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      budget_categories: {
        Row: {
          allocated_amount: number
          created_at: string
          description: string | null
          financial_year: string
          id: string
          name: string
          name_ne: string | null
          spent_amount: number
          updated_at: string
        }
        Insert: {
          allocated_amount?: number
          created_at?: string
          description?: string | null
          financial_year: string
          id?: string
          name: string
          name_ne?: string | null
          spent_amount?: number
          updated_at?: string
        }
        Update: {
          allocated_amount?: number
          created_at?: string
          description?: string | null
          financial_year?: string
          id?: string
          name?: string
          name_ne?: string | null
          spent_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      budget_transactions: {
        Row: {
          amount: number
          category_id: string
          created_at: string
          created_by: string | null
          description: string
          description_ne: string | null
          id: string
          receipt_url: string | null
          transaction_date: string
        }
        Insert: {
          amount: number
          category_id: string
          created_at?: string
          created_by?: string | null
          description: string
          description_ne?: string | null
          id?: string
          receipt_url?: string | null
          transaction_date?: string
        }
        Update: {
          amount?: number
          category_id?: string
          created_at?: string
          created_by?: string | null
          description?: string
          description_ne?: string | null
          id?: string
          receipt_url?: string | null
          transaction_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "budget_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      community_issues: {
        Row: {
          assigned_to: string | null
          category: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          likes_count: number | null
          location: string | null
          priority: Database["public"]["Enums"]["issue_priority"] | null
          reported_by: string
          resolved_at: string | null
          status: Database["public"]["Enums"]["issue_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          location?: string | null
          priority?: Database["public"]["Enums"]["issue_priority"] | null
          reported_by: string
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["issue_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          location?: string | null
          priority?: Database["public"]["Enums"]["issue_priority"] | null
          reported_by?: string
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["issue_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      discussion_replies: {
        Row: {
          author_name: string
          avatar_url: string | null
          content: string
          created_at: string
          discussion_id: string
          id: string
          parent_reply_id: string | null
        }
        Insert: {
          author_name: string
          avatar_url?: string | null
          content: string
          created_at?: string
          discussion_id: string
          id?: string
          parent_reply_id?: string | null
        }
        Update: {
          author_name?: string
          avatar_url?: string | null
          content?: string
          created_at?: string
          discussion_id?: string
          id?: string
          parent_reply_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "discussion_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          author_name: string
          avatar_url: string | null
          category: string
          created_at: string
          description: string
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_name: string
          avatar_url?: string | null
          category?: string
          created_at?: string
          description: string
          id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          avatar_url?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          download_count: number | null
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          title: string
          title_ne: string | null
          uploaded_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          download_count?: number | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          title: string
          title_ne?: string | null
          uploaded_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          download_count?: number | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          title?: string
          title_ne?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      donation_campaigns: {
        Row: {
          collected_amount: number | null
          created_at: string
          created_by: string | null
          description: string | null
          description_ne: string | null
          end_date: string | null
          goal_amount: number | null
          id: string
          is_active: boolean | null
          qr_image_url: string | null
          recipient_account: string | null
          recipient_name: string
          start_date: string
          title: string
          title_ne: string | null
          updated_at: string
        }
        Insert: {
          collected_amount?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_ne?: string | null
          end_date?: string | null
          goal_amount?: number | null
          id?: string
          is_active?: boolean | null
          qr_image_url?: string | null
          recipient_account?: string | null
          recipient_name: string
          start_date?: string
          title: string
          title_ne?: string | null
          updated_at?: string
        }
        Update: {
          collected_amount?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_ne?: string | null
          end_date?: string | null
          goal_amount?: number | null
          id?: string
          is_active?: boolean | null
          qr_image_url?: string | null
          recipient_account?: string | null
          recipient_name?: string
          start_date?: string
          title?: string
          title_ne?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          campaign_id: string | null
          created_at: string
          donor_email: string | null
          donor_name: string | null
          donor_phone: string | null
          id: string
          is_anonymous: boolean | null
          notes: string | null
          payment_method: string | null
          payment_reference: string | null
          purpose: string | null
          qr_data: string | null
          recipient_account: string | null
          recipient_name: string | null
          status: Database["public"]["Enums"]["donation_status"] | null
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          created_at?: string
          donor_email?: string | null
          donor_name?: string | null
          donor_phone?: string | null
          id?: string
          is_anonymous?: boolean | null
          notes?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          purpose?: string | null
          qr_data?: string | null
          recipient_account?: string | null
          recipient_name?: string | null
          status?: Database["public"]["Enums"]["donation_status"] | null
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          created_at?: string
          donor_email?: string | null
          donor_name?: string | null
          donor_phone?: string | null
          id?: string
          is_anonymous?: boolean | null
          notes?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          purpose?: string | null
          qr_data?: string | null
          recipient_account?: string | null
          recipient_name?: string | null
          status?: Database["public"]["Enums"]["donation_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "donation_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          created_at: string
          event_id: string
          id: string
          name: string
          phone: string
          tole: string | null
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          name: string
          phone: string
          tole?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          name?: string
          phone?: string
          tole?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string | null
          contact_person: string | null
          created_at: string
          created_by: string | null
          description: string | null
          description_ne: string | null
          end_date: string | null
          event_date: string
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string | null
          max_attendees: number | null
          registration_count: number | null
          title: string
          title_ne: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_ne?: string | null
          end_date?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string | null
          max_attendees?: number | null
          registration_count?: number | null
          title: string
          title_ne?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_ne?: string | null
          end_date?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string | null
          max_attendees?: number | null
          registration_count?: number | null
          title?: string
          title_ne?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_photos: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string
          is_approved: boolean | null
          is_featured: boolean | null
          title: string
          title_ne: string | null
          uploaded_by: string | null
          view_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          title: string
          title_ne?: string | null
          uploaded_by?: string | null
          view_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          title?: string
          title_ne?: string | null
          uploaded_by?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      issue_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          issue_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          issue_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          issue_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_comments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "community_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_likes: {
        Row: {
          id: string
          issue_id: string
          user_id: string
        }
        Insert: {
          id?: string
          issue_id: string
          user_id: string
        }
        Update: {
          id?: string
          issue_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_likes_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "community_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          content_ne: string | null
          created_at: string
          id: string
          image_url: string | null
          is_published: boolean | null
          summary: string | null
          summary_ne: string | null
          title: string
          title_ne: string | null
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          content_ne?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          summary?: string | null
          summary_ne?: string | null
          title: string
          title_ne?: string | null
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          content_ne?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          summary?: string | null
          summary_ne?: string | null
          title?: string
          title_ne?: string | null
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      notices: {
        Row: {
          category: string | null
          content: string | null
          content_ne: string | null
          created_at: string
          created_by: string | null
          file_url: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          published_date: string
          title: string
          title_ne: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          content_ne?: string | null
          created_at?: string
          created_by?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_date?: string
          title: string
          title_ne?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string | null
          content_ne?: string | null
          created_at?: string
          created_by?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_date?: string
          title?: string
          title_ne?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: Json | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json | null
        }
        Relationships: []
      }
      support_requests: {
        Row: {
          admin_notes: string | null
          assigned_to: string | null
          category: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          priority: Database["public"]["Enums"]["issue_priority"] | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["support_status"] | null
          subject: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          priority?: Database["public"]["Enums"]["issue_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["support_status"] | null
          subject: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          priority?: Database["public"]["Enums"]["issue_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["support_status"] | null
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      ward_representatives: {
        Row: {
          achievements: string | null
          address: string | null
          bio: string | null
          bio_ne: string | null
          created_at: string
          email: string | null
          full_name: string
          full_name_ne: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          photo_url: string | null
          position: string
          position_ne: string | null
          updated_at: string
          ward_number: number | null
        }
        Insert: {
          achievements?: string | null
          address?: string | null
          bio?: string | null
          bio_ne?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          full_name_ne?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          photo_url?: string | null
          position: string
          position_ne?: string | null
          updated_at?: string
          ward_number?: number | null
        }
        Update: {
          achievements?: string | null
          address?: string | null
          bio?: string | null
          bio_ne?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          full_name_ne?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          photo_url?: string | null
          position?: string
          position_ne?: string | null
          updated_at?: string
          ward_number?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_donations: {
        Args: never
        Returns: {
          amount: number
          created_at: string
          donor_name: string
          id: string
          purpose: string
          status: Database["public"]["Enums"]["donation_status"]
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      announcement_priority: "normal" | "high" | "urgent"
      app_role: "admin" | "moderator" | "user"
      donation_status: "pending" | "completed" | "failed"
      issue_priority: "low" | "medium" | "high" | "urgent"
      issue_status: "open" | "in_progress" | "resolved" | "closed"
      support_status: "open" | "in_progress" | "resolved" | "closed"
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
    Enums: {
      announcement_priority: ["normal", "high", "urgent"],
      app_role: ["admin", "moderator", "user"],
      donation_status: ["pending", "completed", "failed"],
      issue_priority: ["low", "medium", "high", "urgent"],
      issue_status: ["open", "in_progress", "resolved", "closed"],
      support_status: ["open", "in_progress", "resolved", "closed"],
    },
  },
} as const

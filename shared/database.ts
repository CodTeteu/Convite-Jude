export interface Database {
  public: {
    Tables: {
      rsvp_confirmations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          guest_name: string;
          phone: string;
          attendance_status: "pending" | "attending" | "not-attending";
          companions_count: number;
          companions_names: string[];
          notes: string;
          admin_notes: string;
          acknowledged_guidelines: boolean;
          source: string;
          event_slug: string;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          guest_name: string;
          phone: string;
          attendance_status: "pending" | "attending" | "not-attending";
          companions_count?: number;
          companions_names?: string[];
          notes?: string;
          admin_notes?: string;
          acknowledged_guidelines?: boolean;
          source?: string;
          event_slug: string;
          submitted_at?: string;
        };
        Update: {
          updated_at?: string;
          guest_name?: string;
          phone?: string;
          attendance_status?: "pending" | "attending" | "not-attending";
          companions_count?: number;
          companions_names?: string[];
          notes?: string;
          admin_notes?: string;
          acknowledged_guidelines?: boolean;
          source?: string;
          event_slug?: string;
          submitted_at?: string;
        };
        Relationships: [];
      };
      gift_items: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          event_slug: string;
          name: string;
          description: string;
          price_cents: number;
          category: string;
          image_url: string;
          is_active: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          event_slug: string;
          name: string;
          description?: string;
          price_cents: number;
          category?: string;
          image_url?: string;
          is_active?: boolean;
          sort_order?: number;
        };
        Update: {
          updated_at?: string;
          event_slug?: string;
          name?: string;
          description?: string;
          price_cents?: number;
          category?: string;
          image_url?: string;
          is_active?: boolean;
          sort_order?: number;
        };
        Relationships: [];
      };
      gift_selections: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          event_slug: string;
          guest_name: string;
          guest_phone: string;
          message: string;
          total_cents: number;
          payment_status: "pending" | "paid" | "cancelled";
          admin_notes: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          event_slug: string;
          guest_name: string;
          guest_phone: string;
          message?: string;
          total_cents?: number;
          payment_status?: "pending" | "paid" | "cancelled";
          admin_notes?: string;
        };
        Update: {
          updated_at?: string;
          event_slug?: string;
          guest_name?: string;
          guest_phone?: string;
          message?: string;
          total_cents?: number;
          payment_status?: "pending" | "paid" | "cancelled";
          admin_notes?: string;
        };
        Relationships: [];
      };
      gift_selection_items: {
        Row: {
          id: string;
          created_at: string;
          selection_id: string;
          gift_item_id: string;
          quantity: number;
          unit_price_cents: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          selection_id: string;
          gift_item_id: string;
          quantity?: number;
          unit_price_cents: number;
        };
        Update: {
          selection_id?: string;
          gift_item_id?: string;
          quantity?: number;
          unit_price_cents?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

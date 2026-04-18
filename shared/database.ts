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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

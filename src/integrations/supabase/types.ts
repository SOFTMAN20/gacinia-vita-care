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
      brands: {
        Row: {
          country_of_origin: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
        }
        Insert: {
          country_of_origin?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
        }
        Update: {
          country_of_origin?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity: number
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          description_sw: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          name_sw: string | null
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_sw?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          name_sw?: string | null
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_sw?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          name_sw?: string | null
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_sku: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_sku: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_sku?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          notes: string | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          order_id: string
          status: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          delivery_fee: number | null
          delivery_method: string | null
          delivery_notes: string | null
          discount_amount: number | null
          estimated_delivery_date: string | null
          id: string
          notes: string | null
          order_number: string
          order_type: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          shipping_address: Json | null
          shipping_amount: number | null
          status: string | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          delivery_fee?: number | null
          delivery_method?: string | null
          delivery_notes?: string | null
          discount_amount?: number | null
          estimated_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_number: string
          order_type?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          shipping_amount?: number | null
          status?: string | null
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          delivery_fee?: number | null
          delivery_method?: string | null
          delivery_notes?: string | null
          discount_amount?: number | null
          estimated_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          order_type?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          shipping_amount?: number | null
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          alt_text_sw: string | null
          created_at: string
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string
          sort_order: number | null
        }
        Insert: {
          alt_text?: string | null
          alt_text_sw?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id: string
          sort_order?: number | null
        }
        Update: {
          alt_text?: string | null
          alt_text_sw?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active_ingredients: string[] | null
          barcode: string | null
          batch_number: string | null
          brand_id: string | null
          category_id: string | null
          compare_price: number | null
          contraindications: string | null
          cost_price: number | null
          created_at: string
          description: string | null
          description_sw: string | null
          dosage_form: string | null
          expiry_date: string | null
          featured: boolean | null
          id: string
          is_active: boolean | null
          is_prescription_only: boolean | null
          is_wholesale_only: boolean | null
          manufacturer: string | null
          max_stock_level: number | null
          meta_description: string | null
          meta_title: string | null
          min_stock_level: number | null
          name: string
          name_sw: string | null
          price: number
          reorder_level: number | null
          requires_prescription: boolean | null
          retail_price: number | null
          short_description: string | null
          short_description_sw: string | null
          side_effects: string | null
          sku: string
          slug: string
          stock_quantity: number | null
          storage_conditions: string | null
          strength: string | null
          supplier_id: string | null
          tags: string[] | null
          updated_at: string
          usage_instructions: string | null
          usage_instructions_sw: string | null
          weight: number | null
          wholesale_price: number | null
        }
        Insert: {
          active_ingredients?: string[] | null
          barcode?: string | null
          batch_number?: string | null
          brand_id?: string | null
          category_id?: string | null
          compare_price?: number | null
          contraindications?: string | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          description_sw?: string | null
          dosage_form?: string | null
          expiry_date?: string | null
          featured?: boolean | null
          id?: string
          is_active?: boolean | null
          is_prescription_only?: boolean | null
          is_wholesale_only?: boolean | null
          manufacturer?: string | null
          max_stock_level?: number | null
          meta_description?: string | null
          meta_title?: string | null
          min_stock_level?: number | null
          name: string
          name_sw?: string | null
          price: number
          reorder_level?: number | null
          requires_prescription?: boolean | null
          retail_price?: number | null
          short_description?: string | null
          short_description_sw?: string | null
          side_effects?: string | null
          sku: string
          slug: string
          stock_quantity?: number | null
          storage_conditions?: string | null
          strength?: string | null
          supplier_id?: string | null
          tags?: string[] | null
          updated_at?: string
          usage_instructions?: string | null
          usage_instructions_sw?: string | null
          weight?: number | null
          wholesale_price?: number | null
        }
        Update: {
          active_ingredients?: string[] | null
          barcode?: string | null
          batch_number?: string | null
          brand_id?: string | null
          category_id?: string | null
          compare_price?: number | null
          contraindications?: string | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          description_sw?: string | null
          dosage_form?: string | null
          expiry_date?: string | null
          featured?: boolean | null
          id?: string
          is_active?: boolean | null
          is_prescription_only?: boolean | null
          is_wholesale_only?: boolean | null
          manufacturer?: string | null
          max_stock_level?: number | null
          meta_description?: string | null
          meta_title?: string | null
          min_stock_level?: number | null
          name?: string
          name_sw?: string | null
          price?: number
          reorder_level?: number | null
          requires_prescription?: boolean | null
          retail_price?: number | null
          short_description?: string | null
          short_description_sw?: string | null
          side_effects?: string | null
          sku?: string
          slug?: string
          stock_quantity?: number | null
          storage_conditions?: string | null
          strength?: string | null
          supplier_id?: string | null
          tags?: string[] | null
          updated_at?: string
          usage_instructions?: string | null
          usage_instructions_sw?: string | null
          weight?: number | null
          wholesale_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          avatar_url: string | null
          business_name: string | null
          city: string | null
          created_at: string
          full_name: string | null
          id: string
          is_active: boolean | null
          language_preference: string | null
          license_number: string | null
          phone: string | null
          postal_code: string | null
          region: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          avatar_url?: string | null
          business_name?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          language_preference?: string | null
          license_number?: string | null
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          avatar_url?: string | null
          business_name?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          language_preference?: string | null
          license_number?: string | null
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          tax_id: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          tax_id?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          tax_id?: string | null
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          city: string
          created_at: string | null
          full_address: string
          id: string
          is_default: boolean | null
          latitude: number | null
          longitude: number | null
          phone: string | null
          postal_code: string | null
          region: string
          title: string
          user_id: string
        }
        Insert: {
          city?: string
          created_at?: string | null
          full_address: string
          id?: string
          is_default?: boolean | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          postal_code?: string | null
          region?: string
          title: string
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string | null
          full_address?: string
          id?: string
          is_default?: boolean | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          postal_code?: string | null
          region?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_addresses_user_id_fkey"
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
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
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

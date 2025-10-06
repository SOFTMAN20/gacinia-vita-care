import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SystemSettings {
  id?: string;
  store_name?: string;
  store_email?: string;
  store_phone?: string;
  store_address?: string;
  currency?: string;
  timezone?: string;
  language?: string;
  email_notifications?: boolean;
  order_notifications?: boolean;
  low_stock_alerts?: boolean;
  customer_messages?: boolean;
  marketing_emails?: boolean;
  payment_cod?: boolean;
  payment_mobile_money?: boolean;
  payment_bank_transfer?: boolean;
  payment_card?: boolean;
  free_delivery_threshold?: number;
  standard_delivery_fee?: number;
  express_delivery_fee?: number;
  delivery_radius?: number;
  two_factor_auth?: boolean;
  session_timeout?: number;
  password_expiry?: number;
  max_login_attempts?: number;
  created_at?: string;
  updated_at?: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load from localStorage first
      const savedSettings = localStorage.getItem('pharmacy_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      } else {
        setSettings(getDefaultSettings());
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
      setSettings(getDefaultSettings());
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<SystemSettings>) => {
    try {
      const newSettings = { ...settings, ...updates, updated_at: new Date().toISOString() };
      setSettings(newSettings);
      
      // Save to localStorage
      localStorage.setItem('pharmacy_settings', JSON.stringify(newSettings));
      
      // In a real app, you would also save to database here
      // For now, we'll just use localStorage
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  };

  const getDefaultSettings = (): SystemSettings => ({
    store_name: 'Gacinia Pharmacy & Medical Supplies',
    store_email: 'info@gacinia.co.tz',
    store_phone: '+255 123 456 789',
    store_address: 'Dar es Salaam, Tanzania',
    currency: 'TSh',
    timezone: 'Africa/Dar_es_Salaam',
    language: 'en',
    email_notifications: true,
    order_notifications: true,
    low_stock_alerts: true,
    customer_messages: true,
    marketing_emails: false,
    payment_cod: true,
    payment_mobile_money: true,
    payment_bank_transfer: true,
    payment_card: false,
    free_delivery_threshold: 50000,
    standard_delivery_fee: 5000,
    express_delivery_fee: 10000,
    delivery_radius: 50,
    two_factor_auth: false,
    session_timeout: 30,
    password_expiry: 90,
    max_login_attempts: 5,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings,
  };
}

/**
 * Supabase Configuration Value Object
 *
 * Domain-Driven Design: Value object for Supabase configuration
 */

/**
 * Supabase Configuration
 * Required configuration for initializing Supabase client
 */
export interface SupabaseConfig {
  /**
   * Supabase project URL
   * Example: https://your-project.supabase.co
   */
  url: string;

  /**
   * Supabase anonymous/public key
   * This is safe to expose in client-side code
   */
  anonKey: string;

  /**
   * Optional: Custom storage adapter
   * If not provided, AsyncStorage will be used
   */
  storage?: {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
  };

  /**
   * Optional: Database schema
   * Default: 'public'
   */
  schema?: string;

  /**
   * Optional: Realtime heartbeat interval in milliseconds
   * Default: 30000
   */
  realtimeHeartbeatIntervalMs?: number;

  /**
   * Optional: Auto refresh token
   * Default: true
   */
  autoRefreshToken?: boolean;

  /**
   * Optional: Persist session
   * Default: true
   */
  persistSession?: boolean;

  /**
   * Optional: Detect session in URL
   * Default: false (not applicable for React Native)
   */
  detectSessionInUrl?: boolean;
}

/**
 * Validate Supabase configuration
 */
export function validateSupabaseConfig(config: SupabaseConfig): {
  valid: boolean;
  error?: string;
} {
  if (!config.url || typeof config.url !== 'string') {
    return {
      valid: false,
      error: 'Supabase URL is required and must be a string',
    };
  }

  if (!config.anonKey || typeof config.anonKey !== 'string') {
    return {
      valid: false,
      error: 'Supabase anon key is required and must be a string',
    };
  }

  // Validate URL format
  try {
    const url = new URL(config.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return {
        valid: false,
        error: 'Supabase URL must use http:// or https:// protocol',
      };
    }
  } catch {
    return {
      valid: false,
      error: 'Invalid Supabase URL format',
    };
  }

  // Validate key format (basic check)
  if (config.anonKey.trim().length === 0) {
    return {
      valid: false,
      error: 'Supabase anon key cannot be empty',
    };
  }

  // Check for placeholder values
  if (
    config.anonKey.includes('your_supabase_anon_key') ||
    config.url.includes('your-project')
  ) {
    return {
      valid: false,
      error: 'Please replace placeholder values with actual Supabase credentials',
    };
  }

  return { valid: true };
}


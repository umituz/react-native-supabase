/**
 * Supabase Client Port (Interface)
 *
 * Domain-Driven Design: Application layer port for Supabase client
 * Defines the contract for Supabase client operations
 */

import type { SupabaseClient } from '@supabase/supabase-js';

type SupabaseClientType = SupabaseClient;

/**
 * Supabase Client Interface
 * Defines the contract for Supabase client operations
 */
export interface ISupabaseClient {
  /**
   * Get the Supabase client instance
   * @throws {SupabaseInitializationError} If client is not initialized
   */
  getClient(): SupabaseClientType;

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean;

  /**
   * Get initialization error if any
   */
  getInitializationError(): string | null;

  /**
   * Clear all session cache
   * Useful for logout and GDPR compliance
   */
  clearSessionCache(): Promise<void>;

  /**
   * Reset the client instance
   * Useful for testing
   */
  reset(): void;
}


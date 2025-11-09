/**
 * Supabase Client - Infrastructure Layer
 *
 * Domain-Driven Design: Infrastructure implementation of Supabase client
 * Singleton pattern for managing Supabase client instance
 *
 * IMPORTANT: This package does NOT read from .env files.
 * Configuration must be provided by the application.
 */

import {
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import type { SupabaseClient as SupabaseClientType } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SupabaseConfig } from '../../domain/value-objects/SupabaseConfig';
import { validateSupabaseConfig } from '../../domain/value-objects/SupabaseConfig';
import {
  SupabaseInitializationError,
  SupabaseConfigurationError,
} from '../../domain/errors/SupabaseError';
import type { ISupabaseClient } from '../../application/ports/ISupabaseClient';

/**
 * Supabase Client Singleton
 * Manages single instance of Supabase client
 */
class SupabaseClientSingleton implements ISupabaseClient {
  private static instance: SupabaseClientSingleton | null = null;
  private client: SupabaseClientType | null = null;
  private initializationError: string | null = null;
  private config: SupabaseConfig | null = null;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get singleton instance
   */
  static getInstance(): SupabaseClientSingleton {
    if (!SupabaseClientSingleton.instance) {
      SupabaseClientSingleton.instance = new SupabaseClientSingleton();
    }
    return SupabaseClientSingleton.instance;
  }

  /**
   * Initialize Supabase client with configuration
   * Configuration must be provided by the application (not from .env)
   *
   * @param config - Supabase configuration
   * @returns Supabase client instance or null if initialization fails
   */
  initialize(config: SupabaseConfig): SupabaseClientType | null {
    // Return existing instance if already initialized
    if (this.client) {
      return this.client;
    }

    // Don't retry if initialization already failed
    if (this.initializationError) {
      return null;
    }

    try {
      // Validate configuration
      const validation = validateSupabaseConfig(config);
      if (!validation.valid) {
        this.initializationError = validation.error || 'Invalid configuration';
        return null;
      }

      // Store config for later use
      this.config = config;

      // Use provided storage or default to AsyncStorage
      const storage = config.storage || {
        getItem: (key: string) => AsyncStorage.getItem(key),
        setItem: (key: string, value: string) =>
          AsyncStorage.setItem(key, value),
        removeItem: (key: string) => AsyncStorage.removeItem(key),
      };

      // Create Supabase client
      this.client = createClient(config.url, config.anonKey, {
        auth: {
          storage,
          autoRefreshToken: config.autoRefreshToken ?? true,
          persistSession: config.persistSession ?? true,
          detectSessionInUrl: config.detectSessionInUrl ?? false,
        },
        db: {
          schema: (config.schema || 'public') as 'public',
        },
        realtime: {
          heartbeatIntervalMs: config.realtimeHeartbeatIntervalMs || 30000,
        },
      }) as SupabaseClientType;

      return this.client;
    } catch (error) {
      this.initializationError =
        error instanceof Error
          ? error.message
          : 'Failed to initialize Supabase client';
      return null;
    }
  }

  /**
   * Get the Supabase client instance
   * @throws {SupabaseInitializationError} If client is not initialized
   */
  getClient(): SupabaseClientType {
    if (!this.client) {
      const errorMsg =
        this.initializationError ||
        'Supabase client not initialized. Call initialize() first with configuration.';
      throw new SupabaseInitializationError(errorMsg);
    }
    return this.client;
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.client !== null;
  }

  /**
   * Get initialization error if any
   */
  getInitializationError(): string | null {
    return this.initializationError;
  }

  /**
   * Clear all session cache
   * Useful for logout and GDPR compliance
   */
  async clearSessionCache(): Promise<void> {
    try {
      if (this.client) {
        // Clear Supabase auth session
        await this.client.auth.signOut();

        // Clear AsyncStorage session keys
        const keys = await AsyncStorage.getAllKeys();
        const sessionKeys = keys.filter(
          key =>
            key.includes('supabase') ||
            key.includes('auth') ||
            key.includes('session') ||
            key.includes('sb-')
        );

        if (sessionKeys.length > 0) {
          await AsyncStorage.multiRemove(sessionKeys);
        }
      }
    } catch {
      // Silent error - session cache clear is best effort
    }
  }

  /**
   * Reset the client instance
   * Useful for testing
   */
  reset(): void {
    this.client = null;
    this.initializationError = null;
    this.config = null;
  }
}

/**
 * Singleton instance
 */
export const supabaseClient = SupabaseClientSingleton.getInstance();

/**
 * Initialize Supabase client
 * This is the main entry point for applications
 *
 * @param config - Supabase configuration (must be provided by app, not from .env)
 * @returns Supabase client instance or null if initialization fails
 *
 * @example
 * ```typescript
 * import { initializeSupabase } from '@umituz/react-native-supabase';
 *
 * // Get config from your app's configuration (e.g., from Constants, config file, etc.)
 * const config = {
 *   url: 'https://your-project.supabase.co',
 *   anonKey: 'your-anon-key',
 * };
 *
 * const client = initializeSupabase(config);
 * if (!client) {
 *   console.error('Failed to initialize Supabase');
 * }
 * ```
 */
export function initializeSupabase(
  config: SupabaseConfig
): SupabaseClientType | null {
  return supabaseClient.initialize(config);
}

/**
 * Get Supabase client instance
 * @throws {SupabaseInitializationError} If client is not initialized
 *
 * @example
 * ```typescript
 * import { getSupabaseClient } from '@umituz/react-native-supabase';
 *
 * try {
 *   const client = getSupabaseClient();
 *   const { data } = await client.from('users').select();
 * } catch (error) {
 *   console.error('Supabase not initialized');
 * }
 * ```
 */
export function getSupabaseClient(): SupabaseClientType {
  return supabaseClient.getClient();
}

/**
 * Check if Supabase client is initialized
 */
export function isSupabaseInitialized(): boolean {
  return supabaseClient.isInitialized();
}

/**
 * Get initialization error if any
 */
export function getSupabaseInitializationError(): string | null {
  return supabaseClient.getInitializationError();
}

/**
 * Clear all session cache
 * Useful for logout and GDPR compliance
 */
export async function clearSupabaseSessionCache(): Promise<void> {
  return supabaseClient.clearSessionCache();
}

/**
 * Reset Supabase client instance
 * Useful for testing
 */
export function resetSupabaseClient(): void {
  supabaseClient.reset();
}

// Export types
export type { SupabaseClientType };
export type { SupabaseConfig } from '../../domain/value-objects/SupabaseConfig';


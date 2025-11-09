/**
 * useSupabase Hook
 *
 * Domain-Driven Design: Presentation layer hook for Supabase client
 * Provides React hook for accessing Supabase client instance
 */

import { useMemo } from 'react';
import { getSupabaseClient, isSupabaseInitialized } from '../../infrastructure/config/SupabaseClient';
import type { SupabaseClientType } from '../../infrastructure/config/SupabaseClient';
import { SupabaseInitializationError } from '../../domain/errors/SupabaseError';

/**
 * Supabase Hook Result
 */
export interface UseSupabaseResult {
  /**
   * Supabase client instance
   * @throws {SupabaseInitializationError} If client is not initialized
   */
  client: SupabaseClientType;

  /**
   * Whether client is initialized
   */
  isInitialized: boolean;

  /**
   * Get client safely (returns null if not initialized)
   */
  getClientSafely: () => SupabaseClientType | null;
}

/**
 * React hook for accessing Supabase client
 *
 * @example
 * ```typescript
 * import { useSupabase } from '@umituz/react-native-supabase';
 *
 * const MyComponent = () => {
 *   const { client, isInitialized } = useSupabase();
 *
 *   if (!isInitialized) {
 *     return <Text>Loading...</Text>;
 *   }
 *
 *   // Use client
 *   const fetchData = async () => {
 *     const { data } = await client.from('users').select();
 *   };
 *
 *   return <View>...</View>;
 * };
 * ```
 */
export function useSupabase(): UseSupabaseResult {
  const isInitialized = useMemo(() => isSupabaseInitialized(), []);

  const client = useMemo(() => {
    if (!isInitialized) {
      throw new SupabaseInitializationError(
        'Supabase client not initialized. Call initializeSupabase() first.'
      );
    }
    return getSupabaseClient();
  }, [isInitialized]);

  const getClientSafely = useMemo(
    () => (): SupabaseClientType | null => {
      if (!isInitialized) {
        return null;
      }
      try {
        return getSupabaseClient();
      } catch {
        return null;
      }
    },
    [isInitialized]
  );

  return {
    client,
    isInitialized,
    getClientSafely,
  };
}


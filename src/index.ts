/**
 * React Native Supabase - Public API
 *
 * Domain-Driven Design (DDD) Architecture
 *
 * This is the SINGLE SOURCE OF TRUTH for all Supabase operations.
 * ALL imports from the Supabase package MUST go through this file.
 *
 * Architecture:
 * - domain: Entities, value objects, errors (business logic)
 * - application: Ports (interfaces)
 * - infrastructure: Supabase client implementation
 * - presentation: Hooks (React integration)
 *
 * Usage:
 *   import { initializeSupabase, getSupabaseClient, useSupabase } from '@umituz/react-native-supabase';
 */

// =============================================================================
// DOMAIN LAYER - Business Logic
// =============================================================================

export {
  SupabaseError,
  SupabaseInitializationError,
  SupabaseConfigurationError,
  SupabaseAuthError,
  SupabaseDatabaseError,
  SupabaseStorageError,
  SupabaseRealtimeError,
} from './domain/errors/SupabaseError';

export type { SupabaseConfig } from './domain/value-objects/SupabaseConfig';
export { validateSupabaseConfig } from './domain/value-objects/SupabaseConfig';

// =============================================================================
// APPLICATION LAYER - Ports
// =============================================================================

export type { ISupabaseClient } from './application/ports/ISupabaseClient';

// =============================================================================
// INFRASTRUCTURE LAYER - Implementation
// =============================================================================

export {
  initializeSupabase,
  getSupabaseClient,
  isSupabaseInitialized,
  getSupabaseInitializationError,
  clearSupabaseSessionCache,
  resetSupabaseClient,
  supabaseClient,
} from './infrastructure/config/SupabaseClient';

export type { SupabaseClientType } from './infrastructure/config/SupabaseClient';

// =============================================================================
// PRESENTATION LAYER - Hooks
// =============================================================================

export { useSupabase } from './presentation/hooks/useSupabase';
export type { UseSupabaseResult } from './presentation/hooks/useSupabase';



/**
 * Supabase Domain Errors
 *
 * Domain-Driven Design: Error types for Supabase operations
 */

/**
 * Base Supabase Error
 */
export class SupabaseError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'SupabaseError';
    Object.setPrototypeOf(this, SupabaseError.prototype);
  }
}

/**
 * Initialization Error
 * Thrown when Supabase client fails to initialize
 */
export class SupabaseInitializationError extends SupabaseError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'INITIALIZATION_ERROR', originalError);
    this.name = 'SupabaseInitializationError';
    Object.setPrototypeOf(this, SupabaseInitializationError.prototype);
  }
}

/**
 * Configuration Error
 * Thrown when required configuration is missing or invalid
 */
export class SupabaseConfigurationError extends SupabaseError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'CONFIGURATION_ERROR', originalError);
    this.name = 'SupabaseConfigurationError';
    Object.setPrototypeOf(this, SupabaseConfigurationError.prototype);
  }
}

/**
 * Authentication Error
 * Thrown when authentication operations fail
 */
export class SupabaseAuthError extends SupabaseError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'AUTH_ERROR', originalError);
    this.name = 'SupabaseAuthError';
    Object.setPrototypeOf(this, SupabaseAuthError.prototype);
  }
}

/**
 * Database Error
 * Thrown when database operations fail
 */
export class SupabaseDatabaseError extends SupabaseError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'DATABASE_ERROR', originalError);
    this.name = 'SupabaseDatabaseError';
    Object.setPrototypeOf(this, SupabaseDatabaseError.prototype);
  }
}

/**
 * Storage Error
 * Thrown when storage operations fail
 */
export class SupabaseStorageError extends SupabaseError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'STORAGE_ERROR', originalError);
    this.name = 'SupabaseStorageError';
    Object.setPrototypeOf(this, SupabaseStorageError.prototype);
  }
}

/**
 * Realtime Error
 * Thrown when realtime operations fail
 */
export class SupabaseRealtimeError extends SupabaseError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'REALTIME_ERROR', originalError);
    this.name = 'SupabaseRealtimeError';
    Object.setPrototypeOf(this, SupabaseRealtimeError.prototype);
  }
}





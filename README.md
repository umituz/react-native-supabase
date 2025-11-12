# @umituz/react-native-supabase

Domain-Driven Design Supabase client for React Native apps with type-safe operations and singleton pattern.

## Installation

```bash
npm install @umituz/react-native-supabase
```

## Peer Dependencies

- `@supabase/supabase-js` >= 2.39.0
- `react` >= 18.2.0
- `react-native` >= 0.74.0
- `@react-native-async-storage/async-storage` >= 1.21.0

## Features

- ✅ Domain-Driven Design (DDD) architecture
- ✅ Singleton pattern for single client instance
- ✅ Type-safe Supabase operations
- ✅ React hooks for easy integration
- ✅ Configuration validation
- ✅ Session cache management
- ✅ **Security**: No .env reading - configuration must be provided by app
- ✅ Works with Expo and React Native CLI

## Important: Configuration

**This package does NOT read from .env files for security reasons.** You must provide configuration from your application code.

### Why?

- **Security**: Prevents accidental exposure of credentials
- **Flexibility**: Works with any configuration source (Constants, config files, etc.)
- **Multi-app support**: Same package can be used across hundreds of apps with different configs

## Usage

### 1. Initialize Supabase Client

Initialize the client early in your app (e.g., in `App.tsx` or `index.js`):

```typescript
import { initializeSupabase } from '@umituz/react-native-supabase';
import Constants from 'expo-constants';

// Get configuration from your app's config source
// Option 1: From Expo Constants (recommended for Expo apps)
const config = {
  url: Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL!,
  anonKey: Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
};

// Option 2: From your app's config file
// const config = require('./config/supabase.json');

// Option 3: Direct configuration
// const config = {
//   url: 'https://your-project.supabase.co',
//   anonKey: 'your-anon-key',
// };

// Initialize
const client = initializeSupabase(config);

if (!client) {
  console.error('Failed to initialize Supabase');
  // Handle initialization error
}
```

### 2. Use Supabase Client

#### Direct Access

```typescript
import { getSupabaseClient } from '@umituz/react-native-supabase';

// Get client instance
const client = getSupabaseClient();

// Use Supabase features
const { data, error } = await client.from('users').select();
const { data: authData } = await client.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});
```

#### React Hook

```typescript
import { useSupabase } from '@umituz/react-native-supabase';

const MyComponent = () => {
  const { client, isInitialized, getClientSafely } = useSupabase();

  if (!isInitialized) {
    return <Text>Loading...</Text>;
  }

  const fetchData = async () => {
    const { data, error } = await client.from('users').select();
    if (error) {
      console.error(error);
      return;
    }
    console.log(data);
  };

  return (
    <View>
      <Button title="Fetch Data" onPress={fetchData} />
    </View>
  );
};
```

### 3. Advanced Configuration

```typescript
import { initializeSupabase } from '@umituz/react-native-supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const config = {
  url: 'https://your-project.supabase.co',
  anonKey: 'your-anon-key',
  
  // Optional: Custom storage adapter
  storage: {
    getItem: (key: string) => AsyncStorage.getItem(key),
    setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
    removeItem: (key: string) => AsyncStorage.removeItem(key),
  },
  
  // Optional: Custom schema
  schema: 'public',
  
  // Optional: Realtime heartbeat interval
  realtimeHeartbeatIntervalMs: 30000,
  
  // Optional: Auth settings
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
};

initializeSupabase(config);
```

### 4. Session Management

```typescript
import { clearSupabaseSessionCache } from '@umituz/react-native-supabase';

// Clear session cache (useful for logout and GDPR compliance)
await clearSupabaseSessionCache();
```

### 5. Error Handling

```typescript
import {
  getSupabaseClient,
  SupabaseInitializationError,
  SupabaseConfigurationError,
} from '@umituz/react-native-supabase';

try {
  const client = getSupabaseClient();
  // Use client
} catch (error) {
  if (error instanceof SupabaseInitializationError) {
    console.error('Supabase not initialized:', error.message);
  } else if (error instanceof SupabaseConfigurationError) {
    console.error('Invalid configuration:', error.message);
  }
}
```

### 6. Check Initialization Status

```typescript
import {
  isSupabaseInitialized,
  getSupabaseInitializationError,
} from '@umituz/react-native-supabase';

if (isSupabaseInitialized()) {
  console.log('Supabase is ready');
} else {
  const error = getSupabaseInitializationError();
  console.error('Initialization error:', error);
}
```

## API

### Functions

- `initializeSupabase(config)`: Initialize Supabase client with configuration
- `getSupabaseClient()`: Get Supabase client instance (throws if not initialized)
- `isSupabaseInitialized()`: Check if client is initialized
- `getSupabaseInitializationError()`: Get initialization error if any
- `clearSupabaseSessionCache()`: Clear all session cache
- `resetSupabaseClient()`: Reset client instance (useful for testing)

### Hooks

- `useSupabase()`: React hook for accessing Supabase client

### Types

- `SupabaseConfig`: Configuration interface
- `SupabaseClientType`: Supabase client type
- `UseSupabaseResult`: Hook return type

### Errors

- `SupabaseError`: Base error class
- `SupabaseInitializationError`: Initialization errors
- `SupabaseConfigurationError`: Configuration errors
- `SupabaseAuthError`: Authentication errors
- `SupabaseDatabaseError`: Database errors
- `SupabaseStorageError`: Storage errors
- `SupabaseRealtimeError`: Realtime errors

## Integration with Expo

For Expo apps, configure in `app.config.js`:

```javascript
module.exports = () => {
  return {
    expo: {
      // ... other config
      extra: {
        supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
        supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      },
    },
  };
};
```

Then initialize in your app:

```typescript
import { initializeSupabase } from '@umituz/react-native-supabase';
import Constants from 'expo-constants';

const config = {
  url: Constants.expoConfig?.extra?.supabaseUrl!,
  anonKey: Constants.expoConfig?.extra?.supabaseAnonKey!,
};

initializeSupabase(config);
```

## Security Best Practices

1. **Never commit credentials**: Use environment variables or secure config files
2. **Use anon key only**: This package only requires the anonymous/public key (safe for client-side)
3. **Implement RLS**: Use Supabase Row Level Security for data protection
4. **Clear sessions on logout**: Always call `clearSupabaseSessionCache()` on logout

## License

MIT





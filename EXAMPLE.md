# Usage Examples

## Basic Setup

### 1. Initialize in App Entry Point

```typescript
// App.tsx or index.js
import { initializeSupabase } from '@umituz/react-native-supabase';
import Constants from 'expo-constants';

// Get config from your app's configuration
const config = {
  url: Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL!,
  anonKey: Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
};

// Initialize once at app startup
const client = initializeSupabase(config);

if (!client) {
  console.error('Failed to initialize Supabase');
}
```

### 2. Use in Components

```typescript
// components/UserList.tsx
import { useSupabase } from '@umituz/react-native-supabase';
import { useEffect, useState } from 'react';

export const UserList = () => {
  const { client, isInitialized } = useSupabase();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!isInitialized) return;

    const fetchUsers = async () => {
      const { data, error } = await client.from('users').select();
      if (error) {
        console.error(error);
        return;
      }
      setUsers(data || []);
    };

    fetchUsers();
  }, [client, isInitialized]);

  if (!isInitialized) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      {users.map(user => (
        <Text key={user.id}>{user.name}</Text>
      ))}
    </View>
  );
};
```

### 3. Authentication Example

```typescript
// services/AuthService.ts
import { getSupabaseClient } from '@umituz/react-native-supabase';

export const signIn = async (email: string, password: string) => {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const signOut = async () => {
  const client = getSupabaseClient();
  await client.auth.signOut();
  // Also clear session cache for GDPR compliance
  await clearSupabaseSessionCache();
};
```

### 4. Realtime Subscription Example

```typescript
// hooks/useRealtimeUsers.ts
import { useSupabase } from '@umituz/react-native-supabase';
import { useEffect, useState } from 'react';

export const useRealtimeUsers = () => {
  const { client, isInitialized } = useSupabase();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!isInitialized) return;

    const channel = client
      .channel('users')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        (payload) => {
          console.log('Change received!', payload);
          // Update users state
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [client, isInitialized]);

  return users;
};
```

### 5. Error Handling Example

```typescript
import {
  getSupabaseClient,
  SupabaseInitializationError,
  SupabaseDatabaseError,
} from '@umituz/react-native-supabase';

const fetchData = async () => {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client.from('users').select();

    if (error) {
      throw new SupabaseDatabaseError(error.message, error);
    }

    return data;
  } catch (error) {
    if (error instanceof SupabaseInitializationError) {
      console.error('Supabase not initialized');
      // Handle initialization error
    } else if (error instanceof SupabaseDatabaseError) {
      console.error('Database error:', error.message);
      // Handle database error
    } else {
      console.error('Unknown error:', error);
    }
    throw error;
  }
};
```

### 6. Expo Configuration Example

```javascript
// app.config.js
module.exports = () => {
  return {
    expo: {
      name: 'My App',
      // ... other config
      extra: {
        supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
        supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      },
    },
  };
};
```

```typescript
// App.tsx
import { initializeSupabase } from '@umituz/react-native-supabase';
import Constants from 'expo-constants';

const config = {
  url: Constants.expoConfig?.extra?.supabaseUrl!,
  anonKey: Constants.expoConfig?.extra?.supabaseAnonKey!,
};

initializeSupabase(config);
```

### 7. Custom Storage Adapter Example

```typescript
import { initializeSupabase } from '@umituz/react-native-supabase';
import * as SecureStore from 'expo-secure-store';

// Custom secure storage adapter
const secureStorage = {
  getItem: async (key: string) => {
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};

const config = {
  url: 'https://your-project.supabase.co',
  anonKey: 'your-anon-key',
  storage: secureStorage,
};

initializeSupabase(config);
```



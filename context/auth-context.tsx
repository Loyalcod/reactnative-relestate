import { appwriteConfig } from '@/constants/appwrite';
import { account, database } from '@/lib/appwrite';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Query } from 'react-native-appwrite';

type User = Awaited<ReturnType<typeof account.get>>;
type Property = any;

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  latestProperties: Property[];
  properties: Property[];


  refetch: () => Promise<void>;
  signOut: () => Promise<void>;

  getLatestProperties: () => Promise<Property[]>;
  getProperties: (params: {
    filter: string;
    query: string;
    limit: number;
  }) => Promise<Property[]>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [latestProperties, setLatestProperties] = useState<Property[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  const refetch = useCallback(async () => {
    try {
      const u = await account.get();
      setUser(u);
    } catch {
      setUser(null);
    }
  }, []);

  const getLatestProperties = useCallback(async () => {
    try {
      const result = await database.listDocuments(
        appwriteConfig.databaseId!,
        appwriteConfig.propertiesCollectionId!,
        [Query.orderAsc("$createdAt"), Query.limit(5)]
      );

      setLatestProperties(result.documents);
      return result.documents;
    } catch (error) {
      console.error(error);
      setLatestProperties([]);
      return [];
    }
  }, []);

  const getProperties = useCallback(
    async ({
      filter,
      query,
      limit,
    }: {
      filter: string;
      query: string;
      limit: number;
    }) => {
      try {
        const buildQuery = [Query.orderDesc("$createdAt")];

        if (filter && filter !== "All") {
          buildQuery.push(Query.equal("type", filter));
        }

        if (query) {
          buildQuery.push(
            Query.or([
              Query.search("name", query),
              Query.search("address", query),
              Query.search("type", query),
            ])
          );
        }

        if (limit) buildQuery.push(Query.limit(limit));

        const result = await database.listDocuments(
          appwriteConfig.databaseId!,
          appwriteConfig.propertiesCollectionId!,
          buildQuery
        );

        setProperties(result.documents);
        return result.documents;
      } catch (error) {
        console.error(error);
        setProperties([]);
        return [];
      }
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const u = await account.get();
        if (!cancelled) setUser(u);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signOut = useCallback(async () => {
    try {
      await account.deleteSession({ sessionId: 'current' });
    } catch {
      // Session may already be invalid
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,

      latestProperties,
      properties,

      refetch,
      signOut,

      getLatestProperties,
      getProperties,
    }),
    [user, isLoading, latestProperties, properties, refetch, signOut,  getLatestProperties, getProperties,],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

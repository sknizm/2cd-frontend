import { config } from '@/lib/config';
import { useEffect, useState } from 'react';

export type User = {
  id: string;
  email: string;
};

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`${config.backend_url}/api/session`, {
          credentials: 'include',
        });

        const data = await res.json();
        console.log("User ............", data.data.user)
        setUser(data.user || null);
      } catch (err) {
        console.error('Failed to fetch session:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  return { user, loading, isAuthenticated: !!user };
}

import { config } from "@/lib/config";
import { createContext, useEffect, useState, ReactNode } from "react";


interface User {
  id: string;  // UUID is a string
  email: string;
}

interface AppContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export default function AppProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);

  
 async function getUser() {
 try {
  const res = await fetch(`${config.backend_url}/api/user-data`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,  // ✅ Required for Sanctum token
      Accept: "application/json",        // ✅ Important for Laravel to return JSON
    },
  });
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to fetch user data.");
    }

    // If your API returns { success: true, data: { id, email, ... } }
    if (result.success) {
      setUser(result.data as User);
    } else {
      console.warn("Unexpected response format:", result);
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
    setUser(null); // Optional: reset user state on error
  }
}

  useEffect(() => {
    if (token) {
      getUser();
    }
  }, [token]);

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}

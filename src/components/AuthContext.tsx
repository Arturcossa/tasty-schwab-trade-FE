"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<{
    success: boolean;
    token?: string;
    message?: string;
  }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("TIM_USER");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      console.log("res", res)
      const data = await res.json();

      if (res.ok && data.success) {
        setUser({ email });
        localStorage.setItem("TIM_USER", JSON.stringify({ email }));
        localStorage.setItem("TIM_TOKEN", data.token);
        return { success: true, token: data.token };
      }
      return {
        success: false,
        message: data.message,
      };
    } catch (err) {
      return { success: false, message: "Network error" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("TIM_USER");
    localStorage.removeItem("TIM_TOKEN");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

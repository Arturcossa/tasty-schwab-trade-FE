"use client";

import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";

interface AuthContextType {
  user: { email: string; token: string } | null;
  connectionStatus: {
    schwab: boolean,
    tasty: boolean,
  }
  login: (
    email: string,
    password: string
  ) => Promise<{
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
  const [user, setUser] = useState<{ email: string; token: string } | null>(
    null
  );
  const [connectionStatus, setConnectionStatus] = useState<{
    schwab: boolean;
    tasty: boolean;
  }>({
    schwab: false,
    tasty: false,
  });
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("TIM_USER");
    const storedToken = localStorage.getItem("TIM_TOKEN");
    if (storedUser && storedToken) {
      setUser({ email: JSON.parse(storedUser), token: storedToken });
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
      const data = await res.json();

      if (res.ok && data.success) {
        setUser({ email: email, token: data.token });
        setConnectionStatus({
          schwab: data.refreshToken ? true : false,
          tasty: data.tastyToken ? true : false,
        });
        toast.success("Successful login!", {
          className: "toast-success",
        });
        router.push("/dashboard");
        return { success: true, token: data.token };
      }

      toast.error(`${data.message}`, {
        className: "toast-error",
      });
      return {
        success: false,
        message: data.message,
      };
    } catch (err) {
      toast.error(`Network error`, {
        className: "toast-error",
      });
      return { success: false, message: "Network error" };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, connectionStatus, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

"use client";

import LoginPage from "@/app/login/page";
import { useAuth } from "@/components/AuthContext";
import { Toaster } from "@/components/ui/sonner";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <>
        <LoginPage />
      </>
    );
  }

  return <>{children}</>;
}

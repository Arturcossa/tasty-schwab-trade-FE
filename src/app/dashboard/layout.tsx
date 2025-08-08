'use client'

import AppBreadCrumb from "@/components/app-breadcrumb";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import TokenValidationModal from "@/components/token-validation-modal";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      redirect('/login')
    }
  }, [user])

  return (
    <>
      <SidebarProvider>
        <div className="flex h-full w-full">
          <AppSidebar />
          <main className="flex-1 min-w-0 py-5 px-5">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <AppBreadCrumb />
            </div>
            {children}
          </main>
        </div>
        <TokenValidationModal />
      </SidebarProvider>
    </>
  );
};

export default DashboardLayout;

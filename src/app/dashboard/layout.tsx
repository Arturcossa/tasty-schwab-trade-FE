import AppBreadCrumb from "@/components/app-breadcrumb";
import AppSidebar from "@/components/app-sidebar";
import PlayButtons from "@/components/play-buttons";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import TokenValidationModal from "@/components/token-validation-modal";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full py-5 px-5">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <AppBreadCrumb />
            <PlayButtons />
          </div>
          {children}
        </main>
        <TokenValidationModal />
      </SidebarProvider>
    </>
  );
};

export default DashboardLayout;

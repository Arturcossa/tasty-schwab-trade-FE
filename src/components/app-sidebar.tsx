"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const AppSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <Sidebar className="font-playfair">
      <SidebarHeader className="py-10">
        <Link className="flex flex-col items-center gap-3" href="/dashboard">
          <Image
            src="/logo.png"
            alt="Tasty Trading Logo"
            width={100}
            height={100}
          />
          <p className="uppercase font-bold text-2xl">Trading bot</p>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/strategy-control"}
                  className="flex items-center gap-3 px-3 py-5 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <Link href="/dashboard/strategy-control">
                    <LayoutDashboard size={18} />
                    <span className="text-base font-semibold">
                      Strategy Control
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/user-setting"}
                  className="flex items-center gap-3 px-3 py-5 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <Link href="/dashboard/user-setting">
                    <User size={18} />
                    <span className="text-base font-semibold">
                      User Setting
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <hr />
        <SidebarGroup>
          <SidebarGroupContent>
            {/* <PlayButtons /> */}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col items-center gap-2 w-full px-4 pb-4">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 font-semibold text-base"
            onClick={logout}
          >
            <LogOut size={18} />
            Log out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

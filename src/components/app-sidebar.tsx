'use client'

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
import { LayoutDashboard, KeyRound, Zap, LogOut } from "lucide-react";
import Image from "next/image";

const menuItems = [
  {
    label: "Strategy Control",
    href: "/strategy-control",
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "Token Management",
    href: "/token-management",
    icon: <KeyRound size={18} />,
  },
  {
    label: "Quick Actions",
    href: "/quick-actions",
    icon: <Zap size={18} />,
  },
];

const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="font-playfair">
      <SidebarHeader className="py-10">
        <Link className="flex flex-col items-center gap-3" href="/">
          <Image src="/logo.png" alt="Tasty Trading Logo" width={100} height={100} />
          <p className="uppercase font-bold text-2xl">Trading bot</p>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="flex items-center gap-3 px-3 py-5 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <Link href={item.href}>
                      {item.icon}
                      <span className="text-base font-semibold">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col items-center gap-2 w-full px-4 pb-4">
          <Button variant="outline" className="w-full flex items-center gap-2 font-semibold text-base">
            <LogOut size={18} />
            Log out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
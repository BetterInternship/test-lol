"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileEdit, FileText, FileUser, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    icon: <BarChart3 className="h-5 w-5" />,
    label: "My Applications",
  },
  {
    href: "/listings",
    icon: <FileText className="h-5 w-5" />,
    label: "My Listings",
  },
  {
    href: "/forms-management",
    icon: <FileUser className="h-5 w-5" />,
    label: "Forms Automation",
  },
];

function SideNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col">
      {items.map(({ href, label, icon }) => (
        <Link key={label} href={href} className="w-full">
          <Button
            variant="ghost"
            scheme="default"
            className={cn(
              "w-full h-10 px-8 flex flex-row justify-start border-0 rounded-none",
              pathname === href ? "text-primary bg-gray-200" : "font-normal"
            )}
          >
            {icon}
            {label}
          </Button>
        </Link>
      ))}
    </nav>
  );
}

interface ContentLayoutProps {
  children?: React.ReactNode;
}

const ContentLayout: React.FC<ContentLayoutProps> = ({ children }) => {
  return (
    <>
      <aside className="lg:block fixed top-16 left-0 z-20 h-screen w-[280px] border-r bg-muted/40">
        <div className="flex h-full flex-col gap-2 overflow-y-auto py-4">
          <SideNav items={navItems} />
        </div>
       </aside> 

      <div className="flex flex-col w-full lg:ml-[280px] h-full">
        <main className="flex-1 flex overflow-auto justify-center bg-white">
          {children}
        </main>
      </div>
    </>
  );
};

export default ContentLayout;

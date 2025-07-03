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
      <aside className="hidden lg:block fixed top-16 left-0 z-20 h-screen w-[280px] border-r bg-muted/40">
        <div className="flex h-full flex-col gap-2 overflow-y-auto py-4">
          <SideNav items={navItems} />
        </div>
      </aside>

      <div className="flex flex-col w-full lg:ml-[280px] h-full">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6 lg:hidden sticky top-0 z-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex flex-col p-4 top-18 mt-0 max-h-[calc(100vh-4rem)] border-r-0"
            >
              <SheetTitle hidden />
              <SideNav items={navItems} />
            </SheetContent>
          </Sheet>
        </header>
        <main className=" flex-1 flex overflow-auto">{children}</main>
      </div>
    </>
  );
};

export default ContentLayout;

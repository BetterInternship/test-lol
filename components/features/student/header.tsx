"use client";

import React from "react";
import { useAuthContext } from "@/lib/ctx-auth";
import { useRouter } from "next/navigation";
import { User, Settings, BookA, Heart, LogOut, HelpCircle } from "lucide-react";
import { useAppContext } from "@/lib/ctx-app";
import { DropdownOption, GroupableNavDropdown } from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HeaderTitle } from "@/components/shared/header";
import { useRoute } from "@/hooks/use-route";

/**
 * The header present on every page
 *
 * @component
 */
export const Header = () => {
  const { is_mobile } = useAppContext();
  const header_routes = ["/login", "/register", "/otp"];
  const { route_excluded } = useRoute();

  return (
    <div
      className={cn(
        "flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-gray-100 z-[90]",
        is_mobile ? "px-6 py-4" : "py-4 px-8"
      )}
      style={{
        // Ensure dropdown can escape overflow constraints
        overflow: "visible",
        position: "relative",
        zIndex: 100,
      }}
    >
      <HeaderTitle />
      {route_excluded(header_routes) ? (
        <ProfileButton />
      ) : (
        <div className="w-1 h-10 bg-transparent"></div>
      )}
    </div>
  );
};

/**
 * A dropdown menu for the other parts of the site
 *
 * @component
 */
export const ProfileButton = () => {
  const { user, is_authenticated, logout } = useAuthContext();
  const router = useRouter();

  const handle_logout = () => {
    logout().then(() => {
      router.push("/");
    });
  };

  return is_authenticated() ? (
    <div className="relative">
      <GroupableNavDropdown
        display={
          <div className="w-6 h-6 rounded-md border-2 border-gray-400 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
        }
        content={
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {user?.first_name && user?.last_name 
                ? `${user.first_name} ${user.last_name}` 
                : user?.email}
            </p>
            <p className="text-xs text-gray-500 text-ellipsis overflow-hidden">
              {user?.email}
            </p>
          </div>
        }
        className="z-[200]" // Higher z-index for mobile
      >
        <DropdownOption href="/profile">
          <Settings className="w-4 h-4 inline-block m-1 mr-2" />
          Profile Settings
        </DropdownOption>
        <DropdownOption href="/applications">
          <BookA className="w-4 h-4 inline-block m-1 mr-2" />
          Applications
        </DropdownOption>
        <DropdownOption href="/saved">
          <Heart className="w-4 h-4 inline-block m-1 mr-2" />
          Saved Jobs
        </DropdownOption>
        <DropdownOption href="/help">
          <HelpCircle className="w-4 h-4 inline-block m-1 mr-2" />
          Help Center
        </DropdownOption>
        <DropdownOption href="/login" on_click={handle_logout}>
          <LogOut className="text-red-500 w-4 h-4 inline-block m-1 mr-2" />
          <span className="text-red-500">Sign Out</span>
        </DropdownOption>
      </GroupableNavDropdown>
    </div>
  ) : (
    <Button
      type="button"
      variant="outline"
      className="flex items-center gap-2 h-10 px-4 bg-white border-gray-300 hover:bg-gray-50 text-blue-600 hover:text-blue-600"
      onClick={() => router.push("/login")}
    >
      Sign in
    </Button>
  );
};

export default Header;

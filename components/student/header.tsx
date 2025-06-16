"use client";

import Link from "next/link";
import { useAuthContext } from "@/lib/ctx-auth";
import { usePathname, useRouter } from "next/navigation";
import { User, Settings, BookA, Heart, LogOut } from "lucide-react";
import { useAppContext } from "@/lib/ctx-app";
import { DropdownOption, GroupableNavDropdown } from "../ui/dropdown";
import { cn } from "@/lib/utils";

/**
 * The header present on every page
 *
 * @component
 */
export const Header = () => {
  const { is_mobile } = useAppContext();
  const authroutes = ["/login", "/register", "/otp"];
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-gray-100",
        is_mobile ? "px-6 py-4" : "py-4 px-8"
      )}
    >
      <HeaderTitle />
      {!authroutes.some((route) => pathname.startsWith(route)) ? (
        <ProfileButton />
      ) : (
        <div className="w-1 h-10 bg-transparent"></div>
      )}
    </div>
  );
};

const HeaderTitle = () => {
  const { is_mobile } = useAppContext();
  return (
    <Link href="/" className="block">
      <h1
        className={cn(
          "font-bold text-gray-900",
          is_mobile ? "text-lg" : "text-xl"
        )}
      >
        BetterInternship
      </h1>
    </Link>
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

  const get_display_name = () => {
    if (!user?.full_name) return "User";
    const names = user.full_name.split(" ");
    if (names.length > 1)
      return `${names[0]} ${names[names.length - 1].charAt(0)}.`;
    return names[0];
  };

  return (
    <GroupableNavDropdown
      display={
        <>
          <div className="w-6 h-6 rounded-md border-2 border-gray-400 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-gray-700 font-medium">
            {is_authenticated() ? get_display_name() : "Account"}
          </span>
        </>
      }
      content={
        is_authenticated() ? (
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {user?.full_name}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        ) : (
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Please sign in to access your profile.
            </p>
          </div>
        )
      }
    >
      {is_authenticated() ? (
        [
          <DropdownOption href="/profile">
            <Settings className="w-4 h-4 inline-block m-1 mr-2" />
            Profile Settings
          </DropdownOption>,
          <DropdownOption href="/applications">
            <BookA className="w-4 h-4 inline-block m-1 mr-2" />
            Applications
          </DropdownOption>,
          <DropdownOption href="/saved">
            <Heart className="w-4 h-4 inline-block m-1 mr-2" />
            Saved Jobs
          </DropdownOption>,
          <DropdownOption href="/login" on_click={handle_logout}>
            <LogOut className="text-red-500 w-4 h-4 inline-block m-1 mr-2"></LogOut>
            <span className="text-red-500">Sign Out</span>
          </DropdownOption>,
        ]
      ) : (
        <DropdownOption highlighted href="/login">
          Sign in
        </DropdownOption>
      )}
    </GroupableNavDropdown>
  );
};

export default Header;

import { Database } from "@/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { LucideIcon } from "lucide-react";

export type TypedSupabase = SupabaseClient<Database>;
export type SupabaseEnums = Database["public"]["Enums"];

export type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

export type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
  has_notifications?: boolean;
  should_show?: boolean;
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
};
export * from "./axios-base-types";
export * from "./file-upload-type";
export * from "./internship-data";

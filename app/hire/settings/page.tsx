"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  BarChart3,
  FileText,
  Building2,
  UserPlus,
  LogOut,
  FileEdit,
  Settings,
} from "lucide-react";
import Link from "next/link";
import ContentLayout from "@/components/features/hire/content-layout";

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <ContentLayout>
        <div className="h-screen bg-white flex">

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem className="cursor-pointer" asChild>
                                <Link href="/company-profile">
                                    <Building2 className="mr-2 h-4 w-4" />
                                    <span>Edit Company Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" asChild>
                                <Link href="/forms-automation">
                                    <FileEdit className="mr-2 h-4 w-4" />
                                    <span>Forms automation</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" asChild>
                                <Link href="/add-users">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    <span>Add Users</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" asChild>
                                <Link href="/settings">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-red-600"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center">
                            {/* Info for Automation Section */}
                            <div className="mb-12 mt-16">
                                <h2 className="text-xl font-semibold text-gray-800 mb-8">
                                    Info for Automation
                                </h2>

                                <div className="space-y-6">
                                    {/* Company Info */}
                                    <div className="cursor-pointer hover:opacity-75 transition-opacity">
                                        <h3 className="text-lg font-medium text-purple-600">
                                            Company Info
                                        </h3>
                                    </div>

                                    {/* Signatory Info */}
                                    <div className="cursor-pointer hover:opacity-75 transition-opacity">
                                        <h3 className="text-lg font-medium text-purple-600">
                                            Signatory Info
                                        </h3>
                                    </div>

                                    {/* Other Info */}
                                    <div className="cursor-pointer hover:opacity-75 transition-opacity">
                                        <h3 className="text-lg font-medium text-purple-600">
                                            Other Info
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ContentLayout>
  );
}

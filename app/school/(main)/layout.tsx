import React from "react";
import AdminPanelLayout from "@/components/features/school/ui/admin-panel/admin-panel-layout";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
};

export default Layout;

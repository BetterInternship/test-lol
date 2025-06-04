import React from "react";
import AdminPanelLayout from "@/components/school/ui/admin-panel/admin-panel-layout";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
};

export default Layout;

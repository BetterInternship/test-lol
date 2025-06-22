"use client";
import React from "react";
import ContentLayout from "@/components/features/hire/content-layout";
import DocumentsManagement from "@/components/features/hire/forms-management/documents-management";
import { useAuthContext } from "../authctx";

const Page = () => {
  const { redirect_if_not_logged_in } = useAuthContext();
  redirect_if_not_logged_in();

  return (
    <ContentLayout>
      <DocumentsManagement />
    </ContentLayout>
  );
};

export default Page;

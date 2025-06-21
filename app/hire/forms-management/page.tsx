import React from 'react';
import ContentLayout from "@/components/features/hire/content-layout";
import DocumentsManagement from "@/components/features/hire/forms-management/documents-management";

const Page = () => {
    return (
        <ContentLayout>
            <DocumentsManagement/>
        </ContentLayout>
    );
};

export default Page;
import React from "react";
import { ContentLayout } from "@/components/school/ui/admin-panel/content-layout";
import { StatsCards } from "@/components/school/dashboard/stats/stats-card";
import { StatsCharts } from "@/components/school/dashboard/stats/stats-chart";

const Page = () => {
  return (
    <ContentLayout title={"Internship Stats"}>
      <div className="space-y-6">
        <StatsCards />
        <StatsCharts />
      </div>
    </ContentLayout>
  );
};

export default Page;

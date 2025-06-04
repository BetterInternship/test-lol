import { Building, Briefcase, Users, FileCheck, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/school/ui/card";

export function StatsCards() {
  const stats = [
    {
      title: "Total Students",
      value: "1,248",
      icon: Users,
      description: "Students in internship program",
    },
    {
      title: "Active Listings",
      value: "342",
      icon: Briefcase,
      description: "Open internship positions",
    },
    {
      title: "Companies",
      value: "156",
      icon: Building,
      description: "Participating companies",
    },
    {
      title: "Applications",
      value: "2,845",
      icon: FileText,
      description: "Total applications submitted",
    },
    {
      title: "Accepted",
      value: "876",
      icon: FileCheck,
      description: "Applications accepted",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

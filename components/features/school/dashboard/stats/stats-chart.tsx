"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/features/school/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/features/school/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

const applicationData = [
  { month: "Jan", applications: 65, accepted: 40 },
  { month: "Feb", applications: 80, accepted: 45 },
  { month: "Mar", applications: 110, accepted: 60 },
  { month: "Apr", applications: 95, accepted: 50 },
  { month: "May", applications: 120, accepted: 70 },
  { month: "Jun", applications: 150, accepted: 90 },
];

const departmentDataRaw = [
  { name: "Computer Science", value: 35, key: "computerScience" },
  { name: "Business", value: 25, key: "business" },
  { name: "Engineering", value: 20, key: "engineering" },
  { name: "Design", value: 15, key: "design" },
  { name: "Other", value: 5, key: "other" },
];

const companyData = [
  { name: "Tech Co", students: 45 },
  { name: "Finance Inc", students: 30 },
  { name: "Design Studio", students: 25 },
  { name: "Marketing Group", students: 20 },
  { name: "Consulting LLC", students: 15 },
];

const applicationChartConfig = {
  applications: {
    label: "Applications",
    color: "hsl(242, 58%, 70%)", // Example: Purple-ish
  },
  accepted: {
    label: "Accepted",
    color: "hsl(165, 100%, 38%)", // Example: Green-ish
  },
} satisfies ChartConfig;

const departmentChartConfig = {
  computerScience: { label: "Computer Science", color: "hsl(217, 100%, 50%)" }, // Blue
  business: { label: "Business", color: "hsl(165, 100%, 38%)" }, // Teal/Green
  engineering: { label: "Engineering", color: "hsl(45, 100%, 57%)" }, // Yellow
  design: { label: "Design", color: "hsl(17, 100%, 63%)" }, // Orange
  other: { label: "Other", color: "hsl(242, 58%, 70%)" }, // Purple
} satisfies ChartConfig;

const departmentData = departmentDataRaw.map((dept) => ({
  ...dept,
  fill: `var(--color-${dept.key})`,
}));

const companyChartConfig = {
  students: {
    label: "Students Hired",
    color: "hsl(217, 100%, 50%)", // Example: Blue
  },
} satisfies ChartConfig;

export function StatsCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Application Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={applicationChartConfig}
            className="max-h-[400px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={applicationData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="hsl(var(--muted-foreground))"
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent indicator="line" />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                dataKey="applications"
                type="monotone"
                stroke="var(--color-applications)"
                strokeWidth={2}
                dot={{
                  r: 4,
                  fill: "var(--color-applications)",
                  strokeWidth: 1,
                }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                dataKey="accepted"
                type="monotone"
                stroke="var(--color-accepted)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--color-accepted)", strokeWidth: 1 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Internships by Department</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={departmentChartConfig}
            className="min-h-[300px] w-full"
          >
            <PieChart accessibilityLayer margin={{ top: 20, bottom: 20 }}>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="name" hideLabel />}
              />
              <Pie
                data={departmentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              />
              <ChartLegend content={<ChartLegendContent nameKey="key" />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-3">
        <CardHeader>
          <CardTitle>Top Companies by Hires</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={companyChartConfig}
            className="max-h-[400px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={companyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="hsl(var(--muted-foreground))"
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar
                dataKey="students"
                fill="var(--color-students)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

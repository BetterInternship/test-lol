import { Group } from "@/types";
import { TableIcon, ChartLineIcon } from "lucide-react";

const BASE_URL = "/dashboard";

export function getMenuList(): Group[] {
  return [
    {
      groupLabel: "Main",
      menus: [
        {
          href: `${BASE_URL}`,
          label: "Internship Stats",
          icon: ChartLineIcon,
          should_show: true,
        },
        {
          href: `${BASE_URL}/data`,
          label: "Internship Data",
          icon: TableIcon,
          should_show: true,
        },
      ],
    },
  ];
}

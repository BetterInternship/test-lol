"use client";

import { Autocomplete } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { TabGroup, Tab } from "@/components/ui/tabs";
import { useEmployers } from "@/hooks/use-employer-api";
import { employer_auth_service } from "@/lib/api/employer.api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthContext } from "../authctx";

export default function GodLandingPage() {
  const { login_as } = useAuthContext();
  const { employers, loading, error } = useEmployers();
  const [search_name, set_search_name] = useState<string | null>();
  const router = useRouter();

  // Redirect if no employers found (not god)
  useEffect(() => {
    if (!employers.length && !loading) router.push("/dashboard");
  }, [employers, loading]);

  /**
   * Handle auth by proxy
   *
   * @returns
   */
  const authorize_as = async (employer_id: string) => {
    await login_as(employer_id);
    router.push("/dashboard");
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <TabGroup>
        <Tab name="employers">
          <div className="absolute w-full px-4 py-4 border-b">
            <Autocomplete
              setter={set_search_name}
              options={employers.map((e) => e.name ?? "")}
              placeholder="Search name..."
            ></Autocomplete>
          </div>
          <div className="absolute mt-18 w-[100%] h-[100%] flex flex-col overflow-scroll p-4">
            {employers
              .filter((e) =>
                e.name?.toLowerCase().includes(search_name?.toLowerCase() ?? "")
              )
              .toSorted((a, b) => a.name?.localeCompare(b.name ?? "") ?? 0)
              .map((e) => (
                <div className="flex flex-row items-center p-2 space-x-2 hover:bg-gray-200 hover:cursor-pointer transition-all">
                  <Button
                    variant="outline"
                    className="border-blue-500 text-blue-500 hover:text-white hover:bg-blue-600 border-opacity-50 rounded-sm text-xs h-8 p-2"
                    onClick={() => authorize_as(e.id ?? "")}
                  >
                    View
                  </Button>
                  <div className="text-gray-700">{e.name}</div>
                </div>
              ))}
          </div>
        </Tab>

        <Tab name="students">
          <h1>Students</h1>
        </Tab>
      </TabGroup>
    </div>
  );
}

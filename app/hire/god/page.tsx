"use client";

import { Autocomplete } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { TabGroup, Tab } from "@/components/ui/tabs";
import { useEmployers, useUsers } from "@/lib/api/god.api";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuthContext } from "../authctx";
import { Badge, BoolBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { getFullName } from "@/lib/utils/user-utils";
import { BooleanCheckIcon } from "@/components/ui/icons";
import { EmployerApplication } from "@/lib/db/db.types";
import { useRefs } from "@/lib/db/use-refs";

export default function GodLandingPage() {
  const { login_as } = useAuthContext();
  const employers = useEmployers();
  const { users } = useUsers();
  const [search_name, set_search_name] = useState<string | null>();
  const [selected, set_selected] = useState("");
  const { to_app_status_name } = useRefs();
  const router = useRouter();
  const applications = useMemo(() => {
    const apps: EmployerApplication[] = [];
    // @ts-ignore
    employers.data.forEach((e) => e?.applications?.map((a) => apps.push(a)));
    return apps;
  }, [employers.data]);

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
    <div className="w-full h-[90vh] overflow-hidden">
      <TabGroup>
        <Tab name="verified employers">
          <div className="absolute w-full px-4 py-4 border-b">
            <Autocomplete
              setter={set_search_name}
              options={employers.data.map((e) => e.name ?? "")}
              placeholder="Search name..."
            ></Autocomplete>
          </div>
          <div className="absolute top-18 w-[100%] h-[85%] flex flex-col overflow-scroll p-4">
            {employers.data
              .filter((e) =>
                e.name?.toLowerCase().includes(search_name?.toLowerCase() ?? "")
              )
              .filter((e) => e.is_verified)
              .toSorted((a, b) => a.name?.localeCompare(b.name ?? "") ?? 0)
              .map((e) => (
                <div
                  key={e.id}
                  className="flex flex-row items-center p-2 space-x-2 hover:bg-gray-200 hover:cursor-pointer transition-all"
                >
                  <Button
                    scheme="primary"
                    size="xs"
                    onClick={() => authorize_as(e.id ?? "")}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    scheme="destructive"
                    size="xs"
                    disabled={employers.isUnverifying && e.id === selected}
                    onClick={() => {
                      set_selected(e.id ?? "");
                      employers.unverify(e.id ?? "");
                    }}
                  >
                    {employers.isUnverifying && e.id === selected
                      ? "Unverifying..."
                      : "Unverify"}
                  </Button>
                  <div className="text-gray-700 w-full">{e.name}</div>
                  <Badge
                    // @ts-ignore
                    type={!e?.applications?.length ? "destructive" : "default"}
                  >
                    {
                      // @ts-ignore
                      e?.applications?.length ?? 0
                    }{" "}
                    applications
                  </Badge>
                  <Badge type={e.is_verified ? "supportive" : "destructive"}>
                    <BooleanCheckIcon checked={e.is_verified} />
                    {e.is_verified ? "verified" : "unverified"}
                  </Badge>
                </div>
              ))}
          </div>
        </Tab>

        <Tab name="unverified employers">
          <div className="absolute w-full px-4 py-4 border-b">
            <Autocomplete
              setter={set_search_name}
              options={employers.data.map((e) => e.name ?? "")}
              placeholder="Search name..."
            ></Autocomplete>
          </div>
          <div className="absolute top-18 w-[100%] h-[85%] flex flex-col overflow-scroll p-4">
            {employers.data
              .filter((e) =>
                e.name?.toLowerCase().includes(search_name?.toLowerCase() ?? "")
              )
              .filter((e) => !e.is_verified)
              .toSorted((a, b) => a.name?.localeCompare(b.name ?? "") ?? 0)
              .map((e) => (
                <div
                  key={e.id}
                  className="flex flex-row items-center p-2 space-x-2 hover:bg-gray-200 hover:cursor-pointer transition-all"
                >
                  <Button
                    scheme="primary"
                    size="xs"
                    onClick={() => authorize_as(e.id ?? "")}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    scheme="supportive"
                    disabled={employers.isVerifying && e.id === selected}
                    onClick={() => {
                      set_selected(e.id ?? "");
                      employers.verify(e.id ?? "");
                    }}
                  >
                    {employers.isVerifying && e.id === selected
                      ? "Verifying..."
                      : "Verify"}
                  </Button>
                  <div className="text-gray-700 w-full">{e.name}</div>
                  <Badge
                    // @ts-ignore
                    type={!e?.applications?.length ? "destructive" : "default"}
                  >
                    {
                      // @ts-ignore
                      e?.applications?.length ?? 0
                    }{" "}
                    applications
                  </Badge>
                  <BoolBadge
                    state={e.is_verified}
                    onValue="verified"
                    offValue="not verified"
                  />
                </div>
              ))}
          </div>
        </Tab>

        <Tab name="students">
          <div className="absolute w-full px-4 py-4 border-b">
            <Autocomplete
              setter={set_search_name}
              options={users.map((u) => getFullName(u) ?? "")}
              placeholder="Search name..."
            ></Autocomplete>
          </div>
          <div className="absolute top-18 w-[100%] h-[85%] flex flex-col overflow-scroll p-4">
            {users
              .filter((u) =>
                `${getFullName(u)} ${u.email}`
                  ?.toLowerCase()
                  .includes(search_name?.toLowerCase() ?? "")
              )
              .toSorted(
                (a, b) =>
                  new Date(b.created_at ?? "").getTime() -
                  new Date(a.created_at ?? "").getTime()
              )
              .map((u) => {
                const userApplications = applications.filter(
                  (a) => a.user_id === u.id
                );
                return (
                  <div
                    key={u.id}
                    className="flex flex-row items-center p-2 space-x-2 hover:bg-gray-200 hover:cursor-pointer transition-all"
                  >
                    <div className="text-gray-700 w-full">
                      {getFullName(u)}{" "}
                      <Badge strength="medium">{u.email}</Badge>
                    </div>
                    <BoolBadge
                      state={u.is_verified}
                      onValue="verified"
                      offValue="not verified"
                    />

                    <Badge
                      // @ts-ignore
                      type={
                        !userApplications.length ? "destructive" : "default"
                      }
                    >
                      {
                        // @ts-ignore
                        userApplications.length ?? 0
                      }{" "}
                      applications
                    </Badge>

                    <Badge strength="medium">
                      {formatDate(u.created_at ?? "")}
                    </Badge>
                  </div>
                );
              })}
          </div>
        </Tab>

        <Tab name="applications">
          <div className="absolute w-full px-4 py-4 border-b">
            <Autocomplete
              setter={set_search_name}
              options={applications.map(
                (a) =>
                  `${a.job?.employers?.name} ${getFullName(a.users)} ${
                    a.jobs?.employers?.name
                  }`
              )}
              placeholder="Search name..."
            ></Autocomplete>
          </div>
          <div className="absolute top-18 w-[100%] h-[85%] flex flex-col overflow-scroll p-4">
            {applications
              .filter((a) =>
                `${a.job?.employers?.name} ${getFullName(a.users)} ${
                  a.jobs?.employers?.name
                }`
                  ?.toLowerCase()
                  .includes(search_name?.toLowerCase() ?? "")
              )
              .toSorted(
                (a, b) =>
                  new Date(b.applied_at ?? "").getTime() -
                  new Date(a.applied_at ?? "").getTime()
              )
              .map((a) => (
                <div
                  key={a.id}
                  className="flex flex-row items-center p-2 space-x-2 hover:bg-gray-200 hover:cursor-pointer transition-all"
                >
                  <div className="text-gray-700 w-full flex flex-row space-x-2">
                    <div className="inline-block">{a.users?.email} </div>
                    <Badge strength="medium">{a?.jobs?.title}</Badge>
                    <Badge strength="medium">{a.jobs?.employers?.name}</Badge>
                  </div>
                  <Badge strength="medium">
                    {to_app_status_name(a.status)}
                  </Badge>
                  <Badge strength="medium">
                    {formatDate(a.applied_at ?? "")}
                  </Badge>
                </div>
              ))}
          </div>
        </Tab>
      </TabGroup>
    </div>
  );
}

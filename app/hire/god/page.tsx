"use client";

import { Autocomplete } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { GroupableRadioDropdown } from "@/components/ui/dropdown";
import { useEmployers } from "@/hooks/use-employer-api";
import { auth_service } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GodLandingPage() {
  const { employers, loading, error } = useEmployers();
  const [employer_name, set_employer_name] = useState<string | null>();
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
  const handle_authorize = async () => {
    const employer_id = employers.filter(
      (e) =>
        e.name?.trim().toLowerCase() === employer_name?.trim().toLowerCase()
    )[0]?.id;

    // Invalid name probs
    if (!employer_id) {
      alert("Make sure you typed the right name.");
      return;
    }

    // Login as that employer
    const response = await auth_service.employer.login_as_employer(employer_id);
    if (!response.success) {
      alert("Error logging in by proxy.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
      <div className="flex flex-col items-start w-80 space-x-0">
        <span className="font-heading font-bold text-4xl mb-8">God Mode</span>
        <span className="text-gray-700 pl-1">Enter Employer Name</span>
      </div>
      <Autocomplete
        setter={set_employer_name}
        options={employers.map((e) => e.name ?? "")}
      ></Autocomplete>
      <Button className="w-80" onClick={handle_authorize}>
        Authorize
      </Button>
    </div>
  );
}

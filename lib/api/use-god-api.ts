import { useState, useEffect } from "react";
import { Employer, PrivateUser } from "@/lib/db/db.types";
import { handleApiError } from "./api";
import { employer_auth_service } from "./employer.api";

/**
 * Retrieves aggregate employer information.
 * @returns
 */
export function useEmployers() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employer_auth_service.get_all_employers();
      if (response.success)
        // @ts-ignore
        setEmployers(response.employers ?? []);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verify = async (employer_id: string, new_status: boolean) => {
    setLoading(true);

    const old_employer = employers.filter((e) => e.id === employer_id)[0];
    const response = new_status
      ? await employer_auth_service.verify_employer(employer_id)
      : await employer_auth_service.unverify_employer(employer_id);

    // Error
    if (!response.success) {
      setError(response.message ?? "");
      return;
    }

    // Update cache
    setEmployers([
      ...employers.filter((e) => e.id !== employer_id),
      { ...old_employer, is_verified: new_status },
    ]);

    setLoading(false);
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  return {
    employers,
    verify,
    loading,
    error,
  };
}

/**
 * Retrieves aggregate user info.
 * @returns
 */
export function useUsers() {
  const [users, set_users] = useState<PrivateUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employer_auth_service.get_all_users();
      if (response.success)
        // @ts-ignore
        set_users(response.users ?? []);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
  };
}

import { useState, useEffect, useCallback, useMemo } from "react";
import { useEmployerApplications } from "@/hooks/use-employer-api";
import { useRefs } from "@/lib/db/use-refs";
import { useFile } from "@/hooks/use-file";
<<<<<<< Updated upstream
import { UserService } from "@/lib/api/api";
=======
import { UserService } from "@/lib/api/services";
>>>>>>> Stashed changes
import { EmployerApplication } from "@/lib/db/db.types";

export const useApplicationData = () => {
  const {
    employer_applications,
    review: review_app,
    loading,
  } = useEmployerApplications();
<<<<<<< Updated upstream
  
=======

>>>>>>> Stashed changes
  const {
    app_statuses,
    get_app_status_by_name,
    to_level_name,
    to_university_name,
    to_app_status_name,
  } = useRefs();
<<<<<<< Updated upstream
  
=======

>>>>>>> Stashed changes
  const [selected_application, set_selected_application] =
    useState<EmployerApplication | null>(null);
  const [selected_resume, set_selected_resume] = useState("");

  // Syncs everything
  const set_application = useCallback((application: EmployerApplication) => {
    set_selected_application(application);
    set_selected_resume("/users/" + application?.user_id + "/resume");
  }, []);

  useEffect(() => {
    const id = selected_application?.id;
    if (!id) return;
    set_application(employer_applications.filter((a) => a.id === id)[0]);
  }, [employer_applications, selected_application?.id, set_application]);

  // Memoize repeated expressions
  const selectedUserFullName = useMemo(
<<<<<<< Updated upstream
    () => selected_application?.user ? 
      `${selected_application.user.first_name} ${selected_application.user.last_name}` : '',
=======
    () =>
      selected_application?.user
        ? `${selected_application.user.first_name} ${selected_application.user.last_name}`
        : "",
>>>>>>> Stashed changes
    [selected_application?.user]
  );

  const selectedUserId = selected_application?.user?.id ?? "";

  const get_user_resume_url = useCallback(
    () => UserService.getUserResumeURL(selectedUserId),
    [selectedUserId]
  );

  const { url: resumeUrl, sync: syncResumeUrl } = useFile({
    fetcher: get_user_resume_url,
    route: selected_resume,
  });

  // Event handlers
  const handleStatusChange = useCallback(
    async (application: EmployerApplication, status: string) => {
      if (!application?.id) {
        console.error("Not an application you can edit.");
        return;
      }

      const { success } = await review_app(application.id, {
        status: get_app_status_by_name(status)?.id,
      });

      console.log(success);
    },
    [review_app, get_app_status_by_name]
  );

  const handleScheduleClick = useCallback(
    (application: EmployerApplication) => {
      window?.open(application.user?.calendar_link ?? "", "_blank")?.focus();
    },
    []
  );

  return {
    // Data
    employer_applications,
    selected_application,
    selectedUserFullName,
    selectedUserId,
    resumeUrl,
    loading,
<<<<<<< Updated upstream
    
=======

>>>>>>> Stashed changes
    // References
    app_statuses,
    to_level_name,
    to_university_name,
    to_app_status_name,
<<<<<<< Updated upstream
    
=======

>>>>>>> Stashed changes
    // Actions
    set_application,
    review_app,
    syncResumeUrl,
    handleStatusChange,
    handleScheduleClick,
  };
<<<<<<< Updated upstream
};
=======
};
>>>>>>> Stashed changes

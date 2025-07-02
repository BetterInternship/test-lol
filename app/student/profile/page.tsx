"use client";

import { useState, useEffect, useRef, JSX } from "react";
import Link from "next/link";
import {
  Edit2,
  Upload,
  Eye,
  Camera,
  MessageCircleQuestion,
} from "lucide-react";
import { useProfile } from "@/lib/api/use-api";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../../lib/ctx-auth";
import { useModal } from "@/hooks/use-modal";
import { useRefs } from "@/lib/db/use-refs";
import { PublicUser } from "@/lib/db/db.types";
import { useFormData } from "@/lib/form-data";
import {
  EditableGroupableRadioDropdown,
  EditableInput,
} from "@/components/ui/editable";
import {
  UserPropertyLabel,
  UserLinkLabel,
  ErrorLabel,
} from "@/components/ui/labels";
import { DropdownGroup } from "@/components/ui/dropdown";
import { UserService } from "@/lib/api/api";
import { FileUploadFormBuilder } from "@/lib/multipart-form";
import { ApplicantModalContent } from "@/components/shared/applicant-modal";
import { Button } from "@/components/ui/button";
import { useFile } from "@/hooks/use-file";
import { Card } from "@/components/ui/our-card";
import { getFullName } from "@/lib/utils/user-utils";
import { Checkbox } from "@/components/ui/checkbox";
import { PDFPreview } from "@/components/shared/pdf-preview";
import {
  isValidOptionalLinkedinURL,
  isValidOptionalCalendarURL,
  toURL,
  openURL,
} from "@/lib/utils/url-utils";
import {
  isValidOptionalGitHubURL,
  isValidOptionalURL,
} from "@/lib/utils/url-utils";
import { Loader } from "@/components/ui/loader";
import { BoolBadge } from "@/components/ui/badge";
import { cn, isValidOptionalPhoneNumber } from "@/lib/utils";
import { MyPfp } from "@/components/shared/pfp";
import { useAppContext } from "@/lib/ctx-app";

export default function ProfilePage() {
  const { isAuthenticated: is_authenticated } = useAuthContext();
  const { profile, loading, error, updateProfile } = useProfile();
  const { isMobile } = useAppContext();
  const {
    ref_loading,
    ref_is_not_null,
    levels,
    to_college_name,
    to_level_name,
    to_department_name,
    to_degree_full_name,
    to_university_name,
    get_college_by_name,
    get_level_by_name,
    get_departments_by_college,
    get_colleges_by_university,
    get_degrees_by_university,
    get_department_by_name,
    get_degree_by_type_and_name,
    get_university_by_name,
    get_universities_from_domain,
  } = useRefs();
  const defaultUniversity = "Select University";
  const defaultCollege = "Select College";
  const defaultDepartment = "Select Department";
  const defaultDegree = "Select Degree";
  const [isEditing, setIsEditing] = useState(false);
  const { url: resumeUrl, sync: syncResumeUrl } = useFile({
    fetcher: UserService.getMyResumeURL,
    route: "/users/me/resume",
  });
  const { form_data, set_field, set_fields, field_setter } = useFormData<
    PublicUser & {
      college_name: string | null;
      department_name: string | null;
      degree_name: string | null;
      year_level_name: string | null;
      university_name: string | null;
    }
  >();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [linkErrors, setLinkErrors] = useState<{
    portfolio_link?: string;
    github_link?: string;
    linkedin_link?: string;
    calendar_link?: string;
  }>({});

  const [fieldErrors, setFieldErrors] = useState<{
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    phone_number?: string;
    university?: string;
    college?: string;
    department?: string;
    year_level?: string;
  }>({});

  const isValidName = (name: string): boolean => {
    if (!name || name.trim() === "") return false;
    return (
      name.trim().length >= 2 &&
      name.trim().length <= 32 &&
      /^[a-zA-Z\s.-]+$/.test(name.trim())
    );
  };

  const validateFields = () => {
    const errors: typeof fieldErrors = {};

    // First name validation
    if (!form_data.first_name || !isValidName(form_data.first_name)) {
      errors.first_name = !form_data.first_name?.trim()
        ? "First name is required"
        : form_data.first_name.trim().length < 2
        ? "First name must be at least 2 characters"
        : form_data.first_name.trim().length > 32
        ? "First name must be 32 characters or less"
        : "First name must contain only letters, spaces, dots, and hyphens";
    }

    // Middle name validation (optional but must be valid if provided)
    if (form_data.middle_name && form_data.middle_name.trim()) {
      if (
        form_data.middle_name.trim().length > 32 ||
        !/^[a-zA-Z\s.-]+$/.test(form_data.middle_name.trim())
      ) {
        errors.middle_name =
          form_data.middle_name.trim().length > 32
            ? "Middle name must be 32 characters or less"
            : "Middle name must contain only letters, spaces, dots, and hyphens";
      }
    }

    // Last name validation
    if (!form_data.last_name || !isValidName(form_data.last_name)) {
      errors.last_name = !form_data.last_name?.trim()
        ? "Last name is required"
        : form_data.last_name.trim().length < 2
        ? "Last name must be at least 2 characters"
        : form_data.last_name.trim().length > 32
        ? "Last name must be 32 characters or less"
        : "Last name must contain only letters, spaces, dots, and hyphens";
    }

    // Phone number validation
    if (
      form_data.phone_number &&
      !isValidOptionalPhoneNumber(form_data.phone_number)
    ) {
      errors.phone_number =
        "Phone number must be 11 digits in Philippine format (09XXXXXXXXX)";
    }

    // College validation
    if (!form_data.college_name || form_data.college_name === defaultCollege) {
      errors.college = "Please select your college";
    }

    // College validation
    if (
      !form_data.department_name ||
      form_data.department_name === defaultDepartment
    ) {
      errors.department = "Please select your department";
    }

    // Year level validation
    if (
      !form_data.year_level_name ||
      form_data.year_level_name === "Not specified"
    ) {
      errors.year_level = "Please select your year level";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateLinks = () => {
    const errors: typeof linkErrors = {};

    if (
      form_data.portfolio_link &&
      !isValidOptionalURL(form_data.portfolio_link)
    ) {
      errors.portfolio_link =
        "Please enter a valid URL (e.g., https://example.com)";
    }

    if (
      form_data.github_link &&
      !isValidOptionalGitHubURL(form_data.github_link)
    ) {
      errors.github_link =
        "Please enter a valid GitHub URL (e.g., https://github.com/username)";
    }

    if (
      form_data.linkedin_link &&
      !isValidOptionalLinkedinURL(form_data.linkedin_link)
    ) {
      errors.linkedin_link =
        "Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)";
    }

    if (
      form_data.calendar_link &&
      !isValidOptionalCalendarURL(form_data.calendar_link)
    ) {
      errors.calendar_link =
        "Please enter a valid calendar URL (e.g., https://calendar.app.google/link or https://calendar.google.com/link)";
    }

    setLinkErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enhanced field setters - simplified without real-time validation
  const validatedFieldSetter = (field: keyof PublicUser) => (value: string) => {
    field_setter(field)(value);

    // Clear field error when user starts typing (immediate feedback)
    const fieldErrorKey = field as keyof typeof fieldErrors;
    if (fieldErrors[fieldErrorKey]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldErrorKey];
        return newErrors;
      });
    }

    // Clear link error when user starts typing (immediate feedback)
    const linkErrorKey = field as keyof typeof linkErrors;
    if (linkErrors[linkErrorKey]) {
      setLinkErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[linkErrorKey];
        return newErrors;
      });
    }
  };

  // Field setter for basic fields - simplified without real-time validation
  const validatedBasicFieldSetter =
    (field: keyof PublicUser) => (value: string) => {
      field_setter(field)(value);

      // Clear field error when user starts typing (immediate feedback)
      const fieldErrorKey = field as keyof typeof fieldErrors;
      if (fieldErrors[fieldErrorKey]) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldErrorKey];
          return newErrors;
        });
      }
    };
  const {
    open: open_employer_modal,
    close: close_employer_modal,
    Modal: EmployerModal,
  } = useModal("employer-modal");
  const {
    open: open_resume_modal,
    close: close_resume_modal,
    Modal: ResumeModal,
  } = useModal("resume-modal");
  const router = useRouter();

  // File input refs
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const profilePictureInputRef = useRef<HTMLInputElement>(null);

  // File upload handlers
  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF document");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert("File size must be less than 3MB");
      return;
    }

    try {
      setUploading(true);
      const form = FileUploadFormBuilder.new("resume");
      form.file(file);
      // @ts-ignore
      const result = await UserService.updateMyResume(form.build());
      alert("Resume uploaded successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to upload resume");
    } finally {
      setUploading(false);
      if (resumeInputRef.current) {
        resumeInputRef.current.value = "";
      }
    }
  };

  const handlePreviewResume = async () => {
    await syncResumeUrl();
    open_resume_modal();
  };

  const handleProfilePictureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a JPEG, PNG, GIF, or WebP image");
      return;
    }

    if (file.size > (1024 * 1024) / 4) {
      alert("Image size must be less than 0.25MB");
      return;
    }

    try {
      setUploading(true);
      const form = FileUploadFormBuilder.new("pfp");
      form.file(file);
      // @ts-ignore
      const result = await UserService.updateMyPfp(form.build());
      if (!result.success) {
        alert("Could not upload profile picture.");
        return;
      }
      alert("Profile picture uploaded successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to upload profile picture");
    } finally {
      setUploading(false);
      if (profilePictureInputRef.current) {
        profilePictureInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    if (!is_authenticated()) {
      router.push("/login");
    }
  }, [is_authenticated(), router]);

  useEffect(() => {
    if (profile)
      set_fields({
        ...(profile as PublicUser),
        degree_name: to_degree_full_name(profile.degree),
        college_name: to_college_name(profile.college),
        year_level_name: to_level_name(profile.year_level),
        department_name: to_department_name(profile.department),
        university_name: to_university_name(profile.university),
        calendar_link: profile.calendar_link ?? "",
      });
  }, [profile, ref_loading]);

  const handleSave = async () => {
    // Validate all fields before saving
    const fieldsValid = validateFields();
    const linksValid = validateLinks();

    if (!fieldsValid || !linksValid) return;

    try {
      setSaving(true);
      const dataToSend = {
        first_name: form_data.first_name ?? "",
        middle_name: form_data.middle_name ?? "",
        last_name: form_data.last_name ?? "",
        phone_number: form_data.phone_number ?? "",
        college: get_college_by_name(form_data.college_name)?.id ?? undefined,
        year_level:
          get_level_by_name(form_data.year_level_name)?.id ?? undefined,
        department:
          get_department_by_name(form_data.department_name)?.id ?? undefined,
        degree:
          get_degree_by_type_and_name(
            form_data.degree_name?.split(" - ")[0],
            form_data.degree_name?.split(" - ")[1]
          )?.id ?? undefined,
        university:
          get_university_by_name(form_data.university_name)?.id ?? undefined,
        degree_notes: form_data.degree_notes ?? undefined,
        portfolio_link: toURL(form_data.portfolio_link)?.toString(),
        github_link: toURL(form_data.github_link)?.toString(),
        linkedin_link: toURL(form_data.linkedin_link)?.toString(),
        calendar_link: toURL(form_data.calendar_link)?.toString(),
        bio: form_data.bio ?? "",
        taking_for_credit: form_data.taking_for_credit,
        linkage_officer: form_data.linkage_officer ?? "",
      };
      await updateProfile(dataToSend);
      setIsEditing(false);
      setLinkErrors({}); // Clear errors on successful save
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile)
      set_fields({
        ...profile,
        college_name: to_college_name(profile.college),
        year_level_name: to_level_name(profile.year_level),
        department_name: to_department_name(profile.department),
        university_name: to_university_name(profile.university),
        degree_name: to_degree_full_name(profile.degree),
      });
    setIsEditing(false);
    setLinkErrors({}); // Clear errors when cancelling
    setFieldErrors({}); // Clear field errors when cancelling
  };

  if (!is_authenticated() || loading)
    return <Loader>Loading profile...</Loader>;

  if (error) {
    return (
      <Card className="max-w-md m-auto">
        <p className="text-red-600 mb-4 text-base sm:text-lg">
          Failed to load profile: {error}
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </Card>
    );
  }

  return (
    profile && (
      <>
        <div className="min-h-screen bg-background p-6 py-12">
          <div className="flex items-start gap-8 flex-1 w-full max-w-[600px] m-auto">
            <div className="relative flex-shrink-0">
              <MyPfp size="36" />
              <Button
                variant="outline"
                size="icon"
                className="absolute -bottom-[-10] -right-[-10] h-6 w-6 sm:h-7 sm:w-7 rounded-full"
                onClick={() => profilePictureInputRef.current?.click()}
                disabled={uploading}
              >
                <Camera className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold font-heading mb-1 line-clamp-1">
                {getFullName(profile)}
              </h1>
              <p className="text-muted-foreground text-sm">
                <div>
                  <BoolBadge
                    state={profile.taking_for_credit}
                    onValue="Taking for credit"
                    offValue="Not taking for credit"
                  />
                </div>
              </p>
              <div className="flex w-full flex-row flex-wrap gap-2 flex-shrink-0 mt-10">
                <Button
                  variant="outline"
                  scheme="primary"
                  disabled={isEditing}
                  onClick={() => open_employer_modal()}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                {/* Edit Mode Buttons */}
                {isEditing ? (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={
                        saving ||
                        Object.keys(linkErrors).length > 0 ||
                        Object.keys(fieldErrors).length > 0
                      }
                      className={`${
                        Object.keys(linkErrors).length > 0 ||
                        Object.keys(fieldErrors).length > 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => (
                      setIsEditing(true),
                      set_fields({
                        ...profile,
                        degree_name: to_degree_full_name(profile.degree),
                        college_name: to_college_name(profile.college),
                        year_level_name: to_level_name(profile.year_level),
                        department_name: to_department_name(profile.department),
                        calendar_link: profile.calendar_link ?? "",
                      })
                    )}
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="w-full max-w-[600px] m-auto space-y-2 mt-8">
            {isEditing ? (
              <div className="space-y-1 mb-4 transition-all">
                <textarea
                  value={form_data.bio || ""}
                  onChange={(e) => set_field("bio", e.target.value)}
                  placeholder="Tell us about yourself, your interests, goals, and what makes you unique..."
                  className="w-full border border-gray-200 rounded-[0.33em] px-3 py-2 text-sm min-h-24 resize-none focus:border-opacity-70 focus:ring-transparent"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {(form_data.bio || "").length}/500 characters
                </p>
              </div>
            ) : (
              <Card className="bg-muted/50 p-3 px-5 overflow-hidden text-wrap">
                <p className="text-sm leading-relaxed">
                  {profile.bio || (
                    <span className="text-muted-foreground italic">
                      No bio provided. Click "Edit" to add information about
                      yourself.
                    </span>
                  )}
                </p>
              </Card>
            )}

            <Card className="px-5">
              <div
                className={cn(
                  isEditing || isMobile
                    ? "grid grid-cols-1 space-y-5 mb-8"
                    : "grid grid-cols-2 gap-y-5"
                )}
              >
                <div>
                  <label className="text-xs text-gray-400 italic mb-1 block">
                    Full Name, Middle Name, Last Name
                  </label>
                  <div className="">
                    <ErrorLabel value={fieldErrors.first_name} />
                    <ErrorLabel value={fieldErrors.middle_name} />
                    <ErrorLabel value={fieldErrors.last_name} />
                  </div>
                  <div className="flex flex-row space-x-1">
                    <EditableInput
                      is_editing={isEditing}
                      value={form_data.first_name}
                      setter={validatedBasicFieldSetter("first_name")}
                      placeholder="First name"
                      maxLength={32}
                    >
                      <UserPropertyLabel />
                    </EditableInput>
                    <EditableInput
                      is_editing={isEditing}
                      value={form_data.middle_name}
                      setter={validatedBasicFieldSetter("middle_name")}
                      placeholder="Middle name"
                      maxLength={32}
                    >
                      <UserPropertyLabel fallback="" />
                    </EditableInput>
                    <EditableInput
                      is_editing={isEditing}
                      value={form_data.last_name}
                      setter={validatedBasicFieldSetter("last_name")}
                      placeholder="Last name"
                      maxLength={32}
                    >
                      <UserPropertyLabel />
                    </EditableInput>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 italic mb-1 block">
                    Phone Number
                  </label>
                  <ErrorLabel value={fieldErrors.phone_number} />
                  <EditableInput
                    is_editing={isEditing}
                    value={form_data.phone_number}
                    setter={validatedBasicFieldSetter("phone_number")}
                    placeholder="09XXXXXXXXX"
                  >
                    <UserPropertyLabel />
                  </EditableInput>
                </div>

                <DropdownGroup>
                  <div>
                    <label className="text-xs text-gray-400 italic mb-1 block">
                      Year Level
                    </label>
                    <ErrorLabel value={fieldErrors.year_level} />
                    <EditableGroupableRadioDropdown
                      is_editing={isEditing}
                      name="year_level"
                      value={form_data.year_level_name}
                      setter={(value) => {
                        field_setter("year_level_name")(value);
                        // Clear year level error when user selects a value (immediate feedback)
                        if (value && value !== "Not specified") {
                          setFieldErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.year_level;
                            return newErrors;
                          });
                        }
                      }}
                      options={["Not specified", ...levels.map((l) => l.name)]}
                    >
                      <UserPropertyLabel />
                    </EditableGroupableRadioDropdown>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 italic block mb-1">
                      Education
                    </label>
                    <div
                      className={cn(
                        isEditing ? "space-y-2" : "space-y-1 text-nowrap"
                      )}
                    >
                      <ErrorLabel value={fieldErrors.university} />
                      <EditableGroupableRadioDropdown
                        is_editing={isEditing}
                        name="university"
                        value={form_data.university_name}
                        setter={(value) => {
                          set_fields({
                            university_name: value,
                            university: get_university_by_name(value)?.id,
                            college_name: defaultCollege,
                            college: null,
                            department_name: defaultDepartment,
                            department: null,
                            degree_name: defaultDegree,
                            degree: null,
                          });

                          // Clear college error when user selects a value (immediate feedback)
                          if (value && value !== defaultUniversity) {
                            setFieldErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.university;
                              return newErrors;
                            });
                          }
                        }}
                        options={[
                          defaultUniversity,
                          ...get_universities_from_domain(
                            profile.email.split("@")[1]
                          ).map((uid) => to_university_name(uid) ?? ""),
                        ]}
                      >
                        <UserPropertyLabel />
                      </EditableGroupableRadioDropdown>
                      <ErrorLabel value={fieldErrors.college} />
                      <EditableGroupableRadioDropdown
                        is_editing={isEditing}
                        name="college"
                        value={form_data.college_name}
                        setter={(value) => {
                          set_fields({
                            college_name: value,
                            college: get_college_by_name(value)?.id,
                            department_name: defaultDepartment,
                            department: null,
                          });
                          // Clear college error when user selects a value (immediate feedback)
                          if (value && value !== defaultCollege) {
                            setFieldErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.college;
                              return newErrors;
                            });
                          }
                        }}
                        options={[
                          defaultCollege,
                          ...get_colleges_by_university(
                            get_university_by_name(form_data.university_name)
                              ?.id ?? ""
                          ).map((cid) => to_college_name(cid) ?? ""),
                        ]}
                      >
                        <UserPropertyLabel />
                      </EditableGroupableRadioDropdown>
                      <ErrorLabel value={fieldErrors.department} />
                      <EditableGroupableRadioDropdown
                        is_editing={isEditing}
                        name="department"
                        value={form_data.department_name}
                        setter={(value: string) => {
                          set_field(
                            "department",
                            get_department_by_name(value)
                          );
                          set_field("department_name", value);
                          setFieldErrors((prev) => {
                            const newErrors = { ...prev };
                            if (value && value !== defaultDepartment)
                              delete newErrors.department;
                            return newErrors;
                          });
                        }}
                        options={[
                          defaultDepartment,
                          ...get_departments_by_college(
                            get_college_by_name(form_data.college_name)?.id ??
                              ""
                          ).map((did) => to_department_name(did) ?? ""),
                        ]}
                      >
                        <UserPropertyLabel />
                      </EditableGroupableRadioDropdown>
                      <EditableGroupableRadioDropdown
                        is_editing={isEditing}
                        name="degree"
                        value={form_data.degree_name}
                        setter={field_setter("degree_name")}
                        options={[
                          defaultDegree,
                          ...get_degrees_by_university(
                            get_university_by_name(form_data.university_name)
                              ?.id ?? ""
                          ).map((did) => to_degree_full_name(did) ?? ""),
                        ]}
                      >
                        <UserPropertyLabel />
                      </EditableGroupableRadioDropdown>
                      <EditableInput
                        is_editing={isEditing}
                        value={form_data.degree_notes}
                        setter={field_setter("degree_notes")}
                        placeholder="Degree Notes (e.g. Major in Electronics, Minor in Robotics)"
                      >
                        <UserPropertyLabel fallback="" />
                      </EditableInput>
                    </div>
                  </div>
                </DropdownGroup>
              </div>
              <br />
              <hr />
              <br />

              <div
                className={cn(
                  "mb-8",
                  isEditing || isMobile
                    ? "grid grid-cols-1 space-y-5"
                    : "flex flex-row space-x-2 items-center"
                )}
              >
                <EditableProfileLink
                  title={"Portfolio Link"}
                  link={form_data.portfolio_link}
                  setter={field_setter("portfolio_link")}
                  placeholder={"https://myportfolio.com"}
                  isEditing={isEditing}
                />

                <EditableProfileLink
                  title={"Github Profile"}
                  link={form_data.github_link}
                  setter={field_setter("github_link")}
                  placeholder={"https://github.com/me"}
                  isEditing={isEditing}
                />

                <EditableProfileLink
                  title={"Linkedin Profile"}
                  link={form_data.linkedin_link}
                  setter={field_setter("linkedin_link")}
                  placeholder={"https://linkedin.com/in/me"}
                  isEditing={isEditing}
                />

                <EditableProfileLink
                  title={"Calendar Link"}
                  link={form_data.calendar_link}
                  setter={field_setter("calendar_link")}
                  placeholder={"https://calendar.app.google/your-link"}
                  isEditing={isEditing}
                  LabelComponent={() => {
                    return (
                      isEditing && (
                        <Link
                          href="https://www.canva.com/design/DAGrKQdRG-8/XDGzebwKdB4CMWLOszcheg/edit"
                          target="_blank"
                          className="inline-block mx-2"
                        >
                          <span className="text-xs italic">
                            <MessageCircleQuestion className="w-4 h-4" />
                          </span>
                        </Link>
                      )
                    );
                  }}
                />
              </div>
              {profile.resume ? (
                <div className="w-full flex items-end gap-1">
                  <Button
                    variant="outline"
                    scheme="primary"
                    onClick={handlePreviewResume}
                  >
                    View Resume
                  </Button>
                  <Button
                    variant="outline"
                    scheme="primary"
                    onClick={() => resumeInputRef.current?.click()}
                    disabled={uploading}
                  >
                    Upload Resume
                  </Button>
                </div>
              ) : (
                <Card>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {uploading ? "Uploading..." : "No resume uploaded"}
                    </p>
                    <Button
                      onClick={() => resumeInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload className="h-4 w-4" />
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF up to 2.5MB
                    </p>
                  </div>
                </Card>
              )}

              {isEditing && (
                <>
                  <br />
                  <hr />
                  <br />

                  <div className="space-y-3 mt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={form_data.taking_for_credit ?? false}
                        onCheckedChange={(value) => {
                          set_fields({
                            taking_for_credit: !!value,
                            linkage_officer: !!value
                              ? form_data.linkage_officer
                              : "",
                          });
                        }}
                      />
                      <span className="text-sm">
                        Taking for internships credit
                      </span>
                    </div>
                    {form_data.taking_for_credit && (
                      <div>
                        <label className="text-xs text-gray-400 italic mb-1 block">
                          Linkage Officer
                        </label>
                        <EditableInput
                          is_editing={isEditing}
                          value={form_data.linkage_officer}
                          setter={field_setter("linkage_officer")}
                          maxLength={32}
                        >
                          <UserPropertyLabel />
                        </EditableInput>
                      </div>
                    )}
                  </div>
                </>
              )}
            </Card>
            <br />
            <br />
          </div>
        </div>

        <input
          type="file"
          ref={resumeInputRef}
          onChange={handleResumeUpload}
          accept=".pdf"
          style={{ display: "none" }}
        />
        <input
          type="file"
          ref={profilePictureInputRef}
          onChange={handleProfilePictureUpload}
          accept="image/*"
          style={{ display: "none" }}
        />

        {/* Modals */}
        {resumeUrl.length > 0 && (
          <ResumeModal>
            <div className="space-y-4">
              <h1 className="text-2xl font-bold px-6 pt-2">Resume Preview</h1>
              <PDFPreview url={resumeUrl} />
            </div>
          </ResumeModal>
        )}

        <EmployerModal>
          <ApplicantModalContent
            applicant={profile}
            pfp_fetcher={UserService.getMyPfpURL}
            pfp_route="/users/me/pic"
            open_resume={async () => {
              close_employer_modal();
              await syncResumeUrl();
              open_resume_modal();
            }}
            open_calendar={async () => {
              openURL(profile?.calendar_link);
            }}
          />
        </EmployerModal>
      </>
    )
  );
}

const EditableProfileLink = ({
  title,
  link,
  error,
  setter,
  placeholder,
  isEditing,
  LabelComponent,
}: {
  title: string;
  link?: string | null;
  error?: string;
  setter: (value: string) => void;
  placeholder: string;
  isEditing: boolean;
  LabelComponent?: React.ComponentType<{}>;
}) => {
  return (
    <div>
      {!isEditing ? (
        <Button
          variant="ghost"
          className="p-0 h-6"
          disabled={!link}
          onClick={() => openURL(link)}
        >
          <BoolBadge state={!!link} onValue={title} offValue={title} />
        </Button>
      ) : (
        <>
          <label className="text-xs text-gray-400 italic mb-1 block">
            {title}
            {LabelComponent && <LabelComponent />}
          </label>
          <EditableInput
            is_editing={isEditing}
            value={link}
            setter={setter}
            placeholder={placeholder}
          >
            <UserLinkLabel />
          </EditableInput>
        </>
      )}
      <ErrorLabel value={error} />
    </div>
  );
};

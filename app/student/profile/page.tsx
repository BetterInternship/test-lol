"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Edit2,
  Upload,
  User,
  ExternalLink,
  FileText,
  Eye,
  Award,
  Camera,
  AlertCircle,
  HelpCircle,
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
import { UserPropertyLabel, UserLinkLabel } from "@/components/ui/labels";
import { DropdownGroup } from "@/components/ui/dropdown";
import { UserService } from "@/lib/api/api";
import { FileUploadFormBuilder } from "@/lib/multipart-form";
import { ApplicantModalContent } from "@/components/shared/applicant-modal";
import { Button } from "@/components/ui/button";
import { useFile } from "@/hooks/use-file";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getFullName } from "@/lib/utils/user-utils";
import { Checkbox } from "@/components/ui/checkbox";
import { PDFPreview } from "@/components/shared/pdf-preview";

export default function ProfilePage() {
  const { isAuthenticated: is_authenticated } = useAuthContext();
  const { profile, error, updateProfile } = useProfile();
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
  const [isEditing, setIsEditing] = useState(false);
  const { url: resumeUrl, sync: syncResumeUrl } = useFile({
    fetcher: UserService.get_my_resume_url,
    route: "/users/me/resume",
  });
  const { url: pfp_url, sync: sync_pfp_url } = useFile({
    fetcher: UserService.get_my_pfp_url,
    route: "/users/me/pic",
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

  // URL validation functions
  const isValidURL = (url: string): boolean => {
    if (!url || url.trim() === "") return true; // Empty URLs are allowed
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const isValidGitHubURL = (url: string): boolean => {
    if (!url || url.trim() === "") return true;
    try {
      const urlObj = new URL(url);
      return (
        (urlObj.protocol === "http:" || urlObj.protocol === "https:") &&
        urlObj.hostname === "github.com"
      );
    } catch {
      return false;
    }
  };

  const isValidLinkedInURL = (url: string): boolean => {
    if (!url || url.trim() === "") return true;
    try {
      const urlObj = new URL(url);
      return (
        ((urlObj.protocol === "http:" || urlObj.protocol === "https:") &&
          urlObj.hostname === "linkedin.com") ||
        urlObj.hostname === "www.linkedin.com"
      );
    } catch {
      return false;
    }
  };

  const isValidCalendarURL = (url: string): boolean => {
    if (!url || url.trim() === "") return true;
    try {
      const urlObj = new URL(url);
      return (
        (urlObj.protocol === "http:" || urlObj.protocol === "https:") &&
        (urlObj.hostname === "calendar.app.google" ||
          urlObj.hostname === "calendar.google.com" ||
          urlObj.hostname === "calendly.com" ||
          urlObj.hostname === "cal.com")
      );
    } catch {
      return false;
    }
  };

  // Field validation functions
  const isValidPhoneNumber = (phone: string): boolean => {
    if (!phone || phone.trim() === "") return true; // Empty is allowed
    const cleanPhone = phone.replace(/\D/g, ""); // Remove non-digits
    return cleanPhone.length === 11 && /^09\d{9}$/.test(cleanPhone); // Philippine format: 09XXXXXXXXX
  };

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
    if (form_data.phone_number && !isValidPhoneNumber(form_data.phone_number)) {
      errors.phone_number =
        "Phone number must be 11 digits in Philippine format (09XXXXXXXXX)";
    }

    // College validation
    if (!form_data.college_name || form_data.college_name === "Not specified") {
      errors.college = "Please select your college";
    }

    // College validation
    if (
      !form_data.department_name ||
      form_data.department_name === "Not specified"
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

    if (form_data.portfolio_link && !isValidURL(form_data.portfolio_link)) {
      errors.portfolio_link =
        "Please enter a valid URL (e.g., https://example.com)";
    }

    if (form_data.github_link && !isValidGitHubURL(form_data.github_link)) {
      errors.github_link =
        "Please enter a valid GitHub URL (e.g., https://github.com/username)";
    }

    if (
      form_data.linkedin_link &&
      !isValidLinkedInURL(form_data.linkedin_link)
    ) {
      errors.linkedin_link =
        "Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)";
    }

    if (
      form_data.calendar_link &&
      !isValidCalendarURL(form_data.calendar_link)
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

  useEffect(() => {
    sync_pfp_url();
  }, []);

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
      const result = await UserService.update_my_resume(form.build());
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
      const result = await UserService.update_my_pfp(form.build());
      if (!result.success) {
        alert("Could not upload profile picture.");
        return;
      }
      await sync_pfp_url();
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

    if (!fieldsValid || !linksValid) {
      alert("Please fix all validation errors before saving.");
      return;
    }

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
        degree_notes: form_data.degree_notes ?? "",
        portfolio_link: form_data.portfolio_link ?? "",
        github_link: form_data.github_link ?? "",
        linkedin_link: form_data.linkedin_link ?? "",
        calendar_link: form_data.calendar_link ?? "",
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

  if (!is_authenticated()) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">Failed to load profile: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl py-6">
          {/* Mobile-Optimized Header with Avatar, Name and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 mb-8">
            {/* Avatar and Name Section */}
            <div className="flex items-start gap-4 sm:gap-6 flex-1">
              <div className="relative flex-shrink-0">
                <Avatar className="h-28 w-28 border border-gray-300">
                  {profile.profile_picture && pfp_url ? (
                    <AvatarImage src={pfp_url} alt="Profile picture" />
                  ) : (
                    <AvatarFallback className="text-base sm:text-lg font-semibold">
                      {profile.first_name?.[0]?.toUpperCase()}
                      {profile.last_name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute -bottom-0 -right-0 h-6 w-6 sm:h-7 sm:w-7 rounded-full"
                  onClick={() => profilePictureInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Camera className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-1">
                  {getFullName(profile)}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {profile.college && to_college_name(profile.college)}
                  {ref_is_not_null(profile.year_level) && profile.college
                    ? " • "
                    : ""}
                  {ref_is_not_null(profile.year_level)
                    ? to_level_name(profile.year_level)
                    : ""}
                </p>
                <div className="flex w-full flex-row gap-2 flex-shrink-0 mt-2">
                  {/* Preview Button - Always Visible */}
                  <Button
                    variant="outline"
                    scheme="primary"
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
                          department_name: to_department_name(
                            profile.department
                          ),
                          calendar_link: profile.calendar_link ?? "",
                        })
                      )}
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                  )}

                  {/* Error Messages - Mobile Optimized */}
                  {isEditing &&
                    (Object.keys(linkErrors).length > 0 ||
                      Object.keys(fieldErrors).length > 0) && (
                      <div className="flex flex-col gap-1 text-xs">
                        {Object.keys(linkErrors).length > 0 && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertCircle className="h-3 w-3" />
                            <span>Fix URL errors to save</span>
                          </div>
                        )}
                        {Object.keys(fieldErrors).length > 0 && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertCircle className="h-3 w-3" />
                            <span>Fix required fields to save</span>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content - Personal Info and Links */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  {/* Personal Information Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-5 w-5 text-blue-600" />
                      <h2 className="text-lg font-semibold">
                        Personal Information
                      </h2>
                      {!isEditing && (
                        <Link href="/help">
                          <HelpCircle className="h-4 w-4 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer" />
                        </Link>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Full Name, Middle Name, Last Name
                        </label>
                        {(fieldErrors.first_name ||
                          fieldErrors.middle_name ||
                          fieldErrors.last_name) && (
                          <div className="mb-2">
                            {fieldErrors.first_name && (
                              <div className="flex items-center gap-1 text-red-600 text-xs mb-1">
                                <AlertCircle className="h-3 w-3" />
                                <span>{fieldErrors.first_name}</span>
                              </div>
                            )}
                            {fieldErrors.middle_name && (
                              <div className="flex items-center gap-1 text-red-600 text-xs mb-1">
                                <AlertCircle className="h-3 w-3" />
                                <span>{fieldErrors.middle_name}</span>
                              </div>
                            )}
                            {fieldErrors.last_name && (
                              <div className="flex items-center gap-1 text-red-600 text-xs">
                                <AlertCircle className="h-3 w-3" />
                                <span>{fieldErrors.last_name}</span>
                              </div>
                            )}
                          </div>
                        )}
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
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Phone Number
                        </label>
                        {fieldErrors.phone_number && (
                          <div className="flex items-center gap-1 text-red-600 text-xs mb-2">
                            <AlertCircle className="h-3 w-3" />
                            <span>{fieldErrors.phone_number}</span>
                          </div>
                        )}
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
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            University
                          </label>
                          {fieldErrors.university && (
                            <div className="flex items-center gap-1 text-red-600 text-xs mb-2">
                              <AlertCircle className="h-3 w-3" />
                              <span>{fieldErrors.university}</span>
                            </div>
                          )}
                          <EditableGroupableRadioDropdown
                            is_editing={isEditing}
                            name="college"
                            value={form_data.university_name}
                            setter={(value) => {
                              set_fields({
                                university_name: value,
                                university: get_university_by_name(value)?.id,
                                college_name: "Not specified",
                                college: null,
                                department_name: "Not specified",
                                department: null,
                                degree_name: "Not specified",
                                degree: null,
                              });

                              // Clear college error when user selects a value (immediate feedback)
                              if (value && value !== "Not specified") {
                                setFieldErrors((prev) => {
                                  const newErrors = { ...prev };
                                  delete newErrors.university;
                                  return newErrors;
                                });
                              }
                            }}
                            options={[
                              "Not specified",
                              ...get_universities_from_domain(
                                profile.email.split("@")[1]
                              ).map((uid) => to_university_name(uid) ?? ""),
                            ]}
                          >
                            <UserPropertyLabel />
                          </EditableGroupableRadioDropdown>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            College
                          </label>
                          {fieldErrors.college && (
                            <div className="flex items-center gap-1 text-red-600 text-xs mb-2">
                              <AlertCircle className="h-3 w-3" />
                              <span>{fieldErrors.college}</span>
                            </div>
                          )}
                          <EditableGroupableRadioDropdown
                            is_editing={isEditing}
                            name="college"
                            value={form_data.college_name}
                            setter={(value) => {
                              set_fields({
                                college_name: value,
                                college: get_college_by_name(value)?.id,
                                department_name: "Not specified",
                                department: null,
                              });
                              // Clear college error when user selects a value (immediate feedback)
                              if (value && value !== "Not specified") {
                                setFieldErrors((prev) => {
                                  const newErrors = { ...prev };
                                  delete newErrors.college;
                                  return newErrors;
                                });
                              }
                            }}
                            options={[
                              "Not specified",
                              ...get_colleges_by_university(
                                get_university_by_name(
                                  form_data.university_name
                                )?.id ?? ""
                              ).map((cid) => to_college_name(cid) ?? ""),
                            ]}
                          >
                            <UserPropertyLabel />
                          </EditableGroupableRadioDropdown>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Department
                          </label>
                          {fieldErrors.department && (
                            <div className="flex items-center gap-1 text-red-600 text-xs mb-2">
                              <AlertCircle className="h-3 w-3" />
                              <span>{fieldErrors.department}</span>
                            </div>
                          )}
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
                                if (value && value !== "Not specified")
                                  delete newErrors.department;
                                return newErrors;
                              });
                            }}
                            options={[
                              "Not specified",
                              ...get_departments_by_college(
                                get_college_by_name(form_data.college_name)
                                  ?.id ?? ""
                              ).map((did) => to_department_name(did) ?? ""),
                            ]}
                          >
                            <UserPropertyLabel />
                          </EditableGroupableRadioDropdown>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Degree
                          </label>
                          <EditableGroupableRadioDropdown
                            is_editing={isEditing}
                            name="department"
                            value={form_data.degree_name}
                            setter={field_setter("degree_name")}
                            options={[
                              "Not specified",
                              ...get_degrees_by_university(
                                get_university_by_name(
                                  form_data.university_name
                                )?.id ?? ""
                              ).map((did) => to_degree_full_name(did) ?? ""),
                            ]}
                          >
                            <UserPropertyLabel />
                          </EditableGroupableRadioDropdown>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Degree Notes
                          </label>
                          <EditableInput
                            is_editing={isEditing}
                            value={form_data.degree_notes}
                            setter={field_setter("degree_notes")}
                            placeholder="Major in Electronics, Minor in Robotics"
                          >
                            <UserPropertyLabel />
                          </EditableInput>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Year Level
                          </label>
                          {fieldErrors.year_level && (
                            <div className="flex items-center gap-1 text-red-600 text-xs mb-2">
                              <AlertCircle className="h-3 w-3" />
                              <span>{fieldErrors.year_level}</span>
                            </div>
                          )}
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
                            options={[
                              "Not specified",
                              ...levels.map((l) => l.name),
                            ]}
                          >
                            <UserPropertyLabel />
                          </EditableGroupableRadioDropdown>
                        </div>
                      </DropdownGroup>

                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Internship for Credit
                        </label>
                        {isEditing ? (
                          <div className="space-y-3">
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
                              <span className="text-sm">Taking for credit</span>
                            </div>
                            {form_data.taking_for_credit && (
                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
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
                        ) : (
                          <div>
                            {profile.taking_for_credit ? (
                              <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 text-green-700">
                                  <Award className="h-4 w-4" />
                                  <span className="text-sm font-medium">
                                    Taking for credit
                                  </span>
                                </div>
                                {profile.linkage_officer && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                      Linkage Officer
                                    </label>
                                    <UserPropertyLabel
                                      value={profile.linkage_officer}
                                    />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground italic text-sm">
                                Not taking for credit
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Professional Links Section */}
                  <div>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <ExternalLink className="h-5 w-5 text-green-600" />
                      Professional Links
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Portfolio Website
                        </label>
                        <EditableInput
                          is_editing={isEditing}
                          value={form_data.portfolio_link}
                          setter={validatedFieldSetter("portfolio_link")}
                          placeholder="https://yourportfolio.com"
                        >
                          <UserLinkLabel />
                        </EditableInput>
                        {linkErrors.portfolio_link && (
                          <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            <span>{linkErrors.portfolio_link}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          GitHub Profile
                        </label>
                        <EditableInput
                          is_editing={isEditing}
                          value={form_data.github_link}
                          setter={validatedFieldSetter("github_link")}
                          placeholder="https://github.com/yourusername"
                        >
                          <UserLinkLabel />
                        </EditableInput>
                        {linkErrors.github_link && (
                          <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            <span>{linkErrors.github_link}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          LinkedIn Profile
                        </label>
                        <EditableInput
                          is_editing={isEditing}
                          value={form_data.linkedin_link}
                          setter={validatedFieldSetter("linkedin_link")}
                          placeholder="https://linkedin.com/in/yourusername"
                        >
                          <UserLinkLabel />
                        </EditableInput>
                        {linkErrors.linkedin_link && (
                          <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            <span>{linkErrors.linkedin_link}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Calendar Link
                          </label>
                          {!isEditing && (
                            <Link
                              href="https://www.canva.com/design/DAGrKQdRG-8/XDGzebwKdB4CMWLOszcheg/edit"
                              className="mb-1"
                            >
                              <HelpCircle className="h-4 w-4 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer" />
                            </Link>
                          )}
                        </div>
                        <EditableInput
                          is_editing={isEditing}
                          value={form_data.calendar_link}
                          setter={validatedFieldSetter("calendar_link")}
                          placeholder="https://calendar.app.google/your-link"
                        >
                          <UserLinkLabel />
                        </EditableInput>
                        {linkErrors.calendar_link && (
                          <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            <span>{linkErrors.calendar_link}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Resume and About */}
            <div className="space-y-6">
              {/* Resume Section */}
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-600" />
                    Resume
                  </h3>
                </CardHeader>
                <CardContent className="pt-0">
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

                  {profile.resume ? (
                    <div className="border border-green-200 bg-green-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Uploaded
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            onClick={handlePreviewResume}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => resumeInputRef.current?.click()}
                            disabled={uploading}
                          >
                            <Upload className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <FileText className="h-6 w-6 text-gray-400 mx-auto mb-2" />
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
                  )}
                </CardContent>
              </Card>

              {/* About Section */}
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-600" />
                    About
                  </h3>
                </CardHeader>
                <CardContent className="pt-0">
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={form_data.bio || ""}
                        onChange={(e) => set_field("bio", e.target.value)}
                        placeholder="Tell us about yourself, your interests, goals, and what makes you unique..."
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-24 resize-none focus:border-blue-500 focus:ring-blue-500"
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {(form_data.bio || "").length}/500 characters
                      </p>
                    </div>
                  ) : (
                    <div className="bg-muted/50 rounded-lg p-3 overflow-hidden text-wrap">
                      <p className="text-sm leading-relaxed">
                        {profile.bio || (
                          <span className="text-muted-foreground italic">
                            No bio provided. Click "Edit" to add information
                            about yourself.
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

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
          pfp_fetcher={UserService.get_my_pfp_url}
          pfp_route="/users/me/pic"
          open_resume={async () => {
            close_employer_modal();
            await syncResumeUrl();
            open_resume_modal();
          }}
          open_calendar={async () => {
            window?.open(profile?.calendar_link ?? "", "_blank")?.focus();
          }}
        />
      </EmployerModal>
    </>
  );
}

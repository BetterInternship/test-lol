"use client";

import { useState, useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Edit2,
  Upload,
  User,
  Phone,
  ExternalLink,
  FileText,
  Eye,
  Calendar,
  Award,
  Github,
  Hash,
  Camera,
  GraduationCap,
} from "lucide-react";
import { useProfile } from "@/hooks/use-api";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../../lib/ctx-auth";
import { useModal } from "@/hooks/use-modal";
import { useRefs } from "@/lib/db/use-refs";
import { useAppContext } from "@/lib/ctx-app";
import { PublicUser } from "@/lib/db/db.types";
import { useFormData } from "@/lib/form-data";
import {
  EditableGroupableRadioDropdown,
  EditableInput,
} from "@/components/ui/editable";
import { UserPropertyLabel } from "@/components/ui/labels";
import Link from "next/link";
import { UserLinkLabel } from "../../../components/ui/labels";
import { DropdownGroup } from "@/components/ui/dropdown";
import { user_service } from "@/lib/api";
import { useClientDimensions } from "@/hooks/use-dimensions";
import { FileUploadFormBuilder } from "@/lib/multipart-form";
import { ApplicantModalContent } from "@/components/shared/applicant-modal";
import { Button } from "@/components/ui/button";
import { useFile } from "@/hooks/use-file";

export default function ProfilePage() {
  const { is_authenticated } = useAuthContext();
  const { profile, error, updateProfile } = useProfile();
  const { client_width, client_height } = useClientDimensions();
  const {
    colleges,
    levels,
    to_college_name,
    to_level_name,
    get_college_by_name,
    get_level_by_name,
  } = useRefs();
  const [isEditing, setIsEditing] = useState(false);
  const { url: resume_url, sync: sync_resume_url } = useFile({
    fetch: user_service.get_my_resume_url,
    route: "/users/me/resume",
  });
  const { url: pfp_url, sync: sync_pfp_url } = useFile({
    fetch: user_service.get_my_pfp_url,
    route: "/users/me/pic",
  });
  const { form_data, set_field, set_fields, field_setter } = useFormData<
    PublicUser & {
      college_name: string | null;
      year_level_name: string | null;
    }
  >();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<boolean>(false);
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

  const { is_mobile } = useAppContext();
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

    // Validate file type
    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF document");
      return;
    }

    // Validate file size (3MB)
    if (file.size > 3 * 1024 * 1024) {
      alert("File size must be less than 3MB");
      return;
    }

    try {
      setUploading(true);
      const form = FileUploadFormBuilder.new("resume");
      form.file(file);

      // @ts-ignore
      const result = await user_service.update_my_resume(form.build());

      alert("Resume uploaded successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to upload resume");
    } finally {
      setUploading(false);
      // Clear the input
      if (resumeInputRef.current) {
        resumeInputRef.current.value = "";
      }
    }
  };

  const handlePreviewResume = async () => {
    await sync_resume_url();
    open_resume_modal();
  };

  console.log(profile);
  const handleProfilePictureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a JPEG, PNG, GIF, or WebP image");
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB");
      return;
    }

    try {
      setUploading(true);
      const form = FileUploadFormBuilder.new("pfp");
      form.file(file);
      // @ts-ignore
      const result = await user_service.update_my_pfp(form.build());
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
      // Clear the input
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
        college_name: to_college_name(profile.college),
        year_level_name: to_level_name(profile.year_level),
      });
  }, [profile]);

  const handleSave = async () => {
    try {
      setSaving(true);
      // Transform frontend field names to backend field names
      const dataToSend = {
        full_name: form_data.full_name ?? "",
        phone_number: form_data.phone_number ?? "",
        college: get_college_by_name(form_data.college_name)?.id ?? undefined,
        year_level:
          get_level_by_name(form_data.year_level_name)?.id ?? undefined,
        portfolio_link: form_data.portfolio_link ?? "",
        github_link: form_data.github_link ?? "",
        linkedin_link: form_data.linkedin_link ?? "",
        calendly_link: form_data.calendly_link ?? "",
        bio: form_data.bio ?? "",
        taking_for_credit: form_data.taking_for_credit,
        linkage_officer: form_data.linkage_officer ?? "",
      };
      console.log(dataToSend);
      await updateProfile(dataToSend);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) set_fields({ ...profile });
    setIsEditing(false);
  };

  if (!is_authenticated()) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load profile: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Profile Content */}
          <div
            className={`flex-1 ${
              is_mobile ? "p-4 pb-32" : "p-4"
            }`}
          >
            <div
              className={`${is_mobile ? "max-w-none" : "max-w-4xl mx-auto"}`}
            >
              <div className="flex flex-col gap-y-3 mb-8">
                <div className="relative w-24 h-24 rounded-full border border-gray-300 flex items-center overflow-hidden">
                  {profile.profile_picture && pfp_url ? (
                    <>
                      <img className="w-24 h-24" src={pfp_url} alt="Profile picture"></img>
                      <Button
                        variant="ghost"
                        className="absolute w-full h-full hover:opacity-30 opacity-0"
                        onClick={() => profilePictureInputRef.current?.click()}
                      >
                        <Camera className="w-32 h-32 m-auto opacity-50"></Camera>
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full h-full"
                      onClick={() => profilePictureInputRef.current?.click()}
                    >
                      <Camera className="w-32 h-32 m-auto opacity-50"></Camera>
                    </Button>
                  )}
                </div>
                <div className="flex flex-row w-full justify-between">
                  <h1
                    className={"font-bold font-heading text-4xl text-gray-900"}
                  >
                    {profile.full_name}
                  </h1>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          disabled={saving}
                          size={is_mobile ? "sm" : "default"}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          disabled={saving}
                          size={is_mobile ? "sm" : "default"}
                        >
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => (
                          setIsEditing(true),
                          set_fields({
                            ...profile,
                            college_name: to_college_name(profile.college),
                            year_level_name: to_level_name(profile.year_level),
                          })
                        )}
                        size={is_mobile ? "sm" : "default"}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Layout */}
              {is_mobile ? (
                <div className="space-y-4">
                  {/* Preview Profile Section - Moved to top */}
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <h2 className="text-lg font-heading font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center mr-2">
                        <Eye className="w-3 h-3 text-indigo-600" />
                      </div>
                      Preview Profile
                    </h2>

                    <Button
                      variant="outline"
                      onClick={() => open_employer_modal()}
                      className="w-full h-12 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>

                    <p className="text-xs text-gray-500 mt-2 text-center">
                      See how employers view your profile
                    </p>
                  </div>

                  {/* Basic Information Card */}
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <h2 className="text-lg font-heading font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                        <User className="w-3 h-3 text-blue-600" />
                      </div>
                      Basic Information
                    </h2>
                    <div className="space-y-4">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          Full Name
                        </label>
                        <EditableInput
                          is_editing={isEditing}
                          value={form_data.full_name}
                          setter={field_setter("full_name")}
                        ></EditableInput>
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          Phone Number
                        </label>
                        <EditableInput
                          is_editing={isEditing}
                          value={form_data.phone_number}
                          setter={field_setter("phone_number")}
                        >
                          <UserPropertyLabel />
                        </EditableInput>
                      </div>

                      <DropdownGroup>
                        {/* College */}
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-semibold text-gray-700">
                            <GraduationCap className="w-4 h-4 mr-2 text-gray-500" />
                            College
                          </label>
                          <EditableGroupableRadioDropdown
                            is_editing={isEditing}
                            name="college"
                            value={form_data.college_name}
                            setter={field_setter("college_name")}
                            options={[
                              "Not specified",
                              ...colleges.map((c) => c.name),
                            ]}
                          >
                            <UserPropertyLabel />
                          </EditableGroupableRadioDropdown>
                        </div>

                        {/* Year Level and Internship for Credit */}
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-semibold text-gray-700">
                            <Hash className="w-4 h-4 mr-2 text-gray-500" />
                            Year Level
                          </label>
                          <EditableGroupableRadioDropdown
                            is_editing={isEditing}
                            name="year_level"
                            value={form_data.year_level_name}
                            setter={field_setter("year_level_name")}
                            options={[
                              "Not specified",
                              ...levels.map((l) => l.name),
                            ]}
                          >
                            <UserPropertyLabel />
                          </EditableGroupableRadioDropdown>
                        </div>
                      </DropdownGroup>

                      {/* Taking for Credit */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <Award className="w-4 h-4 mr-2 text-gray-500" />
                          Internship for Credit
                        </label>
                        {isEditing ? (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={form_data.taking_for_credit ?? false}
                              className="border-gray-300"
                              onCheckedChange={(value) => {
                                set_fields({
                                  taking_for_credit: !!value,
                                  linkage_officer: !!value
                                    ? form_data.linkage_officer
                                    : "",
                                });
                              }}
                            />
                            <span className="text-sm text-gray-700">
                              Taking for credit
                            </span>
                          </div>
                        ) : (
                          <p className="text-gray-900 font-medium text-sm">
                            {profile.taking_for_credit ? (
                              <span className="inline-flex items-center gap-2 text-green-700">
                                <Award className="w-4 h-4" />
                                Taking for credit
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">
                                Not taking for credit
                              </span>
                            )}
                          </p>
                        )}
                      </div>

                      {/* Linkage Officer - Conditional */}
                      {(isEditing
                        ? form_data.taking_for_credit
                        : profile.taking_for_credit) && (
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-semibold text-gray-700">
                            <User className="w-4 h-4 mr-2 text-gray-500" />
                            Linkage Officer
                          </label>
                          <EditableInput
                            is_editing={isEditing}
                            value={form_data.linkage_officer}
                            setter={field_setter("linkage_officer")}
                          >
                            <UserPropertyLabel />
                          </EditableInput>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Professional Links Card */}
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <h2 className="text-lg font-heading font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                        <ExternalLink className="w-3 h-3 text-green-600" />
                      </div>
                      Professional Links
                    </h2>
                    <div className="space-y-4">
                      {/* Portfolio */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <ExternalLink className="w-4 h-4 mr-2 text-gray-500" />
                          Portfolio Website
                        </label>
                        <EditableInput
                          is_editing={isEditing}
                          value={form_data.portfolio_link}
                          setter={field_setter("portfolio_link")}
                          placeholder="https://yourportfolio.com"
                        >
                          <UserLinkLabel />
                        </EditableInput>
                      </div>

                      {/* GitHub */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <Github className="w-4 h-4 mr-2 text-gray-500" />
                          GitHub Profile
                        </label>
                        <EditableInput
                          is_editing={isEditing}
                          value={form_data.github_link}
                          setter={field_setter("github_link")}
                          placeholder="https://github.com/yourusername"
                        >
                          <UserLinkLabel />
                        </EditableInput>
                      </div>

                      {/* LinkedIn */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <ExternalLink className="w-4 h-4 mr-2 text-gray-500" />
                          LinkedIn Profile
                        </label>
                        <EditableInput
                          is_editing={isEditing}
                          value={form_data.linkedin_link}
                          setter={field_setter("linkedin_link")}
                          placeholder="https://linkedin.com/in/yourusername"
                        >
                          <UserLinkLabel />
                        </EditableInput>
                      </div>

                      {/* Calendly */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          Calendly Link
                        </label>
                        <EditableInput
                          is_editing={isEditing}
                          value={form_data.calendly_link}
                          setter={field_setter("calendly_link")}
                          placeholder="https://calendly.com/yourusername"
                        >
                          <UserLinkLabel />
                        </EditableInput>
                      </div>
                    </div>
                  </div>

                  {/* About Card */}
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <h2 className="text-lg font-heading font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                        <FileText className="w-3 h-3 text-purple-600" />
                      </div>
                      About
                    </h2>
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={form_data.bio || ""}
                          onChange={(e) => set_field("bio", e.target.value)}
                          placeholder="Tell us about yourself, your interests, goals, and what makes you unique..."
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 h-32 resize-none focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                          maxLength={500}
                        />
                        <p className="text-xs text-gray-500 text-right">
                          {(form_data.bio || "").length}/500 characters
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <p className="text-gray-900 leading-relaxed break-words overflow-wrap-anywhere text-sm">
                          {profile.bio || (
                            <span className="text-gray-400 italic">
                              No bio provided. Click "Edit Profile" to add
                              information about yourself.
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Resume Section */}
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <h2 className="text-lg font-heading font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center mr-2">
                        <FileText className="w-3 h-3 text-orange-600" />
                      </div>
                      Resume
                    </h2>

                    {/* Hidden file inputs */}
                    <input
                      type="file"
                      ref={resumeInputRef}
                      onChange={handleResumeUpload}
                      disabled={uploading}
                      accept=".pdf"
                      style={{ display: "none" }}
                    />
                    <input
                      type="file"
                      ref={profilePictureInputRef}
                      onChange={handleProfilePictureUpload}
                      disabled={uploading}
                      accept="image/*"
                      style={{ display: "none" }}
                    />

                    {profile.resume ? (
                      // Resume exists
                      <div className="border border-green-200 bg-green-50 rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-green-800">
                                Resume uploaded
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handlePreviewResume}
                              className="text-green-600 border-green-600 hover:bg-green-100 h-7 px-2"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => resumeInputRef.current?.click()}
                              disabled={uploading}
                              className="text-blue-600 border-blue-600 hover:bg-blue-100 h-7 px-2"
                            >
                              <Upload className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // No resume
                      <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                        <FileText className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          {uploading ? "Uploading..." : "No resume uploaded"}
                        </p>
                        <Button
                          onClick={() => resumeInputRef.current?.click()}
                          disabled={uploading}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 h-8"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          {uploading ? "Uploading..." : "Upload Resume"}
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF files up to 3MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Desktop Layout */
                <div className="grid gap-4 lg:grid-cols-3">
                  {/* Left Column - Basic Information and Professional Links */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Basic Information Card */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <h2 className="text-xl font-bold font-heading text-gray-900 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        Basic Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-semibold text-gray-700">
                            <User className="w-4 h-4 mr-2 text-gray-500" />
                            Full Name
                          </label>
                          <EditableInput
                            is_editing={isEditing}
                            value={form_data.full_name}
                            setter={field_setter("full_name")}
                          >
                            <UserPropertyLabel />
                          </EditableInput>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-semibold text-gray-700">
                            <Phone className="w-4 h-4 mr-2 text-gray-500" />
                            Phone Number
                          </label>
                          <EditableInput
                            is_editing={isEditing}
                            value={form_data.phone_number}
                            setter={field_setter("phone_number")}
                          >
                            <UserPropertyLabel />
                          </EditableInput>
                        </div>

                        <DropdownGroup>
                          {/* College */}
                          <div className="space-y-2">
                            <label className="flex items-center text-sm font-semibold text-gray-700">
                              <GraduationCap className="w-4 h-4 mr-2 text-gray-500" />
                              College
                            </label>
                            <EditableGroupableRadioDropdown
                              is_editing={isEditing}
                              name="college"
                              value={form_data.college_name}
                              setter={field_setter("college_name")}
                              options={[
                                "Not specified",
                                ...colleges.map((c) => c.name),
                              ]}
                            >
                              <UserPropertyLabel />
                            </EditableGroupableRadioDropdown>
                          </div>

                          {/* Year Level */}
                          <div className="space-y-2">
                            <label className="flex items-center text-sm font-semibold text-gray-700">
                              <Hash className="w-4 h-4 mr-2 text-gray-500"></Hash>
                              Year Level
                            </label>
                            <EditableGroupableRadioDropdown
                              is_editing={isEditing}
                              name="year_level"
                              value={form_data.year_level_name}
                              setter={field_setter("year_level_name")}
                              options={[
                                "Not specified",
                                ...levels.map((l) => l.name),
                              ]}
                            >
                              <UserPropertyLabel />
                            </EditableGroupableRadioDropdown>
                          </div>
                        </DropdownGroup>

                        {/* Taking for Credit */}
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-semibold text-gray-700">
                            <Award className="w-4 h-4 mr-2 text-gray-500" />
                            Internship for Credit
                          </label>
                          {isEditing ? (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={form_data.taking_for_credit ?? false}
                                className="inline-block p-3 m-1"
                                onCheckedChange={(value) => {
                                  set_fields({
                                    taking_for_credit: !!value,
                                    linkage_officer: !!value
                                      ? form_data.linkage_officer
                                      : "",
                                  });
                                }}
                              />
                              <span className="text-sm text-gray-700">
                                Taking for credit{" "}
                              </span>
                            </div>
                          ) : (
                            <p className="text-gray-900 font-medium text-sm">
                              {profile.taking_for_credit ? (
                                <span className="inline-flex items-center gap-2 text-green-700">
                                  <Award className="w-4 h-4" />
                                  Taking for credit
                                </span>
                              ) : (
                                <span className="text-gray-400 italic">
                                  Not taking for credit
                                </span>
                              )}
                            </p>
                          )}
                        </div>

                        {/* Linkage Officer - Conditional */}
                        {(isEditing
                          ? form_data.taking_for_credit
                          : profile.taking_for_credit) && (
                          <div className="space-y-2">
                            <label className="flex items-center text-sm font-semibold text-gray-700">
                              <User className="w-4 h-4 mr-2 text-gray-500" />
                              Linkage Officer
                            </label>
                            <EditableInput
                              is_editing={isEditing}
                              value={form_data.linkage_officer}
                              setter={field_setter("linkage_officer")}
                            >
                              <UserPropertyLabel />
                            </EditableInput>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Professional Links Card */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <h2 className="text-xl font-heading font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <ExternalLink className="w-4 h-4 text-green-600" />
                        </div>
                        Professional Links
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Portfolio */}
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-semibold text-gray-700">
                            <ExternalLink className="w-4 h-4 mr-2 text-gray-500" />
                            Portfolio Website
                          </label>
                          <EditableInput
                            is_editing={isEditing}
                            value={form_data.portfolio_link}
                            setter={field_setter("portfolio_link")}
                            placeholder="https://yourportfolio.com"
                          >
                            <UserLinkLabel />
                          </EditableInput>
                        </div>

                        {/* GitHub */}
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-semibold text-gray-700">
                            <Github className="w-4 h-4 mr-2 text-gray-500" />
                            GitHub Profile
                          </label>
                          <EditableInput
                            is_editing={isEditing}
                            value={form_data.github_link}
                            setter={field_setter("github_link")}
                            placeholder="https://github.com/yourusername"
                          >
                            <UserLinkLabel />
                          </EditableInput>
                        </div>

                        {/* LinkedIn */}
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-semibold text-gray-700">
                            <ExternalLink className="w-4 h-4 mr-2 text-gray-500" />
                            LinkedIn Profile
                          </label>
                          <EditableInput
                            is_editing={isEditing}
                            value={form_data.linkedin_link}
                            setter={field_setter("linkedin_link")}
                            placeholder="https://linkedin.com/in/yourusername"
                          >
                            <UserLinkLabel />
                          </EditableInput>
                        </div>

                        {/* Calendly */}
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-semibold text-gray-700">
                            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                            Calendly Link
                          </label>
                          <EditableInput
                            is_editing={isEditing}
                            value={form_data.calendly_link}
                            setter={field_setter("calendly_link")}
                            placeholder="https://calendly.com/yourusername"
                          >
                            <UserLinkLabel />
                          </EditableInput>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Preview Profile & Resume */}
                  <div className="lg:col-span-1">
                    {/* Preview Profile Section */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow sticky top-6 mb-4">
                      <h2 className="text-xl font-heading font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                          <Eye className="w-4 h-4 text-indigo-600" />
                        </div>
                        Preview Profile
                      </h2>

                      <Button
                        variant="outline"
                        onClick={() => open_employer_modal()}
                        className="w-full h-12 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>

                      <p className="text-xs text-gray-500 mt-2 text-center">
                        See how employers view your profile
                      </p>
                    </div>

                    {/* Resume Section */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <h2 className="text-xl font-heading font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                          <FileText className="w-4 h-4 text-orange-600" />
                        </div>
                        Resume
                      </h2>

                      {/* Hidden file inputs */}
                      <input
                        type="file"
                        ref={resumeInputRef}
                        onChange={handleResumeUpload}
                        accept=".pdf,.doc,.docx"
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
                        // Resume exists
                        <div className="border border-green-200 bg-green-50 rounded-md p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="text-sm font-medium text-green-800">
                                  Uploaded
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePreviewResume}
                                className="text-green-600 border-green-600 hover:bg-green-100 h-7 px-2"
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => resumeInputRef.current?.click()}
                                disabled={uploading}
                                className="text-blue-600 border-blue-600 hover:bg-blue-100 h-7 px-2"
                              >
                                <Upload className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // No resume
                        <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                          <FileText className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            {uploading ? "Uploading..." : "No resume uploaded"}
                          </p>
                          <Button
                            onClick={() => resumeInputRef.current?.click()}
                            disabled={uploading}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 h-8"
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            {uploading ? "Uploading..." : "Upload Resume"}
                          </Button>
                          <p className="text-xs text-gray-500 mt-1">
                            PDF files up to 3MB
                          </p>
                        </div>
                      )}
                    </div>

                    {/* About Card - Moved here under Resume */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow mt-4">
                      <h2 className="text-xl font-heading font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <FileText className="w-4 h-4 text-purple-600" />
                        </div>
                        About
                      </h2>
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            value={form_data.bio || ""}
                            onChange={(e) => set_field("bio", e.target.value)}
                            placeholder="Tell us about yourself, your interests, goals, and what makes you unique..."
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 h-32 resize-none focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                            maxLength={500}
                          />
                          <p className="text-xs text-gray-500 text-right">
                            {(form_data.bio || "").length}/500 characters
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <p className="text-gray-900 leading-relaxed break-words overflow-wrap-anywhere text-sm">
                            {profile.bio || (
                              <span className="text-gray-400 italic">
                                No bio provided. Click "Edit Profile" to add
                                information about yourself.
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {resume_url.length && (
        <ResumeModal>
          <h1 className="font-bold font-heading text-4xl px-8 pt-2 pb-6">
            Resume Preview
          </h1>
          <iframe
            allowTransparency={true}
            style={{
              width: client_width * 0.4,
              height: client_height * 0.8,
              background: "#FFFFFF",
            }}
            src={resume_url + "#toolbar=0&navpanes=0&scrollbar=0"}
          >
            Resume could not be loaded.
          </iframe>
        </ResumeModal>
      )}

      {/* Employer Preview Modal */}
      <EmployerModal>
        <ApplicantModalContent applicant={profile} />
      </EmployerModal>
    </>
  );
}

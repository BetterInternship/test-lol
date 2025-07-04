"use client";

import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
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
import { ErrorLabel, LabeledProperty } from "@/components/ui/labels";
import { UserService } from "@/lib/api/api";
import { FileUploadFormBuilder } from "@/lib/multipart-form";
import { ApplicantModalContent } from "@/components/shared/applicant-modal";
import { Button } from "@/components/ui/button";
import { useFile } from "@/hooks/use-file";
import { Card } from "@/components/ui/our-card";
import { getFullName } from "@/lib/utils/user-utils";
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
import { cn, isValidPHNumber } from "@/lib/utils";
import { MyUserPfp } from "@/components/shared/pfp";
import { useAppContext } from "@/lib/ctx-app";
import {
  createEditForm,
  FormCheckbox,
  FormDropdown,
  FormInput,
} from "@/components/EditForm";
import { Divider } from "@/components/ui/divider";
import Link from "next/link";
import {
  isValidOptionalUserName,
  isValidRequiredUserName,
} from "@/lib/utils/name-utils";

const [ProfileEditForm, useProfileEditForm] = createEditForm<PublicUser>();

export default function ProfilePage() {
  const { isAuthenticated } = useAuthContext();
  const { profile, loading, error, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const { url: resumeUrl, sync: syncResumeUrl } = useFile({
    fetcher: UserService.getMyResumeURL,
    route: "/users/me/resume",
  });
  const {
    open: openEmployerModal,
    close: closeEmployerModal,
    Modal: EmployerModal,
  } = useModal("employer-modal");
  const { open: openResumeModal, Modal: ResumeModal } =
    useModal("resume-modal");
  const profileEditorRef = useRef<{ save: () => Promise<void> }>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [isAuthenticated(), router]);

  // File input refs
  const profilePictureInputRef = useRef<HTMLInputElement>(null);

  const handlePreviewResume = async () => {
    await syncResumeUrl();
    openResumeModal();
  };

  const handleProfilePictureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a JPEG, PNG, or WebP image");
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

  if (!isAuthenticated() || loading) return <Loader>Loading profile...</Loader>;

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center max-w-md m-auto">
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
        <div className="min-h-screen bg-transparent p-6 py-12 w-full">
          <div className="flex items-start gap-8 flex-1 w-full max-w-[600px] m-auto">
            <div className="relative flex-shrink-0">
              <MyUserPfp size="36" />
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-[0.5em] right-[0.5em] h-6 w-6 sm:h-7 sm:w-7 rounded-full"
                onClick={() => profilePictureInputRef.current?.click()}
                disabled={uploading}
              >
                <Camera className="h-3 w-3" />
              </Button>
              <input
                type="file"
                ref={profilePictureInputRef}
                onChange={handleProfilePictureUpload}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold font-heading mb-1 line-clamp-1">
                {getFullName(profile)}
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
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
                  onClick={() => openEmployerModal()}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                {/* Edit Mode Buttons */}
                {isEditing ? (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={async () => {
                        setSaving(true);
                        await profileEditorRef.current?.save();
                        setSaving(false);
                        setIsEditing(false);
                      }}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="w-full max-w-[600px] m-auto space-y-2 mt-8">
            {!isEditing && (
              <ProfileDetails
                profile={profile}
                openResumeModal={handlePreviewResume}
              />
            )}
            {isEditing && (
              <ProfileEditForm data={profile}>
                <ProfileEditor
                  updateProfile={updateProfile}
                  ref={profileEditorRef}
                />
              </ProfileEditForm>
            )}
          </div>
        </div>

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
            pfp_fetcher={() => UserService.getUserPfpURL("me")}
            pfp_route="/users/me/pic"
            open_resume={async () => {
              closeEmployerModal();
              await syncResumeUrl();
              openResumeModal();
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

const ProfileDetails = ({
  profile,
  openResumeModal,
}: {
  profile: PublicUser;
  openResumeModal: () => void;
}) => {
  const { isMobile } = useAppContext();
  const {
    to_college_name,
    to_level_name,
    to_department_name,
    to_degree_full_name,
    to_university_name,
  } = useRefs();

  return (
    <>
      <Card className="bg-white p-3 px-5 overflow-hidden text-wrap">
        <p className="text-sm leading-relaxed">
          {profile.bio || (
            <span className="text-muted-foreground italic">
              No bio provided. Click "Edit" to add information about yourself.
            </span>
          )}
        </p>
      </Card>

      <Card className="px-5">
        <div
          className={cn(
            isMobile
              ? "grid grid-cols-1 space-y-5 mb-8"
              : "grid grid-cols-2 gap-y-5"
          )}
        >
          <LabeledProperty
            label="Full Name"
            value={`${profile.first_name} ${profile.middle_name} ${profile.last_name}`}
          />

          <LabeledProperty label="Phone Number" value={profile.phone_number} />

          <LabeledProperty
            label="Year Level"
            value={to_level_name(profile.year_level)}
          />

          <LabeledProperty
            label="Education"
            value={`${to_university_name(profile.university)}\n
              ${to_college_name(profile.college)}\n
              ${to_department_name(profile.department)}\n
              ${to_degree_full_name(profile.degree)}`}
          />
        </div>
        <Divider />
        <div
          className={cn(
            "mb-8",
            isMobile
              ? "grid grid-cols-1 space-y-2"
              : "flex flex-row space-x-2 items-center justify-start"
          )}
        >
          <ProfileLinkBadge
            title="Portfolio Link"
            link={profile.portfolio_link}
          />
          <ProfileLinkBadge title="Github Profile" link={profile.github_link} />
          <ProfileLinkBadge
            title="Linkedin Profile"
            link={profile.linkedin_link}
          />
          <ProfileLinkBadge
            title="Calendar Link"
            link={profile.calendar_link}
          />
        </div>
        <ResumeBox profile={profile} openResumeModal={openResumeModal} />
      </Card>
      <br />
    </>
  );
};

const ProfileEditor = forwardRef<
  { save: () => Promise<void> },
  {
    updateProfile: (
      updatedProfile: Partial<PublicUser>
    ) => Promise<Partial<PublicUser>>;
  }
>(({ updateProfile }, ref) => {
  const {
    formData,
    formErrors,
    setField,
    fieldSetter,
    addValidator,
    validateFormData,
    cleanFormData,
  } = useProfileEditForm();
  const { isMobile } = useAppContext();
  const {
    levels,
    universities,
    colleges,
    departments,
    degrees,
    get_universities_from_domain,
    get_colleges_by_university,
    get_departments_by_college,
    get_degrees_by_university,
  } = useRefs();

  // Provide an external link to save profile
  useImperativeHandle(ref, () => ({
    save: async () => {
      try {
        const updatedProfile = {
          ...cleanFormData(),
          portfolio_link: toURL(formData.portfolio_link)?.toString(),
          github_link: toURL(formData.github_link)?.toString(),
          linkedin_link: toURL(formData.linkedin_link)?.toString(),
          calendar_link: toURL(formData.calendar_link)?.toString(),
        };
        await updateProfile(updatedProfile);
        return;
      } catch (error) {
        console.error("Failed to update profile:", error);
        alert("Failed to update profile. Please try again.");
        return;
      }
    },
  }));

  // Dropdown options
  const [universityOptions, setUniversityOptions] = useState(universities);
  const [collegeOptions, setCollegeOptions] = useState(colleges);
  const [departmentOptions, setDepartmentOptions] = useState(departments);
  const [degreeOptions, setDegreeOptions] = useState(degrees);

  // Update dropdown options
  useEffect(() => {
    setUniversityOptions(
      universities.filter((u) =>
        get_universities_from_domain(formData.email.split("@")[1]).includes(
          u.id
        )
      )
    );
    setCollegeOptions(
      colleges.filter((c) =>
        get_colleges_by_university(formData.university ?? "").includes(c.id)
      )
    );
    setDepartmentOptions(
      departments.filter((d) =>
        get_departments_by_college(formData.college ?? "").includes(d.id)
      )
    );
    setDegreeOptions(
      degrees
        .filter((d) =>
          get_degrees_by_university(formData.university ?? "").includes(d.id)
        )
        .map((d) => ({ ...d, name: `${d.type} ${d.name}` }))
    );

    const debouncedValidation = setTimeout(() => validateFormData(), 500);
    return () => clearTimeout(debouncedValidation);
  }, [formData]);

  // Data validators
  useEffect(() => {
    addValidator(
      "first_name",
      (name: string) =>
        !isValidRequiredUserName(name) && `First name is not valid.`
    );
    addValidator(
      "middle_name",
      (name: string) =>
        !isValidOptionalUserName(name) && `Middle name is not valid.`
    );
    addValidator(
      "last_name",
      (name: string) =>
        !isValidRequiredUserName(name) && `Last name is not valid.`
    );
    addValidator(
      "phone_number",
      (number: string) =>
        !isValidPHNumber(number) && "Invalid Philippine number."
    );
    addValidator(
      "portfolio_link",
      (link: string) => !isValidOptionalURL(link) && "Invalid portfolio link."
    );
    addValidator(
      "github_link",
      (link: string) =>
        !isValidOptionalGitHubURL(link) && "Invalid github link."
    );
    addValidator(
      "linkedin_link",
      (link: string) =>
        !isValidOptionalLinkedinURL(link) && "Invalid linkedin link."
    );
    addValidator(
      "calendar_link",
      (link: string) =>
        !isValidOptionalCalendarURL(link) && "Invalid calendar link."
    );
  }, []);

  return (
    <>
      <Card>
        <div className="text-2xl tracking-tight font-medium text-gray-700 mb-4">
          Identity
        </div>
        <div className="flex flex-col space-y-1 mb-2">
          <ErrorLabel value={formErrors.first_name} />
          <ErrorLabel value={formErrors.middle_name} />
          <ErrorLabel value={formErrors.last_name} />
        </div>
        <div
          className={cn(
            "mb-4",
            isMobile ? "flex flex-col space-y-3" : "flex flex-row space-x-2"
          )}
        >
          <FormInput
            label="First Name"
            value={formData.first_name ?? ""}
            setter={fieldSetter("first_name")}
            maxLength={32}
          />
          <FormInput
            label="Middle Name"
            value={formData.middle_name ?? ""}
            setter={fieldSetter("middle_name")}
            maxLength={2}
            required={false}
          />
          <FormInput
            label="Last Name"
            value={formData.last_name ?? ""}
            setter={fieldSetter("last_name")}
          />
        </div>
        <div className="flex flex-col space-y-1 mb-2">
          <ErrorLabel value={formErrors.phone_number} />
        </div>
        <div className="mb-8">
          <FormInput
            label="Phone Number"
            value={formData.phone_number ?? ""}
            setter={fieldSetter("phone_number")}
          />
        </div>
        <div className="text-2xl tracking-tight font-medium text-gray-700 my-6 mt-12">
          Personal Bio
        </div>
        <textarea
          value={formData.bio || ""}
          onChange={(e) => setField("bio", e.target.value)}
          placeholder="Tell us about yourself, your interests, goals, and what makes you unique..."
          className="w-full border border-gray-200 rounded-[0.25em] p-3 px-5 text-sm min-h-24 resize-none focus:border-opacity-70 focus:ring-transparent"
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground text-right">
          {(formData.bio || "").length}/500 characters
        </p>
        <div className="text-2xl tracking-tight font-medium text-gray-700 my-6">
          Educational Background
        </div>
        <div className="flex flex-col space-y-3">
          <FormDropdown
            label={"University"}
            value={formData.university ?? ""}
            options={universityOptions}
            setter={fieldSetter("university")}
          />
          <FormDropdown
            label={"College"}
            value={formData.college ?? ""}
            options={collegeOptions}
            setter={fieldSetter("college")}
          />
          <FormDropdown
            label={"Department"}
            value={formData.department ?? ""}
            options={departmentOptions}
            setter={fieldSetter("department")}
          />
          <FormDropdown
            label={"Degree"}
            value={formData.degree ?? ""}
            options={degreeOptions}
            setter={fieldSetter("degree")}
          />
          <FormDropdown
            label="Year Level"
            value={formData.year_level ?? ""}
            options={levels}
            setter={fieldSetter("year_level")}
          />
          <FormInput
            label={"Degree Notes"}
            value={formData.degree_notes ?? ""}
            setter={fieldSetter("degree_notes")}
            maxLength={100}
            required={false}
          />
          <div className="flex flex-col space-y-2">
            <div className="flex flex-row items-center justify-start mt-8 my-2">
              <FormCheckbox
                checked={formData.taking_for_credit}
                setter={fieldSetter("taking_for_credit")}
              />
              <div className="text-sm text-gray-500 ml-3">
                Taking internships for credit?
              </div>
            </div>
            {formData.taking_for_credit && (
              <FormInput
                label={"Linkage Officer"}
                value={formData.linkage_officer ?? ""}
                setter={fieldSetter("linkage_officer")}
              />
            )}
          </div>
        </div>
        <div className="text-2xl tracking-tight font-medium text-gray-700 my-4 mt-12">
          External Profiles
        </div>
        <div className="flex flex-col space-y-1 mb-2">
          <ErrorLabel value={formErrors.portfolio_link} />
          <ErrorLabel value={formErrors.github_link} />
          <ErrorLabel value={formErrors.linkedin_link} />
          <ErrorLabel value={formErrors.calendar_link} />
        </div>
        <div className="flex flex-col space-y-3">
          <FormInput
            label={"Portfolio Link"}
            value={formData.portfolio_link ?? ""}
            setter={fieldSetter("portfolio_link")}
            required={false}
          />
          <FormInput
            label={"Github Profile"}
            value={formData.github_link ?? ""}
            setter={fieldSetter("github_link")}
            required={false}
          />
          <FormInput
            label={"Linkedin Profile"}
            value={formData.linkedin_link ?? ""}
            setter={fieldSetter("linkedin_link")}
            required={false}
          />
          <div className="relative">
            <div className="absolute ml-24">
              <Link
                href="https://www.canva.com/design/DAGrKQdRG-8/XDGzebwKdB4CMWLOszcheg/edit"
                target="_blank"
                className="opacity-70 hover:opacity-90"
              >
                <MessageCircleQuestion className="w-4 h-4 text-blue-500" />
              </Link>
            </div>
            <FormInput
              label={"Calendar Link"}
              value={formData.calendar_link ?? ""}
              setter={fieldSetter("calendar_link")}
            />
          </div>
        </div>
      </Card>
      <br />
      <br />
    </>
  );
});

const ResumeBox = ({
  profile,
  openResumeModal,
}: {
  profile: PublicUser;
  openResumeModal: () => void;
}) => {
  const [uploading, setUploading] = useState(false);
  const resumeInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="mt-5">
      {profile.resume ? (
        <div className="w-full flex justify-start gap-2">
          <Button variant="outline" scheme="primary" onClick={openResumeModal}>
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
            <p className="text-xs text-muted-foreground mt-2">
              PDF up to 2.5MB
            </p>
          </div>
        </Card>
      )}
      <input
        type="file"
        ref={resumeInputRef}
        onChange={handleResumeUpload}
        accept=".pdf"
        style={{ display: "none" }}
      />
    </div>
  );
};

const ProfileLinkBadge = ({
  title,
  link,
}: {
  title: string;
  link?: string | null;
}) => {
  return (
    <Button
      variant="ghost"
      className="p-0 h-6 w-fit"
      disabled={!link}
      onClick={() => openURL(link)}
    >
      <BoolBadge state={!!link} onValue={title} offValue={title} />
    </Button>
  );
};

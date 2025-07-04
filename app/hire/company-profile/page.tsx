"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Camera, Edit2 } from "lucide-react";
import ContentLayout from "@/components/features/hire/content-layout";
import { useProfile } from "@/hooks/use-employer-api";
import { Button } from "@/components/ui/button";
import { useMoa } from "@/lib/db/use-moa";
import { useRefs } from "@/lib/db/use-refs";
import { Badge, BoolBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/our-card";
import { Employer } from "@/lib/db/db.types";
import { cn, isValidEmail, isValidPHNumber, isValidUUID } from "@/lib/utils";
import { useAppContext } from "@/lib/ctx-app";
import { Divider } from "@/components/ui/divider";
import { isValidOptionalURL, openURL, toURL } from "@/lib/utils/url-utils";
import { ErrorLabel, LabeledProperty } from "@/components/ui/labels";
import { createEditForm, FormDropdown, FormInput } from "@/components/EditForm";
import { MyEmployerPfp } from "@/components/shared/pfp";
import { FileUploadFormBuilder } from "@/lib/multipart-form";
import { EmployerService } from "@/lib/api/api";

const [ProfileEditForm, useProfileEditForm] = createEditForm<Employer>();

export default function CompanyProfile() {
  const { loading, error, profile, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { check } = useMoa();
  const { get_university_by_name } = useRefs();
  const { to_industry_name } = useRefs();
  const profileEditorRef = useRef<{ save: () => Promise<void> }>(null);
  const profilePictureInputRef = useRef<HTMLInputElement>(null);

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
      const form = FileUploadFormBuilder.new("logo");
      form.file(file);
      // @ts-ignore
      const result = await EmployerService.updateMyPfp(form.build());
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

  return !profile ? (
    <></>
  ) : (
    <ContentLayout>
      <div className="h-fit min-h-screen bg-background p-6 py-12 w-full">
        <div className="flex items-start gap-8 flex-1 w-full max-w-[600px] m-auto">
          <div className="relative flex-shrink-0">
            <MyEmployerPfp size="36" />
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
              {profile.name}
            </h1>
            <h1 className="text-sm font-normal mb-2 line-clamp-1 text-gray-400">
              Legal Name: [{profile.legal_entity_name}]
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              <div className="flex flex-row gap-1">
                <BoolBadge
                  state={check(
                    profile?.id ?? "",
                    get_university_by_name("DLSU - Manila")?.id ?? ""
                  )}
                  onValue="Active DLSU MOA"
                  offValue="No DLSU MOA"
                />
                <BoolBadge
                  state={profile.is_verified}
                  onValue="Verified"
                  offValue="Not Verified"
                />
                {to_industry_name(profile.industry, null) && (
                  <Badge>{to_industry_name(profile.industry)}</Badge>
                )}
              </div>
            </p>
            <div className="flex w-full flex-row flex-wrap gap-2 flex-shrink-0 mt-4">
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

        <div className="w-full max-w-[600px] m-auto space-y-2 mt-8 ">
          {!isEditing && <ProfileDetails profile={profile} />}
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
    </ContentLayout>
  );
}

const ProfileDetails = ({ profile }: { profile: Employer }) => {
  const { isMobile } = useAppContext();

  return (
    <>
      <Card className="bg-muted/50 p-3 px-5 overflow-hidden text-wrap">
        <p className="text-sm leading-relaxed">
          {profile.description || (
            <span className="text-muted-foreground italic">
              No description provided. Click "Edit" to add information about the
              company.
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
          <LabeledProperty label="Company Name" value={profile.name} />
          <LabeledProperty label="Location" value={profile.location} />
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
          <ProfileLinkBadge title="Company Email" link={profile.email} />
          <ProfileLinkBadge title="Company Website" link={profile.website} />
          <ProfileLinkBadge
            title="Company Number"
            link={profile.phone_number}
          />
        </div>
      </Card>
      <br />
    </>
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

const ProfileEditor = forwardRef<
  { save: () => Promise<void> },
  {
    updateProfile: (
      updatedProfile: Partial<Employer>
    ) => Promise<Partial<Employer>>;
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
  const { industries } = useRefs();

  // Provide an external link to save profile
  useImperativeHandle(ref, () => ({
    save: async () => {
      try {
        const updatedProfile = {
          ...cleanFormData(),
          website: toURL(formData.website)?.toString(),
          industry: isValidUUID(formData.industry ?? "")
            ? formData.industry
            : undefined,
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

  // Update dropdown options
  useEffect(() => {
    const debouncedValidation = setTimeout(() => validateFormData(), 500);
    return () => clearTimeout(debouncedValidation);
  }, [formData]);

  // Data validators
  useEffect(() => {
    addValidator(
      "phone_number",
      (number: string) =>
        !isValidPHNumber(number) && "Invalid Philippine number."
    );
    addValidator(
      "email",
      (email: string) => !isValidEmail(email) && "Invalid Philippine number."
    );
    addValidator(
      "website",
      (link: string) => !isValidOptionalURL(link) && "Invalid website link."
    );
  }, []);

  return (
    <>
      <Card>
        <div className="text-xl tracking-tight font-medium text-gray-700 mb-4">
          Identity
        </div>
        <div className="flex flex-col space-y-1 mb-2">
          <ErrorLabel value={formErrors.name} />
        </div>
        <div className={"mb-4 flex flex-col space-y-3"}>
          <FormInput
            label="Company Name"
            value={formData.name ?? ""}
            setter={fieldSetter("name")}
            maxLength={32}
          />
          <FormInput
            label="Legal Entity Name"
            value={formData.legal_entity_name ?? ""}
            setter={fieldSetter("legal_entity_name")}
            maxLength={32}
          />
          <FormDropdown
            label="Industry"
            value={formData.industry ?? ""}
            options={industries.sort((a, b) => a.name.localeCompare(b.name))}
            setter={fieldSetter("industry")}
          />
        </div>
        <label className="text-xs text-gray-400 italic mb-1 block">
          Description
        </label>
        <textarea
          value={formData.description || ""}
          onChange={(e) => setField("description", e.target.value)}
          placeholder="Let applicants know what they're in for..."
          className="w-full border border-gray-200 rounded-[0.25em] p-3 px-5 text-sm min-h-24 resize-none focus:border-opacity-70 focus:ring-transparent"
          maxLength={750}
        />
        <p className="text-xs text-muted-foreground text-right">
          {(formData.description || "").length}/750 characters
        </p>
        <div className="text-xl tracking-tight font-medium text-gray-700 mb-4">
          Contact Information
        </div>
        <ErrorLabel value={formErrors.email} />
        <div className="mb-8">
          <FormInput
            label="Company Email"
            value={formData.email ?? ""}
            setter={fieldSetter("email")}
          />
        </div>
        <ErrorLabel value={formErrors.phone_number} />
        <div className="mb-8">
          <FormInput
            label="Phone Number"
            value={formData.phone_number ?? ""}
            setter={fieldSetter("phone_number")}
          />
        </div>
        <ErrorLabel value={formErrors.website} />
        <div className="mb-8">
          <FormInput
            label="Website"
            value={formData.website ?? ""}
            setter={fieldSetter("website")}
          />
        </div>
      </Card>
      <br />
      <br />
    </>
  );
});

"use client";

import { useState } from "react";
import { Edit2 } from "lucide-react";
import ContentLayout from "@/components/features/hire/content-layout";
import { useProfile } from "@/hooks/use-employer-api";
import { Button } from "@/components/ui/button";
import { useMoa } from "@/lib/db/use-moa";
import { useRefs } from "@/lib/db/use-refs";
import { Badge, BoolBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/our-card";
import { useFormData } from "@/lib/form-data";
import { Employer } from "@/lib/db/db.types";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/lib/ctx-app";
import { Divider } from "@/components/ui/divider";
import { openURL } from "@/lib/utils/url-utils";
import { LabeledProperty } from "@/components/ui/labels";

export default function CompanyProfile() {
  const { loading, error, profile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { check } = useMoa();
  const { get_university_by_name } = useRefs();
  const { to_industry_name } = useRefs();

  const handleSave = () => {
    // Here you would typically save all data to a backend
    console.log("Saving company data:", profile);
    setIsEditing(false);
  };

  return !profile ? (
    <></>
  ) : (
    <ContentLayout>
      <div className="min-h-screen bg-background p-6 py-12">
        <div className="flex items-start gap-8 flex-1 w-full max-w-[600px] m-auto">
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
                {profile.industry && (
                  <Badge>{to_industry_name(profile.industry)}</Badge>
                )}
              </div>
            </p>
            <div className="flex w-full flex-row flex-wrap gap-2 flex-shrink-0 mt-10">
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
                      // await profileEditorRef.current?.save();
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
          {!isEditing && <ProfileDetails profile={profile} />}
          {/* {isEditing && (
            // <ProfileEditForm data={profile}>
            //   <ProfileEditor
            //     updateProfile={updateProfile}
            //     ref={profileEditorRef}
            //   />
            // </ProfileEditForm>
          )} */}
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

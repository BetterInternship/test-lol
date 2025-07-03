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
import { EditableInput } from "@/components/ui/editable";
import { EmployerPropertyLabel } from "@/components/ui/labels";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/lib/ctx-app";

export default function CompanyProfile() {
  const { loading, error, profile } = useProfile();
  const {
    formData: form_data,
    setField: set_field,
    fieldSetter: field_setter,
  } = useFormData<Employer>();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { check } = useMoa();
  const { isMobile } = useAppContext();
  const { get_university_by_name } = useRefs();

  const handleInputChange = (field: string, value: string) => {};

  const handleSave = () => {
    // Here you would typically save all data to a backend
    console.log("Saving company data:", profile);
    setIsEditing(false);
  };

  const handleCancel = () => {};

  return !profile ? (
    <></>
  ) : (
    <ContentLayout>
      <div className="w-full min-h-screen bg-background p-6 py-12">
        <div className="flex items-start gap-8 flex-1 w-full max-w-[600px] m-auto">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold font-heading mb-2 line-clamp-1">
              {profile.name}
            </h1>
            <div className="flex flex-row space-x-1">
              <p className="text-muted-foreground text-sm">
                <BoolBadge
                  state={check(
                    profile?.id ?? "",
                    get_university_by_name("DLSU - Manila")?.id ?? ""
                  )}
                  onValue="Active DLSU MOA"
                  offValue="No DLSU MOA"
                />
              </p>
              <p className="text-muted-foreground text-sm">
                <BoolBadge
                  state={profile.is_verified}
                  onValue="Verified Account"
                  offValue="Pending Verification"
                />
              </p>
              <Badge type="accent">
                {profile.industry ?? "Other Industry"}
              </Badge>
            </div>
            <div className="flex w-full flex-row flex-wrap gap-2 flex-shrink-0 mt-10">
              {isEditing ? (
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() =>
                    // setIsEditing(true),
                    // set_fields({
                    //   ...profile,
                    //   degree_name: to_degree_full_name(profile.degree),
                    //   college_name: to_college_name(profile.college),
                    //   year_level_name: to_level_name(profile.year_level),
                    //   department_name: to_department_name(profile.department),
                    //   calendar_link: profile.calendar_link ?? "",
                    // })
                    null
                  }
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>

            <div className="w-full max-w-[600px] m-auto space-y-2 mt-8">
              {isEditing ? (
                <div className="space-y-1 mb-4 transition-all">
                  <textarea
                    value={profile.description || ""}
                    onChange={(e) => set_field("description", e.target.value)}
                    placeholder="Tell us what you do..."
                    className="w-full border border-gray-200 rounded-[0.33em] px-3 py-2 text-sm min-h-24 resize-none focus:border-opacity-70 focus:ring-transparent"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {(form_data.description || "").length}/500 characters
                  </p>
                </div>
              ) : (
                <Card className="bg-muted/50 p-3 px-5 overflow-hidden text-wrap">
                  <p className="text-sm leading-relaxed">
                    {profile.description || (
                      <span className="text-muted-foreground italic">
                        No description provided. Click "Edit" to add information
                        about the company.
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
                      Location
                    </label>
                    <EditableInput
                      is_editing={isEditing}
                      value={form_data.location}
                      setter={field_setter("location")}
                      placeholder="Location"
                      maxLength={50}
                    >
                      <EmployerPropertyLabel />
                    </EditableInput>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 italic mb-1 block">
                      Phone Number
                    </label>
                    <EditableInput
                      is_editing={isEditing}
                      value={form_data.phone_number}
                      setter={field_setter("phone_number")}
                      placeholder="Phone Number"
                      maxLength={50}
                    >
                      <EmployerPropertyLabel />
                    </EditableInput>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}

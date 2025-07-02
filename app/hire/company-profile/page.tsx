"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, Phone, Camera, Edit2 } from "lucide-react";
import ContentLayout from "@/components/features/hire/content-layout";
import { useProfile } from "@/hooks/use-employer-api";
import { Pfp } from "@/components/shared/pfp";
import { Button } from "@/components/ui/button";

export default function CompanyProfile() {
  const { loading, error, profile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

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
      <div className="min-h-screen bg-background p-6 py-12">
        <div className="flex items-start gap-8 flex-1 w-full max-w-[600px] m-auto">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold font-heading mb-1 line-clamp-1">
              {profile.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              <div>
                {/* <BoolBadge
                  state={profile.taking_for_credit}
                  onValue="Taking for credit"
                  offValue="Not taking for credit"
                /> */}
              </div>
            </p>
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
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}

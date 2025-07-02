"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, Phone } from "lucide-react";
import ContentLayout from "@/components/features/hire/content-layout";
import { useProfile } from "@/hooks/use-employer-api";

export default function CompanyProfile() {
  const { loading, error, profile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: string, value: string) => {};

  const handleSave = () => {
    // Here you would typically save all data to a backend
    console.log("Saving company data:", profile);
    setIsEditing(false);
  };

  return !profile ? (
    <></>
  ) : (
    <ContentLayout>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div
              className="bg-white border-2 border-gray-200 rounded-lg p-8"
              data-tour="company-details"
            >
              <div className="mb-6">
                {isEditing ? (
                  <Input
                    id="company-name"
                    value={profile.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-2"
                    placeholder="Enter company name"
                  />
                ) : (
                  <p className="text-gray-900 text-lg font-medium mt-2">
                    {profile.name}
                  </p>
                )}
              </div>

              <div className="mb-6" data-tour="branding-section">
                {isEditing ? (
                  <Textarea
                    id="company-description"
                    value={profile.description ?? ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="mt-2 min-h-[120px]"
                    placeholder="Enter company description"
                  />
                ) : (
                  <p className="text-gray-700 mt-2 leading-relaxed">
                    {profile.description}
                  </p>
                )}
              </div>

              {/* Company Locations */}
              <div className="mb-6">
                <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Company Location(s)
                </Label>
                <div className="mt-2 space-y-2">{profile.location}</div>
              </div>

              {/* HR Email */}
              <div className="mb-6" data-tour="signatory-info">
                <Label
                  htmlFor="hr-email"
                  className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  HR Email
                </Label>
                {isEditing ? (
                  <Input
                    id="hr-email"
                    type="email"
                    value={profile.email ?? ""}
                    onChange={(e) =>
                      handleInputChange("hrEmail", e.target.value)
                    }
                    className="mt-2"
                    placeholder="hr@company.com"
                  />
                ) : (
                  <p className="text-gray-700 mt-2">{profile.email ?? ""}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="mb-8">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Contact Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone_number ?? ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="mt-2"
                    placeholder="+63 2 1234 5678"
                  />
                ) : (
                  <p className="text-gray-700 mt-2">{profile.phone_number}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}

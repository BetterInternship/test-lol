"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  GroupableRadioDropdown,
  DropdownGroup,
} from "@/components/ui/dropdown";
import { useRefs } from "@/lib/db/use-refs";
import { useAuthContext } from "../authctx";
import { MultipartFormBuilder } from "@/lib/multipart-form";
import { EditableDatePicker } from "@/components/ui/editable";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form_data, setFormData] = useState({
    doing_business_as: "",
    legal_entity_name: "",
    industry: "",
    office_location: "",
    website: "",
    company_description: "",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    contact_position: "",
    accept_outside_dlsu: false,
    has_moa_with_dlsu: false,
    moa_start_date: new Date().getTime(),
    moa_expires_at: new Date().getTime(),
    terms_accepted: false,
  });

  const { industries, universities } = useRefs();
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handle_change = (field: string, value: any) => {
    setFormData({ ...form_data, [field]: value });
  };

  const handle_submit = async () => {
    const multipart_form = MultipartFormBuilder.new();
    multipart_form.from({
      name: form_data.doing_business_as,
      contact_name: form_data.contact_name,
      legal_entity_name: form_data.legal_entity_name,
      industry: form_data.industry,
      location: form_data.office_location,
      description: form_data.company_description,
      email: form_data.contact_email,
      website: form_data.website,
      phone_number: form_data.contact_phone,
      accepted_universities: `[${universities
        .map((u) => `"${u.id}"`)
        .join("")}]`,
      acceps_non_university: form_data.accept_outside_dlsu,

      // Moa instances, in this case DLSU only for now
      ...(form_data.has_moa_with_dlsu
        ? {
            moa: JSON.stringify([
              {
                // ! change when unis update
                university_id: universities.map((u) => u.id)[0],
                start_date: form_data.moa_start_date,
                expires_at: form_data.moa_expires_at,
              },
            ]),
          }
        : {}),
    });
    // multipart_form.add_file("logo", ogoFile);
    // console.log("Form data:", multipart_form.build());

    setLoading(true);
    // @ts-ignore
    const response = await register(multipart_form.build());
    // @ts-ignore
    if (response && response.success) {
      alert("Email has been sent with password!");
      router.push("/login");
      setLoading(false);
    } else {
      alert(
        "Could not register, check all your inputs are correct and complete."
      );
      setLoading(false);
    }

    setLoading(false);
  };

  return (
    <div className="flex-1 flex justify-center px-6 py-12 pt-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-heading font-bold text-gray-900 mb-4">
            Company Registration
          </h2>
        </div>

        <form onSubmit={handle_submit} className="space-y-16">
          {/* General Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              General Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Doing Business As</Label>
                <Input
                  value={form_data.doing_business_as}
                  onChange={(e) =>
                    handle_change("doing_business_as", e.target.value)
                  }
                  placeholder="e.g. Google"
                />
              </div>
              <div>
                <Label>Legal Entity Name</Label>
                <Input
                  value={form_data.legal_entity_name}
                  onChange={(e) =>
                    handle_change("legal_entity_name", e.target.value)
                  }
                  placeholder="e.g. LeapFroggr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Industry</Label>
                <DropdownGroup>
                  <GroupableRadioDropdown
                    name="industry"
                    options={[...industries.map((industry) => industry.name)]}
                    on_change={(selected_name) => {
                      const selected_industry = industries.find(
                        (industry) => industry.name === selected_name
                      );
                      handle_change("industry", selected_industry?.id || "");
                    }}
                    default_value="Not Selected"
                  />
                </DropdownGroup>
              </div>
              <div>
                <Label>Office's General Location</Label>
                <Input
                  value={form_data.office_location}
                  onChange={(e) =>
                    handle_change("office_location", e.target.value)
                  }
                  placeholder="e.g. Makati, Manila"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <Label className=" block mb-2">Website</Label>
                <Input
                  value={form_data.website}
                  onChange={(e) => handle_change("website", e.target.value)}
                  placeholder="e.g. https://google.com"
                />
              </div>
            </div>

            <div>
              <Label>Company Description</Label>
              <Textarea
                value={form_data.company_description}
                onChange={(e) =>
                  handle_change("company_description", e.target.value)
                }
                placeholder="Write about your company..."
                className="min-h-[120px]"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Contact Information
            </h3>

            <div className="w-max-prose text-sm text-gray-700 border border-gray-200 p-4 rounded-sm">
              <span className="text-yellow-400">*</span>
              An admin account will be created for the person as soon as
              registration is finished. Their email will be sent a password
              after completing this form.{" "}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Company Contact Name</Label>
                <Input
                  value={form_data.contact_name}
                  onChange={(e) =>
                    handle_change("contact_name", e.target.value)
                  }
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <Label>Contact's Phone Number</Label>
                <Input
                  value={form_data.contact_phone}
                  onChange={(e) =>
                    handle_change("contact_phone", e.target.value)
                  }
                  placeholder="e.g. 09XXXXXXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Contact's Email</Label>
                <Input
                  value={form_data.contact_email}
                  onChange={(e) =>
                    handle_change("contact_email", e.target.value)
                  }
                  placeholder="e.g. john@google.com"
                />
              </div>
              <div>
                <Label>Contact's Position</Label>
                <Input
                  value={form_data.contact_position}
                  onChange={(e) =>
                    handle_change("contact_position", e.target.value)
                  }
                  placeholder="e.g. CTO/CEO"
                />
              </div>
            </div>
          </div>

          {/* Profile Customization */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Profile Customization
            </h3>

            <div className="text-center">
              <div className="text-center">
                <Label className="block mb-4">
                  Are you willing to accept interns outside DLSU?
                </Label>
                <div className="flex justify-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={form_data.accept_outside_dlsu === true}
                      onCheckedChange={() =>
                        handle_change("accept_outside_dlsu", true)
                      }
                    />
                    <Label>Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={form_data.accept_outside_dlsu === false}
                      onCheckedChange={() =>
                        handle_change("accept_outside_dlsu", false)
                      }
                    />
                    <Label>No</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Label className="block mb-4">
                Do you have an ongoing MOA with DLSU?
              </Label>
              <div className="flex justify-center gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={form_data.has_moa_with_dlsu === true}
                    onCheckedChange={() =>
                      handle_change("has_moa_with_dlsu", true)
                    }
                  />
                  <Label>Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={form_data.has_moa_with_dlsu === false}
                    onCheckedChange={() =>
                      handle_change("has_moa_with_dlsu", false)
                    }
                  />
                  <Label>No</Label>
                </div>
              </div>
            </div>

            {form_data.has_moa_with_dlsu && (
              <div className="space-y-4">
                <Label className="block text-center">
                  MOA Start & End Date
                </Label>
                <div className="flex justify-center gap-4">
                  <EditableDatePicker
                    is_editing={true}
                    value={new Date(form_data.moa_start_date)}
                    setter={(value) => handle_change("moa_start_date", value)}
                  ></EditableDatePicker>
                </div>
                <div className="flex justify-center gap-4">
                  <EditableDatePicker
                    is_editing={true}
                    value={new Date(form_data.moa_expires_at)}
                    setter={(value) => handle_change("moa_expires_at", value)}
                  ></EditableDatePicker>{" "}
                </div>
              </div>
            )}

            <div className="mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="accept-terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) =>
                      setAcceptTerms(checked as boolean)
                    }
                    className="mt-1"
                  />
                  <label
                    htmlFor="accept-terms"
                    className="text-sm text-gray-700 leading-relaxed cursor-pointer flex-1"
                  >
                    I have read and agree to the{" "}
                    <a
                      href="/TermsConditions.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/PrivacyPolicy.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-3 pb-10">
              <Button
                type="button"
                disabled={loading}
                className="w-full max-w-md h-12 bg-black hover:bg-gray-800 text-white"
                onClick={() => handle_submit()}
              >
                {!loading ? "Register" : "Registering..."}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

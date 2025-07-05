"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";
import {
  GroupableRadioDropdown,
  DropdownGroup,
} from "@/components/ui/dropdown";
import { useRefs } from "@/lib/db/use-refs";
import { useAuthContext } from "../authctx";
import { MultipartFormBuilder } from "@/lib/multipart-form";
import { EditableDatePicker } from "@/components/ui/editable";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
    accept_outside_dlsu: true,
    has_moa_with_dlsu: false,
    moa_start_date: new Date().getTime(),
    moa_expires_at: new Date().getTime(),
    terms_accepted: false,
  });

  const { industries, universities } = useRefs();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Simple validation functions
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) =>
    /^09\d{9}$/.test(phone.replace(/\D/g, ""));
  const isValidUrl = (url: string) => {
    if (!url.trim()) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Get validation errors for display
  const getValidationErrors = () => {
    const errors = [];

    if (!form_data.doing_business_as?.trim()) errors.push("Company name (DBA)");
    if (!form_data.legal_entity_name?.trim()) errors.push("Legal entity name");
    if (!form_data.industry || form_data.industry === "Not Selected")
      errors.push("Industry");
    if (!form_data.office_location?.trim()) errors.push("Office location");
    if (
      !form_data.company_description?.trim() ||
      form_data.company_description.trim().length < 10
    ) {
      errors.push("Company description (min 10 characters)");
    }
    if (!form_data.contact_name?.trim()) errors.push("Contact name");
    if (
      !form_data.contact_phone?.trim() ||
      !isValidPhone(form_data.contact_phone)
    ) {
      errors.push("Valid phone number (09XXXXXXXXX)");
    }
    if (
      !form_data.contact_email?.trim() ||
      !isValidEmail(form_data.contact_email)
    ) {
      errors.push("Valid email address");
    }
    if (!form_data.contact_position?.trim()) errors.push("Contact position");
    if (!form_data.website?.trim() || !isValidUrl(form_data.website.trim())) {
      errors.push("Valid website URL");
    }
    if (!acceptTerms) errors.push("Accept terms and conditions");

    return errors;
  };

  // Get field-specific error status for styling
  const getFieldErrors = () => {
    return {
      doing_business_as: !form_data.doing_business_as?.trim(),
      legal_entity_name: !form_data.legal_entity_name?.trim(),
      industry: !form_data.industry || form_data.industry === "Not Selected",
      office_location: !form_data.office_location?.trim(),
      company_description:
        !form_data.company_description?.trim() ||
        form_data.company_description.trim().length < 10,
      contact_name: !form_data.contact_name?.trim(),
      contact_phone:
        !form_data.contact_phone?.trim() ||
        !isValidPhone(form_data.contact_phone),
      contact_email:
        !form_data.contact_email?.trim() ||
        !isValidEmail(form_data.contact_email),
      contact_position: !form_data.contact_position?.trim(),
      website: form_data.website?.trim() && !isValidUrl(form_data.website),
    };
  };

  const fieldErrors =
    validationErrors.length > 0
      ? getFieldErrors()
      : {
          doing_business_as: false,
          legal_entity_name: false,
          industry: false,
          office_location: false,
          company_description: false,
          contact_name: false,
          contact_phone: false,
          contact_email: false,
          contact_position: false,
          website: false,
        };

  const handle_change = (field: string, value: any) => {
    setFormData({ ...form_data, [field]: value });
  };

  const handle_submit = async () => {
    // Check validation on submit
    const errors = getValidationErrors();
    setValidationErrors(errors);

    if (errors.length > 0) return;

    try {
      setLoading(true);

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
          .join(",")}]`,
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

      // @ts-ignore
      const response = await register(multipart_form.build());
      // @ts-ignore
      if (response && response.success) {
        alert("Email has been sent with password!");
        router.push("/login");
      } else {
        alert("Registration failed. Please check your inputs and try again.");
      }
    } catch (err: any) {
      alert(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
          {/* Missing Fields Error Card */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-red-800 mb-2">
                    Please complete the following:
                  </h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          {/* General Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              General Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>
                  Doing Business As <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form_data.doing_business_as}
                  onChange={(e) =>
                    handle_change("doing_business_as", e.target.value)
                  }
                  placeholder="e.g. Google"
                  maxLength={100}
                  className={cn(
                    "text-sm",
                    fieldErrors.doing_business_as ? "border-red-500" : ""
                  )}
                  disabled={loading}
                />
              </div>
              <div>
                <Label>
                  Legal Entity Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form_data.legal_entity_name}
                  onChange={(e) =>
                    handle_change("legal_entity_name", e.target.value)
                  }
                  placeholder="e.g. Google inc."
                  maxLength={100}
                  className={cn(
                    "text-sm",
                    fieldErrors.legal_entity_name ? "border-red-500" : ""
                  )}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>
                  Industry <span className="text-red-500">*</span>
                </Label>
                <DropdownGroup>
                  <GroupableRadioDropdown
                    name="industry"
                    options={industries}
                    onChange={(selected_id) =>
                      handle_change("industry", selected_id)
                    }
                  />
                </DropdownGroup>
              </div>
              <div>
                <Label>
                  Office's General Location{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form_data.office_location}
                  onChange={(e) =>
                    handle_change("office_location", e.target.value)
                  }
                  placeholder="e.g. Makati, Manila"
                  maxLength={100}
                  className={cn(
                    "text-sm",
                    fieldErrors.office_location ? "border-red-500" : ""
                  )}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full">
                <Label className="block mb-2">
                  Website <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form_data.website}
                  onChange={(e) => handle_change("website", e.target.value)}
                  placeholder="e.g. https://google.com"
                  className={cn(
                    "text-sm",
                    fieldErrors.website ? "border-red-500" : ""
                  )}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label>
                Company Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={form_data.company_description}
                onChange={(e) =>
                  handle_change("company_description", e.target.value)
                }
                placeholder="Write about your company..."
                className={`min-h-[120px] ${
                  fieldErrors.company_description ? "border-red-500" : ""
                }`}
                maxLength={1000}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                {form_data.company_description.length}/1000 characters
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Contact Information
            </h3>

            <div className="w-max-prose text-sm text-gray-700 border border-gray-200 p-4 rounded-sm">
              <span className="text-yellow-400">*</span>
              Your account will be created using the email address you provide
              below. We will provide the Login details to the same email created
              with the account.{" "}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>
                  Company Contact Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form_data.contact_name}
                  onChange={(e) =>
                    handle_change("contact_name", e.target.value)
                  }
                  placeholder="e.g. John Doe"
                  maxLength={50}
                  className={cn(
                    "text-sm",
                    fieldErrors.contact_name ? "border-red-500" : ""
                  )}
                  disabled={loading}
                />
              </div>
              <div>
                <Label>
                  Contact's Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form_data.contact_phone}
                  onChange={(e) =>
                    handle_change("contact_phone", e.target.value)
                  }
                  placeholder="e.g. 09XXXXXXXXX"
                  maxLength={11}
                  className={cn(
                    "text-sm",
                    fieldErrors.contact_phone ? "border-red-500" : ""
                  )}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>
                  Contact's Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form_data.contact_email}
                  onChange={(e) =>
                    handle_change("contact_email", e.target.value)
                  }
                  placeholder="e.g. john@google.com"
                  type="email"
                  className={cn(
                    "text-sm",
                    fieldErrors.contact_email ? "border-red-500" : ""
                  )}
                  disabled={loading}
                />
              </div>
              <div>
                <Label>
                  Contact's Position <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form_data.contact_position}
                  onChange={(e) =>
                    handle_change("contact_position", e.target.value)
                  }
                  placeholder="e.g. CTO/CEO"
                  maxLength={50}
                  className={cn(
                    "text-sm",
                    fieldErrors.contact_position ? "border-red-500" : ""
                  )}
                  disabled={loading}
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
                className="w-full max-w-md h-12 bg-black hover:bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handle_submit()}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

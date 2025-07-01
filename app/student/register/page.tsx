"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Award, AlertCircle } from "lucide-react";
import { useAuthContext } from "../../../lib/ctx-auth";
import { useRefs } from "@/lib/db/use-refs";
import { PublicUser, University } from "@/lib/db/db.types";
import {
  DropdownGroup,
  GroupableRadioDropdown,
} from "@/components/ui/dropdown";
import { useFormData } from "@/lib/form-data";
import { MultipartFormBuilder } from "@/lib/multipart-form";

export default function RegisterPage() {
  const defaultYearLevel = "Select Year Level";
  const defaultCollege = "Select College";
  const validFieldClassName = "border-green-600 border-opacity-50";
  const {
    levels,
    colleges,
    universities,
    get_level_by_name,
    get_college_by_name,
    get_university_by_domain,
  } = useRefs();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [takingForCredit, setTakingForCredit] = useState(false);
  const { form_data, set_fields, set_field, field_setter } = useFormData<
    PublicUser & {
      college_name: string;
      year_level_name: string;
    }
  >();
  const { register, redirect_if_logged_in } = useAuthContext();
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState<University>();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    phone_number?: string;
    linkage_officer?: string;
  }>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeInputRef = useRef<HTMLInputElement>(null);

  redirect_if_logged_in();

  // Validation functions - reusing patterns from profile page
  const isValidName = (name: string): boolean => {
    if (!name || name.trim() === "") return false;
    return (
      name.trim().length >= 2 &&
      name.trim().length <= 32 &&
      /^[a-zA-Z\s.-]+$/.test(name.trim())
    );
  };

  const isValidPhoneNumber = (phone: string): boolean => {
    if (!phone || phone.trim() === "") return false;
    const cleanPhone = phone.replace(/\D/g, ""); // Remove non-digits
    return cleanPhone.length === 11 && /^09\d{9}$/.test(cleanPhone); // Philippine format: 09XXXXXXXXX
  };

  const isValidLinkageOfficer = (name: string): boolean => {
    if (!name || name.trim() === "") return false;
    return name.trim().length <= 40 && /^[a-zA-Z\s.-]+$/.test(name.trim());
  };

  // Validation function
  const validateFields = () => {
    const errors: typeof validationErrors = {};

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
    if (
      !form_data.phone_number ||
      !isValidPhoneNumber(form_data.phone_number)
    ) {
      errors.phone_number = !form_data.phone_number?.trim()
        ? "Phone number is required"
        : "Phone number must be 11 digits in Philippine format (09XXXXXXXXX)";
    }

    // Linkage officer validation (only if taking for credit)
    if (
      takingForCredit &&
      (!form_data.linkage_officer ||
        !isValidLinkageOfficer(form_data.linkage_officer))
    ) {
      errors.linkage_officer = !form_data.linkage_officer?.trim()
        ? "Linkage officer is required when taking for credit"
        : form_data.linkage_officer.trim().length > 40
        ? "Linkage officer name must be 40 characters or less"
        : "Linkage officer name must contain only letters, spaces, dots, and hyphens";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Initialize form fields with default values
  useEffect(() => {
    if (form_data.taking_for_credit === undefined) {
      set_field("taking_for_credit", false);
    }
  }, [form_data.taking_for_credit, set_field]);

  // Pre-fill email if coming from login redirect
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (!emailParam) return router.push("/login");
    setEmail(emailParam);
    if (!universities.length) return;

    const domain = emailParam.split("@")[1];
    const uni = get_university_by_domain(domain);
    if (!uni) return router.push("/login");
    setUniversity(uni);
  }, [searchParams, universities, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const domain = email.split("@")[1];

    // Clear previous errors
    setError("");
    setValidationErrors({});

    // Run validation only on submit
    const isValid = validateFields();

    // Check for missing required fields
    const missingFields = [];
    if (!form_data.first_name?.trim()) missingFields.push("First Name");
    if (!form_data.last_name?.trim()) missingFields.push("Last Name");
    if (!form_data.phone_number?.trim()) missingFields.push("Phone Number");
    if (
      !form_data.year_level_name ||
      form_data.year_level_name === defaultYearLevel
    )
      missingFields.push("Year Level");
    if (!form_data.college_name || form_data.college_name === defaultCollege)
      missingFields.push("College");
    if (takingForCredit && !form_data.linkage_officer?.trim())
      missingFields.push("Linkage Officer");

    // Show specific missing fields error
    if (missingFields.length > 0) {
      setError(
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      return;
    }

    // Show validation errors if any
    if (!isValid) {
      setError("Please fix the validation errors above before continuing");
      return;
    }

    if (!acceptTerms) {
      setError(
        "Please accept the Terms & Conditions and Privacy Policy to continue"
      );
      return;
    }

    if (!get_university_by_domain(domain)) {
      setError("Please use your university email address (e.g. @dlsu.edu.ph)");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const new_user = {
        ...form_data,
        email: email,
        year_level: get_level_by_name(form_data.year_level_name)?.id,
        college: get_college_by_name(form_data.college_name)?.id,
      };

      // User form
      const multipart_form = MultipartFormBuilder.new();
      multipart_form.from(new_user);
      multipart_form.add_file("resume", resumeFile);

      // @ts-ignore
      await register(multipart_form.build())
        .then((r) => {
          if (r && r.success) router.push("/verify");
          else setError("Ensure that your inputs are correct.");
        })
        .catch((e) =>
          setError(e.message || "Registration failed. Please try again.")
        );
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) return <></>;
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Let's Create your Profile
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>, Middle Name,
                Last Name <span className="text-red-500">*</span>
              </label>
              {(validationErrors.first_name ||
                validationErrors.middle_name ||
                validationErrors.last_name) && (
                <div className="mb-2">
                  {validationErrors.first_name && (
                    <div className="flex items-center gap-1 text-red-600 text-xs mb-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{validationErrors.first_name}</span>
                    </div>
                  )}
                  {validationErrors.middle_name && (
                    <div className="flex items-center gap-1 text-red-600 text-xs mb-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{validationErrors.middle_name}</span>
                    </div>
                  )}
                  {validationErrors.last_name && (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      <span>{validationErrors.last_name}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="w-full flex flex-row space-x-2">
                <Input
                  type="text"
                  value={form_data.first_name ?? undefined}
                  onChange={(e) => set_field("first_name", e.target.value)}
                  placeholder="First Name..."
                  maxLength={32}
                  className={
                    (form_data.first_name === ""
                      ? "border-gray-300"
                      : validFieldClassName) +
                    " w-full h-12 px-4 input-box hover:cursor-text focus:ring-0"
                  }
                  disabled={loading}
                  required
                />
                <Input
                  type="text"
                  value={form_data.middle_name ?? undefined}
                  onChange={(e) => set_field("middle_name", e.target.value)}
                  placeholder="Middle Name..."
                  maxLength={32}
                  className={
                    (form_data.middle_name === ""
                      ? "border-gray-300"
                      : validFieldClassName) +
                    " w-full h-12 px-4 input-box hover:cursor-text focus:ring-0"
                  }
                  disabled={loading}
                />
                <Input
                  type="text"
                  value={form_data.last_name ?? undefined}
                  onChange={(e) => set_field("last_name", e.target.value)}
                  placeholder="Last Name..."
                  maxLength={32}
                  className={
                    (form_data.last_name === ""
                      ? "border-gray-300"
                      : validFieldClassName) +
                    " w-full h-12 px-4 input-box hover:cursor-text focus:ring-0"
                  }
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              {validationErrors.phone_number && (
                <div className="flex items-center gap-1 text-red-600 text-xs mb-2">
                  <AlertCircle className="h-3 w-3" />
                  <span>{validationErrors.phone_number}</span>
                </div>
              )}
              <Input
                type="tel"
                value={form_data.phone_number ?? ""}
                onChange={(e) => set_field("phone_number", e.target.value)}
                placeholder="Enter Phone Number"
                maxLength={11}
                className={
                  (form_data.phone_number === ""
                    ? "border-gray-300"
                    : validFieldClassName) +
                  " w-full h-12 px-4 input-box hover:cursor-text focus:ring-0"
                }
                disabled={loading}
                required
              />
            </div>

            <DropdownGroup>
              {/* College */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College <span className="text-red-500">*</span>
                </label>
                <GroupableRadioDropdown
                  name="college"
                  default_value={defaultCollege}
                  options={colleges
                    .filter((c) => c.university_id === university?.id)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((college) => college.name)}
                  on_change={(value) => set_field("college_name", value)}
                ></GroupableRadioDropdown>
              </div>

              {/* School Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Level <span className="text-red-500">*</span>
                </label>
                <GroupableRadioDropdown
                  name="yearLevel"
                  default_value={defaultYearLevel}
                  options={levels
                    .sort(
                      (a, b) =>
                        a.order - b.order || a.name.localeCompare(b.name)
                    )
                    .map((level) => level.name)}
                  on_change={(value) => set_field("year_level_name", value)}
                ></GroupableRadioDropdown>
              </div>
            </DropdownGroup>

            {/* Portfolio Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Link{" "}
                <span className="text-gray-500 italic">(Optional)</span>
              </label>
              <Input
                type="url"
                value={form_data.portfolio_link ?? ""}
                onChange={(e) => set_field("portfolio_link", e.target.value)}
                placeholder="Enter Portfolio Link"
                className={
                  (form_data.portfolio_link === ""
                    ? "border-gray-300"
                    : validFieldClassName) +
                  " w-full h-12 px-4 input-box hover:cursor-text focus:ring-0"
                }
                disabled={loading}
              />
            </div>

            {/* LinkedIn Profile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile{" "}
                <span className="text-gray-500 italic">(Optional)</span>
              </label>
              <Input
                type="url"
                value={form_data.linkedin_link ?? ""}
                onChange={(e) => set_field("linkedin_link", e.target.value)}
                placeholder="Enter LinkedIn Profile Link"
                className={
                  (form_data.linkedin_link === ""
                    ? "border-gray-300"
                    : validFieldClassName) +
                  " w-full h-12 px-4 text-gray-900 input-box hover:cursor-text focus:ring-0"
                }
                disabled={loading}
              />
            </div>

            {/* Github Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Github Link{" "}
                <span className="text-gray-500 italic">(Optional)</span>
              </label>
              <Input
                type="url"
                value={form_data.github_link ?? ""}
                onChange={(e) => set_field("github_link", e.target.value)}
                placeholder="Enter Github Link"
                className={
                  (form_data.github_link === ""
                    ? "border-gray-300"
                    : validFieldClassName) +
                  " w-full h-12 px-4 input-box hover:cursor-text focus:ring-0"
                }
                disabled={loading}
              />
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume <span className="text-gray-500 italic">(Optional)</span>
              </label>
              <input
                type="file"
                ref={resumeInputRef}
                onChange={(r) =>
                  setResumeFile((r.target?.files ?? [])[0] ?? null)
                }
                accept=".pdf,.doc,.docx"
                disabled={loading}
                style={{ display: "none" }}
              />
              <div
                onClick={() => resumeInputRef.current?.click()}
                className={
                  (!resumeFile || !resumeFile.name
                    ? "border-gray-300"
                    : validFieldClassName) +
                  " w-full h-12 px-4 input-box flex items-center justify-between"
                }
              >
                <span
                  className={
                    resumeFile
                      ? " line-clamp-1 text-gray-900 text-ellipsis"
                      : "line-clamp-1 text-gray-500 text-ellipsis"
                  }
                >
                  {resumeFile ? resumeFile.name : "Upload File Here"}
                </span>
                <Upload className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Taking for Credit */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Academic Credit
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="academic-credit-checkbox"
                  checked={takingForCredit}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    setTakingForCredit(newValue);
                    set_field("taking_for_credit", newValue);
                    // Clear linkage officer if unchecked
                    if (!newValue) {
                      set_field("linkage_officer", "");
                    }
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />

                <label
                  htmlFor="academic-credit-checkbox"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700 font-medium">
                    I am taking this internship for academic credit
                  </span>
                </label>
              </div>
            </div>

            {/* Linkage Officer - Conditional */}
            {takingForCredit && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Linkage Officer
                </label>
                {validationErrors.linkage_officer && (
                  <div className="flex items-center gap-1 text-red-600 text-xs mb-2">
                    <AlertCircle className="h-3 w-3" />
                    <span>{validationErrors.linkage_officer}</span>
                  </div>
                )}
                <Input
                  type="text"
                  value={form_data.linkage_officer ?? ""}
                  onChange={(e) => set_field("linkage_officer", e.target.value)}
                  placeholder="Enter your linkage officer's name"
                  maxLength={40}
                  className={
                    (form_data.linkage_officer === ""
                      ? "border-gray-300"
                      : validFieldClassName) +
                    " w-full h-12 px-4 text-gray-900 border border-opacity-80 placeholder-gray-500 rounded-lg focus:border-gray-900 focus:ring-0"
                  }
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Please provide the name of your assigned linkage officer from
                  your college.
                </p>
              </div>
            )}
          </div>

          {/* Terms & Conditions Acceptance */}
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

          {/* Continue Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={loading || !acceptTerms}
              className="w-80 h-12 bg-black hover:bg-gray-800 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Profile..." : "Continue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

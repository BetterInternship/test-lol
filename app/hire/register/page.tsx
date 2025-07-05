"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useRefs } from "@/lib/db/use-refs";
import { useAuthContext } from "../authctx";
import { MultipartFormBuilder } from "@/lib/multipart-form";
import { useRouter } from "next/navigation";
import { cn, isValidEmail, isValidPHNumber } from "@/lib/utils";
import { isValidRequiredURL, toURL } from "@/lib/utils/url-utils";
import { Employer, MoA } from "@/lib/db/db.types";
import {
  createEditForm,
  FormCheckbox,
  FormDatePicker,
  FormDropdown,
  FormInput,
} from "@/components/EditForm";
import { Card } from "@/components/ui/our-card";
import { ErrorLabel } from "@/components/ui/labels";
import { useAppContext } from "@/lib/ctx-app";
import { StoryBook } from "@/components/ui/storybook";
import { Button } from "@/components/ui/button";

const [EmployerRegisterForm, useEmployerRegisterForm] =
  createEditForm<Employer>();

export default function RegisterPage() {
  const { register } = useAuthContext();
  const router = useRouter();
  const profileRegisterRef = useRef<{ register: () => Promise<void> }>(null);

  return (
    <div className="flex-1 flex justify-center px-6 py-12 pt-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-heading font-bold text-gray-900 mb-4">
            Employer Registration
          </h2>
        </div>

        <EmployerRegisterForm data={{}}>
          <EmployerEditor registerProfile={register} ref={profileRegisterRef} />
        </EmployerRegisterForm>
      </div>
    </div>
  );
}

const EmployerEditor = forwardRef<
  { register: () => Promise<void> },
  {
    registerProfile: (newProfile: Partial<Employer>) => void;
  }
>(({ registerProfile }, ref) => {
  const {
    formData,
    formErrors,
    setField,
    fieldSetter,
    addValidator,
    validateFormData,
    cleanFormData,
  } = useEmployerRegisterForm();
  interface AdditionalFields {
    has_moa_with_dlsu: boolean;
    moa_start_date: number;
    moa_expires_at: number;
    terms_accepted: boolean;
  }
  const { industries, universities } = useRefs();
  const [additionalFields, setAdditionalFields] = useState<AdditionalFields>(
    {} as AdditionalFields
  );

  // Provide an external link to save profile
  useImperativeHandle(ref, () => ({
    register: async () => {
      const newProfile = {
        ...cleanFormData(),
        website: toURL(formData.website)?.toString(),
        accepts_non_university: formData.accepts_non_university ?? true, // default to true
        accepted_universities: `[${universities
          .map((u) => `"${u.id}"`)
          .join(",")}]`,
        ...additionalFields,
      };
      // @ts-ignore
      await registerProfile(newProfile);
      return;
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
      "name",
      (name: string) => name.length < 3 && `Company Name is not valid.`
    );
    addValidator(
      "industry",
      (industry: string) => !industry && `Industry is required.`
    );
    addValidator(
      "description",
      (description: string) =>
        description.length < 10 && `Description is too short.`
    );
    addValidator(
      "legal_entity_name",
      (name: string) => name.length < 3 && `Legal Entity Name is not valid.`
    );
    addValidator(
      "website",
      (link: string) => !isValidRequiredURL(link) && "Invalid website link."
    );
  }, []);

  return (
    <>
      <StoryBook>
        <Card>
          <div className="text-2xl tracking-tight font-bold text-gray-700 mb-4">
            General Information
            <div className="text-lg opacity-50 font-normal">Step 1 of 3</div>
          </div>
          <div className="flex flex-col space-y-1 mb-2">
            <ErrorLabel value={formErrors.name} />
            <ErrorLabel value={formErrors.legal_entity_name} />
          </div>
          <div className="mb-4 flex flex-col space-y-3">
            <FormInput
              label="Doing Business As"
              value={formData.name ?? ""}
              setter={fieldSetter("name")}
              maxLength={100}
            />
            <FormInput
              label="Legal Entity Name"
              value={formData.legal_entity_name ?? ""}
              setter={fieldSetter("legal_entity_name")}
              maxLength={100}
            />
            <FormInput
              label="General Office Location"
              value={formData.location ?? ""}
              setter={fieldSetter("location")}
              maxLength={100}
            />
            <FormInput
              label="Website"
              value={formData.website ?? ""}
              setter={fieldSetter("website")}
              maxLength={100}
            />
            <FormDropdown
              label="Industry"
              options={industries}
              value={formData.industry ?? ""}
              setter={fieldSetter("industry")}
            />
          </div>
          <label className="text-xs text-gray-400 italic mb-1 block">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Let students know what you're all about..."
            className="w-full border border-gray-200 rounded-[0.25em] p-3 px-5 text-sm min-h-24 resize-none focus:border-opacity-70 focus:ring-transparent"
            maxLength={750}
          />
          <p className="text-xs text-muted-foreground text-right">
            {(formData.description || "").length}/750 characters
          </p>
        </Card>
        <Card>
          <div className="text-2xl tracking-tight font-bold text-gray-700 mb-4">
            Contact Person Information
            <div className="text-lg opacity-50 font-normal">Step 2 of 3</div>
          </div>
          <div className="flex flex-col space-y-1 mb-2">
            <ErrorLabel value={formErrors.phone_number} />
            <ErrorLabel value={formErrors.email} />
          </div>
          <div className="mb-4 flex flex-col space-y-3">
            <FormInput
              label="Phone Number"
              value={formData.phone_number ?? ""}
              setter={fieldSetter("phone_number")}
            />
            <FormInput
              label="Email"
              value={formData.email ?? ""}
              setter={fieldSetter("email")}
            />
          </div>
          <Card className="border-warning p-4">
            <p className="font-normal opacity-80 text-sm italic text-warning">
              This person will be emailed the login details to this account upon
              registration. Other accounts can be added later on if multiple
              people plan to manage this employer account.
            </p>
          </Card>
        </Card>
        <Card>
          <div className="text-2xl tracking-tight font-bold text-gray-700 mb-4">
            Profile Agreements
            <div className="text-lg opacity-50 font-normal">Step 3 of 3</div>
          </div>
          <div className="flex flex-col space-y-1 mb-2">
            <ErrorLabel value={formErrors.accepts_non_university} />
            <ErrorLabel value={formErrors.email} />
          </div>
          <div className="mb-4 flex flex-col space-y-3">
            <Card className="p-3">
              <div className="flex flex-row items-center justify-start">
                <FormCheckbox
                  checked={formData.accepts_non_university ?? true}
                  setter={fieldSetter("accepts_non_university")}
                />
                <div className="text-sm text-gray-500 ml-3">
                  Accept Non-University Interns?
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex flex-row items-center justify-start">
                <FormCheckbox
                  checked={additionalFields.has_moa_with_dlsu}
                  setter={(checked) =>
                    setAdditionalFields({
                      ...additionalFields,
                      has_moa_with_dlsu: checked,
                    })
                  }
                />
                <div className="text-sm text-gray-500 ml-3">
                  Ongoing MOA with DLSU?
                </div>
              </div>
              {additionalFields.has_moa_with_dlsu && (
                <div className="flex flex-row space-x-2 mt-4">
                  <FormDatePicker
                    label={"MOA Start Date"}
                    date={additionalFields.moa_start_date}
                    setter={(date) =>
                      setAdditionalFields({
                        ...additionalFields,
                        moa_start_date: date,
                      })
                    }
                  />
                  <FormDatePicker
                    label={"MOA Expiry Date"}
                    date={additionalFields.moa_expires_at}
                    setter={(date) =>
                      setAdditionalFields({
                        ...additionalFields,
                        moa_expires_at: date,
                      })
                    }
                  />
                </div>
              )}
            </Card>

            <Card className="p-3">
              <div className="flex items-start gap-3">
                <FormCheckbox
                  id="accept-terms"
                  checked={additionalFields.terms_accepted}
                  setter={(checked) =>
                    setAdditionalFields({
                      ...additionalFields,
                      terms_accepted: checked,
                    })
                  }
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
            </Card>
            <Button className="w-full h-12 bg-black hover:bg-gray-800 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
              Register
            </Button>
          </div>
        </Card>
      </StoryBook>
      <br />
      <br />
    </>
  );
});

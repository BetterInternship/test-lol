import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, FileEdit } from "lucide-react";
import { Job } from "@/lib/db/db.types";
import { useRefs } from "@/lib/db/use-refs";
import { MDXEditor } from "@/components/MDXEditor";
import { useFormData } from "@/lib/form-data";
import {
  DropdownGroup,
  GroupableRadioDropdown,
} from "@/components/ui/dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CreateJobModalFormProps {
  createJob: (job: Partial<Job>) => Promise<any>;
  close: () => void;
}

export function ListingsCreateJobModal({
  createJob,
  close,
}: CreateJobModalFormProps) {
  const [creating, setCreating] = useState(false);
  const {
    formData: form_data,
    setField: set_field,
    setFields: setFields,
    fieldSetter: field_setter,
  } = useFormData<Job>();
  const { job_types, job_modes, job_pay_freq, job_allowances } = useRefs();

  const handleSaveEdit = async () => {
    const job: Partial<Job> = {
      id: form_data.id,
      title: form_data.title,
      description: form_data.description ?? "",
      requirements: form_data.requirements ?? "",
      location: form_data.location ?? "",
      allowance: form_data.allowance,
      mode: form_data.mode,
      type: form_data.type,
      salary: form_data.allowance === 0 ? form_data.salary : null,
      salary_freq: form_data.allowance === 0 ? form_data.salary_freq : null,
      require_github: form_data.require_github,
      require_portfolio: form_data.require_portfolio,
      require_cover_letter: form_data.require_cover_letter,
      is_unlisted: form_data.is_unlisted,
      start_date: form_data.start_date,
      end_date: form_data.end_date,
      is_year_round: form_data.is_year_round,
    };

    console.log(job);
    setCreating(true);
    try {
      const response = await createJob(job);
      if (!response?.success) {
        alert("Could not create job");
        setCreating(false);
        return;
      }
      setCreating(false);
      close(); // Ensure modal closes after successful creation
    } catch (error) {
      setCreating(false);
      alert("Error creating job");
    }
  };

  return (
    <>
      {/* Header with improved styling */}
      <div className="px-6 py-5 border-b border-gray-200 bg-white">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {form_data.title || "Untitled Job"}
              </h2>
              <p className="text-sm text-gray-500">Create a new job listing</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => close()}
                className="px-4 py-2 text-sm font-medium"
                disabled={creating}
              >
                Cancel
              </Button>
              <Button disabled={creating} onClick={handleSaveEdit}>
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  "Publish Listing"
                )}
              </Button>
            </div>
          </div>
          <div>
            <Input
              value={form_data.title || ""}
              onChange={(e) => set_field("title", e.target.value)}
              className="text-lg font-medium h-12"
              placeholder="Enter job title here..."
              maxLength={30}
            />
            <p className="text-xs text-gray-500 text-right mt-1">
              {(form_data.title || "").length}/30 characters
            </p>
          </div>
        </div>
      </div>

      {/* Main Content with improved layout */}
      <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)] bg-gray-50">
        <div className="max-w-[1024px] mx-auto space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={form_data.location ?? ""}
                  onChange={(e) => set_field("location", e.target.value)}
                  placeholder="Enter location"
                  className="text-sm"
                />
              </div>

              <DropdownGroup>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Work Load <span className="text-destructive">*</span>
                  </Label>
                  <GroupableRadioDropdown
                    name="type"
                    defaultValue={form_data.type}
                    options={job_types}
                    onChange={field_setter("type")}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Work Mode <span className="text-destructive">*</span>
                  </Label>
                  <GroupableRadioDropdown
                    name="mode"
                    defaultValue={form_data.mode}
                    options={job_modes}
                    onChange={field_setter("mode")}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Compensations <span className="text-destructive">*</span>
                  </Label>
                  <GroupableRadioDropdown
                    name="allowance"
                    defaultValue={form_data.allowance}
                    options={job_allowances.reverse()}
                    onChange={field_setter("allowance")}
                  />
                </div>

                {form_data.allowance === 0 && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Salary <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={form_data.salary ?? ""}
                        onChange={(e) => set_field("salary", e.target.value)}
                        placeholder="Enter salary amount"
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Pay Frequency{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <GroupableRadioDropdown
                        name="pay_freq"
                        defaultValue={form_data.salary_freq}
                        options={job_pay_freq}
                        onChange={field_setter("salary_freq")}
                      />
                    </div>
                  </>
                )}
              </DropdownGroup>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Mark as Unlisted
                </Label>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Unlisted Job
                    </p>
                    <p className="text-xs text-gray-500">
                      Only visible to applicants with the link
                    </p>
                  </div>
                  <Checkbox
                    checked={form_data.is_unlisted ?? false}
                    onCheckedChange={(value) => set_field("is_unlisted", value)}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Duration <span className="text-destructive">*</span>
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={form_data.is_year_round ?? false}
                      onCheckedChange={(value) => {
                        setFields({
                          is_year_round: !!value,
                        });
                      }}
                    />
                    <span className="text-sm font-medium">Year Round</span>
                  </div>
                  {!form_data.is_year_round && (
                    <div className="flex flex-col gap-4">
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-600 mb-1 block">
                          Start Date
                        </label>
                        <DatePicker
                          id="start-date"
                          selected={
                            form_data.start_date
                              ? new Date(form_data.start_date)
                              : new Date()
                          }
                          className="input-box text-sm"
                          onChange={(date) =>
                            set_field("start_date", date?.getTime())
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-600 mb-1 block">
                          End Date
                        </label>
                        <DatePicker
                          id="end-date"
                          selected={
                            form_data.end_date
                              ? new Date(form_data.end_date)
                              : new Date()
                          }
                          className="input-box text-sm"
                          onChange={(date) =>
                            set_field("end_date", date?.getTime())
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Requirements Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
              <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Checkbox className="w-4 h-4 text-green-600" />
              </div>
              Application Requirements
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div>
                  <Label className="text-sm font-medium text-gray-900">
                    GitHub Repository
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Require GitHub link
                  </p>
                </div>
                <Checkbox
                  checked={form_data.require_github ?? false}
                  onCheckedChange={(value) => {
                    set_field("require_github", value);
                  }}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div>
                  <Label className="text-sm font-medium text-gray-900">
                    Portfolio
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Require portfolio link
                  </p>
                </div>
                <Checkbox
                  checked={form_data.require_portfolio ?? false}
                  onCheckedChange={(value) => {
                    set_field("require_portfolio", value);
                  }}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div>
                  <Label className="text-sm font-medium text-gray-900">
                    Cover Letter
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Require cover letter
                  </p>
                </div>
                <Checkbox
                  checked={form_data.require_cover_letter ?? false}
                  onCheckedChange={(value) => {
                    set_field("require_cover_letter", value);
                  }}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Content Editors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <FileEdit className="w-4 h-4 text-purple-600" />
                </div>
                Job Description
              </h3>
              <div className="relative">
                <MDXEditor
                  className="min-h-[250px] border border-gray-200 rounded-lg overflow-y-auto"
                  markdown={form_data.description ?? ""}
                  onChange={(value) => set_field("description", value)}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 pb-16">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 text-orange-600" />
                </div>
                Requirements
              </h3>
              <div className="relative">
                <MDXEditor
                  className="min-h-[250px] w-full border border-gray-200 rounded-lg overflow-y-auto"
                  markdown={form_data.requirements ?? ""}
                  onChange={(value) => set_field("requirements", value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

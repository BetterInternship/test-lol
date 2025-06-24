"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/lib/ctx-auth";
import { MultipartFormBuilder } from "@/lib/multipart-form";

export default function LoginPage() {
  const { email_status, register, redirect_if_logged_in } = useAuthContext();
  const [email, setEmail] = useState("");
  const [new_account, set_new_account] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  redirect_if_logged_in();

  // Check if user just registered
  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "pending" && error.trim() === "") {
      setShowVerificationMessage(true);
    }
  }, [searchParams, error]);

  const validateDLSUEmail = (email: string): boolean => {
    const dlsuDomains = [
      "@dlsu.edu.ph",
      "@students.dlsu.edu.ph",
      "@staff.dlsu.edu.ph",
      "@faculty.dlsu.edu.ph",
    ];
    return dlsuDomains.some((domain) => email.toLowerCase().endsWith(domain));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateDLSUEmail(email)) {
      setError(
        "Please use your DLSU email address (@dlsu.edu.ph, @students.dlsu.edu.ph, etc.)"
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Production flow with OTP
      await email_status(email).then((response) => {
        if (!response?.existing_user) {
          set_new_account(true);
          setLoading(false);
        } else if (!response.verified_user) {
          router.push(`/login?verified=pending`);
        } else {
          router.push(`/login/otp?email=${encodeURIComponent(email)}`);
        }
      });
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred. Please try again.");
      setLoading(false);
    } finally {
    }
  };

  const handle_skip = async () => {
    const multipart_form = MultipartFormBuilder.new();
    multipart_form.add_field("email", email);
    // @ts-ignore
    const response = await register(multipart_form.build());
    if (response?.success) router.push(`/verify`);
    else setError(response?.message ?? "Could not create account.");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e as any);
    }
  };

  return (
    <>
      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full">
          {/* Welcome Message */}
          <div className="text-center mb-10">
            {!new_account ? (
              <h2 className="text-5xl font-heading font-bold text-gray-900 mb-2">
                Recruiters are waiting!
              </h2>
            ) : (
              <>
                <h2 className="text-5xl font-heading font-bold text-gray-900 mb-2">
                  First time?
                </h2>
                <div>We're glad to see you join us!</div>
              </>
            )}
          </div>

          <div className="max-w-md m-auto">
            {/* Verification Message - Only show if coming from registration */}
            {showVerificationMessage && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700 text-center font-medium">
                  📧 Please check your Inbox for a Verification Email!
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Input
                  type="email"
                  placeholder="School Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    // Clear any existing errors when user types
                    if (error) setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  required
                  className="w-full h-12 px-4 input-box hover:cursor-text focus:ring-0"
                  disabled={loading}
                />
              </div>

              {!new_account ? (
                <Button
                  type="submit"
                  className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors cursor-pointer"
                >
                  {loading ? "Checking..." : "Continue"}
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/register?email=${encodeURIComponent(email)}`
                      )
                    }
                  >
                    Finish setting up profile
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-gray-300 font-medium rounded-lg transition-colors cursor-pointer"
                    onClick={handle_skip}
                  >
                    Skip for now
                  </Button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

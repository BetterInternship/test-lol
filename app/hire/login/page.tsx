"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useAuthContext } from "../authctx";

export default function LoginPage() {
  const { email_status, send_otp_request, verify_otp } = useAuthContext();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (email.trim() === "") {
      setIsLoading(false);
      setError("Email is required.");
      return;
    }

    await email_status(email).then(async (r) => {
      if (!r.existing_user) {
        setIsLoading(false);
        setError("Account does not exist in our database.");
        return;
      }

      // Wait for confirmation of otp being sent, then focus on otp input
      const response = await send_otp_request(email.trim());
      // @ts-ignore
      if (!response.success) {
        setIsLoading(false);
        // @ts-ignore
        alert(response.message);
        return;
      }
      setIsLoading(false);
      setStep("otp");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    // Clear error when user starts typing
    if (error) {
      setError("");
    }

    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, ""); // Only numbers
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6).split("");

    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    otpRefs.current[focusIndex]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const otpString = otp.join("");
    await verify_otp(email, otpString).then((r) => {
      if (r.success) {
        router.push("/dashboard");
      } else {
        setError("Invalid OTP.");
      }

      setIsLoading(false);
    });
  };

  const handleBackToEmail = () => {
    setStep("email");
    setOtp(["", "", "", "", "", ""]);
    setError("");
  };

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    const otpString = otp.join("");
    if (otpString.length === 6 && !isLoading && !error) {
      handleOtpSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  }, [otp]);

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full">
          {/* Back Arrow for OTP step */}
          {step === "otp" && (
            <div className="mb-6">
              <button
                onClick={handleBackToEmail}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Welcome Message */}
          <div className="text-center mb-10">
            {step === "email" ? (
              <h2 className="text-5xl font-heading font-bold text-gray-900 mb-2">
                Future interns are waiting!
              </h2>
            ) : (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Enter OTP
                </h2>
                <p className="text-gray-600">We've sent an OTP to {email}</p>
              </div>
            )}
          </div>

          <div className="max-w-md m-auto">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 justify-center">{error}</p>
              </div>
            )}

            {/* Login Form */}
            {step === "email" ? (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 px-4 input-box hover:cursor-text focus:ring-0"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending OTP..." : "Continue"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                {/* OTP Input Boxes */}
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      className="w-12 h-16 text-center text-2xl font-semibold border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors disabled:opacity-50"
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || otp.join("").length !== 6}
                  className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

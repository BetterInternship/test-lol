"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/lib/ctx-auth";
import { OtpComponent } from "@/components/otp/OtpInput";

export default function OTPPage() {
  const { sendOtpRequest, resendOtpRequest, verifyOtp, redirectIfLoggedIn } =
    useAuthContext();

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  redirectIfLoggedIn();

  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
  }, [email, router]);

  const handleVerifySuccess = () => router.push("/");
  const handleBack = () => router.push("/login");

  if (!email) return null;

  return (
    <OtpComponent
      email={email}
      onVerifySuccess={handleVerifySuccess}
      onBack={handleBack}
      verifyOtp={verifyOtp}
      sendOtp={sendOtpRequest}
      resendOtp={resendOtpRequest}
    />
  );
}

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/lib/ctx-auth";
import { useOtp } from "@/hooks/otp/otp-input";
import { OtpComponent } from "@/components/otp/OtpInput";

export default function OTPPage() {
  const { sendOtpRequest, resendOtpRequest, verifyOtp, redirectIfLoggedIn } =
    useAuthContext();

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const otpHook = useOtp({
    onVerifySuccess: () => router.push("/"),
    verifyOtp,
    sendOtp: sendOtpRequest,
    resendOtp: resendOtpRequest,
  });

  redirectIfLoggedIn();

  useEffect(() => {
    if (email) {
      otpHook.handleSendOtp(email);
    } else {
      router.push("/login");
    }
  }, [email, router]);

  const handleVerify = () => otpHook.handleVerify(email, otpHook.otp);
  const handleAutoVerify = (otpValue: string) =>
    otpHook.handleVerify(email, otpValue);
  const handleResend = () => otpHook.handleResendOtp(email);
  const handleBack = () => router.push("/login");

  if (!email) return null;

  return (
    <OtpComponent
      email={email}
      otp={otpHook.otp}
      error={otpHook.error}
      loading={otpHook.loading}
      resending={otpHook.resending}
      timer={otpHook.timer}
      isComplete={otpHook.isComplete}
      onOtpChange={otpHook.setOtp}
      onVerify={handleVerify}
      onAutoVerify={handleAutoVerify}
      onResend={handleResend}
      onBack={handleBack}
    />
  );
}

import { useState, useCallback } from "react";

interface UseOtpOptions {
  length?: number;
  resendDelay?: number;
  onVerifySuccess?: () => void;
  verifyOtp: (email: string, otp: string) => Promise<any>;
  sendOtp: (email: string) => Promise<any>;
  resendOtp: (email: string) => Promise<any>;
}

export const useOtp = ({
  length = 6,
  resendDelay = 60000,
  onVerifySuccess,
  verifyOtp,
  sendOtp,
  resendOtp,
}: UseOtpOptions) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState<number>(Date.now() + resendDelay);

  const handleVerify = useCallback(async (email: string, otpString: string) => {
    if (otpString.length !== length) {
      setError("Please enter all digits");
      return false;
    }

    try {
      setLoading(true);
      setError("");
      const result = await verifyOtp(email, otpString);
      
      if (result?.success) {
        onVerifySuccess?.();
        return true;
      } else {
        setError("Invalid OTP");
        setOtp("");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Verification failed");
      setOtp("");
      return false;
    } finally {
      setLoading(false);
    }
  }, [length, verifyOtp, onVerifySuccess]);

  const handleSendOtp = useCallback(async (email: string) => {
    const result = await sendOtp(email);
    if (!result.success) {
      setError(result.message ?? "Failed to send OTP");
    }
    return result;
  }, [sendOtp]);

  const handleResendOtp = useCallback(async (email: string) => {
    try {
      setResending(true);
      setError("");
      const result = await resendOtp(email);
      
      if (result?.success) {
        setTimer(Date.now() + resendDelay);
      } else {
        setError(result.message ?? "Could not resend OTP");
      }
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
      return { success: false };
    } finally {
      setResending(false);
    }
  }, [resendOtp, resendDelay]);

  const isComplete = useCallback(() => otp.length === length, [otp, length]);

  return {
    otp,
    setOtp,
    error,
    setError,
    loading,
    resending,
    timer,
    handleVerify,
    handleSendOtp,
    handleResendOtp,
    isComplete,
  };
};
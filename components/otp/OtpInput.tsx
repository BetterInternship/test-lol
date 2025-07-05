import { useEffect } from "react";
import Countdown from "react-countdown";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useOtp } from "@/hooks/otp/otp-input";

const OTP_LENGTH = 6;

interface OtpComponentProps {
  email: string;
  onVerifySuccess: () => void;
  onBack: () => void;
  verifyOtp: (email: string, otp: string) => Promise<any>;
  sendOtp: (email: string) => Promise<any>;
  resendOtp: (email: string) => Promise<any>;
}

export const OtpComponent = ({
  email,
  onVerifySuccess,
  onBack,
  verifyOtp,
  sendOtp,
  resendOtp,
}: OtpComponentProps) => {
  const otp = useOtp({
    onVerifySuccess,
    verifyOtp,
    sendOtp,
    resendOtp,
  });

  // Send OTP when component mounts
  useEffect(() => {
    if (email) {
      otp.handleSendOtp(email);
    }
  }, [email]);

  // Auto-submit when complete
  useEffect(() => {
    if (otp.isComplete() && !otp.loading && !otp.error) {
      otp.handleVerify(email, otp.otp);
    }
  }, [otp.otp, otp.loading, otp.error, email]);

  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            disabled={otp.loading}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Enter OTP</h2>
          <p className="text-gray-600">We've sent a verification code to</p>
          <p className="text-gray-900 font-medium">{email}</p>
        </div>

        {/* Error */}
        {otp.error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 text-center">{otp.error}</p>
          </div>
        )}

        {/* OTP Input */}
        <div className="flex justify-center mb-8">
          <InputOTP
            maxLength={OTP_LENGTH}
            value={otp.otp}
            onChange={otp.setOtp}
            disabled={otp.loading}
          >
            <InputOTPGroup className="gap-3">
              {Array.from({ length: OTP_LENGTH }, (_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Verify Button */}
        <Button
          onClick={() => otp.handleVerify(email, otp.otp)}
          disabled={otp.loading || !otp.isComplete()}
          className="w-full h-12 bg-black hover:bg-gray-800 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {otp.loading ? "Verifying..." : "Verify OTP"}
        </Button>

        {/* Resend */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the code?{" "}
            <Countdown
              key={otp.timer}
              date={otp.timer}
              renderer={({ minutes, seconds, completed }) => (
                <button
                  onClick={() => otp.handleResendOtp(email)}
                  disabled={otp.resending || otp.loading || !completed}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors disabled:opacity-50"
                >
                  {!completed
                    ? `Resend in ${String(seconds).padStart(2, "0")} seconds`
                    : otp.resending
                    ? "Sending..."
                    : "Resend OTP"}
                </button>
              )}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

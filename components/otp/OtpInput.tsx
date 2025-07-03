import { useEffect } from "react";
import Countdown from "react-countdown";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OtpComponentProps {
  email: string;
  otp: string;
  error: string;
  loading: boolean;
  resending: boolean;
  timer: number;
  isComplete: () => boolean;
  onOtpChange: (value: string) => void;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
  onAutoVerify: (otpValue: string) => void;
}

export const OtpComponent = ({
  email,
  otp,
  error,
  loading,
  resending,
  timer,
  isComplete,
  onOtpChange,
  onVerify,
  onResend,
  onBack,
  onAutoVerify,
}: OtpComponentProps) => {
  // Auto-submit when complete
  useEffect(() => {
    if (otp.length === 6 && !loading && !error) {
      onAutoVerify(otp);
    }
  }, [otp, loading, error, onAutoVerify]);

  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            disabled={loading}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* OTP Input */}
        <div className="flex justify-center mb-8">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={onOtpChange}
            disabled={loading}
          >
            <InputOTPGroup className="gap-3">
              {Array.from({ length: 6 }, (_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Verify Button */}
        <Button
          onClick={onVerify}
          disabled={loading || !isComplete()}
          className="w-full h-12 bg-black hover:bg-gray-800 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>

        {/* Resend */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the code?{" "}
            <Countdown
              key={timer}
              date={timer}
              renderer={({ minutes, seconds, completed }) => (
                <button
                  onClick={onResend}
                  disabled={resending || loading || !completed}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors disabled:opacity-50"
                >
                  {!completed
                    ? `Resend in ${String(seconds).padStart(2, "0")} seconds`
                    : resending
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
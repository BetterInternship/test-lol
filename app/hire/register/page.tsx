"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useAuthContext } from "../authctx";

export default function LoginPage() {
  const { email_status, login, redirect_if_logged_in } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  redirect_if_logged_in();

  const handle_email_submit = async (e: React.FormEvent) => {
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

      // @ts-ignore
      if (!r.success) {
        setIsLoading(false);
        // @ts-ignore
        alert(r.message);
        return;
      }
      console.log("lol what");
      setIsLoading(false);
      setStep("password");
    });
  };

  const handle_password_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    await login(email, password).then((r) => {
      // @ts-ignore
      if (r?.success) {
        // @ts-ignore
        if (r.god) router.push("/god");
        else router.push("/dashboard");
      } else {
        setError("Invalid password.");
      }

      setIsLoading(false);
    });
  };

  const handle_back_to_email = () => {
    setStep("email");
    setPassword("");
    setError("");
  };

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full">
          {/* Back Arrow for OTP step */}
          {step === "password" && (
            <div className="mb-6">
              <button
                onClick={handle_back_to_email}
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
                Coming soon.
              </h2>
            ) : (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Enter Password
                </h2>
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
            <form onSubmit={handle_password_submit} className="space-y-6">
              <Button
                type="submit"
                disabled={true}
                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Register"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

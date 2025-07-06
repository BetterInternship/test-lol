import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const router = useRouter();

  const handleRequestAccess = () => {
    router.push("/login");
  };
  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-8 pt-8 text-center">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Main Heading */}
        <h1 className="text-7xl font-bold text-black tracking-tighter mb-8">
          Need Interns? Done.
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          We are largest platform dedicated to hiring PH interns.
        </p>

        {/* Statistics */}
        <div className="translate-y-[-0.5em] pb-6">
          <p className="text-xl text-gray-700">
            Average company saves{" "}
            <span className="text-3xl font-bold text-gray-700">125</span>{" "}
            hours/year (10 interns)
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center pt-2">
          <Button
            className="w-1/2 bg-black hover:bg-gray-900 transition-all duration-200"
            size="lg"
            scheme="default"
            onClick={handleRequestAccess}
          >
            Request Access
          </Button>
        </div>
      </div>
    </div>
  );
}

import React from "react";

interface BannerProps {
  children: React.ReactNode;
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md ${className}`}
    >
      {children}
    </div>
  );
};

//unverified banner for Employers
export const ShowUnverifiedBanner = () => {
  return (
    <Banner className="mb-4">
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium">Account not verified</span>
      </div>
      <p className="mt-1 text-sm px-3">
        You can add listings now — they’ll go live once we finish verifying your account (usually within 24 hours). We personally check every new account to keep things safe and smooth. 
        <br />
        Questions? Email us at hello@betterinternship.com.
      </p>
    </Banner>
  );
};

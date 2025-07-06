"use client";

import { useRoute } from "@/hooks/use-route";
import { useAppContext } from "@/lib/ctx-app";

/**
 * Footer
 *
 * @component
 */
export const Footer = ({ content }: { content?: string }) => {
  const { isMobile: is_mobile } = useAppContext();
  const footer_routes = ["/login", "/register", "/otp", "/"];
  const { route_excluded } = useRoute();

  // If on mobile or on a page with no footer
  if (is_mobile || route_excluded(footer_routes)) {
    return <></>;
  }

  return (
    <div className="bg-transparent px-6 py-4 opacity-70">
      <div className="text-center">
        <p className="text-sm text-gray-500">
          {content ?? (
            <>
              © 2025 BetterInternship. All rights reserved.{" "}
              <a
                href="/TermsConditions.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a
                href="/PrivacyPolicy.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </a>
              .
            </>
          )}
        </p>
      </div>
    </div>
  );
};

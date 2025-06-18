"use client";

import { useRoute } from "@/hooks/use-route";
import { useAppContext } from "@/lib/ctx-app";

/**
 * Footer
 *
 * @component
 */
export const Footer = ({ content }: { content?: string }) => {
  const { is_mobile } = useAppContext();
  const footer_routes = ["/login", "/register", "/otp", "/"];
  const { route_excluded } = useRoute();

  // If on mobile or on a page with no footer
  if (is_mobile || route_excluded(footer_routes)) {
    return <></>;
  }

  return (
    <div className="bg-white border-t px-6 py-4">
      <div className="text-center">
        <p className="text-sm text-gray-500">
          {content ?? "Encountering problems? Contact us at:"}{" "}
          <a
            href="mailto:hello@betterinternship.com"
            className="text-blue-600 hover:underline"
          >
            hello@betterinternship.com
          </a>
        </p>
      </div>
    </div>
  );
};

import { useAppContext } from "@/lib/ctx-app";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const HeaderTitle = () => {
  const { isMobile: is_mobile } = useAppContext();
  return (
    <Link
      href="/"
      className="block outline-none focus:outline-none border-none"
    >
      <h1
        className={cn(
          "font-display font-bold text-gray-900",
          is_mobile ? "text-lg" : "text-2xl"
        )}
      >
        BetterInternship
      </h1>
    </Link>
  );
};

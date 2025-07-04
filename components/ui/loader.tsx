import { cn } from "@/lib/utils";

/**
 * A reusable loader.
 *
 * @component
 */
export const Loader = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex w-full h-full items-center justify-center py-16">
      <div className="text-center animate-scale-in">
        <div
          className={cn(
            "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
            children ? "mb-4" : ""
          )}
        ></div>
        {children}
      </div>
    </div>
  );
};

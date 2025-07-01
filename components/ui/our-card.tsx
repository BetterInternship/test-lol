import { cn } from "@/lib/utils";

export const Card = ({
  className,
  children,
  ...props
}: {
  className: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "p-4 border-2 rounded-[0.33em] transition-colors border-gray-200",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
Card.displayName = "Card";

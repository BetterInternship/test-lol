import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/features/school/ui/tooltip';
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  side?: "right" | "top" | "bottom" | "left" | undefined
  delayDuration?: number | undefined
  children: React.ReactNode
  content?: string | undefined
  icon?: LucideIcon | undefined
  iconClassName?: string | undefined
  className?: string | undefined
  onClick?: () => void
}

const ShowTooltip = ({side = "right", delayDuration = 100, className, children, icon: Icon, iconClassName, content, onClick}: Props) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild className={cn("w-fit", className)} onClick={() => onClick?.()}>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side}>
          <div className="flex items-center space-x-2">
            {Icon && <Icon className={cn("w-4 h-4 text-secondary", iconClassName && iconClassName, onClick && "cursor-pointer")} />}
            <p className="text-sm font-medium leading-none">{content}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ShowTooltip;
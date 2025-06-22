import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {cn} from "@/lib/utils";

interface ModeToggleProps {
    isTrustMode: boolean;
    onToggle: (checked: boolean) => void;
    className?: string;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ isTrustMode, onToggle, className }) => {
    return (
        <div className={cn("flex items-center space-x-2 mb-6 justify-center", className)}>
            <Label htmlFor="mode-toggle" className="text-lg font-medium">Manual Mode</Label>
            <Switch
                id="mode-toggle"
                checked={isTrustMode}
                onCheckedChange={onToggle}
                className={isTrustMode ? "data-[state=checked]:bg-green-500" : ""}
            />
            <Label htmlFor="mode-toggle" className="text-lg font-medium">Trust Mode</Label>
        </div>
    );
};

export default ModeToggle;
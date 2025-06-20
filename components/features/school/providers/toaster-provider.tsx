import React from "react";
import { Toaster } from "@/components/features/school/ui/sonner";

const ToasterProvider = () => {
    /*
      Refer to the following URL for more information on
      how to customize the Toaster component:
      https://sonner.emilkowal.ski/toaster
      https://ui.shadcn.com/docs/components/sonner
      */
    return <Toaster richColors position="top-center" visibleToasts={2} />;
};

export default ToasterProvider;

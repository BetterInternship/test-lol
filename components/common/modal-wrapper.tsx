// import React from "react";
// import { X } from "lucide-react";
// import { Button } from "../ui/button";

// interface ModalWrapperProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title?: string;
//   children: React.ReactNode;
//   size?: "sm" | "md" | "lg" | "xl" | "full";
//   showCloseButton?: boolean;
// }

// export const ModalWrapper: React.FC<ModalWrapperProps> = ({
//   isOpen,
//   onClose,
//   title,
//   children,
//   size = "md",
//   showCloseButton = true,
// }) => {
//   if (!isOpen) return null;

//   const sizeClasses = {
//     sm: "max-w-md",
//     md: "max-w-lg",
//     lg: "max-w-2xl",
//     xl: "max-w-4xl",
//     full: "max-w-7xl",
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//       onClick={onClose}
//     >
//       <div
//         className={`bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden`}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {(title || showCloseButton) && (
//           <div className="flex items-center justify-between p-6 border-b border-gray-200">
//             {title && (
//               <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
//             )}
//             {showCloseButton && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={onClose}
//                 className="p-2 hover:bg-gray-100 rounded-full"
//               >
//                 <X className="h-5 w-5" />
//               </Button>
//             )}
//           </div>
//         )}
//         <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModalWrapper;

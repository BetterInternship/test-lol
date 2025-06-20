"use client";
import { GlobalModalProvider } from "@/components/features/school/providers/global-modal-provider";
import ReactQueryProvider from "@/components/features/school/providers/react-query-provider";
import { LoadingProvider } from "@/components/features/school/providers/loader-spinner-provider";
import { ThemeProvider } from "@/components/features/school/providers/theme-provider";
import ToasterProvider from "@/components/features/school/providers/toaster-provider";
import GlobalModal from "@/components/features/school/global-modal";
import LoadingSpinner from "@/components/features/school/loader-spinner";
import { UserSessionProvider } from "@/components/features/school/providers/user-session-provider";
interface Props {
  children: React.ReactNode;
}

export default function RootProviders({ children }: Props) {
  return (
    <ReactQueryProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LoadingProvider>
          <GlobalModalProvider>
            <UserSessionProvider>
              {children}
              <GlobalModal />
              <LoadingSpinner />
            </UserSessionProvider>
          </GlobalModalProvider>
        </LoadingProvider>
        <ToasterProvider />
      </ThemeProvider>
    </ReactQueryProvider>
  );
}

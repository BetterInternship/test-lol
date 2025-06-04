"use client";
import { GlobalModalProvider } from "@/components/school/providers/global-modal-provider";
import ReactQueryProvider from "@/components/school/providers/react-query-provider";
import { LoadingProvider } from "@/components/school/providers/loader-spinner-provider";
import { ThemeProvider } from "@/components/school/providers/theme-provider";
import ToasterProvider from "@/components/school/providers/toaster-provider";
import GlobalModal from "@/components/school/global-modal";
import LoadingSpinner from "@/components/school/loader-spinner";
import { UserSessionProvider } from "@/components/school/providers/user-session-provider";
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

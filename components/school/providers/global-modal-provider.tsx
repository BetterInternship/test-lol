"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface ModalContextType {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  component: React.ReactNode;
  setComponent: (component: React.ReactNode) => void;
  title: string;
  description: string;
  setDescription: (description: string) => void;
  setTitle: (title: string) => void;
  setHeaderComponent: (headerComponent: React.ReactNode) => void;
  headerComponent: React.ReactNode;
  containerClassName: string;
  setContainerClassName: (className: string) => void;
  shouldScroll: boolean;
  setShouldScroll: (shouldScroll: boolean) => void;
  scrollClassName: string;
  setScrollClassName: (scrollClassName: string) => void;
  isDismissible: boolean;
  setIsDismissible: (dismissible: boolean) => void;
  isResponsive: boolean;
  setIsResponsive: (isResponsive: boolean) => void;
  onDismiss?: () => void;
  setOnDismiss: (callback: (() => void) | undefined) => void;
  resetModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModalContext = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      "useModalContext must be used within a GlobalModalProvider",
    );
  }
  return context;
};

interface ModalProviderProps {
  children: React.ReactNode;
}

export const GlobalModalProvider = ({ children }: ModalProviderProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [component, setComponent] = useState<React.ReactNode>(null);
  const [headerComponent, setHeaderComponent] = useState<React.ReactNode>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [containerClassName, setContainerClassName] = useState("");
  const [shouldScroll, setShouldScroll] = useState(false);
  const [scrollClassName, setScrollClassName] = useState("");
  const [isDismissible, setIsDismissible] = useState(true);
  const [isResponsive, setIsResponsive] = useState(false);
  const [onDismiss, setOnDismiss] = useState<(() => void) | undefined>(
    undefined,
  );
  const resetModal = useCallback(() => {
    setTitle("");
    setDescription("");
    setComponent(null);
    setHeaderComponent(null);
    setContainerClassName("");
    setShouldScroll(false);
    setScrollClassName("");
    setIsDismissible(true);
    setIsResponsive(false);
    setOnDismiss(undefined);
  }, []);

  useEffect(() => {
    if (!modalOpen) {
      if (onDismiss) {
        onDismiss();
      }
      const timer = setTimeout(() => {
        resetModal();
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [modalOpen, onDismiss, resetModal]);

  return (
    <ModalContext.Provider
      value={{
        modalOpen,
        setModalOpen,
        component,
        setComponent,
        title,
        setTitle,
        description,
        setDescription,
        containerClassName,
        setContainerClassName,
        shouldScroll,
        setShouldScroll,
        resetModal,
        scrollClassName,
        setScrollClassName,
        isDismissible,
        setIsDismissible,
        isResponsive,
        setIsResponsive,
        onDismiss,
        setOnDismiss,
        headerComponent,
        setHeaderComponent,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

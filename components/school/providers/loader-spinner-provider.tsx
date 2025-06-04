"use client";
import React, { createContext, useState, useContext } from "react";

interface LoadingContextType {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    text: string;
    setText: React.Dispatch<React.SetStateAction<string>>;
    progress: number | undefined | null;
    setProgress: React.Dispatch<React.SetStateAction<number | undefined | null>>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoadingContext = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoadingContext must be used within a LoadingProvider");
    }
    return context;
};

interface LoadingProviderProps {
    children: React.ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [text, setText] = useState<string>("");
    const [progress, setProgress] = useState<number | undefined | null>(undefined);

    return (
        <LoadingContext.Provider
            value={{ loading, setLoading, text, setText, progress, setProgress }}
        >
            {children}
        </LoadingContext.Provider>
    );
};

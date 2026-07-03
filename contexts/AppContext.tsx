"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo } from "react";
import { ServiceProvider, createServiceProvider } from "../services/provider";

const configuration = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  websocketUrl: process.env.NEXT_PUBLIC_WS_URL ?? "",
};

const AppContext = createContext<ServiceProvider | undefined>(undefined);

export interface AppProviderProps {
  readonly children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const services = useMemo(() => createServiceProvider(configuration), []);

  useEffect(() => {
    void services.start().catch((error) => {
      console.error("Application startup failed.", error);
    });

    return () => {
      void services.stop();
    };
  }, [services]);

  return <AppContext.Provider value={services}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp() must be used inside AppProvider.");
  }

  return context;
}

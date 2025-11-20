"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type AirlineContextType = {
  airline: string | null; // currently selected airline slug or name
  setAirline: (airline: string | null) => void; // updater function
};
    
// Create context with default undefined
const AirlineContext = createContext<AirlineContextType | undefined>(undefined);

// Provider component
export const AirlineProvider = ({ children }: { children: ReactNode }) => {
  const [airline, setAirline] = useState<string | null>(null);

  return (
    <AirlineContext.Provider value={{ airline, setAirline }}>
      {children}
    </AirlineContext.Provider>
  );
};

// Hook to use context safely
export const useAirline = () => {
  const context = useContext(AirlineContext);
  if (!context) {
    throw new Error("useAirline must be used within an AirlineProvider");
  }
  return context;
};

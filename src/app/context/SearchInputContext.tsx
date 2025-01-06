"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SearchInputContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  collateralType: string;
  setCollateralType: (type: string) => void;
}

const SearchInputContext = createContext<SearchInputContextType | undefined>(
  undefined
);

export function SearchInputProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [collateralType, setCollateralType] = useState("eth");

  return (
    <SearchInputContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        collateralType,
        setCollateralType,
      }}
    >
      {children}
    </SearchInputContext.Provider>
  );
}

export function useSearchInput() {
  const context = useContext(SearchInputContext);
  if (context === undefined) {
    throw new Error("useSearchInput must be used within a SearchInputProvider");
  }
  return context;
}

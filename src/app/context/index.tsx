import { ReactNode } from "react";
import { SearchInputProvider } from "./SearchInputContext";
import { Web3Provider } from "./Web3Context";

export * from "./SearchInputContext";
export * from "./Web3Context";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Web3Provider>
      <SearchInputProvider>{children}</SearchInputProvider>
    </Web3Provider>
  );
}

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";

interface Web3ContextType {
  web3: Web3 | null;
  isConnected: boolean;
  initError: string | null;
  account: string;
  isLoading: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  web3: null,
  isConnected: false,
  initError: null,
  account: "",
  isLoading: false,
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string>("");
  const [initError, setInitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initWeb3 = async () => {
      if (typeof window.ethereum !== "undefined") {
        if (mounted || isLoading) {
          return;
        }

        try {
          setIsLoading(true);
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });

          if (accounts) {
            setAccount(accounts[0]);
            setWeb3(new Web3(window.ethereum));
            setIsConnected(true);
            setInitError(null);
          }
        } catch (error) {
          console.error("Wallet connection error:", error);
          setInitError("Failed to connect wallet");
        } finally {
          setIsLoading(false);
        }
      } else {
        setInitError("Please install MetaMask!");
      }
    };

    initWeb3();
    setMounted(true);
  }, [mounted, isLoading]);

  if (!mounted) {
    return null;
  }

  return (
    <Web3Context.Provider
      value={{ web3, isConnected, initError, account, isLoading }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}

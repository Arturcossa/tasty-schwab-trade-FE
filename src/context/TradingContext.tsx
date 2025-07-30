"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { TickerData } from "@/lib/type";

interface TradingContextType {
  schwabToken: string;
  setSchwabToken: (token: string) => void;
  validateSchwabToken: (
    token: string
  ) => Promise<{ success: boolean; message?: string }>;
  isOpenTokenValidModal: boolean;
  setIsOpenTokenValidModal: (open: boolean) => void;
  isTokenValidated: boolean;
  setIsTokenValidated: (validated: boolean) => void;
  getTickerData: (strategy: 'ema' | 'supertrend') => void;
  tickerData: TickerData;
  setTickerData: (data: TickerData) => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error("useTrading must be used in within a TradingProvider");
  }
  return context;
};

export const TradingProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [schwabToken, setSchwabToken] = useState<string>("");
  const [isOpenTokenValidModal, setIsOpenTokenValidModal] = useState(false);
  const [isTokenValidated, setIsTokenValidated] = useState(false);
  const [tickerData, setTickerData] = useState<TickerData>({
    ema: [],
    supertrend: [],
  });

  useEffect(() => {
    const storedSchwabToken = localStorage.getItem("TIM_REFRESH_TOKEN");
    const storedValidationStatus = localStorage.getItem("TIM_TOKEN_VALIDATED");
    
    if (storedSchwabToken) {
      try {
        const parsedToken = JSON.parse(storedSchwabToken);
        setSchwabToken(parsedToken);
      } catch (error) {
        console.error("Error parsing stored token:", error);
        localStorage.removeItem("TIM_REFRESH_TOKEN");
      }
    }
    
    if (storedValidationStatus) {
      setIsTokenValidated(JSON.parse(storedValidationStatus));
    }
  }, []);

  const validateSchwabToken = async (
    token: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      if (!token || token.trim() === "") {
        return { success: false, message: "Token link is required" };
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/refresh-token-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ token }),
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        // If validation succeeds, mark as validated and close modal
        setIsTokenValidated(true);
        localStorage.setItem("TIM_TOKEN_VALIDATED", "true");
        setIsOpenTokenValidModal(false);
        return { success: true };
      } else {
        // If validation fails, keep modal open
        setIsTokenValidated(false);
        localStorage.setItem("TIM_TOKEN_VALIDATED", "false");
        return {
          success: false,
          message: data.message || "Token validation failed",
        };
      }
    } catch (error) {
      setIsTokenValidated(false);
      localStorage.setItem("TIM_TOKEN_VALIDATED", "false");
      return {
        success: false,
        message: "Network error during token validation",
      };
    }
  };

  const updateSchwabToken = (token: string) => {
    setSchwabToken(token);
    localStorage.setItem("TIM_REFRESH_TOKEN", JSON.stringify(token));
  };

  const updateTokenValidated = (validated: boolean) => {
    setIsTokenValidated(validated);
    localStorage.setItem("TIM_TOKEN_VALIDATED", JSON.stringify(validated));
  };

  const getTickerData = async (strategy: "ema" | "supertrend") => {
    // TODO: Implement API call to get ticker data
    console.log("Getting ticker data for:", strategy);
  };

  const updateTickerData = (data: TickerData) => {
    setTickerData(data);
  };

  return (
    <TradingContext.Provider
      value={{
        schwabToken,
        setSchwabToken: updateSchwabToken,
        validateSchwabToken,
        isOpenTokenValidModal,
        setIsOpenTokenValidModal,
        isTokenValidated,
        setIsTokenValidated: updateTokenValidated,
        getTickerData,
        tickerData,
        setTickerData: updateTickerData,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

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
import {
  convertBackendDataToEmaArray,
  covertBackendDataToSupertrendArray,
} from "@/lib/functions";
import { toast } from "sonner";
import { EmaTicker } from "@/lib/ema-datas";
import { SupertrendTicker } from "@/lib/supertrend-datas";
import { ZerodayTicker } from "@/lib/zeroday-datas";

interface TradingContextType {
  validateSchwabToken: (
    token: string
  ) => Promise<{ success: boolean; message?: string }>;
  isOpenTokenValidModal: boolean;
  setIsOpenTokenValidModal: (open: boolean) => void;
  isTokenValidated: boolean;
  setIsTokenValidated: (validated: boolean) => void;
  getTickerData: (strategy: "ema" | "supertrend" | "zeroday") => void;
  tickerData: TickerData;
  setTickerData: (data: TickerData) => void;
  saveTickerData: ({
    strategy,
    row,
  }: {
    strategy: "ema" | "supertrend" | "zeroday";
    row: EmaTicker | SupertrendTicker | ZerodayTicker;
  }) => Promise<any>;
  deleteTickerData: ({
    strategy,
    row,
  }: {
    strategy: "ema" | "supertrend" | "zeroday";
    row: EmaTicker | SupertrendTicker | ZerodayTicker;
  }) => void;
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
  const [isOpenTokenValidModal, setIsOpenTokenValidModal] = useState(false);
  const [isTokenValidated, setIsTokenValidated] = useState(false);
  const [tickerData, setTickerData] = useState<TickerData>({
    ema: [],
    supertrend: [],
    zeroday: [],
  });

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
          body: JSON.stringify({ refresh_token_link: token }),
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        // If validation succeeds, mark as validated and close modal
        setIsOpenTokenValidModal(false);
        setIsTokenValidated(true);
        toast.success("Token validated and saved successfully!", {
          className: "toast-success",
        });
        return { success: true };
      } else {
        // If validation fails, keep modal open
        setIsTokenValidated(false);
        toast.error(data.message || "Token validation failed", {
          className: "toast-error",
        });
        return {
          success: false,
          message: data.message || "Token validation failed",
        };
      }
    } catch (error) {
      setIsTokenValidated(false)
      toast.error("Network error during token validation", {
        className: "toast-error",
      });
      return {
        success: false,
        message: "Network error during token validation",
      };
    }
  };

  // Fetch saved ticker data
  const getTickerData = async (strategy: "ema" | "supertrend" | "zeroday") => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/get-ticker?strategy=${encodeURIComponent(strategy)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.success && data.data) {
        // Transform backend data to frontend format
        let transformedData;
        if (strategy !== "supertrend")
          transformedData = convertBackendDataToEmaArray(data.data);
        else transformedData = covertBackendDataToSupertrendArray(data.data);

        setTickerData({
          ...tickerData,
          [strategy]: transformedData,
        });

        return { success: true, data: transformedData };
      } else {
        console.error("Failed to fetch ticker data:", data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error fetching ticker data:", error);
      return { success: false, message: "Network error" };
    }
  };

  // Update ticker data
  const saveTickerData = async ({
    strategy,
    row,
  }: {
    strategy: "ema" | "supertrend" | "zeroday";
    row: EmaTicker | SupertrendTicker;
  }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/add-ticker`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            ...row,
            strategy: strategy,
          }),
        }
      );
      const data = await response.json();

      if (data.success) {
        let transformedData;
        if (strategy !== "supertrend")
          transformedData = convertBackendDataToEmaArray(data.data);
        else transformedData = covertBackendDataToSupertrendArray(data.data);
        setTickerData({
          ...tickerData,
          [strategy]: transformedData,
        });

        toast.success("Save ticker successful!", {
          className: "toast-success",
        });
      } else {
        toast.error(data.message || "Failed to save ticker", {
          className: "toast-error",
        });
      }
    } catch (error) {
      toast.error(`Network error`, {
        className: "toast-error",
      });
    }
  };

  // Delete ticker data
  const deleteTickerData = async ({
    strategy,
    row,
  }: {
    strategy: "ema" | "supertrend" | "zeroday";
    row: EmaTicker | SupertrendTicker;
  }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-ticker`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            strategy: strategy,
            symbol: row.symbol,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        const transformedData = convertBackendDataToEmaArray(data.data);
        setTickerData({
          ...tickerData,
          [strategy]: transformedData,
        });
        toast.success("Delete ticker successful!", {
          className: "toast-success",
        });
      }
    } catch (error) {
      toast.error(`${error}`, {
        className: "toast-error",
      });
    }
  };

  const updateTickerData = (data: TickerData) => {
    setTickerData(data);
  };

  return (
    <TradingContext.Provider
      value={{
        validateSchwabToken,
        isOpenTokenValidModal,
        setIsOpenTokenValidModal,
        isTokenValidated,
        setIsTokenValidated,
        getTickerData,
        tickerData,
        setTickerData: updateTickerData,
        saveTickerData,
        deleteTickerData,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

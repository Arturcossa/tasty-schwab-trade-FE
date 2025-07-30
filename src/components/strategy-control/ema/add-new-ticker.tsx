"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { symbols, timeframes } from "@/lib/ema-datas";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { EmaTicker } from "@/lib/type";
import { useTrading } from "@/context/TradingContext";
import { convertBackendDataToEmaArray } from "@/lib/functions";

const AddNewTicker = () => {
  const { user } = useAuth();
  const { tickerData, setTickerData } = useTrading();
  const [isLoading, setIsLoading] = useState(false);

  // TODO
  useEffect(() => {
    console.log("ticker ", tickerData)
  }, [tickerData])

  // Form state
  const [formData, setFormData] = useState<EmaTicker>({
    symbol: "",
    trade_enabled: false,
    timeframe: "",
    trend_line_1: "EMA",
    period_1: 1,
    trend_line_2: "EMA",
    period_2: 1,
    schwab_quantity: 1,
    tastytrade_quantity: 1,
  });

  // Update form data helper
  const updateFormData = (field: keyof EmaTicker, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Period handlers with validation
  const handlePeriodChange = (field: "period_1" | "period_2", value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      updateFormData(field, numValue);
    } else if (value === "") {
      updateFormData(field, 1);
    }
  };

  // Form validation
  const validateForm = (): string | null => {
    if (!formData.symbol) return "Please select a symbol";
    if (!formData.timeframe) return "Please select a time frame";
    if (formData.period_1 < 1) return "Period 1 must be greater than 0";
    if (formData.period_2 < 1) return "Period 2 must be greater than 0";
    if (formData.schwab_quantity <= 0) return "Schwab quantity must be greater than 0";
    if (formData.tastytrade_quantity <= 0) return "TastyTrade quantity must be greater than 0";
    return null;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      symbol: "",
      trade_enabled: false,
      timeframe: "",
      trend_line_1: "EMA",
      period_1: 1,
      trend_line_2: "EMA",
      period_2: 1,
      schwab_quantity: 1,
      tastytrade_quantity: 1,
    });
  };

  const handleAddTicker = async () => {
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      toast.warning(validationError, {
        className: "toast-warning"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/add-ticker`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("TIM_TOKEN")}`,
          },
          body: JSON.stringify({
            ...formData,
            userId: user?.email,
            strategy: "ema",
          }),
        }
      );
      const data = await response.json();
      if (response.ok && data.success && data.data) {
        toast.success("Ticker added successfully!", {
          className: "toast-success",
        });
        const emaArray = convertBackendDataToEmaArray(data.data);
        setTickerData({
          ...tickerData,
          ema: emaArray,
        })
        resetForm();
      } else {
        toast.error(data.message || "Failed to add ticker", {
          className: "toast-error",
        });
      }
    } catch (error) {
      console.error("Error adding ticker:", error);
      toast.error("Network error. Please try again.", {
        className: "toast-error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-xl">
        Trading Parameters Configuration
      </h2>
      <Card>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 pt-6">
          {/* Symbol Selection */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Ticker Symbol</h3>
            <Select
              value={formData.symbol}
              onValueChange={(value) => updateFormData("symbol", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a symbol" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Symbols</SelectLabel>
                  {symbols.map((symbol) => (
                    <SelectItem value={symbol} key={symbol}>
                      {symbol}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Trade Enabled */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Trade Enabled</h3>
            <Select
              value={formData.trade_enabled.toString()}
              onValueChange={(value) =>
                updateFormData("trade_enabled", value === "true")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">False</SelectItem>
                <SelectItem value="true">True</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Frame */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Time Frame</h3>
            <Select
              value={formData.timeframe}
              onValueChange={(value) => updateFormData("timeframe", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>TimeFrames</SelectLabel>
                  {timeframes.map((timeframe) => (
                    <SelectItem key={timeframe} value={timeframe}>
                      {timeframe}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Trend Line 1 */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Trend Line 1</h3>
            <Select
              value={formData.trend_line_1}
              onValueChange={(value) => updateFormData("trend_line_1", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select trend line" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMA">EMA</SelectItem>
                <SelectItem value="SMA">SMA</SelectItem>
                <SelectItem value="WilderSmoother">Wilder Smoother</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Period 1 */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Period 1</h3>
            <Input
              className="w-full"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={formData.period_1}
              onChange={(e) => handlePeriodChange("period_1", e.target.value)}
            />
          </div>

          {/* Trend Line 2 */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Trend Line 2</h3>
            <Select
              value={formData.trend_line_2}
              onValueChange={(value) => updateFormData("trend_line_2", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select trend line" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMA">EMA</SelectItem>
                <SelectItem value="SMA">SMA</SelectItem>
                <SelectItem value="WilderSmoother">Wilder Smoother</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Period 2 */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Period 2</h3>
            <Input
              className="w-full"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={formData.period_2}
              onChange={(e) => handlePeriodChange("period_2", e.target.value)}
            />
          </div>

          {/* Schwab Quantity */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Schwab Quantity</h3>
            <Input
              className="w-full"
              type="number"
              min={0.01}
              step="any"
              inputMode="decimal"
              value={formData.schwab_quantity}
              onChange={(e) =>
                updateFormData("schwab_quantity", Number(e.target.value) || 0)
              }
            />
          </div>

          {/* TastyTrade Quantity */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">TastyTrade Quantity</h3>
            <Input
              className="w-full"
              type="number"
              min={0.01}
              step="any"
              inputMode="decimal"
              value={formData.tastytrade_quantity}
              onChange={(e) => {
                updateFormData("tastytrade_quantity", Number(e.target.value) || 0)
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            onClick={handleAddTicker}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading && <LoaderIcon className="w-4 h-4 animate-spin" />}
            {isLoading ? "Adding..." : "Add Ticker"}
          </Button>
          <Button variant="outline" onClick={resetForm} disabled={isLoading}>
            Reset
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddNewTicker;

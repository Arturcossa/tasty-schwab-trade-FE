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
import { SupertrendTicker, symbols, timeframes } from "@/lib/supertrend-datas";
import { useState } from "react";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { useTrading } from "@/context/TradingContext";

const AddNewTicker = () => {
  const { saveTickerData } = useTrading();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<SupertrendTicker>({
    symbol: "",
    timeframe: "",
    trade_enabled: true,
    schwab_quantity: 0,
    tastytrade_quantity: 0,
    zigzag_method: "average",
  });

  // Update form data helper
  const updateFormData = <K extends keyof SupertrendTicker>(field: K, value: SupertrendTicker[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Form validation
  const validateForm = (): string | null => {
    if (!formData.symbol) return "Please select a symbol";
    if (!formData.timeframe) return "Please select a time frame";

    return null;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      symbol: "",
      timeframe: "",
      trade_enabled: true,
      schwab_quantity: 0,
      tastytrade_quantity: 0,
      zigzag_method: "average",
    });
  };

  const handleAddTicker = async () => {
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      toast.warning(validationError, {
        className: "toast-warning",
      });
      return;
    }
    setIsLoading(true);
    await saveTickerData({ strategy: "supertrend", row: formData });
    setIsLoading(false);
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
            <h3 className="font-medium text-sm">Symbol</h3>
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

          {/* Schwab Quantity */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Schwab Quantity</h3>
            <Input
              className="w-full"
              type="number"
              min={0}
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
              min={0}
              step="any"
              inputMode="decimal"
              value={formData.tastytrade_quantity}
              onChange={(e) => {
                updateFormData(
                  "tastytrade_quantity",
                  Number(e.target.value) || 0
                );
              }}
            />
          </div>

          {/* ZigZag Method */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">ZigZag Method</h3>
            <Select
              value={formData.zigzag_method}
              onValueChange={(value) => updateFormData("zigzag_method", value as "average" | "high_low")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="high_low">High/Low</SelectItem>
              </SelectContent>
            </Select>
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

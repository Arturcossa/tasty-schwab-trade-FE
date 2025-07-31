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
    short_ma_length: 1,
    short_ma_type: "EMA",
    mid_ma_length: 1,
    mid_ma_type: "EMA",
    long_ma_length: 1,
    long_ma_type: "EMA",
    zigzag_percent_reversal: 1.0,
    atr_length: 14,
    zigzag_atr_multiple: 2.0,
    fibonacci_enabled: false,
    support_demand_enabled: false,
    // timezone: "America/New_York",
    // show_volume_bubbles: false,
    // show_bubbles_price: false,
  });

  // Update form data helper
  const updateFormData = (field: keyof SupertrendTicker, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePeriodChange = (
    field:
      | "short_ma_length"
      | "mid_ma_length"
      | "long_ma_length"
      | "atr_length",
    value: string
  ) => {
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
    // if (formData.period_1 < 1) return "Period 1 must be greater than 0";
    // if (formData.period_2 < 1) return "Period 2 must be greater than 0";
    if (formData.schwab_quantity < 0)
      return "Schwab quantity must be greater than 0";
    if (formData.tastytrade_quantity < 0)
      return "TastyTrade quantity must be greater than 0";
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
      short_ma_length: 1,
      short_ma_type: "EMA",
      mid_ma_length: 1,
      mid_ma_type: "EMA",
      long_ma_length: 1,
      long_ma_type: "EMA",
      zigzag_percent_reversal: 1.0,
      atr_length: 14,
      zigzag_atr_multiple: 2.0,
      fibonacci_enabled: false,
      support_demand_enabled: false,
      // timezone: "America/New_York",
      // show_volume_bubbles: false,
      // show_bubbles_price: false,
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
    await saveTickerData({ strategy: "ema", row: formData });
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

          {/* Short MA Length */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Short MA Length</h3>
            <Input
              className="w-full"
              type="number"
              min={1}
              step="1"
              inputMode="numeric"
              value={formData.short_ma_length}
              onChange={(e) =>
                handlePeriodChange("short_ma_length", e.target.value)
              }
            />
          </div>

          {/* Short MA Type */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Short MA Type</h3>
            <Select
              value={formData.short_ma_type}
              onValueChange={(value) => updateFormData("short_ma_type", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMA">EMA</SelectItem>
                <SelectItem value="SMA">SMA</SelectItem>
                <SelectItem value="WilderSmoother">Wilder Smoother</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mid MA Length */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Mid MA Length</h3>
            <Input
              className="w-full"
              type="number"
              min={1}
              step="1"
              inputMode="numeric"
              value={formData.mid_ma_length}
              onChange={(e) =>
                handlePeriodChange("mid_ma_length", e.target.value)
              }
            />
          </div>

          {/* Mid MA Type */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Mid MA Type</h3>
            <Select
              value={formData.mid_ma_type}
              onValueChange={(value) => updateFormData("mid_ma_type", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMA">EMA</SelectItem>
                <SelectItem value="SMA">SMA</SelectItem>
                <SelectItem value="WilderSmoother">Wilder Smoother</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Long MA Length */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Long MA Length</h3>
            <Input
              className="w-full"
              type="number"
              min={1}
              step="1"
              inputMode="numeric"
              value={formData.long_ma_length}
              onChange={(e) =>
                handlePeriodChange("long_ma_length", e.target.value)
              }
            />
          </div>

          {/* Long MA Type */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Long MA Type</h3>
            <Select
              value={formData.long_ma_type}
              onValueChange={(value) => updateFormData("long_ma_type", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMA">EMA</SelectItem>
                <SelectItem value="SMA">SMA</SelectItem>
                <SelectItem value="WilderSmoother">Wilder Smoother</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ZigZag Reversal % */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">ZigZag Reversal %</h3>
            <Input
              className="w-full"
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              value={formData.zigzag_percent_reversal}
              onChange={(e) => {
                updateFormData(
                  "zigzag_percent_reversal",
                  Number(e.target.value) || 0
                );
              }}
            />
          </div>

          {/* ATR Length */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">ATR Length</h3>
            <Input
              className="w-full"
              type="number"
              min={1}
              step="1"
              inputMode="numeric"
              value={formData.atr_length}
              onChange={(e) => handlePeriodChange("atr_length", e.target.value)}
            />
          </div>

          {/* ATR Multiple */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">ATR Multiple</h3>
            <Input
              className="w-full"
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              value={formData.zigzag_atr_multiple}
              onChange={(e) => {
                updateFormData(
                  "zigzag_atr_multiple",
                  Number(e.target.value) || 0
                );
              }}
            />
          </div>

          {/* Enable Fibonacci */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Enable Fibonacci</h3>
            <Select
              value={formData.fibonacci_enabled.toString()}
              onValueChange={(value) =>
                updateFormData("fibonacci_enabled", value === "true")
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

          {/* Enable Support/Demand */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Enable Support/Demand</h3>
            <Select
              value={formData.support_demand_enabled.toString()}
              onValueChange={(value) =>
                updateFormData("support_demand_enabled", value === "true")
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

          {/* Timezone */}
          {/* <div className="space-y-2">
            <h3 className="font-medium text-sm">Timezone</h3>
            <Input
              className="w-full"
              type="number"
              min={1}
              step="1"
              inputMode="numeric"
              value={formData.timezone}
              onChange={(e) =>
                updateFormData("timezone", e.target.value)
              }
            />
          </div> */}

          {/* Show Volume Bubbles */}
          {/* <div className="space-y-2">
            <h3 className="font-medium text-sm">Show Volume Bubbles</h3>
            <Select
              value={formData.show_volume_bubbles.toString()}
              onValueChange={(value) =>
                updateFormData("show_volume_bubbles", value === "true")
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
          </div> */}

          {/* Show Price Bubbles */}
          {/* <div className="space-y-2">
            <h3 className="font-medium text-sm">Show Price Bubbles</h3>
            <Select
              value={formData.show_bubbles_price.toString()}
              onValueChange={(value) =>
                updateFormData("show_bubbles_price", value === "true")
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
          </div> */}
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

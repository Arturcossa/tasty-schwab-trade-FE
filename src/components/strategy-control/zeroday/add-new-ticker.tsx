"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { timeframes, ZerodayTicker } from "@/lib/zeroday-datas";
import { useState } from "react";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { useTrading } from "@/context/TradingContext";

const AddNewTicker = () => {
  const { saveTickerData } = useTrading();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ZerodayTicker>({
    symbol: "SPX",
    trade_enabled: false,
    timeframe: "5Min",
    trend_line_1: "EMA",
    period_1: 9,
    trend_line_2: "EMA",
    period_2: 21,
    schwab_quantity: 0,
    tastytrade_quantity: 0,
    call_enabled: true,
    put_enabled: true,
  });

  // Update form data helper
  const updateFormData = <K extends keyof ZerodayTicker>(field: K, value: ZerodayTicker[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Period handlers with validation
  const handlePeriodChange = (
    field: "period_1" | "period_2",
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
    if (formData.period_1 < 1) return "Period 1 must be greater than 0";
    if (formData.period_2 < 1) return "Period 2 must be greater than 0";
    if (formData.period_1 >= formData.period_2) return "Period 1 must be shorter than Period 2";
    if (formData.schwab_quantity < 0) return "Schwab quantity must be 0 or greater";
    if (formData.tastytrade_quantity < 0) return "TastyTrade quantity must be 0 or greater";
    if (formData.schwab_quantity === 0 && formData.tastytrade_quantity === 0) {
      return "At least one broker quantity must be greater than 0";
    }
    if (!formData.call_enabled && !formData.put_enabled) {
      return "At least one option type (Call or Put) must be enabled";
    }
    return null;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      symbol: "SPX",
      trade_enabled: false,
      timeframe: "5Min",
      trend_line_1: "EMA",
      period_1: 9,
      period_2: 21,
      trend_line_2: "EMA",
      schwab_quantity: 0,
      tastytrade_quantity: 0,
      call_enabled: true,
      put_enabled: true,
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
    await saveTickerData({ strategy: "zeroday", row: formData });
    setIsLoading(false);
    resetForm();
    toast.success("SPX 0-day options configuration added successfully");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add SPX 0-Day Options Configuration</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure new SPX 0-day options strategy with moving average parameters
          </p>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
            {/* Symbol Selection - Locked to SPX */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Symbol</Label>
              <Input
                value="SPX"
                disabled
                className="w-full bg-gray-50"
              />
            </div>

            {/* Trade Enabled */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Enable Strategy</Label>
              <div className="flex items-center space-x-2 h-full">
                <Switch
                  checked={formData.trade_enabled}
                  onCheckedChange={(checked) => updateFormData("trade_enabled", checked)}
                />
                <span className="text-sm">{formData.trade_enabled ? "Enabled" : "Disabled"}</span>
              </div>
            </div>

            {/* Time Frame */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Time Frame</Label>
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

            {/* Moving Average 1 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Short MA Type</Label>
              <Select
                value={formData.trend_line_1}
                onValueChange={(value) => updateFormData("trend_line_1", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select MA type" />
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
              <Label className="text-sm font-medium">Short MA Period</Label>
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

            {/* Moving Average 2 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Long MA Type</Label>
              <Select
                value={formData.trend_line_2}
                onValueChange={(value) => updateFormData("trend_line_2", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select MA type" />
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
              <Label className="text-sm font-medium">Long MA Period</Label>
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
              <Label className="text-sm font-medium">Schwab Quantity</Label>
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
              <Label className="text-sm font-medium">TastyTrade Quantity</Label>
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

            {/* Call Option Enabled */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Enable Call Options</Label>
              <div className="flex items-center space-x-2 h-full">
                <Switch
                  checked={formData.call_enabled}
                  onCheckedChange={(checked) => updateFormData("call_enabled", checked)}
                />
                <span className="text-sm">{formData.call_enabled ? "Enabled" : "Disabled"}</span>
              </div>
            </div>

            {/* Put Option Enabled */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Enable Put Options</Label>
              <div className="flex items-center space-x-2 h-full">
                <Switch
                  checked={formData.put_enabled}
                  onCheckedChange={(checked) => updateFormData("put_enabled", checked)}
                />
                <span className="text-sm">{formData.put_enabled ? "Enabled" : "Disabled"}</span>
              </div>
            </div>
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

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
import { symbols, timeframes } from "@/lib/ema-datas";
import { useState } from "react";
import { toast } from "sonner";

const AddNewTicker = () => {
  const [symbol, setSymbol] = useState("");
  const [enabled, setEnabled] = useState("false");
  const [timeFrame, setTimeFrame] = useState("");
  const [trendline1, setTrendline1] = useState("ema");
  const [period1, setPeriod1] = useState<number>(1);
  const [trendline2, setTrendline2] = useState("ema");
  const [period2, setPeriod2] = useState<number>(1);
  const [schwabQty, setSchwabQty] = useState<number>(0);
  const [tastyQty, setTastyQty] = useState<number>(0);

  const handlePeriod1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) setPeriod1(val);
    else if (e.target.value === "") setPeriod1(1);
  };

  const incrementPeriod1 = () => setPeriod1((prev) => prev + 1);
  const decrementPeriod1 = () =>
    setPeriod1((prev) => (prev > 1 ? prev - 1 : 1));

  const handlePeriod2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) setPeriod2(val);
    else if (e.target.value === "") setPeriod2(1);
  };

  const incrementPeriod2 = () => setPeriod2((prev) => prev + 1);
  const decrementPeriod2 = () =>
    setPeriod2((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddTicker = () => {
    if (!symbol) {
      return toast.error("Select a symbol!");
    } else if (!timeFrame) {
      return toast.error("Select a time frame!");
    }

    
  };

  return (
    <div className="space-y-2">
      <h2 className="font-semibold text-xl">
        Trading Parameters Configuration
      </h2>
      <Card>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-5">
          <div className="space-y-1">
            <h3>Ticker Symbol</h3>
            <Select value={symbol} onValueChange={setSymbol}>
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
          <div className="space-y-1">
            <h3>Trade Enabled</h3>
            <Select value={enabled} onValueChange={setEnabled}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">False</SelectItem>
                <SelectItem value="true">True</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <h3>Time Frame</h3>
            <Select value={timeFrame} onValueChange={setTimeFrame}>
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
          <div className="space-y-1">
            <h3>Trend Line 1</h3>
            <Select value={trendline1} onValueChange={setTrendline1}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select trend line" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ema">EMA</SelectItem>
                <SelectItem value="sma">SMA</SelectItem>
                <SelectItem value="wilder-smoother">Wilder Smoother</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <h3>Period 1</h3>
            <div className="flex items-center gap-2 relative">
              <Button
                type="button"
                onClick={decrementPeriod1}
                variant="outline"
                className="w-6 h-6 absolute px-0 left-2"
              >
                -
              </Button>
              <Input
                className="w-full text-center"
                type="number"
                min={1}
                step={1}
                value={period1}
                onChange={handlePeriod1Change}
              ></Input>
              <Button
                type="button"
                onClick={incrementPeriod1}
                variant="outline"
                className="w-6 h-6 absolute px-0 right-2"
              >
                +
              </Button>
            </div>
          </div>
          <div className="space-y-1">
            <h3>Trend Line 2</h3>
            <Select value={trendline2} onValueChange={setTrendline2}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select trend line" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ema">EMA</SelectItem>
                <SelectItem value="sma">SMA</SelectItem>
                <SelectItem value="wilder-smoother">Wilder Smoother</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <h3>Period 2</h3>
            <div className="flex items-center gap-2 relative">
              <Button
                type="button"
                onClick={decrementPeriod2}
                variant="outline"
                className="w-6 h-6 absolute px-0 left-2"
              >
                -
              </Button>
              <Input
                className="w-full text-center"
                type="number"
                min={1}
                step={1}
                value={period2}
                onChange={handlePeriod2Change}
              ></Input>
              <Button
                type="button"
                onClick={incrementPeriod2}
                variant="outline"
                className="w-6 h-6 absolute px-0 right-2"
              >
                +
              </Button>
            </div>
          </div>
          <div className="space-y-1">
            <h3>Schwab Quantity</h3>
            <Input
              className="w-full"
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              value={schwabQty}
              onChange={(e) => setSchwabQty(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <h3>TastyTrade Quantity</h3>
            <Input
              className="w-full"
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              value={tastyQty}
              onChange={(e) => setTastyQty(Number(e.target.value))}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddTicker} className="cursor-pointer">
            Add Ticker
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddNewTicker;

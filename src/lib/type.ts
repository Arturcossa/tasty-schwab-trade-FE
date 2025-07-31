import { symbols, timeframes, trendline } from "./ema-datas";
import { symbols, timeframes, trendline } from "./zeroday-datas";

type EMASymbolType = typeof symbols[number]
type EMATimeFrameType = typeof timeframes[number]
type TrendlineType = typeof trendline[number]

type ZerodaySymbolType = typeof symbols[number]
type ZerodayTimeFrameType = typeof timeframes[number]

export type EmaTicker = {
  symbol: EMASymbolType;
  trade_enabled: boolean;
  timeframe: EMATimeFrameType;
  trend_line_1: TrendlineType;
  period_1: number;
  trend_line_2: TrendlineType;
  period_2: number;
  schwab_quantity: number;
  tastytrade_quantity: number;
}

export type ZerodayTicker = {
  symbol: ZerodaySymbolType;
  trade_enabled: boolean;
  timeframe: ZerodayTimeFrameType;
  trend_line_1: TrendlineType;
  period_1: number;
  trend_line_2: TrendlineType;
  period_2: number;
  schwab_quantity: number;
  tastytrade_quantity: number;
}

export type SupertrendTicker = {
  symbol: string;
  enabled: boolean;
  timeFrame: string;
  schwabQty: number;
  tastyQty: number;
}

export type TickerData = {
  ema: EmaTicker[];
  supertrend: SupertrendTicker[];
  zeroday: ZerodayTicker[]
}
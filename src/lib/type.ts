import { symbols, timeframes, trendline } from "./ema-datas";

type SymbolType = typeof symbols[number]
type TimeFrameType = typeof timeframes[number]
type TrendlineType = typeof trendline[number]

export type EmaTicker = {
  symbol: SymbolType;
  trade_enabled: boolean;
  timeframe: TimeFrameType;
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
  supertrend: SupertrendTicker[]
}
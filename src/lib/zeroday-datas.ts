export const symbols = [
  'SPX',
]

export const timeframes = [
  "1Min",
  "2Min",
  "3Min",
  "4Min",
  "5Min",
  "15Min",
  "30Min",
]

export const trendline = [
  'EMA',
  'SMA',
  'WilderSmoother'
]

type SymbolType = typeof symbols[number]
type TimeFrameType = typeof timeframes[number]
type TrendlineType = typeof trendline[number]

export type ZerodayTicker = {
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
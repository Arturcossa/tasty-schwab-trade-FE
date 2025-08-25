export const symbols = [
  'SPX',
]

export const timeframes = [
  "1Min",
  "2Min",
  "5Min",
  "15Min",
  "30Min",
  "1Hour",
  "4Hour",
  "1Day",
  "144t",
  "288t",
  "512t",
  "516t",
  "703t",
  "910t",
  "1160t",
  "1275t",
  "1600t",
  "2074t",
  "2871t",
  "3727t",
  "3827t"
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
  call_enabled: boolean;
  put_enabled: boolean;
}
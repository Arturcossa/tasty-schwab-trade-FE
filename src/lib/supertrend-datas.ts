export const symbols = [
  'MSTR',
  'TSLA',
  'NVDA',
  '/MES',
  '/ES',
  '/MNQ',
  '/NQ',
  '/M2K',
  '/RTY',
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

export type SupertrendTicker = {
  symbol: SymbolType;
  trade_enabled: boolean;
  timeframe: TimeFrameType;
  schwab_quantity: number;
  tastytrade_quantity: number;
  
  short_ma_length: number,
  short_ma_type: TrendlineType,
  mid_ma_length: number,
  mid_ma_type: TrendlineType,
  long_ma_length: number,
  long_ma_type: TrendlineType,

  zigzag_percent_reversal: number,
  atr_length: number,
  zigzag_atr_multiple: number,

  fibonacci_enabled: boolean,
  support_demand_enabled: boolean,
  // timezone: string,
  // show_volume_bubbles: boolean,
  // show_bubbles_price: boolean,
}
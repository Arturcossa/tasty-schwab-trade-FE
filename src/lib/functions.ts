import { EmaTicker } from "./ema-datas";
import { SupertrendTicker } from "./supertrend-datas";

export function formatTimeFrame(raw: string): string {
  if (raw.endsWith('h')) return `${raw.slice(0, -1)}Hour`;
  if (raw.endsWith('d')) return `${raw.slice(0, -1)}Day`;
  if (raw.endsWith('t')) return `${raw.slice(0, -1)}t`;
  return `${raw}Min`;
}

export function convertBackendDataToEmaArray(data: Record<string, string[]>): EmaTicker[] {
  return Object.entries(data).map(([symbol, values]) => ({
    symbol,
    timeframe: formatTimeFrame(values[0]),
    schwab_quantity: Number(values[1]),
    trade_enabled: values[2].toUpperCase() === 'TRUE',
    tastytrade_quantity: Number(values[3]),
    trend_line_1: values[4],
    period_1: parseInt(values[5], 10),
    trend_line_2: values[6],
    period_2: parseInt(values[7], 10)
  }))
}

export function convertBackendDataToSupertrendArray(data: Record<string, string[]>): SupertrendTicker[] {
  return Object.entries(data).map(([symbol, values]) => ({
    symbol,
    timeframe: formatTimeFrame(values[0]),
    schwab_quantity: Number(values[1]),
    trade_enabled: values[2].toUpperCase() === 'TRUE',
    tastytrade_quantity: Number(values[3]),
    short_ma_length:Number(values[4]),
    short_ma_type: values[5],
    mid_ma_length: Number(values[6]),
    mid_ma_type: values[7],
    long_ma_length: Number(values[8]),
    long_ma_type:values[9],
    zigzag_percent_reversal: Number(values[10]),
    atr_length: Number(values[11]),
    zigzag_atr_multiple: Number(values[12]),
    fibonacci_enabled: values[13].toUpperCase() === 'TRUE',
    support_demand_enabled: values[14].toUpperCase() === 'TRUE',
  }))
}
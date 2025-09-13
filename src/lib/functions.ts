import { EmaTicker } from "./ema-datas";
import { SupertrendTicker } from "./supertrend-datas";
import { ZerodayTicker } from "./zeroday-datas";

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
  }))
}

export function convertBackendDataToZerodayArray(data: Record<string, string[]>): ZerodayTicker[] {
  return Object.entries(data).map(([symbol, values]) => ({
    symbol,
    timeframe: formatTimeFrame(values[0]),
    schwab_quantity: Number(values[1]),
    trade_enabled: values[2].toUpperCase() === 'TRUE',
    tastytrade_quantity: Number(values[3]),
    trend_line_1: values[4],
    period_1: Number(values[5]),
    trend_line_2: values[6],
    period_2: Number(values[7]),
  }))
}
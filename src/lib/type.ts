import { EmaTicker } from "./ema-datas";
import { SupertrendTicker } from "./supertrend-datas";
import { ZerodayTicker } from "./zeroday-datas";


export type TickerData = {
  ema: EmaTicker[];
  supertrend: SupertrendTicker[];
  zeroday: ZerodayTicker[]
}
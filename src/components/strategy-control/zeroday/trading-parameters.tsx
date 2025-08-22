"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Check, X, Loader2Icon } from "lucide-react";
import { timeframes, ZerodayTicker } from "@/lib/zeroday-datas";
import { useTrading } from "@/context/TradingContext";

const trendlineOptions = [
  { value: "EMA", label: "EMA" },
  { value: "SMA", label: "SMA" },
  { value: "WilderSmoother", label: "Wilder Smoother" },
];

const TradingParameters = () => {
  const { tickerData, getTickerData, saveTickerData, deleteTickerData } =
    useTrading();
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<ZerodayTicker | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getTickerData("zeroday");
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleEdit = (row: ZerodayTicker, idx: number) => {
    setEditingIdx(idx);
    setEditRow({ ...row });
  };

  const handleCancel = () => {
    setEditingIdx(null);
    setEditRow(null);
  };

  const handleToggleTradeEnabled = async (row: ZerodayTicker, newValue: boolean) => {
    const updatedRow = { ...row, trade_enabled: newValue };
    await saveTickerData({
      strategy: "zeroday",
      row: updatedRow,
    });
  };

  const handleToggleCallEnabled = async (row: ZerodayTicker, newValue: boolean) => {
    const updatedRow = { ...row, call_enabled: newValue };
    await saveTickerData({
      strategy: "zeroday",
      row: updatedRow,
    });
  };

  const handleTogglePutEnabled = async (row: ZerodayTicker, newValue: boolean) => {
    const updatedRow = { ...row, put_enabled: newValue };
    await saveTickerData({
      strategy: "zeroday",
      row: updatedRow,
    });
  };

  // Filter to show only SPX tickers
  const spxTickers = tickerData.zeroday?.filter(ticker => ticker.symbol === 'SPX') || [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">SPX 0-Day Options Configuration</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure moving average parameters and option settings for SPX 0-day options strategy
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Enable</TableHead>
                  <TableHead>Call</TableHead>
                  <TableHead>Put</TableHead>
                  <TableHead>TF</TableHead>
                  <TableHead>MA1</TableHead>
                  <TableHead>P1</TableHead>
                  <TableHead>MA2</TableHead>
                  <TableHead>P2</TableHead>
                  <TableHead>Schwab Qty</TableHead>
                  <TableHead>Tasty Qty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Loader2Icon className="animate-spin" />
                        <div className="text-sm text-muted-foreground">
                          Loading SPX configuration
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : spxTickers.length > 0 ? (
                  spxTickers.map((row, idx) => (
                    <TableRow
                      key={idx}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {row.symbol}
                      </TableCell>

                      {/* Inline Enable Toggle */}
                      <TableCell>
                        <Switch
                          checked={row.trade_enabled}
                          onCheckedChange={(checked) => handleToggleTradeEnabled(row, checked)}
                          aria-label="Toggle trading"
                        />
                      </TableCell>

                      {/* Call Enable Toggle */}
                      <TableCell>
                        <Switch
                          checked={row.call_enabled}
                          onCheckedChange={(checked) => handleToggleCallEnabled(row, checked)}
                          disabled={!row.trade_enabled}
                          aria-label="Toggle call options"
                        />
                      </TableCell>

                      {/* Put Enable Toggle */}
                      <TableCell>
                        <Switch
                          checked={row.put_enabled}
                          onCheckedChange={(checked) => handleTogglePutEnabled(row, checked)}
                          disabled={!row.trade_enabled}
                          aria-label="Toggle put options"
                        />
                      </TableCell>

                      {editingIdx === idx ? (
                        <>
                          <TableCell>
                            <Select
                              value={editRow?.timeframe}
                              onValueChange={(val) =>
                                setEditRow(r => (r ? { ...r, timeframe: val } : r))
                              }
                            >
                              <SelectTrigger className="w-24 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeframes.map((opt) => (
                                  <SelectItem
                                    className="text-xs"
                                    key={opt}
                                    value={opt}
                                  >
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={editRow?.trend_line_1}
                              onValueChange={(val) =>
                                setEditRow(r => (r ? { ...r, trend_line_1: val } : r))
                              }
                            >
                              <SelectTrigger className="w-full text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {trendlineOptions.map((opt) => (
                                  <SelectItem
                                    className="text-xs"
                                    key={opt.value}
                                    value={opt.value}
                                  >
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={1}
                              value={editRow?.period_1}
                              onChange={(e) =>
                                setEditRow(r => (r ? { ...r, period_1: Number(e.target.value) } : r))
                              }
                              className="w-20 text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={editRow?.trend_line_2}
                              onValueChange={(val) =>
                                setEditRow(r => (r ? { ...r, trend_line_2: val } : r))
                              }
                            >
                              <SelectTrigger className="w-full text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {trendlineOptions.map((opt) => (
                                  <SelectItem
                                    className="text-xs"
                                    key={opt.value}
                                    value={opt.value}
                                  >
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={1}
                              value={editRow?.period_2}
                              onChange={(e) =>
                                setEditRow(r => (r ? { ...r, period_2: Number(e.target.value) } : r))
                              }
                              className="w-20 text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              step="any"
                              value={editRow?.schwab_quantity}
                              onChange={(e) =>
                                setEditRow(r => (r ? { ...r, schwab_quantity: Number(e.target.value) } : r))
                              }
                              className="w-20 text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              step="any"
                              value={editRow?.tastytrade_quantity}
                              onChange={(e) =>
                                setEditRow(r => (r ? { ...r, tastytrade_quantity: Number(e.target.value) } : r))
                              }
                              className="w-20 text-xs"
                            />
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={async () => {
                                if (editRow) {
                                  await saveTickerData({
                                    strategy: "zeroday",
                                    row: editRow,
                                  });
                                  setEditingIdx(null);
                                  setEditRow(null);
                                }
                              }}
                              aria-label="Save"
                            >
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={handleCancel}
                              aria-label="Cancel"
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="text-sm">{row.timeframe}</TableCell>
                          <TableCell className="text-sm uppercase">
                            {row.trend_line_1}
                          </TableCell>
                          <TableCell className="text-sm">{row.period_1}</TableCell>
                          <TableCell className="text-sm uppercase">
                            {row.trend_line_2}
                          </TableCell>
                          <TableCell className="text-sm">{row.period_2}</TableCell>
                          <TableCell className="text-sm">{row.schwab_quantity}</TableCell>
                          <TableCell className="text-sm">{row.tastytrade_quantity}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(row, idx)}
                              aria-label="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to delete this SPX configuration?"
                                  )
                                ) {
                                  deleteTickerData({
                                    strategy: "zeroday",
                                    row,
                                  });
                                }
                              }}
                              aria-label="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-lg font-medium">
                          No SPX Configuration Found
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Add SPX 0-day options configuration above to get started
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingParameters;

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  const handleEdit = (row: any, idx: number) => {
    setEditingIdx(idx);
    setEditRow({ ...row });
  };

  const handleCancel = () => {
    setEditingIdx(null);
    setEditRow(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-xl">Current Trading Parameters</h2>
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[850px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Trade</TableHead>
                  <TableHead>TF</TableHead>
                  <TableHead>TL1</TableHead>
                  <TableHead>P1</TableHead>
                  <TableHead>TL2</TableHead>
                  <TableHead>P2</TableHead>
                  <TableHead>SQty</TableHead>
                  <TableHead>TQty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-sm text-muted-foreground">
                          <Loader2Icon className="animate-spin" />
                          Loading
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : tickerData.zeroday && tickerData.zeroday.length > 0 ? (
                  tickerData.zeroday.map((row, idx) => (
                    <TableRow
                      key={idx}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {row.symbol}
                      </TableCell>
                      {editingIdx === idx ? (
                        <>
                          <TableCell>
                            <Select
                              value={String(editRow?.trade_enabled)}
                              onValueChange={(val) =>
                                setEditRow((r: any) => ({
                                  ...r,
                                  trade_enabled: val === "true",
                                }))
                              }
                            >
                              <SelectTrigger className="w-24 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem className="text-xs" value="true">
                                  Enabled
                                </SelectItem>
                                <SelectItem className="text-xs" value="false">
                                  Disabled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={editRow?.timeframe}
                              onValueChange={(val) =>
                                setEditRow((r: any) => ({
                                  ...r,
                                  timeframe: val,
                                }))
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
                                setEditRow((r: any) => ({
                                  ...r,
                                  trend_line_1: val,
                                }))
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
                                setEditRow((r: any) => ({
                                  ...r,
                                  period_1: Number(e.target.value),
                                }))
                              }
                              className="w-20 text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={editRow?.trend_line_2}
                              onValueChange={(val) =>
                                setEditRow((r: any) => ({
                                  ...r,
                                  trend_line_2: val,
                                }))
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
                                setEditRow((r: any) => ({
                                  ...r,
                                  period_2: Number(e.target.value),
                                }))
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
                                setEditRow((r: any) => ({
                                  ...r,
                                  schwab_quantity: Number(e.target.value),
                                }))
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
                                setEditRow((r: any) => ({
                                  ...r,
                                  tastytrade_quantity: Number(e.target.value),
                                }))
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
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                row.trade_enabled
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {row.trade_enabled ? "Enabled" : "Disabled"}
                            </span>
                          </TableCell>
                          <TableCell>{row.timeframe}</TableCell>
                          <TableCell className="uppercase">
                            {row.trend_line_1}
                          </TableCell>
                          <TableCell>{row.period_1}</TableCell>
                          <TableCell className="uppercase">
                            {row.trend_line_2}
                          </TableCell>
                          <TableCell>{row.period_2}</TableCell>
                          <TableCell>{row.schwab_quantity}</TableCell>
                          <TableCell>{row.tastytrade_quantity}</TableCell>
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
                                    "Are you sure you want to delete this ticker?"
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
                      colSpan={10}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-lg font-medium">
                          No results found
                        </div>
                        <div className="text-sm text-muted-foreground">
                          No trading parameters configured yet
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

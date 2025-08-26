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
import { Switch } from "@/components/ui/switch";
import { SupertrendTicker, timeframes } from "@/lib/supertrend-datas";
import { useTrading } from "@/context/TradingContext";

const TradingParameters = () => {
  const { tickerData, getTickerData, saveTickerData, deleteTickerData } =
    useTrading();
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<SupertrendTicker | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      getTickerData("supertrend");
      setIsLoading(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (row: SupertrendTicker, idx: number) => {
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
                  <TableHead>SQty</TableHead>
                  <TableHead>TQty</TableHead>
                  <TableHead>ZigZag Method</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={17}
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
                ) : tickerData.supertrend &&
                  tickerData.supertrend.length > 0 ? (
                  tickerData.supertrend.map((row, idx) => (
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
                                setEditRow((r) => (r ? { ...r, trade_enabled: val === "true" } : r))
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
                                setEditRow((r) => (r ? { ...r, timeframe: val } : r))
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
                            <Input
                              type="number"
                              min={0}
                              step="any"
                              value={editRow?.schwab_quantity}
                              onChange={(e) =>
                                setEditRow((r) => (r ? { ...r, schwab_quantity: Number(e.target.value) } : r))
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
                                setEditRow((r) => (r ? { ...r, tastytrade_quantity: Number(e.target.value) } : r))
                              }
                              className="w-20 text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={editRow?.zigzag_method}
                              onValueChange={(val) =>
                                setEditRow((r) => (r ? { ...r, zigzag_method: val as "average" | "high_low" } : r))
                              }
                            >
                              <SelectTrigger className="w-full text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="average">Average</SelectItem>
                                <SelectItem value="high_low">High/Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={async () => {
                                if (editRow) {
                                  await saveTickerData({
                                    strategy: "supertrend",
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
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={row.trade_enabled}
                                onCheckedChange={async (val) => {
                                  await saveTickerData({ strategy: "supertrend", row: { ...row, trade_enabled: val } });
                                }}
                              />
                              <span className="text-xs text-muted-foreground">
                                {row.trade_enabled ? "Enabled" : "Disabled"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{row.timeframe}</TableCell>
                          <TableCell>{row.schwab_quantity}</TableCell>
                          <TableCell>{row.tastytrade_quantity}</TableCell>
                          <TableCell>{row.zigzag_method}</TableCell>
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
                                    strategy: "supertrend",
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
                      colSpan={17}
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

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
import { Pencil, Trash2, Check, X } from "lucide-react";
import { timeframes } from "@/lib/ema-datas";
import { useTrading } from "@/context/TradingContext";
import { EmaTicker } from "@/lib/type";

const trendlineOptions = [
  { value: "EMA", label: "EMA" },
  { value: "SMA", label: "SMA" },
  { value: "WilderSmoother", label: "Wilder Smoother" },
];

const TradingParameters = ({
  onEdit = (row: any) => {},
  onDelete = (row: any) => {},
}) => {
  const { tickerData, getTickerData, setTickerData } = useTrading();
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<EmaTicker | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getTickerData("ema");
      setIsLoading(false);
    };
    
    fetchData();
  }, [getTickerData]);

  const handleEdit = (row: any, idx: number) => {
    setEditingIdx(idx);
    setEditRow({ ...row });
  };

  const handleCancel = () => {
    setEditingIdx(null);
    setEditRow(null);
  };

  const handleSave = async () => {
    if (!editRow) return;
    
    setIsLoading(true);
    try {
      // Call your edit API here
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-ticker`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("TIM_TOKEN")}`,
          },
          body: JSON.stringify(editRow),
        }
      );

      if (response.ok) {
        // Refresh data after successful edit
        await getTickerData("ema");
        onEdit(editRow);
      }
    } catch (error) {
      console.error("Error updating ticker:", error);
    } finally {
      setIsLoading(false);
      setEditingIdx(null);
      setEditRow(null);
    }
  };

  const handleDelete = async (row: EmaTicker) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-ticker`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("TIM_TOKEN")}`,
          },
          body: JSON.stringify({ symbol: row.symbol }),
        }
      );

      if (response.ok) {
        // Refresh data after successful delete
        await getTickerData("ema");
        onDelete(row);
      }
    } catch (error) {
      console.error("Error deleting ticker:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="font-semibold text-xl">Current Trading Parameters</h2>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticker</TableHead>
                <TableHead>Trade</TableHead>
                <TableHead>Time Frame</TableHead>
                <TableHead>Trendline 1</TableHead>
                <TableHead>Period 1</TableHead>
                <TableHead>Trendline 2</TableHead>
                <TableHead>Period 2</TableHead>
                <TableHead>Schwab Qty</TableHead>
                <TableHead>Tasty Qty</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickerData.ema.map((row, idx) => (
                <TableRow
                  key={idx}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <TableCell className="font-medium">{row.symbol}</TableCell>
                  {editingIdx === idx ? (
                    <>
                      <TableCell>
                        <Select
                          value={String(editRow?.trade_enabled)}
                          onValueChange={(val) =>
                            setEditRow((r: any) => ({ ...r, trade_enabled: val === "true" }))
                          }
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Enabled</SelectItem>
                            <SelectItem value="false">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={editRow?.timeframe}
                          onValueChange={(val) =>
                            setEditRow((r: any) => ({ ...r, timeframe: val }))
                          }
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeframes.map((opt) => (
                              <SelectItem key={opt} value={opt}>
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
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {trendlineOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
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
                          className="w-20"
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
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {trendlineOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
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
                          className="w-20"
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
                          className="w-20"
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
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleSave}
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
                          onClick={() => handleDelete(row)}
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingParameters;

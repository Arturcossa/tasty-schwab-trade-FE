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

const trendlineOptions = [
  { value: "EMA", label: "EMA" },
  { value: "SMA", label: "SMA" },
  { value: "WilderSmoother", label: "Wilder Smoother" },
];

type TradingRow = {
  symbol: string;
  enabled: string;
  timeFrame: string;
  trendline1: string;
  period1: number;
  trendline2: string;
  period2: number;
  schwabQty: number;
  tastyQty: number;
  [key: string]: string | number;
};

const TradingParameters = ({
  data = [
    {
      symbol: "AAPL",
      enabled: "true",
      timeFrame: "1Day",
      trendline1: "EMA",
      period1: 9,
      trendline2: "SMA",
      period2: 21,
      schwabQty: 10,
      tastyQty: 5,
    },
  ] as TradingRow[],
  onEdit = (row: any) => {},
  onDelete = (row: any) => {},
}) => {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<any>(null);

  const handleEdit = (row: any, idx: number) => {
    setEditingIdx(idx);
    setEditRow({ ...row });
  };

  const handleCancel = () => {
    setEditingIdx(null);
    setEditRow(null);
  };

  const handleSave = () => {
    const original = data[editingIdx!];
    const isChanged = Object.keys(editRow).some(
      (key) => editRow[key] !== original[key]
    );
    if (isChanged) {
      onEdit(editRow);
    }
    setEditingIdx(null);
    setEditRow(null);
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
              {data.map((row, idx) => (
                <TableRow
                  key={idx}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <TableCell className="font-medium">{row.symbol}</TableCell>
                  {editingIdx === idx ? (
                    <>
                      <TableCell>
                        <Select
                          value={editRow.enabled}
                          onValueChange={(val) =>
                            setEditRow((r: any) => ({ ...r, enabled: val }))
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
                          value={editRow.timeFrame}
                          onValueChange={(val) =>
                            setEditRow((r: any) => ({ ...r, timeFrame: val }))
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
                          value={editRow.trendline1}
                          onValueChange={(val) =>
                            setEditRow((r: any) => ({ ...r, trendline1: val }))
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
                          value={editRow.period1}
                          onChange={(e) =>
                            setEditRow((r: any) => ({
                              ...r,
                              period1: Number(e.target.value),
                            }))
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={editRow.trendline2}
                          onValueChange={(val) =>
                            setEditRow((r: any) => ({ ...r, trendline2: val }))
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
                          value={editRow.period2}
                          onChange={(e) =>
                            setEditRow((r: any) => ({
                              ...r,
                              period2: Number(e.target.value),
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
                          value={editRow.schwabQty}
                          onChange={(e) =>
                            setEditRow((r: any) => ({
                              ...r,
                              schwabQty: Number(e.target.value),
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
                          value={editRow.tastyQty}
                          onChange={(e) =>
                            setEditRow((r: any) => ({
                              ...r,
                              tastyQty: Number(e.target.value),
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
                            row.enabled === "true"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {row.enabled === "true" ? "Enabled" : "Disabled"}
                        </span>
                      </TableCell>
                      <TableCell>{row.timeFrame}</TableCell>
                      <TableCell className="uppercase">
                        {row.trendline1}
                      </TableCell>
                      <TableCell>{row.period1}</TableCell>
                      <TableCell className="uppercase">
                        {row.trendline2}
                      </TableCell>
                      <TableCell>{row.period2}</TableCell>
                      <TableCell>{row.schwabQty}</TableCell>
                      <TableCell>{row.tastyQty}</TableCell>
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
                          onClick={() => onDelete(row)}
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

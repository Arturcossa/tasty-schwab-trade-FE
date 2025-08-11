"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2Icon, Play, Square, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useTrading } from "@/context/TradingContext";

const ManualTrigger = () => {
  const { user } = useAuth();
  const { tickerData } = useTrading();
  const [isLoading, setIsLoading] = useState(false);
  const [callEnabled, setCallEnabled] = useState(true);
  const [putEnabled, setPutEnabled] = useState(true);
  
  // Get SPX ticker data to check if call/put options are enabled
  useEffect(() => {
    if (tickerData?.zeroday) {
      const spxTicker = tickerData.zeroday.find(ticker => ticker.symbol === 'SPX');
      if (spxTicker) {
        setCallEnabled(spxTicker.call_enabled);
        setPutEnabled(spxTicker.put_enabled);
      }
    }
  }, [tickerData]);

  const handleManualTrigger = async (action: 'buy_call' | 'buy_put' | 'close_position') => {
    if (!user?.token) {
      toast.error("Authentication required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/manual-spx-trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          action: action,
          symbol: 'SPX'
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Trade executed successfully');
      } else {
        toast.error(data.error || 'Failed to execute trade');
      }
    } catch (error) {
      console.error('Manual trigger error:', error);
      toast.error('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Manual Trade Trigger
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manually execute SPX 0-day option trades to avoid slippage from automatic triggers
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Manual Trigger Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <Button
              onClick={() => handleManualTrigger('buy_call')}
              disabled={isLoading || !callEnabled}
              className={`${callEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'} text-white`}
              size="lg"
            >
              {isLoading ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Buy Call
            </Button>
            <div className="flex items-center justify-center text-xs mt-1">
              {callEnabled ? (
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" /> Enabled
                </span>
              ) : (
                <span className="flex items-center text-red-600">
                  <XCircle className="h-3 w-3 mr-1" /> Disabled
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Button
              onClick={() => handleManualTrigger('buy_put')}
              disabled={isLoading || !putEnabled}
              className={`${putEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400'} text-white`}
              size="lg"
            >
              {isLoading ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Buy Put
            </Button>
            <div className="flex items-center justify-center text-xs mt-1">
              {putEnabled ? (
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" /> Enabled
                </span>
              ) : (
                <span className="flex items-center text-red-600">
                  <XCircle className="h-3 w-3 mr-1" /> Disabled
                </span>
              )}
            </div>
          </div>

          <Button
            onClick={() => handleManualTrigger('close_position')}
            disabled={isLoading}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
            size="lg"
          >
            {isLoading ? (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Square className="mr-2 h-4 w-4" />
            )}
            Close Position
          </Button>
        </div>

        {/* Configuration Warning */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                Configuration Required
              </p>
              <p className="text-xs text-blue-700 mt-1">
                To place actual trades, configure the Schwab and TastyTrade quantities in the SPX 0-day options settings. Currently, both are set to 0, so no orders will be placed.
              </p>
            </div>
          </div>
        </div>

        {/* Manual Trading Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Manual Trading Warning
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Manual triggers bypass automatic strategy checks. Ensure you have proper risk management in place and understand the current market conditions before executing trades.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualTrigger;
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface TickDataConfig {
  symbol: string;
  tickInterval: string;
  isSubscribed: boolean;
}

export default function TickDataManager() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [subscriptions, setSubscriptions] = useState<TickDataConfig[]>([]);
  const [availableSymbols, setAvailableSymbols] = useState<string[]>([]);
  const [availableIntervals, setAvailableIntervals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const supportedFutures = ['/MNQ', '/MES', '/M2K', '/NQ', '/ES', '/RTY'];
  const defaultIntervals = ['512t', '1160t', '1600t', '2000t', '3000t', '4000t', '5000t', '10000t'];

  useEffect(() => {
    setAvailableSymbols(supportedFutures);
    setAvailableIntervals(defaultIntervals);
    
    // Initialize subscriptions
    const initialSubscriptions = supportedFutures.map(symbol => ({
      symbol,
      tickInterval: getDefaultInterval(symbol),
      isSubscribed: false
    }));
    setSubscriptions(initialSubscriptions);
  }, []);

  const getDefaultInterval = (symbol: string) => {
    const defaults: { [key: string]: string } = {
      '/MNQ': '512t',
      '/MES': '512t',
      '/M2K': '1160t',
      '/NQ': '1600t',
      '/ES': '2000t',
      '/RTY': '1160t'
    };
    return defaults[symbol] || '512t';
  };

  const connectToTickData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tick-data/connect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setIsConnected(true);
        toast.success('Connected to TastyTrade tick data feed');
      } else {
        toast.error(data.error || 'Failed to connect');
      }
    } catch (error) {
      toast.error('Error connecting to tick data feed');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToTickData = async (symbol: string, tickInterval: string) => {
    try {
      const response = await fetch('/api/tick-data/subscribe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ symbol, tick_interval: tickInterval })
      });

      const data = await response.json();
      if (data.success) {
        setSubscriptions(prev => 
          prev.map(sub => 
            sub.symbol === symbol 
              ? { ...sub, isSubscribed: true }
              : sub
          )
        );
        toast.success(`Subscribed to ${tickInterval} tick data for ${symbol}`);
      } else {
        toast.error(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      toast.error('Error subscribing to tick data');
    }
  };

  const unsubscribeFromTickData = async (symbol: string) => {
    try {
      const response = await fetch('/api/tick-data/unsubscribe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ symbol })
      });

      const data = await response.json();
      if (data.success) {
        setSubscriptions(prev => 
          prev.map(sub => 
            sub.symbol === symbol 
              ? { ...sub, isSubscribed: false }
              : sub
          )
        );
        toast.success(`Unsubscribed from tick data for ${symbol}`);
      } else {
        toast.error(data.error || 'Failed to unsubscribe');
      }
    } catch (error) {
      toast.error('Error unsubscribing from tick data');
    }
  };

  const handleIntervalChange = (symbol: string, newInterval: string) => {
    setSubscriptions(prev => 
      prev.map(sub => 
        sub.symbol === symbol 
          ? { ...sub, tickInterval: newInterval }
          : sub
      )
    );
  };

  const handleSubscriptionToggle = (symbol: string, tickInterval: string, isSubscribed: boolean) => {
    if (isSubscribed) {
      unsubscribeFromTickData(symbol);
    } else {
      subscribeToTickData(symbol, tickInterval);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>📊 TastyTrade Tick Data Manager</span>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            <Button 
              onClick={connectToTickData} 
              disabled={loading || isConnected}
              size="sm"
            >
              {loading ? "Connecting..." : "Connect"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          Manage real-time tick data subscriptions for futures trading. 
          Configure tick intervals for each symbol to enable high-frequency trading strategies.
        </div>
        
        <div className="grid gap-4">
          {subscriptions.map((subscription) => (
            <div key={subscription.symbol} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="font-medium">{subscription.symbol}</div>
                <Select 
                  value={subscription.tickInterval} 
                  onValueChange={(value) => handleIntervalChange(subscription.symbol, value)}
                  disabled={subscription.isSubscribed}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIntervals.map((interval) => (
                      <SelectItem key={interval} value={interval}>
                        {interval}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={subscription.isSubscribed}
                  onCheckedChange={() => handleSubscriptionToggle(
                    subscription.symbol, 
                    subscription.tickInterval, 
                    subscription.isSubscribed
                  )}
                  disabled={!isConnected}
                />
                <Label className="text-sm">
                  {subscription.isSubscribed ? "Subscribed" : "Not Subscribed"}
                </Label>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">📋 Tick Data Information</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>512t:</strong> Very high frequency - 512 ticks per bar</li>
            <li>• <strong>1160t:</strong> High frequency - 1160 ticks per bar</li>
            <li>• <strong>1600t:</strong> Medium-high frequency - 1600 ticks per bar</li>
            <li>• <strong>2000t+:</strong> Lower frequency - suitable for less volatile periods</li>
            <li>• Tick data triggers trading signals based on moving average crossovers</li>
            <li>• Supports all existing strategies (EMA, Supertrend, SPX 0DTE)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 
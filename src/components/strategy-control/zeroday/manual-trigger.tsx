"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2Icon, Play, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const ManualTrigger = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleManualTrigger = async (action: 'put' | 'call' | 'close') => {
    if (!user?.token) {
      toast.error("Authentication required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/manual-trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          ticker: 'SPX',
          action: action,
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Trade executed successfully');
        // Refresh position data
        setTimeout(() => {
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/current-position?ticker=SPX&strategy=zeroday`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }).then(res => res.json());
        }, 1000);
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <Button
              onClick={() => handleManualTrigger('call')}
              disabled={isLoading}
              className={`bg-green-600 hover:bg-green-700 text-white`}
              size="lg"
            >
              {isLoading ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Buy Call
            </Button>
          </div>

          <div className="flex flex-col gap-1">
            <Button
              onClick={() => handleManualTrigger('put')}
              disabled={isLoading}
              className={`bg-red-600 hover:bg-red-700 text-white`}
              size="lg"
            >
              {isLoading ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Buy Put
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            <Button
              onClick={() => handleManualTrigger('close')}
              disabled={isLoading}
              className={`bg-red-600 hover:bg-red-700 text-white`}
              size="lg"
            >
              {isLoading ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Close Position
            </Button>
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
              <p className="text-xs text-amber-700 mt-1 leading-5">
                Manual triggers bypass automatic strategy checks and execute immediately. Use these buttons to avoid slippage from automatic triggers. 
                Strategy must be running to use manual triggers. Current position will be closed before opening new position.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualTrigger;
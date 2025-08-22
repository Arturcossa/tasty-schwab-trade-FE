"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import StrategyEma from "@/components/strategy-control/ema";
import StrategySuperTrend from "@/components/strategy-control/super-trend";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StrategyZeroDay from "@/components/strategy-control/zeroday";
import { useTrading } from "@/context/TradingContext";
import StrategyToolbar from "@/components/strategy-control/strategy-toolbar";

const StrategyControl = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { currentStrategy, setCurrentStrategy } = useTrading()

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="space-y-6">
        <StrategyToolbar />
        <Tabs defaultValue="ema" className="w-full" value={currentStrategy} onValueChange={(value) => setCurrentStrategy(value as "ema" | "supertrend" | "zeroday")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ema">📊 EMA Crossover</TabsTrigger>
            <TabsTrigger value="supertrend">📈 Supertrend</TabsTrigger>
            <TabsTrigger value="zeroday">⚡ SPX 0DTE Options</TabsTrigger>
          </TabsList>
          <TabsContent value="ema" className="w-full">
            <StrategyEma />
          </TabsContent>
          <TabsContent value="supertrend" className="w-full">
            <StrategySuperTrend />
          </TabsContent>
          <TabsContent value="zeroday" className="w-full">
            <StrategyZeroDay />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StrategyControl;

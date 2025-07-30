"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTrading } from "@/context/TradingContext";
import { useRouter } from "next/navigation";
import StrategyEma from "@/components/strategy-control/ema";
import StrategySuperTrend from "@/components/strategy-control/super-trend";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StrategyControl = () => {
  const { user } = useAuth();
  const { schwabToken, setIsOpenTokenValidModal, isTokenValidated } = useTrading();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Show modal on first load only if token is not validated
  useEffect(() => {
    if (user && !isTokenValidated) {
      setIsOpenTokenValidModal(true);
    } 
  }, [user, isTokenValidated, setIsOpenTokenValidModal]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="ema">
        <TabsList>
          <TabsTrigger value="ema">📊 EMA Crossover</TabsTrigger>
          <TabsTrigger value="supertrend">📈 Supertrend</TabsTrigger>
          <TabsTrigger value="0dspx">⚡ SPX 0DTE Options</TabsTrigger>
        </TabsList>
        <TabsContent value="ema">
          <StrategyEma />
        </TabsContent>
        <TabsContent value="supertrend">
          <StrategySuperTrend />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategyControl;

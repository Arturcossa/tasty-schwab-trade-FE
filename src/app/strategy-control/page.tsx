import StrategyEma from "@/components/strategy-control/ema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StrategyControl = () => {
  return (
    <Tabs defaultValue="ema">
      <TabsList>
        <TabsTrigger value="ema">EMA</TabsTrigger>
        <TabsTrigger value="super-trend">SuperTrend</TabsTrigger>
      </TabsList>
      <TabsContent value="ema">
        <StrategyEma />
      </TabsContent>
    </Tabs>
  );
};

export default StrategyControl;

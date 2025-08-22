import { Card, CardContent } from "@/components/ui/card"
import ManualTrigger from "./manual-trigger"
import TradingParameters from "./trading-parameters"
import AddNewTicker from "./add-new-ticker"

const StrategyZeroDay = () => {

  return (
    <Card>
      <CardContent className="space-y-10">
        <ManualTrigger />
        <AddNewTicker />
        <TradingParameters />
      </CardContent>
    </Card>
  )
}

export default StrategyZeroDay
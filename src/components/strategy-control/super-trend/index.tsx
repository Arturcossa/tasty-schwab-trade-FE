import { Card, CardContent } from "@/components/ui/card"
import AddNewTicker from "./add-new-ticker"
import TradingParameters from "./trading-parameters"

const StrategySuperTrend = () => {
  return (
    <Card>
      <CardContent className="space-y-10">
        <AddNewTicker />
        <TradingParameters />
      </CardContent>
    </Card>
  )
}

export default StrategySuperTrend
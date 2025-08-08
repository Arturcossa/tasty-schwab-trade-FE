import { Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

const Security = () => {
  return (
    <Card className="bg-gradient-surface border-border min-w-[400px]">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="change-email">Change Email</Label>
            <Input
              id="change-email"
              type="email"
              placeholder="Enter new email"
              className="bg-background border-border"
            />
            <Button variant="outline" size="sm">
              Update Email
            </Button>
          </div>
          <div className="space-y-3">
            <Label htmlFor="change-password">Change Password</Label>
            <Input
              id="change-password"
              type="password"
              placeholder="Enter new password"
              className="bg-background border-border"
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              className="bg-background border-border"
            />
            <Button variant="outline" size="sm">
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>
  )
}

export default Security
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

const UserSetting = () => {
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
  );
};

export default UserSetting;

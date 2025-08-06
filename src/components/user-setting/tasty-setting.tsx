"use client";

import { useState } from "react";
import UseTastySetting from "@/hooks/use-tasty-setting";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const TastySetting = () => {
  const {user, connectionStatus, setConnectionStatus} = useAuth();
  const { authorizationURL } = UseTastySetting();
  const [copied, setCopied] = useState(false);
  const [authorizationCode, setAuthorizationCode] = useState<string>("");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(authorizationURL);
      setCopied(true);
      toast.success("URL copied to clipboard!", {
        className: "toast-success",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy URL", {
        className: "toast-error",
      });
    }
  };

  const handleGetNewToken = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasty/access-token`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({authorizationCode})
      })

      const data = await res.json();
      console.log("data", data)
      if (res.ok && data.success) {
        setConnectionStatus({
          ...connectionStatus,
          tasty: true,
        });
        toast.success("Connection to Tastytrade successful!", {
          className: "toast-success",
        });
      } else {
        setConnectionStatus({
          ...connectionStatus,
          tasty: false,
        });
        toast.error(data.message || "Connection to Tastytrade failed", {
          className: "toast-error",
        });
      }
    } catch (error) {
      setConnectionStatus({
        ...connectionStatus,
        tasty: false,
      });
      toast.error("Network error during connection to Tastytrade", {
        className: "toast-error",
      });
    }
  }

  return (
    <Card className="bg-gradient-surface border-border min-w-[400px]">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center space-x-2">
          <span>Tasty Trade API</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-start gap-1">
            <Label>Authorization URL</Label>
            <Tooltip>
              <TooltipTrigger>
                <Image
                  src={"/help.png"}
                  alt="Help"
                  width={1024}
                  height={1024}
                  className=" w-3 h-3"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>1. Visit this URL in your browser to authorize.</p>
                <p>
                  2. Sign in with your tastytrade credentials and complete
                  two-factor authentication if prompted.
                </p>
                <p>
                  3. After successful login and consent, you will be redirected
                  back to the your tasty app.
                </p>
                <p>4. Copy and paste code query part from redirected link</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="string"
              value={authorizationURL}
              disabled
              className="bg-background border-border flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="space-y-3">
            <Label htmlFor="autorization-code">Authorization Code</Label>
            <Input
              type="string"
              id="autorization-code"
              value={authorizationCode}
              onChange={(e) => setAuthorizationCode(e.target.value)}
              className="bg-background border-border flex-1"
            />
            <Button variant="secondary" size="sm" onClick={handleGetNewToken}>
              Get new tokens
            </Button>
          </div>
        </div>
        {/* <div className="space-y-3">
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
        </div> */}
      </CardContent>
    </Card>
  );
};

export default TastySetting;

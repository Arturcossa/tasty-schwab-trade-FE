'use client'

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";
import UseSchwabSetting from "@/hooks/use-schwab-setting";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

const SchwabSetting = () => {
  const { user } = useAuth();
  const { authorizationURL } = UseSchwabSetting();
  const [copied, setCopied] = useState(false);
  const [authorizationLink, setAuthorizationLink] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(authorizationURL);
      setCopied(true);
      toast.success("URL copied to clipboard!", {
        className: "toast-success",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL", {
        className: "toast-error",
      });
    }
  };

  const handleGenerateAccessToken = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schwab/access-token`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({authorizationLink})
      })

      const data = await res.json();
      console.log("data", data)
      if (res.ok && data.success) {
        toast.success("Connection to Schwab successful!", {
          className: "toast-success",
        });
      } else {
        toast.error(data.message || "Connection to Schwab failed", {
          className: "toast-error",
        });
      }
    } catch {
      toast.error("Network error during connection to Schwab", {
        className: "toast-error",
      });
    }
  }

  const handleRefreshToken = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasty/refresh-token`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`
        }
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success("TastyTrade token refreshed successfully!", {
          className: "toast-success",
        });
      } else {
        toast.error(data.error || "Failed to refresh TastyTrade token", {
          className: "toast-error",
        });
      }
    } catch {
      toast.error("Network error during token refresh", {
        className: "toast-error",
      });
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <Card className="bg-gradient-surface border-border min-w-[400px]">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center space-x-2">
          <span>Charles Schwab API</span>
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
                <p>Visit this URL in your browser to authorize.</p>
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
            <Label htmlFor="autorization-code">Authorization Link</Label>
            <Input
              type="string"
              id="autorization-code"
              value={authorizationLink}
              onChange={(e) => setAuthorizationLink(e.target.value)}
              className="bg-background border-border flex-1"
            />
            <Button variant="secondary" size="sm" onClick={handleGenerateAccessToken}>
              Generate new Access Token
            </Button>
          </div>
        </div>

        {/* Refresh Token Section */}
        <div className="space-y-3">
          <Label>Refresh Existing Token</Label>
          <div className="text-sm text-muted-foreground">
            Use your existing refresh token to get a new access token without
            re-authorization.
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshToken}
            disabled={isRefreshing}
          >
            {isRefreshing ? "Refreshing..." : "Refresh Token"}
          </Button>
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

export default SchwabSetting;

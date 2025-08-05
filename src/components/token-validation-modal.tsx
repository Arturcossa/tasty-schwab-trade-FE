"use client";

import { useTrading } from "@/context/TradingContext";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useEffect, useState, useRef } from "react";
import { LoaderIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const TokenValidationModal = () => {
  const {
    validateSchwabToken,
    isOpenTokenValidModal,
    setIsOpenTokenValidModal,
    isTokenValidated
  } = useTrading();
  const [isValidating, setIsValidating] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [validationError, setValidationError] = useState<string>("");

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setValidationError("");
    await validateSchwabToken(tokenInput);
    setIsValidating(false);
  };

  const handleClose = () => {
    // Only allow closing if token is validated or user explicitly cancels
    if (isTokenValidated) {
      setIsOpenTokenValidModal(false);
    } else {
      setIsOpenTokenValidModal(false);
      toast.warning("Token validation is required to continue", {
        className: "toast-warning",
      });
    }
  };

  return (
    <Dialog open={isOpenTokenValidModal} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schwab Refresh Token Management</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleTokenSubmit} className="space-y-5 mt-5">
          <div className="space-y-2">
            <Label htmlFor="refresh-token">Schwab Refresh Token Link:</Label>
            <Input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              name="refresh-token"
              placeholder="Enter your Schwab refresh token link"
              required
            />
          </div>

          {/* Show validation error if exists */}
          {validationError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm">{validationError}</span>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isValidating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isValidating}>
              {isValidating && (
                <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
              )}
              {isValidating ? "Validating..." : "Validate & Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TokenValidationModal;

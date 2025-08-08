'use client'

import { Play, RotateCcw, Square } from "lucide-react";
import { Button } from "./ui/button";
import { useTrading } from "@/context/TradingContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function PlayButtons() {
  const {currentStrategy} = useTrading();
  const { user } = useAuth()

  const onPlay = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/start-trading?strategy=${currentStrategy}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
      }
    )
    const data = await res.json()
    if (res.ok && data.success) {
      toast.success(data.message, {
        className: "toast-success"
      })
    } else {
      toast.success(data.message, )
    }
    console.log("res", res)
  }

  const onRestart = () => {

  }

  const onStop = () => {

  }

  return (
    <div className="flex-1 flex gap-5 justify-center p-3">
      <Button onClick={onPlay} variant="default" aria-label="Play" className="cursor-pointer">
        <Play className="w-4 h-4" />
      </Button>
      <Button onClick={onRestart} variant="secondary" aria-label="Restart" className="cursor-pointer">
        <RotateCcw className="w-4 h-4" />
      </Button>
      <Button onClick={onStop} variant="destructive" aria-label="Stop" className="cursor-pointer">
        <Square className="w-4 h-4" />
      </Button>
    </div>
  );
}
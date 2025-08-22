'use client'

import { Play, RotateCcw, Square, Loader2 as Loader2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { useTrading } from "@/context/TradingContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useState } from "react";

export default function PlayButtons() {
  const {currentStrategy} = useTrading();
  const { user } = useAuth()

  const [running, setRunning] = useState<{ ema: boolean; supertrend: boolean; zeroday: boolean }>({
    ema: false,
    supertrend: false,
    zeroday: false,
  })
  const isRunning = running[currentStrategy]

  const [loading, setLoading] = useState<{ start: boolean; restart: boolean; stop: boolean }>({
    start: false,
    restart: false,
    stop: false,
  })

  const onPlay = async () => {
    if (!user?.token) {
      toast.error('Authentication required')
      return
    }
    setLoading(prev => ({ ...prev, start: true }))
    try {
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
        setRunning(prev => ({ ...prev, [currentStrategy]: true }))
      } else {
        toast.error(data.message || 'Failed to start')
      }
    } finally {
      setLoading(prev => ({ ...prev, start: false }))
    }
  }

  const onRestart = async () => {
    if (!user?.token) {
      toast.error('Authentication required')
      return
    }
    setLoading(prev => ({ ...prev, restart: true }))
    try {
      // For now, reuse start endpoint to refresh the running strategy
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
        toast.success(data.message || 'Restarted', { className: 'toast-success' })
        setRunning(prev => ({ ...prev, [currentStrategy]: true }))
      } else {
        toast.error(data.message || 'Failed to restart')
      }
    } finally {
      setLoading(prev => ({ ...prev, restart: false }))
    }
  }

  const onStop = async () => {
    if (!user?.token) {
      toast.error('Authentication required')
      return
    }
    setLoading(prev => ({ ...prev, stop: true }))
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stop-trading?strategy=${currentStrategy}`, {
          method: 'GET',
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
        }
      )
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success(data.message, { className: 'toast-success' })
        setRunning(prev => ({ ...prev, [currentStrategy]: false }))
      } else {
        toast.error(data.error || 'Failed to stop')
      }
    } finally {
      setLoading(prev => ({ ...prev, stop: false }))
    }
  }

  return (
    <div className="flex-1 flex gap-5 justify-center p-3">
      <Button onClick={onPlay} variant="default" aria-label="Play" className="cursor-pointer" disabled={isRunning || loading.start}>
        {loading.start ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
      </Button>
      <Button onClick={onRestart} variant="secondary" aria-label="Restart" className="cursor-pointer" disabled={!isRunning || loading.restart}>
        {loading.restart ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
      </Button>
      <Button onClick={onStop} variant="destructive" aria-label="Stop" className="cursor-pointer" disabled={!isRunning || loading.stop}>
        {loading.stop ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
      </Button>
    </div>
  );
}
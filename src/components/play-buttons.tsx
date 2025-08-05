'use client'

import { Play, RotateCcw, Square } from "lucide-react";
import { Button } from "./ui/button";

export default function PlayButtons() {
  const onPlay = () => {

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
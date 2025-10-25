"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"

export default function TimerHelper() {
  const [minutes, setMinutes] = useState(5)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [totalSeconds, setTotalSeconds] = useState(300)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning, totalSeconds])

  useEffect(() => {
    setMinutes(Math.floor(totalSeconds / 60))
    setSeconds(totalSeconds % 60)
  }, [totalSeconds])

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setTotalSeconds(300)
  }

  const handleSetTime = (mins: number) => {
    setIsRunning(false)
    setTotalSeconds(mins * 60)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Kitchen Timer</h2>

        {/* Timer Display */}
        <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-12 text-center mb-8">
          <div className="text-6xl font-bold text-amber-900 font-mono">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-8 justify-center">
          {isRunning ? (
            <Button onClick={handlePause} className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
              <Pause size={20} />
              Pause
            </Button>
          ) : (
            <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700 text-white gap-2">
              <Play size={20} />
              Start
            </Button>
          )}
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent gap-2"
          >
            <RotateCcw size={20} />
            Reset
          </Button>
        </div>

        {/* Quick Presets */}
        <div>
          <p className="text-sm font-medium text-amber-900 mb-3">Quick Presets</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[1, 5, 10, 15, 20, 30, 45, 60].map((mins) => (
              <Button
                key={mins}
                onClick={() => handleSetTime(mins)}
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
              >
                {mins}m
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

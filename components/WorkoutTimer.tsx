"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function WorkoutTimer({ intervals }) {
  const [currentInterval, setCurrentInterval] = useState(0)
  const [timeLeft, setTimeLeft] = useState(intervals[0].duration)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let timer
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      if (currentInterval < intervals.length - 1) {
        setCurrentInterval((interval) => interval + 1)
        setTimeLeft(intervals[currentInterval + 1].duration)
      } else {
        setIsActive(false)
      }
    }
    return () => clearInterval(timer)
  }, [isActive, timeLeft, currentInterval, intervals])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">{intervals[currentInterval].type === "work" ? "Work" : "Rest"}</h2>
      <div className="text-6xl font-bold mb-8">{timeLeft}</div>
      <Button onClick={toggleTimer} className="text-xl px-8 py-4">
        {isActive ? "Pause" : "Start"}
      </Button>
    </div>
  )
}


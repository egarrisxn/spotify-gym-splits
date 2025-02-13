"use client"

import { useState } from "react"
import WorkoutSetup from "@/components/WorkoutSetup"
import WorkoutTimer from "@/components/WorkoutTimer"

export default function WorkoutPage() {
  const [workoutStarted, setWorkoutStarted] = useState(false)
  const [intervals, setIntervals] = useState([])

  const startWorkout = (setupIntervals) => {
    setIntervals(setupIntervals)
    setWorkoutStarted(true)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {!workoutStarted ? <WorkoutSetup onStart={startWorkout} /> : <WorkoutTimer intervals={intervals} />}
    </main>
  )
}


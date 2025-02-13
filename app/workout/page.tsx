"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import WorkoutSetup from "@/components/WorkoutSetup";
import WorkoutTimer from "@/components/WorkoutTimer";
import { Interval } from "@/types";

export default function WorkoutPage() {
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [intervals, setIntervals] = useState<Interval[]>([]);

  const startWorkout = (setupIntervals: Interval[]) => {
    setIntervals(setupIntervals);
    setWorkoutStarted(true);
  };

  return (
    <SessionProvider>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        {!workoutStarted ? (
          <WorkoutSetup onStart={startWorkout} />
        ) : (
          <WorkoutTimer intervals={intervals} />
        )}
      </main>
    </SessionProvider>
  );
}

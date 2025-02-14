"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import WorkoutSetup from "@/components/WorkoutSetup";
import WorkoutTimer from "@/components/WorkoutTimer";
import type { Interval } from "@/types";

export default function WorkoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [intervals, setIntervals] = useState<Interval[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const startWorkout = (setupIntervals: Interval[]) => {
    setIntervals(setupIntervals);
    setWorkoutStarted(true);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {!workoutStarted ? (
        <WorkoutSetup onStart={startWorkout} />
      ) : (
        <WorkoutTimer intervals={intervals} />
      )}
    </main>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import WorkoutSetup from "@/components/workout-setup";
import WorkoutTimer from "@/components/workout-timer";
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
    <section className="grid min-h-screen place-items-center pb-40">
      <Card className="w-full max-w-lg border p-12 shadow-lg">
        {!workoutStarted ? (
          <WorkoutSetup onStart={startWorkout} />
        ) : (
          <WorkoutTimer intervals={intervals} />
        )}
      </Card>
    </section>
  );
}

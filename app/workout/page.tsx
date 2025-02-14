"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import WorkoutSetup from "@/components/workout-setup";
import WorkoutTimer from "@/components/workout-timer";

interface Interval {
  type: "work" | "rest";
  duration: number;
}

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
      {!workoutStarted ? (
        <WorkoutSetup onStart={startWorkout} />
      ) : (
        <WorkoutTimer intervals={intervals} />
      )}
    </section>
  );
}

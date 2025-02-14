"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { WorkoutSetupProps, Interval } from "@/types";

export default function WorkoutSetup({ onStart }: WorkoutSetupProps) {
  const [workTime, setWorkTime] = useState(90);
  const [restTime, setRestTime] = useState(30);
  const [rounds, setRounds] = useState(5);

  const handleStart = () => {
    const intervals: Interval[] = [];
    for (let i = 0; i < rounds; i++) {
      intervals.push({ type: "work", duration: workTime });
      intervals.push({ type: "rest", duration: restTime });
    }
    onStart(intervals);
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Set Up Your Workout</h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="workTime"
            className="block text-sm font-medium text-gray-700"
          >
            Work Time (seconds)
          </label>
          <Input
            type="number"
            id="workTime"
            value={workTime}
            onChange={(e) => setWorkTime(Number(e.target.value))}
            min="1"
          />
        </div>
        <div>
          <label
            htmlFor="restTime"
            className="block text-sm font-medium text-gray-700"
          >
            Rest Time (seconds)
          </label>
          <Input
            type="number"
            id="restTime"
            value={restTime}
            onChange={(e) => setRestTime(Number(e.target.value))}
            min="1"
          />
        </div>
        <div>
          <label
            htmlFor="rounds"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Rounds
          </label>
          <Input
            type="number"
            id="rounds"
            value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
            min="1"
          />
        </div>
        <Button onClick={handleStart} className="w-full">
          Start Workout
        </Button>
      </div>
    </div>
  );
}

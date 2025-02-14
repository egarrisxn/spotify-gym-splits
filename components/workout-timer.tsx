"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SpotifyPlayer from "./spotify-player";
import type { WorkoutTimerProps } from "@/types";

const WORKOUT_PLAYLISTS = [
  { id: "37i9dQZF1DX76Wlfdnj7AP", name: "Beast Mode" },
  { id: "37i9dQZF1DX5nvHenQ4GGs", name: "Workout Twerkout" },
  { id: "37i9dQZF1DX0HRj9P7NxeE", name: "Workout Motivation" },
];

export default function WorkoutTimer({ intervals }: WorkoutTimerProps) {
  const [currentInterval, setCurrentInterval] = useState(0);
  const [timeLeft, setTimeLeft] = useState(intervals[0].duration);
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(
    WORKOUT_PLAYLISTS[0].id,
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      if (currentInterval < intervals.length - 1) {
        setCurrentInterval((interval) => interval + 1);
        setTimeLeft(intervals[currentInterval + 1].duration);
        setIsPlaying(intervals[currentInterval + 1].type === "work");
      } else {
        setIsActive(false);
        setIsPlaying(false);
      }
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, currentInterval, intervals]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    setIsPlaying(!isActive && intervals[currentInterval].type === "work");
  };

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-3xl font-bold">
        {intervals[currentInterval].type === "work" ? "Work" : "Rest"}
      </h2>
      <div className="text-7xl font-bold">{timeLeft}</div>
      <Button onClick={toggleTimer}>{isActive ? "Pause" : "Start"}</Button>
      <div className="mt-8">
        <h3 className="mb-2 text-xl font-semibold">Select Workout Playlist</h3>
        <Select value={selectedPlaylist} onValueChange={setSelectedPlaylist}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a playlist" />
          </SelectTrigger>
          <SelectContent>
            {WORKOUT_PLAYLISTS.map((playlist) => (
              <SelectItem key={playlist.id} value={playlist.id}>
                {playlist.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <SpotifyPlayer
        isPlaying={isPlaying}
        onPlaybackChange={setIsPlaying}
        playlistId={selectedPlaylist}
      />
    </div>
  );
}

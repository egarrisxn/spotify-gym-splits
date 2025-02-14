"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import spotifyApi from "@/lib/spotify";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX } from "lucide-react";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume: number;
      }) => {
        addListener<T>(eventName: string, callback: (data: T) => void): void;
        connect: () => Promise<boolean>;
        removeListener: (eventName: string) => void;
        togglePlay: () => Promise<void>;
        getCurrentState: () => Promise<any>;
        setVolume: (volume: number) => Promise<void>;
      };
    };
  }
}

interface SpotifyPlayerProps {
  isPlaying: boolean;
  onPlaybackChange: (isPlaying: boolean) => void;
  playlistId: string;
}

interface PlaybackState {
  paused: boolean;
  position: number;
  duration: number;
  track_window: {
    current_track: {
      id: string;
      name: string;
      artists: { name: string }[];
      uri: string;
    };
  };
}

export default function SpotifyPlayer({
  isPlaying,
  onPlaybackChange,
  playlistId,
}: SpotifyPlayerProps) {
  const { data: session, status } = useSession();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const res = await fetch("/api/spotify/refresh");
        const data = await res.json();
        if (data.accessToken) {
          setAccessToken(data.accessToken);
          spotifyApi.setAccessToken(data.accessToken);
        } else {
          throw new Error("Failed to refresh token");
        }
      } catch (err) {
        setError("Failed to connect to Spotify. Please try again.");
        console.error(err);
      }
    };

    if (status === "authenticated" && session?.accessToken) {
      refreshToken();
      const refreshInterval = setInterval(refreshToken, 3600000);
      return () => clearInterval(refreshInterval);
    }
  }, [status, session?.accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const newPlayer = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: volume / 100,
      });

      setPlayer(newPlayer);

      newPlayer.addListener("ready", (data: { device_id: string }) => {
        console.log("Ready with Device ID", data.device_id);
        setDeviceId(data.device_id);
      });

      newPlayer.addListener("not_ready", (data: { device_id: string }) => {
        console.log("Device ID has gone offline", data.device_id);
      });

      newPlayer.addListener(
        "player_state_changed",
        (state: PlaybackState | null) => {
          if (!state) return;
          onPlaybackChange(state.paused);
        },
      );

      newPlayer.connect();
    };

    script.onload = () => {
      console.log("Spotify Web Playback SDK loaded successfully");
    };

    script.onerror = () => {
      setError(
        "Failed to load Spotify Web Playback SDK. Please check your connection.",
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [accessToken]);

  useEffect(() => {
    if (isPlaying && accessToken && deviceId) {
      spotifyApi
        .play({
          device_id: deviceId,
          context_uri: `spotify:playlist:${playlistId}`,
        })
        .catch((err) => console.error("Playback error", err));
    }
  }, [isPlaying, accessToken, deviceId, playlistId]);

  useEffect(() => {
    if (player) {
      player.setVolume(volume / 100).catch(console.error);
    }
  }, [volume, player]);

  if (status === "loading") {
    return <div>Loading Spotify player...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!accessToken) {
    return <div>Please log in to Spotify to use the player.</div>;
  }

  return (
    <div className="mt-4">
      <div className="flex items-center space-x-2">
        <Button onClick={() => setVolume(0)} variant="ghost" size="icon">
          <VolumeX className="h-4 w-4" />
        </Button>
        <Slider
          value={[volume]}
          onValueChange={(value) => setVolume(value[0])}
          max={100}
          step={1}
          className="w-[100px]"
        />
        <Button onClick={() => setVolume(100)} variant="ghost" size="icon">
          <Volume2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

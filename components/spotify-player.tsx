"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import spotifyApi from "@/lib/spotify";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX } from "lucide-react";

import type {
  SpotifyPlayerProps,
  SpotifyPlayerState,
  SpotifyDevice,
} from "@/types";

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
      const refreshInterval = setInterval(refreshToken, 3600000); // Refresh every hour
      return () => clearInterval(refreshInterval);
    }
  }, [status, session]);

  useEffect(() => {
    if (accessToken) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: "Spotify Gym Splits",
          getOAuthToken: (cb: (token: string) => void) => {
            cb(accessToken);
          },
          volume: volume / 100,
        });

        player.addListener("ready", ({ device_id }: SpotifyDevice) => {
          console.log("Ready with Device ID", device_id);
          setDeviceId(device_id);
        });

        player.addListener("not_ready", ({ device_id }: SpotifyDevice) => {
          console.log("Device ID has gone offline", device_id);
        });

        player.addListener(
          "player_state_changed",
          (state: SpotifyPlayerState) => {
            if (state) {
              onPlaybackChange(!state.paused);
            }
          }
        );

        player.connect().then((success: boolean) => {
          if (success) {
            console.log(
              "The Web Playback SDK successfully connected to Spotify!"
            );
          }
        });
      };
    }
  }, [accessToken, volume, onPlaybackChange]);

  useEffect(() => {
    if (accessToken && deviceId) {
      if (isPlaying) {
        spotifyApi
          .play({
            device_id: deviceId,
            context_uri: `spotify:playlist:${playlistId}`,
          })
          .catch((err) => {
            setError("Failed to start playback. Please try again.");
            console.error(err);
          });
      } else {
        spotifyApi.pause({ device_id: deviceId }).catch((err) => {
          setError("Failed to pause playback. Please try again.");
          console.error(err);
        });
      }
    }
  }, [isPlaying, accessToken, deviceId, playlistId]);

  useEffect(() => {
    if (accessToken && deviceId) {
      spotifyApi
        .setVolume(volume, { device_id: deviceId })
        .catch(console.error);
    }
  }, [volume, accessToken, deviceId]);

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

// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import spotifyApi from "@/lib/spotify";
// import { Button } from "@/components/ui/button";
// import { Slider } from "@/components/ui/slider";
// import { Volume2, VolumeX } from "lucide-react";
// import type {
//   SpotifyPlayerProps,
//   SpotifyPlayerState,
//   SpotifyDevice,
// } from "@/types";

// declare global {
//   interface Window {
//     onSpotifyWebPlaybackSDKReady: () => void;
//     Spotify: {
//       Player: new (options: {
//         name: string;
//         getOAuthToken: (cb: (token: string) => void) => void;
//         volume: number;
//       }) => {
//         addListener: (eventName: string, callback: (data: any) => void) => void;
//         connect: () => Promise<boolean>;
//       };
//     };
//   }
// }

// export default function SpotifyPlayer({
//   isPlaying,
//   onPlaybackChange,
//   playlistId,
// }: SpotifyPlayerProps) {
//   const { data: session, status } = useSession();
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [volume, setVolume] = useState(50);
//   const [deviceId, setDeviceId] = useState<string | null>(null);

//   useEffect(() => {
//     const refreshToken = async () => {
//       try {
//         const res = await fetch("/api/spotify/refresh");
//         const data = await res.json();
//         if (data.accessToken) {
//           setAccessToken(data.accessToken);
//           spotifyApi.setAccessToken(data.accessToken);
//         } else {
//           throw new Error("Failed to refresh token");
//         }
//       } catch (err) {
//         setError("Failed to connect to Spotify. Please try again.");
//         console.error(err);
//       }
//     };

//     if (status === "authenticated" && session?.accessToken) {
//       refreshToken();
//       const refreshInterval = setInterval(refreshToken, 3600000); // Refresh every hour
//       return () => clearInterval(refreshInterval);
//     }
//   }, [status, session]);

//   useEffect(() => {
//     if (accessToken) {
//       const script = document.createElement("script");
//       script.src = "https://sdk.scdn.co/spotify-player.js";
//       script.async = true;
//       document.body.appendChild(script);

//       window.onSpotifyWebPlaybackSDKReady = () => {
//         const player = new window.Spotify.Player({
//           name: "Spotify Gym Splits",
//           getOAuthToken: (cb: (token: string) => void) => {
//             cb(accessToken);
//           },
//           volume: volume / 100,
//         });

//         player.addListener("ready", ({ device_id }: SpotifyDevice) => {
//           console.log("Ready with Device ID", device_id);
//           setDeviceId(device_id);
//         });

//         player.addListener("not_ready", ({ device_id }: SpotifyDevice) => {
//           console.log("Device ID has gone offline", device_id);
//         });

//         player.addListener(
//           "player_state_changed",
//           (state: SpotifyPlayerState) => {
//             if (state) {
//               onPlaybackChange(!state.paused);
//             }
//           }
//         );

//         player.connect().then((success: boolean) => {
//           if (success) {
//             console.log(
//               "The Web Playback SDK successfully connected to Spotify!"
//             );
//           }
//         });
//       };
//     }
//   }, [accessToken, volume, onPlaybackChange]);

//   useEffect(() => {
//     if (accessToken && deviceId) {
//       if (isPlaying) {
//         spotifyApi
//           .play({
//             device_id: deviceId,
//             context_uri: `spotify:playlist:${playlistId}`,
//           })
//           .catch((err) => {
//             setError("Failed to start playback. Please try again.");
//             console.error(err);
//           });
//       } else {
//         spotifyApi.pause({ device_id: deviceId }).catch((err) => {
//           setError("Failed to pause playback. Please try again.");
//           console.error(err);
//         });
//       }
//     }
//   }, [isPlaying, accessToken, deviceId, playlistId]);

//   useEffect(() => {
//     if (accessToken && deviceId) {
//       spotifyApi
//         .setVolume(volume, { device_id: deviceId })
//         .catch(console.error);
//     }
//   }, [volume, accessToken, deviceId]);

//   if (status === "loading") {
//     return <div>Loading Spotify player...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500">{error}</div>;
//   }

//   if (!accessToken) {
//     return <div>Please log in to Spotify to use the player.</div>;
//   }

//   return (
//     <div className="mt-4">
//       <div className="flex items-center space-x-2">
//         <Button onClick={() => setVolume(0)} variant="ghost" size="icon">
//           <VolumeX className="h-4 w-4" />
//         </Button>
//         <Slider
//           value={[volume]}
//           onValueChange={(value) => setVolume(value[0])}
//           max={100}
//           step={1}
//           className="w-[100px]"
//         />
//         <Button onClick={() => setVolume(100)} variant="ghost" size="icon">
//           <Volume2 className="h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   );
// }

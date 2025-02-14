export interface Interval {
  type: "work" | "rest";
  duration: number;
}

export interface WorkoutTimerProps {
  intervals: Interval[];
}

export interface WorkoutSetupProps {
  onStart: (intervals: Interval[]) => void;
}

export interface SpotifyPlayerProps {
  isPlaying: boolean;
  onPlaybackChange: (isPlaying: boolean) => void;
  playlistId: string;
}

export interface SpotifyAccessToken {
  accessToken: string;
}

export interface SpotifyRefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface SpotifyError {
  error: string;
  error_description: string;
}

export interface SpotifyPlayOptions {
  context_uri?: string;
  uris?: string[];
  offset?: { position: number } | { uri: string };
  position_ms?: number;
}

export interface SpotifyDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
  device_id: string;
}

export interface SpotifyPlayerState {
  context: {
    uri: string;
    metadata: Record<string, unknown>;
  };
  disallows: {
    pausing: boolean;
    peeking_next: boolean;
    peeking_prev: boolean;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
  };
  duration: number;
  paused: boolean;
  position: number;
  repeat_mode: number;
  shuffle: boolean;
  track_window: {
    current_track: SpotifyTrack;
    next_tracks: SpotifyTrack[];
    previous_tracks: SpotifyTrack[];
  };
}

export interface SpotifyTrack {
  album: {
    name: string;
    uri: string;
    images: { url: string }[];
  };
  artists: { name: string; uri: string }[];
  duration_ms: number;
  id: string;
  is_playable: boolean;
  name: string;
  uri: string;
}

  export interface Player {
    addListener<T>(eventName: string, callback: (data: T) => void): void;
    connect(): Promise<boolean>;
    removeListener(eventName: string): void;
    setVolume(volume: number): Promise<void>;
  }

  export interface Spotify {
    Player: new (options: {
      name: string;
      getOAuthToken: (cb: (token: string) => void) => void;
      volume: number;
    }) => Player;
  }

  export interface PlaybackState = {
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
  };

declare module "next-auth" {
  export interface Session {
    accessToken?: string | null;
    refreshToken?: string | null;
  }
}

declare module "next-auth/jwt" {
  export interface JWT {
    accessToken?: string | null;
    refreshToken?: string | null;
    expiresAt?: number | null;
  }
}

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

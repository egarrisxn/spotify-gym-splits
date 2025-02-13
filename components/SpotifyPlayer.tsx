"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import spotifyApi from "@/lib/spotify"
import SpotifyWebPlaybackSdk from "react-spotify-web-playback-sdk"

export default function SpotifyPlayer({ isPlaying, onPlaybackChange }) {
  const { data: session } = useSession()
  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    const refreshToken = async () => {
      const res = await fetch("/api/spotify/refresh")
      const data = await res.json()
      if (data.accessToken) {
        setAccessToken(data.accessToken)
        spotifyApi.setAccessToken(data.accessToken)
      }
    }

    refreshToken()
    const refreshInterval = setInterval(refreshToken, 3600000) // Refresh every hour

    return () => clearInterval(refreshInterval)
  }, [])

  useEffect(() => {
    if (accessToken) {
      if (isPlaying) {
        spotifyApi
          .play()
          .then(() => onPlaybackChange(true))
          .catch(console.error)
      } else {
        spotifyApi
          .pause()
          .then(() => onPlaybackChange(false))
          .catch(console.error)
      }
    }
  }, [isPlaying, accessToken, onPlaybackChange])

  if (!accessToken) return null

  return (
    <SpotifyWebPlaybackSdk
      name="Spotify Gym Splits"
      token={accessToken}
      uris={["spotify:playlist:37i9dQZF1DX76Wlfdnj7AP"]} // This is an example workout playlist
      play={isPlaying}
      onPlaybackStateChange={(state) => {
        onPlaybackChange(state.isPlaying)
      }}
    />
  )
}


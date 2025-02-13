import SpotifyWebApi from "spotify-web-api-node"

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
})

export default spotifyApi

export const refreshAccessToken = async () => {
  try {
    spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN)
    const data = await spotifyApi.refreshAccessToken()
    return data.body["access_token"]
  } catch (error) {
    console.error("Error refreshing access token", error)
    return null
  }
}


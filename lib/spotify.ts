import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri:
    process.env.SPOTIFY_REDIRECT_URI ||
    "http://localhost:3000/api/auth/callback/spotify",
});

export default spotifyApi;

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    spotifyApi.setRefreshToken(refreshToken);
    const data = await spotifyApi.refreshAccessToken();
    return data.body["access_token"];
  } catch (error) {
    console.error("Error refreshing access token", error);
    return null;
  }
};

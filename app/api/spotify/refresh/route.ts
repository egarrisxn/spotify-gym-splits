import { NextResponse } from "next/server"
import { refreshAccessToken } from "@/lib/spotify"

export async function GET() {
  const accessToken = await refreshAccessToken()

  if (accessToken) {
    return NextResponse.json({ accessToken })
  } else {
    return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 })
  }
}


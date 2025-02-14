import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { refreshAccessToken } from "@/lib/spotify";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.refreshToken) {
      throw new Error("No refresh token found");
    }

    const accessToken = await refreshAccessToken(session.refreshToken);

    if (accessToken) {
      return NextResponse.json({ accessToken });
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    console.error("Error in refresh token route:", error);
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 }
    );
  }
}

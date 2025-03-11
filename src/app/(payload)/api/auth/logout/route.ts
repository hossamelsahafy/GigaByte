import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route.js";
import clientPromise from "../../../lib/dbConnect.js";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    await db
      .collection("sessions")
      .deleteOne({ sessionToken: session.sessionToken });

    // Clear the session cookie
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
    response.headers.set(
      "Set-Cookie",
      "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

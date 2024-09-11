// /app/api/media/user/[userId]/route.ts (App Router)
// Adjust the path to your prisma setup

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust the path if needed

export async function GET(
  req: Request,
  { params }: { params: { userId: string } },
) {
  const { userId } = params;

  try {
    // Fetch all media created by the user
    const userMedia = await prisma.media.findMany({
      where: {
        userId,
      },
    });
    return NextResponse.json(userMedia, { status: 200 });
  } catch (error) {
    console.error("Error fetching media for user:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 },
    );
  }
}

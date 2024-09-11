import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Make sure this path matches your prisma setup

// GET request handler for fetching media by mediaId
export async function GET(
  req: Request,
  { params }: { params: { mediaId: string } },
) {
  const mediaId = params.mediaId;

  try {
    // Find the media by ID, including related characters
    const media = await prisma.media.findUnique({
      where: { id: Number(mediaId) },
      include: {
        characters: true, // Include related characters
      },
    });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    return NextResponse.json(media, { status: 200 });
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

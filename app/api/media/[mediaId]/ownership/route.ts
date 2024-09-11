import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/client";

// API route to check if the current user owns the media
export async function GET(
  req: NextRequest,
  { params }: { params: { mediaId: string } },
) {
  const { mediaId } = params;

  // Fetch the current user from Supabase
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    // Fetch the media from the database
    const media = await prisma.media.findUnique({
      where: { id: Number(mediaId) },
      select: { userId: true }, // Only select the userId to compare
    });

    if (!media) {
      return NextResponse.json({ message: "Media not found" }, { status: 404 });
    }

    // Check if the current user owns this media
    if (media.userId !== user.id) {
      return NextResponse.json(
        { message: "You do not own this media" },
        { status: 403 },
      );
    }

    return NextResponse.json({ message: "You own this media" });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

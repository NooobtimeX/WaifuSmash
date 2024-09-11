import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
interface PostRequestBody {
  name: string;
  mediaId: number;
}

export async function POST(request: NextRequest) {
  try {
    const { name, mediaId }: PostRequestBody = await request.json();

    // Basic validation
    if (!name || !mediaId) {
      return NextResponse.json(
        { error: "Field name and media ID are required." },
        { status: 400 },
      );
    }

    // Validate if the mediaId exists
    const mediaExists = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!mediaExists) {
      return NextResponse.json(
        { error: "Media with the provided ID does not exist." },
        { status: 404 },
      );
    }

    // Create new field associated with a media
    const field = await prisma.field.create({
      data: {
        name,
        media: {
          connect: { id: mediaId },
        },
      },
    });

    return NextResponse.json(field, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating field:", error); // Log the full error for debugging

    // Use type assertion to safely handle the error
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Error creating field." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect(); // Ensure Prisma client is properly disconnected
  }
}

export async function GET(request: NextRequest) {
  try {
    // Retrieve the mediaId from the query parameters
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get("mediaId");

    if (!mediaId) {
      return NextResponse.json(
        { error: "mediaId is required." },
        { status: 400 },
      );
    }

    const parsedMediaId = parseInt(mediaId);
    if (isNaN(parsedMediaId)) {
      return NextResponse.json(
        { error: "Invalid mediaId format." },
        { status: 400 },
      );
    }

    // Fetch fields for the specified mediaId
    const fields = await prisma.field.findMany({
      where: {
        mediaId: parsedMediaId,
      },
      include: {
        values: true, // Include field values for each field
      },
    });

    return NextResponse.json(fields, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching fields:", error); // Log the full error for debugging

    // Use type assertion to safely handle the error
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Error fetching fields." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

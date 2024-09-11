import { prisma } from "@/lib/prisma"; // Adjust path as needed
import { NextRequest, NextResponse } from "next/server";

// Handle POST (Create a new character)
export async function POST(
  req: NextRequest,
  { params }: { params: { mediaId: string } },
) {
  try {
    const { name, photo } = await req.json();

    // Parse mediaId from the URL parameter
    const mediaId = parseInt(params.mediaId, 10);

    // Check if the required fields are provided and that mediaId is a valid number
    if (!name || isNaN(mediaId)) {
      return NextResponse.json(
        { error: "Name and valid mediaId are required" },
        { status: 400 },
      );
    }

    // Create a new character using Prisma
    const newCharacter = await prisma.character.create({
      data: {
        name,
        photo,
        media: {
          connect: { id: mediaId }, // Use parsed integer mediaId
        },
      },
    });

    // Respond with the newly created character
    return NextResponse.json(newCharacter, { status: 201 });
  } catch (error) {
    console.error("Error creating character:", error);
    return NextResponse.json(
      { error: "Failed to create character" },
      { status: 500 },
    );
  }
}

// Handle GET (Fetch all characters for a given mediaId)
export async function GET(
  req: NextRequest,
  { params }: { params: { mediaId: string } },
) {
  try {
    // Parse mediaId from the URL parameter
    const mediaId = parseInt(params.mediaId, 10);

    // Validate the mediaId
    if (isNaN(mediaId)) {
      return NextResponse.json({ error: "Invalid mediaId" }, { status: 400 });
    }

    // Fetch all characters associated with the given mediaId
    const characters = await prisma.character.findMany({
      where: { mediaId },
      include: {
        media: true, // Optionally include media details in the response
      },
    });

    // Respond with the list of characters
    return NextResponse.json(characters, { status: 200 });
  } catch (error) {
    console.error("Error fetching characters:", error);
    return NextResponse.json(
      { error: "Failed to fetch characters" },
      { status: 500 },
    );
  }
}

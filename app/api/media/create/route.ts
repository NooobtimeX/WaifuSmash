import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Initialize the Prisma Client
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, photo, userId, categoryId } = body;

    // Validate required fields
    if (!name || !userId || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create a new media record in the database
    const newMedia = await prisma.media.create({
      data: {
        name,
        description: description || null,
        photo: photo || null, // Save the photo URL or leave it null if no photo is provided
        userId,
        categoryId: Number(categoryId),
      },
    });

    // Return the created media object
    return NextResponse.json(newMedia, { status: 201 });
  } catch (error) {
    console.error("Error creating media:", error);
    return NextResponse.json(
      { error: "Failed to create media." },
      { status: 500 },
    );
  }
}

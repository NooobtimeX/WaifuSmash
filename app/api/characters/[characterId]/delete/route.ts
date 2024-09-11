import { prisma } from "@/lib/prisma"; // Adjust path as needed
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { characterId: string } },
) {
  try {
    // Parse characterId from the URL parameters
    const characterId = parseInt(params.characterId, 10);

    // Validate that characterId is a valid integer
    if (isNaN(characterId)) {
      return NextResponse.json(
        { error: "Invalid character ID" },
        { status: 400 },
      );
    }

    // Use Prisma to delete the character
    const deletedCharacter = await prisma.character.delete({
      where: { id: characterId },
    });

    // Return success response with the deleted character
    return NextResponse.json(deletedCharacter, { status: 200 });
  } catch (error) {
    console.error("Error deleting character:", error);
    return NextResponse.json(
      { error: "Failed to delete character" },
      { status: 500 },
    );
  }
}

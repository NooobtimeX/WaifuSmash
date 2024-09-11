import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc", // Sorting categories alphabetically
      },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Error fetching categories" },
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

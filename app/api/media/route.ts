import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const categories = searchParams.get("categories")?.split(",") || [];
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 8;

  try {
    const where: any = {
      name: {
        contains: search, // Remove the `mode: "insensitive"` argument
      },
    };

    if (categories.length > 0 && categories[0] !== "") {
      where.categoryId = { in: categories.map((id) => parseInt(id, 10)) };
    }

    const totalMedia = await prisma.media.count({ where });
    const media = await prisma.media.findMany({
      where,
      include: {
        user: true,
        category: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({ media, total: totalMedia }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching media:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Error fetching media" },
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

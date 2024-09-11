import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { supabaseId } = await req.json(); // Get the user ID from the request body

  if (!supabaseId) {
    return NextResponse.json({ error: "Invalid Supabase ID" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { supabaseId },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ role: user.role });
  } catch (error) {
    console.error("Error fetching user from Prisma:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

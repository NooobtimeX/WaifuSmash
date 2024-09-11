import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST method to fetch user role
export async function POST(request: Request) {
  const { supabaseId } = await request.json();

  // Debugging log to check incoming supabaseId
  console.log("Received Supabase ID:", supabaseId);

  if (!supabaseId) {
    console.log("Missing Supabase ID, returning 400");
    return NextResponse.json(
      { message: "Missing supabaseId" },
      { status: 400 },
    );
  }

  try {
    // Fetch the user by supabaseId
    const user = await prisma.user.findUnique({
      where: { supabaseId },
      select: { role: true },
    });

    if (!user) {
      console.log("User not found, returning 404");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Debugging log to check the user's role
    console.log("User Role:", user.role);

    // Return the user role
    return NextResponse.json({ role: user.role });
  } catch (error) {
    console.error("Error fetching user from the database:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { value, photo, fieldId } = await request.json();

    if (!value || !fieldId) {
      return NextResponse.json(
        { error: "Field value and fieldId are required." },
        { status: 400 },
      );
    }

    const newFieldValue = await prisma.fieldValue.create({
      data: {
        value,
        photo,
        field: { connect: { id: fieldId } },
      },
    });

    return NextResponse.json(newFieldValue, { status: 201 });
  } catch (error) {
    let errorMessage = "Error adding field value.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: NextRequest) {
  const supabase = createClientComponentClient();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const path = formData.get("path") as string;

    if (!file || !path) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabase.storage
      .from("WaifuSmash")
      .upload(`${path}/${fileName}`, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { publicUrl } = supabase.storage
      .from("WaifuSmash")
      .getPublicUrl(`${path}/${fileName}`).data;

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

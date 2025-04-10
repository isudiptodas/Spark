import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse){
    await connectDB();

    const { email, password, name, action } = await req.json();

    console.log(email, password, name, action);
}
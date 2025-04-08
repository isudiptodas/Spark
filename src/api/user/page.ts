import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";

export const userHandler = async (req: NextRequest, res: NextResponse) => {
    await connectDB();
}
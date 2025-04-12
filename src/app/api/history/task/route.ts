import { Task } from "@/models/taskModel";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { Types } from "mongoose";

export async function GET(req: NextRequest) {
    await connectDB();

    const idTask = req.nextUrl.searchParams.get('id');
    //console.log(idTask);

    try {
        const found = await Task.findById(idTask);
        console.log(found);

        if (!found) {
            return NextResponse.json({
                status: 404,
                message: "Not found",
                success: false
            });
        }

        return NextResponse.json({
            status: 200,
            message: "task found",
            found
        });
    }
    catch (err) {
        return NextResponse.json({
            status: 500,
            message: "Something went wrong"
        });
    }
}
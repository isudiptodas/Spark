import { GoogleGenerativeAI } from '@google/generative-ai'
import { Task } from '@/models/taskModel';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/config/db";

export async function POST(req: NextRequest) {

    await connectDB();

    const { prompt } = await req.json();
    const userId = req.headers.get('userId');

    try {
        const newChat = {
            role: 'user',
            message: prompt
        };

        //console.log(prompt);

        const api = process.env.GEMINI_API as string;
        const genAI = new GoogleGenerativeAI(api);

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseModalities: [
            ],
            responseMimeType: "application/json",
        };

        const chatSession = model.startChat({
            generationConfig,
            history: [
            ],
        });

        const add = process.env.TASK_PROMPT as string;

        const result = await chatSession.sendMessage(`${prompt}${add}`);

        const resp = result.response.text();
       // const parsed = JSON.parse(resp);
       // console.log(parsed);

        const parsed = JSON.parse(resp);
        //console.log(parsed);

        const newTask = new Task({
            task: parsed.taskName,
            actual: parsed.actual,
            taskHistory: [
                { role: 'user', message: prompt },
                { role: 'gemini', message: parsed.taskResponse }
            ],
            taskExplanation: parsed.explanation
            //userId: userId
        });

        await newTask.save();

        //console.log("done");

        return NextResponse.json({
            status: 200,
            success: true,
            message: 'Success',
            newTask
        });

    } catch (err) {
        console.log(err);
        return NextResponse.json({
            status: 500,
            success: false,
        });
    }
}

import { GoogleGenerativeAI } from '@google/generative-ai'
import { Task } from '@/models/taskModel';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/config/db";
import { jwtVerify } from 'jose';

export async function POST(req: NextRequest) {

    await connectDB();

    const { prompt } = await req.json();
    const token = req.cookies.get('token')?.value as string;

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.id as string;

        const found = await Task.findOne({initialPrompt: prompt});
        
        if(found){
            return NextResponse.json({
                status: 200,
                success: true,
                message: 'Success',
                newTask: found
            });
        }

        //console.log('this is id',userId);

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
        const parsed = JSON.parse(resp);

        const explanation = parsed.explanation;
        //console.log(explanation);

        const newTask = new Task({
            task: parsed.taskName,
            actual: parsed.actual,
            taskHistory: [
                { role: 'user', message: prompt },
                { role: 'gemini', message: parsed.taskResponse }
            ],
            taskExplanation: [
                { role: 'user', message: prompt },
                { role: 'gemini', message: explanation }
            ],
            userId,
            initialPrompt: prompt
        });

        await newTask.save();


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

export async function PUT(req: NextRequest){
    const { prompt, id } = await req.json()

    try {

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

        const history = await Task.findById(id);
        //const hist = JSON.stringify(history.taskHistory);
        const actHist = history.taskHistory as {role: string; message: string}[];

        const formattedHistory = actHist.map(entry => {
            return `${entry.role === 'user' ? 'User' : 'Gemini'}: ${entry.message}`;
          }).join('\n');

         //console.log(formattedHistory);

        const result = await chatSession.sendMessage(`Main internal prompt - ${add}. History - ${formattedHistory}. Now here is the task - ${prompt}`);

        const resp = result.response.text();
        const parsed = JSON.parse(resp);

        //console.log(parsed);

        const explanation = parsed.explanation;

        const newTaskExplanation = {
            role: 'user', message: prompt
        };
        const newTaskExplanation2 = {
            role: 'gemini', message: explanation
        };

        const newTaskHistory = {
            role: 'user', message: prompt
        };
        const newTaskHistory2 = {
            role: 'gemini', message: parsed.taskResponse
        };

        const found = await Task.findByIdAndUpdate(id, {
            $push : {
                taskExplanation: { $each: [newTaskExplanation, newTaskExplanation2]},
                taskHistory: { $each: [newTaskHistory, newTaskHistory2]},
            }, $set: {actual: parsed.actual}
        }, {new: true});

        return NextResponse.json({
            success: true,
            status: 201,
            newTask: found
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success: false,
            status: 500,
        });
    }
}

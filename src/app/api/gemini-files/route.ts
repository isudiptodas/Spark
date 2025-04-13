import { GoogleGenerativeAI } from '@google/generative-ai'
import { Files } from '@/models/fileModel';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/config/db";
import { jwtVerify } from 'jose';

export async function POST(req: NextRequest) {

    await connectDB();

    const { prompt, template } = await req.json();
    const token = req.cookies.get('token')?.value as string;
    //console.log(prompt, template);

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.id as string;

        const found = await Files.findOne({initialPrompt: prompt});
        
        if(found){
            return NextResponse.json({
                status: 200,
                success: true,
                message: 'Success',
                newFile: found
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

        const add = process.env.FILE_PROMPT as string;

        const result = await chatSession.sendMessage(`Main task - ${prompt}. Prompt - ${add}. Template - ${template}`);

        const resp = result.response.text();
        //console.log(resp);
        
        // const newFile = new Files({
        //     name: parsed.name,
        //     initialPrompt: prompt,
        //     history: [
        //         {role: 'user', message: prompt}, 
        //         {role: 'model', message: converted}],
        //     chat: [
        //            {role: 'user', message: prompt},
        //            {role: 'model', message: parsed.explanation}],
        //     files: converted,
        //     userId: userId
        // });

       // await newFile.save();

        return NextResponse.json({
            status: 200,
            success: true,
            message: 'Success',
        });

    } catch (err) {
        console.log(err);
        return NextResponse.json({
            status: 500,
            success: false,
        });
    }
}

// export async function PUT(req: NextRequest){
//     const { prompt, id } = await req.json()

//     try {

//         const api = process.env.GEMINI_API as string;
//         const genAI = new GoogleGenerativeAI(api);

//         const fetchTask = await Task.findById(id);
//         const taskHistory = fetchTask.taskHistory as { role: string; message: string}[];

//         const model = genAI.getGenerativeModel({
//             model: "gemini-1.5-flash",
//         });

//         const generationConfig = {
//             temperature: 1,
//             topP: 0.95,
//             topK: 40,
//             maxOutputTokens: 8192,
//             responseModalities: [
//             ],
//             responseMimeType: "application/json",
//         };

//         const chatSession = model.startChat({
//             generationConfig,
//             history: taskHistory.map((task) => ({
//                 role: task.role,
//                 parts: [{text: task.message}]
//             })),
//         });

//         const add = process.env.TASK_PROMPT as string;

//         const result = await chatSession.sendMessage(`Main internal prompt - ${add}. Now here is the task - ${prompt}`);

//         const resp = result.response.text();
//         const parsed = JSON.parse(resp);

//         //console.log(parsed);

//         const explanation = parsed.explanation;

//         const newTaskExplanation = {
//             role: 'user', message: prompt
//         };
//         const newTaskExplanation2 = {
//             role: 'model', message: explanation
//         };

//         const newTaskHistory = {
//             role: 'user', message: prompt
//         };
//         const newTaskHistory2 = {
//             role: 'model', message: parsed.taskResponse
//         };

//         const found = await Task.findByIdAndUpdate(id, {
//             $push : {
//                 taskExplanation: { $each: [newTaskExplanation, newTaskExplanation2]},
//                 taskHistory: { $each: [newTaskHistory, newTaskHistory2]},
//             }, $set: {actual: parsed.actual}
//         }, {new: true});

//         return NextResponse.json({
//             success: true,
//             status: 201,
//             newTask: found
//         });
//     } catch (err) {
//         console.error(err);
//         return NextResponse.json({
//             success: false,
//             status: 500,
//         });
//     }
// }

// export async function GET(req: NextRequest){
//     const token = req.cookies.get('token')?.value as string;

//     try {
//         const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//         const { payload } = await jwtVerify(token, secret);
//         const userId = payload.id as string;

//         const found = await Task.find({userId});

//         if(!found){
//             return NextResponse.json({
//                 status: 404,
//                 success: false
//             });
//         }

//         return NextResponse.json({
//             status: 200,
//             success: true,
//             found
//         });
//     } catch (err) {
//         return NextResponse.json({
//             status: 500,
//             success: false
//         });
//     }
// }
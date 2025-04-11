import { GoogleGenerativeAI } from '@google/generative-ai'
import { Task } from '@/models/taskModel';
import { NextRequest } from 'next/server';
import mime from 'mime-types';

export async function POST(req: NextRequest) {

    const { prompt } = await req.json();
    const userId = req.headers.get('userId');

    const newChat = {
        role: 'user',
        message: prompt
    };

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
        responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
        generationConfig,
        history: [
            
        ],
      });
}

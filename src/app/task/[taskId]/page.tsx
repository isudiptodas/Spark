'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { IoSparklesSharp } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import { Toaster, toast } from "sonner";
import axios from "axios";

export default function Page({ params, }: { params: Promise<{ taskId: string }> }) {

    const { taskId } = use(params);
    const question = decodeURIComponent(taskId);
    const [prompt, setPrompt] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loaded, setLoaded] = useState(false);
    const [generating, setGenerating] = useState(false);

    const generate = async () => {
        if (!prompt) {
            toast.error("Please enter prompt");
            return;
        }

        try {
            setGenerating(true);
            const res = await axios.post('/api/gemini', {
                prompt
            });

            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setLoaded(true);
        }, 2000);
    }, []);

    return (
        <>
            <div className={`${loaded ? "block" : "hidden"} w-full h-screen flex flex-col justify-start overflow-hidden items-center gap-3 bg-black relative scrollbar-hide`}>
                <div className="h-56 w-56 lg:h-72 lg:w-[500px] absolute z-10 -top-24 -right-20 lg:-top-56 lg:-right-16 opacity-40 rounded-full bg-orange-400 blur-[120px]"></div>
                <Toaster richColors position="top-center" />
                <h1 className=" font-black z-30 text-2xl md:py-10 py-5 bg-gradient-to-br from-orange-300 via-orange-700 to-transparent bg-clip-text text-transparent">SPARK</h1>

                <Link href='/new-chat' className="block lg:hidden w-[90%] text-center py-2 rounded-md bg-white text-black cursor-pointer hover:opacity-70 duration-200 ease-in-out active:scale-95">New Chat +</Link>

                <div className="w-full h-full px-2 py-3 lg:py-0 lg:-mt-5 flex flex-col lg:flex-row-reverse justify-between items-center lg:items-start gap-3 overflow-hidden scrollbar-hide">

                    <div className="flex bg-gradient-to-b from-zinc-950 via-zinc-950 to-transparent h-[73%] overflow-y-auto lg:h-[77vh] rounded-md w-full lg:w-[70%] flex-col justify-between items-center gap-3 px-3 py-2 relative">
                        <div className={`absolute z-50 bg-black opacity-80 top-0 rounded-md h-full w-full ${generating ? "block" : "hidden"} flex justify-center items-center text-white`}>Generating your response...</div>

                    </div>

                    <div className=" flex bg-gradient-to-b from-zinc-950 via-zinc-950 to-transparent h-96 lg:h-[77vh] rounded-md w-full lg:w-[30%] flex-col justify-start lg:justify-between items-center gap-3 px-3 py-2 relative">
                        <div className={`absolute z-50 bg-black opacity-80 top-0 rounded-md h-full w-full ${generating ? "block" : "hidden"} flex justify-center items-center text-white`}>Generating your response...</div>
                        <Link href='/new-chat' className="hidden lg:block w-full text-center py-2 rounded-md bg-white text-black cursor-pointer hover:opacity-70 duration-200 ease-in-out active:scale-95">New Chat +</Link>

                        <div className="w-full h-full bg-zinc-900 rounded-md ">

                        </div>

                        <textarea onChange={(e) => setPrompt(e.target.value)} className="w-full px-2 py-2 outline-none h-14 lg:h-24 bg-zinc-800 rounded-md text-white" placeholder="Ask your question" />
                        <span className={`p-2 ${prompt === '' ? "hidden" : "block"} rounded-md cursor-pointer text-sm bottom-5 right-5 duration-200 ease-in-out active:scale-95 absolute bg-orange-400 text-white`}><IoSparklesSharp /></span>
                    </div>
                </div>
            </div>

            <div className={`${loaded ? "hidden" : "block"} overflow-hidden px-4 h-screen w-full flex flex-col lg:flex-row justify-start lg:justify-center py-4 items-center gap-5 bg-black`}>
                <div className="lg:hidden w-full h-auto flex flex-col justify-start items-center gap-3">
                    <div className="bg-zinc-900 w-full h-96 rounded-md lg:rounded-lg"></div>
                    <div className="bg-zinc-900 w-full h-10 rounded-md lg:rounded-lg"></div>
                    <div className="bg-zinc-900 w-full h-64 rounded-md lg:rounded-lg"></div>
                    <div className="bg-zinc-900 w-full h-32 rounded-md lg:rounded-lg"></div>
                    <div className="bg-zinc-900 w-full h-32 rounded-md lg:rounded-lg"></div>
                </div>

                <div className="hidden lg:flex w-full h-auto flex-row justify-start items-center gap-3">
                    <div className="bg-zinc-900 w-[30%] h-[90vh] rounded-md lg:rounded-lg"></div>
                    <div className="bg-zinc-900 w-[70%] h-[90vh] rounded-md lg:rounded-lg"></div>
                </div>
            </div>
        </>
    )
}

'use client'

import { homeSuggestionPrompt } from "@/data/homeSuggestion"
import { IoSparklesSharp } from "react-icons/io5";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSidebar } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { useRef } from "react";
import { Toaster, toast } from "sonner";
import { MdKeyboardVoice } from "react-icons/md";
import { FaRegStopCircle } from "react-icons/fa";

function page() {
  
    type SpeechRecognition = any;

    const [prompt, setPrompt] = useState('');
    const router = useRouter();
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const startRecording = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Your browser does not support Speech Recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
            let interimTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    setPrompt(prev => prev + transcript + " ");
                } else {
                    interimTranscript += transcript;
                }
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech Recognition Error", event.error);
        };

        recognitionRef.current = recognition;
        recognition.start();

        setListening(true);
    }

    const stopRecording = () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          setListening(false);
        }
      };

    const handleSubmit = async () => {
        try {

            const chatId = encodeURIComponent(prompt);
            router.push(`/chat/${chatId}`);
        } catch (err) {
            console.log(err);
        }
    }

    const logout = () => {
        router.push('/');
    }

    return (
        <>
            <div className="w-full h-screen flex flex-col justify-start overflow-hidden items-center gap-3 bg-black relative">
                <Toaster />
                <span onClick={() => setSidebarVisible(!sidebarVisible)} className={`w-auto absolute text-white top-8 left-5 font-bold cursor-pointer`}><FiSidebar /> </span>

                <div className={`w-[70%] px-5 ${sidebarVisible ? "translate-x-0" : "-translate-x-full"} lg:pb-5 duration-200 ease-in-out transition-transform left-0 sm:w-[50%] md:w-[40%] lg:w-[20%] absolute h-screen bg-zinc-950 z-50 flex flex-col justify-start items-start gap-2`}>
                    <span onClick={() => setSidebarVisible(!sidebarVisible)} className={` text-white w-full text-center font-bold flex justify-start items-center py-5 cursor-pointer tracking-wider gap-3`}><FiSidebar /> SPARK </span>

                    <div className="w-full py-2 h-[80%]">

                    </div>

                    <span className="w-full mt-4 lg:mt-2 font-bold flex justify-start items-center gap-2 text-red-500 cursor-pointer" onClick={logout}><CiLogout />Logout</span>
                </div>

                <div className="h-56 w-56 lg:h-72 lg:w-[500px] absolute z-10 -top-24 -right-20 lg:-top-56 lg:-right-16 opacity-40 rounded-full bg-orange-400 blur-[120px]"></div>

                <h1 className=" font-black z-30 text-2xl md:py-10 py-5 bg-gradient-to-br from-orange-300 via-orange-700 to-transparent bg-clip-text text-transparent">SPARK</h1>

                <p className="text-white z-30 text-sm md:text-lg md:py-2 w-auto px-8 text-center py-4 border-b-[1px] border-orange-500">Start a new chat</p>

                <div className="w-[80%] md:w-[60%] z-30 h-auto flex flex-col justify-center items-center relative rounded-md lg:rounded-lg mt-5">
                    <textarea onChange={(e) => setPrompt(e.target.value)} value={prompt} placeholder="Enter your prompt" className="text-white outline-none w-full font-mono h-52 rounded-md lg:rounded-lg bg-zinc-900 px-3 pr-10 py-3" />
                    <p className="text-white text-[12px] opacity-70 w-full text-center py-3">Or</p>

                    <span className={`p-2 lg:p-3 ${prompt === '' ? "hidden" : "block"} rounded-md cursor-pointer text-[12px] lg:text-sm bottom-14 right-3 duration-200 ease-in-out active:scale-95 absolute bg-orange-400 text-white`} onClick={handleSubmit}><IoSparklesSharp /></span>
                    <span className={`p-2 lg:p-3 ${listening ? "hidden" : "block"} rounded-md cursor-pointer text-[12px] lg:text-sm bottom-14 ${prompt === '' ? "right-3" : "right-14"} duration-200 ease-in-out active:scale-95 absolute bg-fuchsia-400 text-white`} onClick={startRecording}><MdKeyboardVoice /></span>
                    <span className={`p-2 lg:p-3 ${listening ? "block" : "hidden"} rounded-md cursor-pointer text-[12px] lg:text-sm bottom-14 ${prompt === '' ? "right-3" : "right-14"} duration-200 ease-in-out active:scale-95 absolute bg-red-500 text-white`} onClick={stopRecording}><FaRegStopCircle /></span>
                </div>

                <div className="w-[80%] md:w-[60%] flex flex-wrap justify-center items-start gap-3">
                    {homeSuggestionPrompt.map((p, index) => {
                        return <p onClick={() => setPrompt(p)} key={index} className="w-auto text-[12px] px-3 py-1 rounded-full bg-zinc-900 text-gray-400 hover:text-white cursor-pointer duration-200 ease-in-out active:scale-95">{p}</p>
                    })}
                </div>

            </div>
        </>
    )
}

export default page

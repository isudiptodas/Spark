'use client'

import { homeSuggestionPrompt } from "@/data/homeSuggestion"
import { homeSuggestionTasks } from "@/data/homeSuggestion";
import { IoSparklesSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiSidebar } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { useRef } from "react";
import { Toaster, toast } from "sonner";
import { MdKeyboardVoice } from "react-icons/md";
import { FaRegStopCircle } from "react-icons/fa";
import axios from "axios";
import { FaReact } from "react-icons/fa";
import { SiSolid } from "react-icons/si";
import { IoLogoHtml5 } from "react-icons/io5";
import { FaJs } from "react-icons/fa";
import { FaVuejs } from "react-icons/fa";
import { SiSvelte } from "react-icons/si";
import { BiLogoDjango } from "react-icons/bi";
import { SiSpringboot } from "react-icons/si";
import { RiNextjsFill } from "react-icons/ri";

function page() {

    type SpeechRecognition = any;

    interface tasks {
        task: string,
        _id: string
    }

    const [prompt, setPrompt] = useState('');
    const [option, setOption] = useState('');
    const[category, setCategory] = useState('task');
    const [template, setTemplate] = useState('select template');
    const router = useRouter();
    const[taskData, setTaskData] = useState<tasks[]>([]);
    const[filesData, setFilesData] = useState([]);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [templateVisible, setTemplateVisible] = useState(false);
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const templates = [
        {
            name: 'react',
            icon: <FaReact />
        },
        {
            name: 'html',
            icon: <IoLogoHtml5 />
        },
        {
            name: 'angular',
            icon: <FaReact />
        },
        {
            name: 'solid',
            icon: <SiSolid />
        },
        {
            name: 'svelte',
            icon: <SiSvelte />
        },
        {
            name: 'Js',
            icon: <FaJs />
        },
        {
            name: 'vue',
            icon: <FaVuejs />
        },
        {
            name: 'django',
            icon: <BiLogoDjango  />
        },
        {
            name: 'Spring',
            icon: <SiSpringboot  />
        },
        {
            name: 'Next.js',
            icon: <RiNextjsFill   />
        },
    ];

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

        if (option === 'programming' && template === 'select template') {
            toast.error("Please select a template");
            return;
        }

        if (!prompt) {
            toast.error("Please write a prompt");
            return;
        }

        try {

            if (option === 'programming') {
                const chatId = encodeURIComponent(prompt);
                router.push(`/chat/${chatId}?template=${template}`);
            }
            else {
                const taskId = encodeURIComponent(prompt);
                router.push(`/task/${taskId}`);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const logout = async () => {
        const res = await axios.get('/api/user');

        if (res.data.status === 200) {
            router.push('/');
        }
    }

    const fetchHistory = async () => {
        try {
            const res = await axios.get('/api/gemini');

            //console.log(res.data);
            setTaskData(res.data.found);
        } catch (err) {
            console.log(err);
        }
    }

    const redirect = (id: string) => {
        router.push(`/history/task/${id}`);
    }

    useEffect(()=> {
        fetchHistory();
    }, []);

    return (
        <>
            <div className={`w-full min-h-screen flex flex-col justify-start overflow-hidden items-center gap-3 bg-black relative scrollbar-hide pb-16`}>
                <Toaster richColors position="top-center" />
                <span onClick={() => setSidebarVisible(!sidebarVisible)} className={`w-auto absolute text-white top-8 left-5 font-bold cursor-pointer`}><FiSidebar /> </span>

                <div className={`w-[70%] px-5 ${sidebarVisible ? "translate-x-0" : "-translate-x-full"} lg:pb-5 duration-200 ease-in-out transition-transform left-0 sm:w-[50%] md:w-[40%] lg:w-[20%] absolute h-screen bg-zinc-950 z-50 flex flex-col justify-start items-start gap-2`}>
                    <span onClick={() => setSidebarVisible(!sidebarVisible)} className={` text-white w-full text-center font-bold flex justify-start items-center py-5 cursor-pointer tracking-wider gap-3`}><FiSidebar /> SPARK </span>

                    <div className="w-full py-2 px-3 h-[80%] border-2 flex flex-col justify-start items-start gap-2 overflow-y-auto content">
                        <div className="w-full bg-transparent mb-2 flex justify-center items-center gap-2">
                            <p className={`w-full rounded-md ${category === 'task' ? "bg-blue-500" : "border-[0.5px] border-blue-500"} active:scale-95 text-white text-[12px] cursor-pointer hover:opacity-75 duration-100 ease-in-out text-center py-2`} onClick={() => setCategory('task')}>Task</p>
                            <p className={`w-full rounded-md ${category === 'files' ? "bg-blue-500" : "border-[0.5px] border-blue-500"} active:scale-95 text-white text-[12px] cursor-pointer hover:opacity-75 duration-100 ease-in-out text-center py-2`} onClick={() => setCategory('files')}>Files</p>
                        </div>

                        {category === 'task' && taskData.map((task, index)=> {
                            return <p key={index} className="w-full px-3 rounded-md text-[12px] text-start flex justify-start items-start text-gray-400 hover:text-white duration-150 ease-in-out cursor-pointer bg-zinc-800 py-2" onClick={() => redirect(task._id)}>{task?.task}</p>
                        })}
                    </div>

                    <span className="w-full mt-4 lg:mt-2 font-bold flex justify-start items-center gap-2 text-red-500 cursor-pointer" onClick={logout}><CiLogout />Logout</span>
                </div>

                <div className="h-56 w-56 lg:h-72 lg:w-[500px] absolute z-10 -top-24 -right-20 lg:-top-56 lg:-right-16 opacity-40 rounded-full bg-orange-400 blur-[120px]"></div>

                <h1 className=" font-black z-30 text-2xl md:py-10 py-5 bg-gradient-to-br from-orange-300 via-orange-700 to-transparent bg-clip-text text-transparent">SPARK</h1>

                <div className={`w-[80%] ${option === '' ? "block" : "hidden"} md:w-[60%] flex flex-col lg:flex-row justify-center items-center h-auto mt-28 lg:mt-5 gap-4`}>
                    <p className="w-auto px-4 py-1 lg:py-2 rounded-full bg-orange-400 text-white text-center cursor-pointer hover:opacity-75 duration-200 ease-in-out active:scale-95" onClick={() => setOption('programming')}>For Programming & File Structure</p>
                    <p className="w-auto px-4 py-1 lg:py-2 rounded-full bg-orange-400 text-white text-center cursor-pointer hover:opacity-75 duration-200 ease-in-out active:scale-95" onClick={() => setOption('everyday')}>For Everyday Task</p>
                </div>

                <p className={`text-white z-30 text-sm md:text-lg md:py-2 w-auto px-8 text-center py-4 border-b-[1px] border-orange-500 ${option === 'programming' ? "block" : "hidden"}`}>For Programming & File Structure</p>

                <div className={`${option === 'programming' ? "block" : "hidden"} w-[80%] md:w-[60%] z-30 h-auto flex flex-col justify-center items-center relative rounded-md lg:rounded-lg mt-5`}>
                    <textarea onChange={(e) => setPrompt(e.target.value)} value={prompt} placeholder="Enter your prompt" className="text-white outline-none w-full font-mono h-52 overflow-y-auto rounded-md lg:rounded-lg bg-zinc-900 px-3 pr-10 pb-10 py-3" />
                    <p className="text-white text-[12px] opacity-70 w-full text-center py-3">Or</p>

                    <p className={`bottom-14 ${prompt === '' ? "right-14" : "right-[100px]"} border-gray-400 text-white text-[10px] md:text-sm hover:bg-gray-700 duration-200 ease-in-out capitalize rounded-md absolute w-auto px-3 py-1 lg:py-2 border-[1px] cursor-pointer `} onClick={() => setTemplateVisible(!templateVisible)}>{template}</p>
                    <span className={`p-2 lg:p-3 ${prompt === '' ? "hidden" : "block"} rounded-md cursor-pointer text-[12px] lg:text-sm bottom-14 right-3 duration-200 ease-in-out active:scale-95 absolute bg-orange-400 text-white`} onClick={handleSubmit}><IoSparklesSharp /></span>
                    <span className={`p-2 lg:p-3 ${listening ? "hidden" : "block"} rounded-md cursor-pointer text-[12px] lg:text-sm bottom-14 ${prompt === '' ? "right-3" : "right-14"} duration-200 ease-in-out active:scale-95 absolute bg-fuchsia-400 text-white`} onClick={startRecording}><MdKeyboardVoice /></span>
                    <span className={`p-2 lg:p-3 ${listening ? "block" : "hidden"} rounded-md cursor-pointer text-[12px] lg:text-sm bottom-14 ${prompt === '' ? "right-3" : "right-14"} duration-200 ease-in-out active:scale-95 absolute bg-red-500 text-white`} onClick={stopRecording}><FaRegStopCircle /></span>

                    <div className={`w-52 lg:w-72 overflow-y-auto ${templateVisible ? "block" : "hidden"} px-1 py-1 absolute flex flex-col lg:overflow-y-hidden lg:overflow-x-auto lg:flex-row justify-start items-start lg:items-center -bottom-36 lg:-bottom-4 content right-0 h-44 lg:h-auto bg-zinc-800 rounded-md`}>
                        {templates.map((temp, index) => {
                            return <p key={index} className="w-full px-3 flex justify-start text-[12px] lg:text-sm items-center gap-2 text-white cursor-pointer py-2 hover:bg-gray-600 duration-200 ease-in-out text-start rounded-md" onClick={() => { setTemplate(temp.name); setTemplateVisible(!templateVisible) }}>{temp.icon}{temp.name}</p>
                        })}
                    </div>
                </div>

                <div className={` ${option === 'programming' ? "block" : "hidden"} w-[80%] md:w-[60%] flex flex-wrap justify-center items-start gap-3`}>
                    {homeSuggestionPrompt.map((p, index) => {
                        return <p onClick={() => setPrompt(p)} key={index} className="w-auto text-[12px] px-3 py-1 rounded-full bg-zinc-900 text-gray-400 hover:text-white cursor-pointer duration-200 ease-in-out active:scale-95">{p}</p>
                    })}
                </div>

                <p className={`text-white z-30 text-sm md:text-lg md:py-2 w-auto px-8 text-center py-4 border-b-[1px] border-orange-500 mt-5 ${option === 'everyday' ? "block" : "hidden"}`}>For Everyday Tasks</p>
                <div className={`w-[80%] md:w-[60%] z-30 h-auto flex flex-col justify-center items-center relative rounded-md lg:rounded-lg mt-5 ${option === 'everyday' ? "block" : "hidden"}`}>
                    <textarea onChange={(e) => setPrompt(e.target.value)} value={prompt} placeholder="Enter your task" className="text-white outline-none w-full font-mono h-52 overflow-y-auto rounded-md lg:rounded-lg bg-zinc-900 px-3 pr-10 pb-10 py-3" />
                    <p className="text-white text-[12px] opacity-70 w-full text-center py-3">Or</p>

                    <span className={`p-2 lg:p-3 ${prompt === '' ? "hidden" : "block"} rounded-md cursor-pointer text-[12px] lg:text-sm bottom-14 right-3 duration-200 ease-in-out active:scale-95 absolute bg-orange-400 text-white`} onClick={handleSubmit}><IoSparklesSharp /></span>
                    <span className={`p-2 lg:p-3 ${listening ? "hidden" : "block"} rounded-md cursor-pointer text-[12px] lg:text-sm bottom-14 ${prompt === '' ? "right-3" : "right-14"} duration-200 ease-in-out active:scale-95 absolute bg-fuchsia-400 text-white`} onClick={startRecording}><MdKeyboardVoice /></span>
                    <span className={`p-2 lg:p-3 ${listening ? "block" : "hidden"} rounded-md cursor-pointer text-[12px] lg:text-sm bottom-14 ${prompt === '' ? "right-3" : "right-14"} duration-200 ease-in-out active:scale-95 absolute bg-red-500 text-white`} onClick={stopRecording}><FaRegStopCircle /></span>
                </div>

                <div className={`w-[80%] md:w-[60%] flex flex-wrap justify-center items-start gap-3 ${option === 'everyday' ? "block" : "hidden"}`}>
                    {homeSuggestionTasks.map((p, index) => {
                        return <p onClick={() => setPrompt(p)} key={index} className="w-auto text-[12px] px-3 py-1 rounded-full bg-zinc-900 text-gray-400 hover:text-white cursor-pointer duration-200 ease-in-out active:scale-95">{p}</p>
                    })}
                </div>

            </div>
        </>
    )
}

export default page

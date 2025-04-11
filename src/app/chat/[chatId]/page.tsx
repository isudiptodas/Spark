'use client'

import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IoSparklesSharp } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";

export default function Page({ params, }: { params: Promise<{ chatId: string }> }) {

    const { chatId } =  use(params);
    const question = decodeURIComponent(chatId);
    const [prompt, setPrompt] = useState('');
    const [option, setOption] = useState('preview');
    const router = useRouter();
    const searchParams = useSearchParams();
    const template = searchParams.get('template');
    const[loaded, setLoaded] = useState(false);

    useEffect(()=> {
       setTimeout(()=> {
        setLoaded(true);
       }, 2000);
    }, []);

    return (
        <>
            <div className={`${loaded ? "block" : "hidden"} w-full min-h-screen flex flex-col justify-start overflow-hidden items-center gap-3 bg-black relative scrollbar-hide`}>
                <div className="h-56 w-56 lg:h-72 lg:w-[500px] absolute z-10 -top-24 -right-20 lg:-top-56 lg:-right-16 opacity-40 rounded-full bg-orange-400 blur-[120px]"></div>

                <h1 className=" font-black z-30 text-2xl md:py-10 py-5 bg-gradient-to-br from-orange-300 via-orange-700 to-transparent bg-clip-text text-transparent">SPARK</h1>

                <div className="w-full h-full px-2 py-3 lg:py-0 lg:-mt-5 flex flex-col lg:flex-row justify-start items-center lg:items-start gap-3 overflow-hidden scrollbar-hide">

                    <div className="hidden lg:flex bg-gradient-to-b from-zinc-950 via-zinc-950 to-transparent h-[77vh] rounded-md w-[30%] flex-col justify-between items-center gap-3 px-3 py-2 relative">
                        <Link href='/new-chat' className="w-full text-center py-2 rounded-md bg-white text-black cursor-pointer hover:opacity-70 duration-200 ease-in-out active:scale-95">New Chat +</Link>
                        <textarea onChange={(e) => setPrompt(e.target.value)} className="w-full px-2 py-2 outline-none h-24 bg-zinc-800 rounded-md text-white" placeholder="Ask your question" />
                        <span className={`p-2 ${prompt === '' ? "hidden" : "block"} rounded-md cursor-pointer text-sm bottom-5 right-5 duration-200 ease-in-out active:scale-95 absolute bg-orange-400 text-white`}><IoSparklesSharp /></span>
                    </div>

                    <div className="w-full h-full flex flex-col z-50 lg:pr-4 scrollbar-hide">

                        <div className={`w-full flex justify-start items-start gap-3 px-4 py-3 rounded-md bg-zinc-950`}>
                            <span onClick={() => setOption('chat')} className={` text-[12px] md:text-sm px-3 py-1 rounded-full lg:hidden cursor-pointer duration-200 ease-in-out border-[1px] ${option === 'chat' ? "border-2 border-emerald-600 bg-emerald-300 text-black" : "text-white border-zinc-700 bg-black"}`}>Chat</span>
                            <span onClick={() => setOption('files')} className={` text-[12px] lg:hidden md:text-sm px-3 py-1 rounded-full cursor-pointer duration-200 ease-in-out border-[1px] ${option === 'files' ? "border-2 border-emerald-600 bg-emerald-300 text-black" : "text-white border-zinc-700 bg-black"}`}>Files</span>
                            <span onClick={() => setOption('code')} className={` text-[12px] md:text-sm px-3 py-1 rounded-full lg:hidden cursor-pointer duration-200 ease-in-out border-[1px] ${option === 'code' ? "border-2 border-emerald-600 bg-emerald-300 text-black" : "text-white border-zinc-700 bg-black"}`}>Code</span>
                            <span onClick={() => setOption('codefiles')} className={` text-[12px] md:text-sm px-3 py-1 rounded-full hidden lg:block cursor-pointer duration-200 ease-in-out border-[1px] ${option === 'codefiles' ? "border-2 border-emerald-600 bg-emerald-300 text-black" : "text-white border-zinc-700 bg-black"}`}>Code</span>
                            <span onClick={() => setOption('preview')} className={` text-[12px] md:text-sm px-3 py-1 rounded-full cursor-pointer duration-200 ease-in-out border-[1px] ${option === 'preview' ? "border-2 border-emerald-600 bg-emerald-300 text-black" : "text-white border-zinc-700 bg-black"}`}>Preview</span>
                        </div>

                        {option === 'chat' && <div className={`lg:hidden h-[75vh] px-3 py-3 overflow-y-auto scrollbar-hide w-full bg-gradient-to-b from-zinc-900 via-zinc-900 to-transparent flex flex-col justify-start items-center gap-3`}>
                            <Link href='/new-chat' className="w-full text-center py-2 rounded-md bg-white text-black cursor-pointer hover:opacity-70 duration-200 ease-in-out active:scale-95">New Chat</Link>

                        </div>}

                        <div className={` w-full h-full scrollbar-hide ${option === 'chat' ? "hidden" : "block"}`}>
                            <SandpackProvider theme={'dark'}>
                                <SandpackLayout className="h-[80vh] lg:h-[70vh] w-full lex flex-col scrollbar-hide">
                                    {option === 'code' && <SandpackCodeEditor className={`h-full w-full`} showInlineErrors showTabs closableTabs showLineNumbers={true} />}
                                    {option === 'preview' && <SandpackPreview className={`h-full w-full`} />}
                                    {option === 'files' && <div className="h-full w-full flex">
                                        <SandpackFileExplorer className={`h-full w-full`} />
                                    </div>}

                                    <div className={`hidden lg:flex h-full w-full`}>
                                        <SandpackFileExplorer className={`h-full w-[20%]`} />
                                        <SandpackCodeEditor className={`h-full w-[70%] flex-none`} showInlineErrors showTabs closableTabs showLineNumbers={true} />
                                    </div>
                                </SandpackLayout>
                            </SandpackProvider>
                        </div>
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

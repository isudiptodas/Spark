'use client'

import Link from "next/link"
import { homeSuggestionPrompt } from "@/data/homeSuggestion"
import { IoSparklesSharp } from "react-icons/io5";
import { useState } from "react";

function page() {

  const[prompt, setPrompt] = useState('');

  const handleSubmit = async () => {
    try {
      
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="w-full h-screen flex flex-col justify-start overflow-hidden items-center gap-3 bg-black relative">


        <div className="h-56 w-56 lg:h-72 lg:w-96 absolute z-10 -top-24 -right-20 lg:-top-56 lg:-right-16 opacity-40 rounded-full bg-orange-400 blur-[120px]"></div>

        <h1 className=" font-black z-30 text-2xl md:py-10 py-5 bg-gradient-to-br from-orange-300 via-orange-700 to-transparent bg-clip-text text-transparent">SPARK</h1>

        <p className="text-white z-30 text-sm md:text-lg md:py-2 w-auto px-8 text-center py-4 border-b-[1px] border-orange-500">ChatGPT on Steroids</p>

        <div className="w-[80%] md:w-[60%] z-30 h-auto flex flex-col justify-center items-center relative rounded-md lg:rounded-lg mt-5">
          <textarea onChange={(e) => setPrompt(e.target.value)} value={prompt} placeholder="Enter your prompt" className="text-white outline-none w-full font-mono h-52 rounded-md lg:rounded-lg bg-zinc-900 px-3 pr-10 py-3" />
          <p className="text-white text-[12px] opacity-70 w-full text-center py-3">Or</p>

          <span className={`p-2 lg:p-3 ${prompt === '' ? "hidden" : "block"} rounded-md cursor-pointer text-[12px] lg:text-sm bottom-14 right-3 duration-200 ease-in-out active:scale-95 absolute bg-orange-400 text-white`}><IoSparklesSharp /></span>
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

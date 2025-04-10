'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { Toaster, toast } from 'sonner';

function page() {

  const [option, setOption] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);

  const router = useRouter();

  const register = async () => {
    
    if (!email || !password || !name) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await axios.post('/api/user', {
        email, name, password, action: 'register'
      });
    } catch (err) {
      console.log(err);
    }
  }

  const login = async () => {
    try {
      if (!email || !password) {
        toast.error("Both email and password required");
        return;
      }

      router.push('/new-chat');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="w-full h-screen flex flex-col justify-start overflow-hidden items-center gap-3 bg-black relative">
        <Toaster richColors position="top-center" />

        <div className="h-56 w-56 lg:h-72 lg:w-[500px] absolute z-10 -top-24 -right-20 lg:-top-56 lg:-right-16 opacity-40 rounded-full bg-orange-400 blur-[120px]"></div>

        <h1 className=" font-black z-30 text-2xl md:py-10 py-5 bg-gradient-to-br from-orange-300 via-orange-700 to-transparent bg-clip-text text-transparent">SPARK</h1>

        <p className="text-white z-30 text-sm md:text-lg md:py-2 w-auto px-8 text-center py-4 border-b-[1px] font-bold border-orange-500">Add a little spark to your coding journey</p>

        <div className="w-[90%] md:w-[50%] xl:w-[40%] mt-10 lg:mt-4 py-3 px-3 flex flex-col justify-center items-center gap-3 bg-zinc-900 rounded-md lg:rounded-lg">
          <div className="w-full flex justify-between items-center gap-4">
            <span onClick={() => setOption('login')} className={`w-full rounded-md py-2 text-center ${option === 'login' ? "text-white bg-orange-400" : "border-[1px] border-orange-400 text-white"} cursor-pointer duration-200 ease-in-out hover:opacity-75`}>Log In</span>
            <span onClick={() => setOption('signup')} className={`w-full rounded-md py-2 text-center ${option === 'signup' ? "text-white bg-orange-400" : "border-[1px] border-orange-400 text-white"} cursor-pointer duration-200 ease-in-out hover:opacity-75`}>Sign Up</span>
          </div>

          <div className={`${option === 'login' ? "block" : "hidden"} w-full py-3 px-3 flex flex-col justify-start items-start gap-3 rounded-md lg:rounded-lg mt-5 relative`}>
            <h1 className="w-full text-center text-white font-bold text-2xl mb-5">Login to your Account</h1>
            <input onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-md bg-black px-3 py-2 text-white outline-none" placeholder="Enter email" />

            <div className="w-full flex justify-center items-center relative">
              <input onChange={(e) => setPassword(e.target.value)} type={visible ? "text" : "password"} className="w-full rounded-md bg-black px-3 py-2 text-white outline-none" placeholder="Enter password" />
              <span onClick={() => setVisible(!visible)} className="text-gray-500 absolute right-7 bottom-3">{visible ? <FaEye /> : <FaEyeSlash />}</span>
            </div>

            <p className="w-full py-2 text-center bg-orange-400 text-white cursor-pointer hover:opacity-75 duration-200 ease-in-out active:scale-95 rounded-md lg:rounded-lg" onClick={login}>Enter </p>
          </div>

          <div className={`${option === 'signup' ? "block" : "hidden"} w-full py-3 px-3 flex flex-col justify-start items-start gap-3 rounded-md lg:rounded-lg mt-5 relative`}>
            <h1 className="w-full text-center text-white font-bold text-2xl mb-5">Create a new account</h1>
            <input onChange={(e) => setName(e.target.value)} type="text" className="w-full rounded-md bg-black px-3 py-2 text-white outline-none" placeholder="Enter name" />
            <input onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-md bg-black px-3 py-2 text-white outline-none" placeholder="Enter email" />

            <div className="w-full flex justify-center items-center relative">
              <input onChange={(e) => setPassword(e.target.value)} type={visible ? "text" : "password"} className="w-full rounded-md bg-black px-3 py-2 text-white outline-none" placeholder="Enter password" />
              <span onClick={() => setVisible(!visible)} className="text-gray-500 absolute right-7 bottom-3">{visible ? <FaEye /> : <FaEyeSlash />}</span>
            </div>

            <p className="w-full py-2 text-center bg-orange-400 text-white cursor-pointer hover:opacity-75 duration-200 ease-in-out active:scale-95 rounded-md lg:rounded-lg" onClick={register}>Create </p>
          </div>
        </div>


      </div>
    </>
  )
}

export default page

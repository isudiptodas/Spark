'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { Toaster, toast } from 'sonner';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import Link from "next/link";
function page() {

  const [option, setOption] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [logging, setLogging] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [mailSent, setMailSent] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');

  const router = useRouter();

  const register = async () => {

    if (!email || !password || !name) {
      toast.error("All fields are required");
      return;
    }

    if(password.length < 8){
      toast.error("Password length must be 8 or long");
      return;
    }

    try {
      setRegistering(true);
      const otp = Math.floor(100000 + Math.random() * 900000);
      setGeneratedOTP(otp.toString());

      const res = await axios.post('/api/user', {
        email, name, password, action: 'register', otp
      });

      //console.log(res.data);

      if (res.data.status === 200) {
        setMailSent(true);
        toast.success("Verification mail sent. Please check email");
      }
      else if (res.data.status === 400) {
        toast.error('Email already exists');
      }
      else {
        toast.error("Something went wrong");
      }

    } catch (err) {
      console.log(err);
    }
    finally {
      setRegistering(false);
    }
  }

  const login = async () => {

    if (!email || !password) {
      toast.error("Both email and password required");
      return;
    }

    try {
      setLogging(true);

      const res = await axios.post('/api/user', {
        email, password, action: 'login', name
      });

      //console.log(res.data);

      if (res.data.status === 200) {
        router.push('/new-chat');
        console.log(res.data);
      }
      else if (res.data.status === 404) {
        toast.error('User not found');
      }
      else if (res.data.status === 400) {
        toast.error("Incorrect password");
      }
      else {
        toast.error("Something went wrong");
      }

    } catch (err) {
      console.log(err);
    }
    finally {
      setLogging(false);
    }
  }

  const verify = async () => {

    if(!enteredOTP){
      toast.error("Please enter OTP");
      return;
    }

    if(enteredOTP !== generatedOTP){
      toast.error("Incorrect OTP");
      return;
    }

    try {
      setVerifying(true);

      const res = await axios.post('/api/user', {
       action: 'verify', email, name, password
      });

      if(res.data.status === 200){
        setOption('login');
        setMailSent(false);
        toast.success("Registration successfull");
      }
      else{
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.log(err);
    }
    finally{
      setVerifying(false);
    }
  }

  // useEffect(()=> {
  //   console.log(Math.floor(Math.random() *600000).toString());
  // });

  return (
    <>
      <div className="w-full min-h-screen pb-10 flex flex-col justify-start overflow-hidden items-center gap-3 bg-black relative">
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
            <Link href='/forgot-password' className="w-full text-start text-[12px] cursor-pointer text-orange-400">Forgot password ?</Link>

            <p className="w-full py-2 text-center bg-orange-400 text-white cursor-pointer hover:opacity-75 duration-200 ease-in-out active:scale-95 rounded-md lg:rounded-lg" onClick={login}>{logging ? "Logging..." : "Enter"} </p>
          </div>

          <div className={`${option === 'signup' ? "block" : "hidden"} w-full py-3 px-3 flex flex-col justify-start items-start gap-3 rounded-md lg:rounded-lg mt-5 relative`}>
            <h1 className="w-full text-center text-white font-bold text-2xl mb-5">Create a new account</h1>
            <input onChange={(e) => setName(e.target.value)} type="text" className={`w-full rounded-md bg-black px-3 py-2 text-white outline-none ${mailSent ? "hidden" : "block"}`} placeholder="Enter name" />
            <input onChange={(e) => setEmail(e.target.value)} type="email" className={`w-full rounded-md bg-black px-3 py-2 text-white outline-none ${mailSent ? "hidden" : "block"}`} placeholder="Enter email" />

            <div className={`w-full flex justify-center items-center relative ${mailSent ? "hidden" : "block"}`}>
              <input onChange={(e) => setPassword(e.target.value)} type={visible ? "text" : "password"} className="w-full rounded-md bg-black px-3 py-2 text-white outline-none" placeholder="Enter password" />
              <span onClick={() => setVisible(!visible)} className="text-gray-500 absolute right-7 bottom-3">{visible ? <FaEye /> : <FaEyeSlash />}</span>
            </div>

            <p className={`w-full py-2 text-center bg-orange-400 text-white cursor-pointer hover:opacity-75 duration-200 ease-in-out active:scale-95 rounded-md lg:rounded-lg ${mailSent ? "hidden" : "block"}`} onClick={register}>{registering ? "Registering..." : "Create"} </p>

            <div className={`w-full py-2 flex flex-col justify-center items-center gap-2 ${mailSent ? "block" : "hidden"}`}>
              <p className="text-white text-[12px] lg:text-sm">Enter your one-time password.</p>
              <InputOTP
                maxLength={6}
                value={enteredOTP}
                onChange={(value) => setEnteredOTP(value)}
              >
                <InputOTPGroup className="text-white">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <p className="text-black flex justify-center items-center w-full py-2 mt-2 bg-white rounded-md cursor-pointer hover:opacity-75 duration-200 ease-in-out text-[12px] lg:text-sm" onClick={verify}>{verifying ? "Verifying..." : "Verify"}</p>
            </div>
          </div>
        </div>


      </div>
    </>
  )
}

export default page

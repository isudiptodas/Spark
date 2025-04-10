"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Toaster, toast } from 'sonner';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import axios from "axios";

function page() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [emailFound, setEmailFound] = useState(false);
    const [mailSent, setMailSent] = useState(false);
    const [mailChecking, setMailChecking] = useState(false);
    const [enteredOTP, setEnteredOTP] = useState('');
    const [generatedOTP, setGeneratedOTP] = useState('');
    const [visible, setVisible] = useState(false);
    const router = useRouter();

    const checkEmail = async () => {
        if (!email) {
            toast.error("Please enter email");
            return;
        }

        try {
            setMailChecking(true);

            const otp = Math.floor(100000 + Math.random() * 900000);
            setGeneratedOTP(otp.toString());
            const res = await axios.post(`/api/password-recovery`, {
                email, otp
            });

            if (res.data.status === 200) {
                setEmailFound(true);
                setMailSent(true);
                toast.success("Email found");
            }
            else if (res.data.status === 404) {
                toast.error("No user found");
            }
        } catch (err) {
            console.log(err);
        }
        finally {
            setMailChecking(false);
        }
    }

    const verifyOTP = async () => {

        if (!enteredOTP) {
            toast.error("Please enter OTP");
            return;
        }

        if (enteredOTP !== generatedOTP) {
            toast.error("Incorrect OTP");
            return;
        }
        setOtpVerified(true);
    }

    const changePassword = async () => {
        if (!password || !confirm) {
            toast.error("Both fields are required");
            return;
        }

        if (password.length < 8) {
            toast.error("Password length must be 8 or more");
            return;
        }

        if (password !== confirm) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setUpdating(true);
            const res = await axios.put('/api/password-recovery', {
                password, email
            });

            if (res.data.status === 201) {
                toast.success("Password changed");
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            }
            else if (res.data.status === 400) {
                toast.error("New password cannot be same as old password");
            }
            else if (res.data.status === 500) {
                toast.error("Something went wrong");
            }
        } catch (err) {
            console.log(err);
        }
        finally {
            setUpdating(false);
        }

    }

    return (
        <>
            <div className="w-full h-screen px-4 flex flex-col justify-start items-center gap-3 bg-black relative overflow-hidden">

                <Toaster richColors position="top-center" />
                <div className="h-56 w-56 lg:h-72 lg:w-[500px] absolute z-10 -top-24 -right-20 lg:-top-56 lg:-right-16 opacity-40 rounded-full bg-orange-400 blur-[120px]"></div>

                <h1 className=" font-black z-30 text-2xl md:py-10 py-5 bg-gradient-to-br from-orange-300 via-orange-700 to-transparent bg-clip-text text-transparent">SPARK</h1>

                <div className={`${emailFound ? "hidden" : "block"} w-full md:w-[50%] xl:w-[40%] h-auto py-4 px-3 bg-zinc-900 rounded-md flex flex-col justify-start items-start gap-4`}>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" className="w-full py-2 px-3 rounded-md text-white bg-black outline-none" placeholder="Enter email" />
                    <p className="w-full bg-orange-400 text-center py-2 rounded-md text-white cursor-pointer hover:opacity-70 ease-in-out duration-200" onClick={checkEmail}>{mailChecking ? "Checking..." : "Check mail"}</p>
                </div>

                <div className={`${emailFound ? "block" : "hidden"} ${otpVerified ? "hidden" : ""} w-full md:w-[50%] xl:w-[40%] h-auto py-4 px-3 bg-zinc-900 rounded-md flex flex-col justify-start items-center mt-4 gap-4`}>
                    <p className="text-white text-[12px] lg:text-sm">OTP sent successfully</p>
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
                    <p className="w-full bg-orange-400 text-center py-2 rounded-md text-white cursor-pointer hover:opacity-70 ease-in-out duration-200" onClick={verifyOTP}>Verify OTP</p>
                </div>

                <div className={`${otpVerified ? "block" : "hidden"} w-full md:w-[50%] xl:w-[40%] h-auto py-4 px-3 bg-zinc-900 rounded-md flex flex-col relative justify-start items-start gap-4`}>
                    <input onChange={(e) => setPassword(e.target.value)} type={visible ? "text" : "password"} className="w-full rounded-md bg-black px-3 py-2 text-white outline-none" placeholder="Enter new password" />
                    <input onChange={(e) => setConfirm(e.target.value)} type={visible ? "text" : "password"} className="w-full rounded-md bg-black px-3 py-2 text-white outline-none" placeholder="Confirm new password" />
                    <span onClick={() => setVisible(!visible)} className="text-gray-500 absolute right-7 top-7">{visible ? <FaEye /> : <FaEyeSlash />}</span>
                    <span onClick={() => setVisible(!visible)} className="text-gray-500 absolute right-7 bottom-[85px]">{visible ? <FaEye /> : <FaEyeSlash />}</span>

                    <p className="w-full bg-orange-400 text-center py-2 rounded-md text-white cursor-pointer hover:opacity-70 ease-in-out duration-200" onClick={changePassword}>{updating ? "Updating..." : "Change Password"}</p>
                </div>

            </div>
        </>
    )
}

export default page

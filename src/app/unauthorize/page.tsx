import Link from "next/link"

function page() {

    return (
        <>
            <div className="w-full h-screen px-5 overflow-hidden bg-black flex flex-col justify-start items-center gap-3 relative">
                <div className="h-56 w-56 lg:h-72 lg:w-[500px] absolute z-10 -top-24 -right-20 lg:-top-56 lg:-right-16 opacity-40 rounded-full bg-orange-400 blur-[120px]"></div>

                <h1 className=" font-black z-30 text-2xl md:py-10 py-5 bg-gradient-to-br from-orange-300 via-orange-700 to-transparent bg-clip-text text-transparent">SPARK</h1>
                
                <p className="w-full text-white text-center font-bold text-xl">Oops ! Looks like you are not logged In :(</p>
                <p className="w-full text-white text-center text-[12px]">Go back to Login Page</p>
                <Link href='/' className="w-auto text-center px-4 py-1 text-[12px] lg:text-sm rounded-full cursor-pointer hover:opacity-75 duration-200 ease-in-out active:scale-95 text-white bg-orange-400">Login</Link>
            </div>
        </>
    )
}

export default page

export default async function Page({ params, }: {
    params: Promise<{ chatId: string }>
}) {
    const { chatId } = await params
    const question = decodeURIComponent(chatId);

    return (
        <>
            <div className="w-full h-screen flex flex-col justify-start overflow-hidden items-center gap-3 bg-black relative">
                <div className="h-56 w-56 lg:h-72 lg:w-[500px] absolute z-10 -top-24 -right-20 lg:-top-56 lg:-right-16 opacity-40 rounded-full bg-orange-400 blur-[120px]"></div>

                <h1 className=" font-black z-30 text-2xl md:py-10 py-5 bg-gradient-to-br from-orange-300 via-orange-700 to-transparent bg-clip-text text-transparent">SPARK</h1>


            </div>
        </>
    )
}

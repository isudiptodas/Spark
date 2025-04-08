export default async function Page({ params, }: {
    params: Promise<{ chatId: string }>
}) {
    const { chatId } = await params
    const question = decodeURIComponent(chatId);

    return (
        <>

            <p>chat window - {question}</p>

        </>)
}
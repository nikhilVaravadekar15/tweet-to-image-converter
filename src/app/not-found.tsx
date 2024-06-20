import {
    ArrowBigLeft
} from 'lucide-react'
import Link from 'next/link'


export default function NotFound() {
    return (
        <main className="h-screen w-screen flex flex-col items-center justify-center">
            <div className="text-center">
                <p className="text-base font-semibold text-black">404</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
                    Page not found
                </h1>
                <p className="mt-4 text-base leading-7">
                    {"Sorry, we couldn't find the page you're looking for."}
                </p>
            </div>
            <div className="mt-4 flex items-center justify-center gap-x-3">
                <Link
                    href={"/"}
                    passHref={true}
                    className="text-sm py-4 px-8 flex gap-2 items-center justify-center font-semibold text-white bg-blue-500 rounded-2xl"
                >
                    <ArrowBigLeft size={20} />
                    Go back
                </Link>
            </div>
        </main>
    )
}

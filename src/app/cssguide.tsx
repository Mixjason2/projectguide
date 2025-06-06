export default function CssgGuide({ children }: { children: React.ReactNode }) {
    return (
        <>
            <header className="navbar bg-base-300 py-8 px-12 text-3xl font-bold shadow-lg flex items-center justify-between">
                <div className="flex-none flex items-center">
                    <button className="btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> 
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> 
                        </svg>
                    </button>
                    <button className="btn btn-square btn-ghost ml-2"></button>
                </div>
                <div className="flex-1 flex items-center justify-center w-full">
                    <span className="text-center w-full">CSS Guide</span>
                </div>
            </header>
            <div> {children}</div>
        </>
    )
};
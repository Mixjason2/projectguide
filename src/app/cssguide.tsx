import React, { useState } from "react";

export default function CssgGuide({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <header className="navbar bg-base-300 py-8 px-12 text-3xl font-bold shadow-lg ">
                <div className="flex-none">
                    <div className="flex-none ml-auto">
                        {/* Hamburger Button */}
                        <button
                            className="btn btn-square btn-ghost"
                            onClick={() => setOpen(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                        <div className="flex items-center justify-center w-full">
                            <span className="text-center">CSS Guide</span>
                        </div>
                    </div>
                </div>
            </header>
            {/* Drawer */}
            {open && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-30 z-30"
                        onClick={() => setOpen(false)}
                    />
                    <div
                        id="drawer-navigation"
                        className="fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto bg-white w-64 dark:bg-gray-800 transition-transform"
                        tabIndex={-1}
                        aria-labelledby="drawer-navigation-label"
                    >
                        <h5 id="drawer-navigation-label" className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menu</h5>
                        <button
                            type="button"
                            aria-controls="drawer-navigation"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => setOpen(false)}
                        >
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close menu</span>
                        </button>
                        <div className="py-4 overflow-y-auto">
                            <ul className="space-y-2 font-medium">
                                <li>
                                    <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                        <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                            <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                            <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                        </svg>
                                        <span className="ms-3">Dashboard</span>
                                    </a>
                                </li>
                                {/* ... (รายการเมนูอื่นๆ ตามที่คุณให้มา) ... */}
                            </ul>
                        </div>
                    </div>
                </>
            )}
            <div> {children}</div>
        </>
    )
}
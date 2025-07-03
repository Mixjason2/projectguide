'use client';
import React, { useState } from "react";
import Link from "next/link";
import Image from 'next/image';

export default function CssgGuide({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="navbar bg-[#2D3E92] py-4 px-12 text-3xl font-bold shadow-lg flex items-center justify-between text-white">
        {/* Left: Hamburger */}
        <div className="flex-none flex items-center">
          <button
            className="btn btn-square btn-ghost text-white"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Center: Logo */}
        <div className="flex items-center justify-center w-full">
          <img
            src="https://dth.travel/wp-content/uploads/2023/08/DTH-LOGO-FULL-WHITE-FORMERLY-new.svg"
            alt="DTH Logo"
            className="h-16 w-auto"
          />
        </div>
 
        {/* Right: Notification Button */}
        <div className="flex-none flex items-center">
          <button
            className="btn btn-square btn-ghost text-white"
            aria-label="Notifications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-6 w-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0
                  .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Drawer */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <nav
            id="drawer-navigation"
            className="fixed top-0 left-0 z-40 min-h-screen w-64 bg-[#2D3E92] p-4 flex flex-col text-white"
            tabIndex={-1}
            aria-labelledby="drawer-navigation-label"
          >
            {/* Drawer Header */}
            <div className="relative flex items-center justify-between mb-4">
              <h5
                id="drawer-navigation-label"
                className="text-base font-semibold uppercase"
              >
                Menu
              </h5>
              <button
                type="button"
                aria-controls="drawer-navigation"
                className="bg-transparent hover:bg-[#1f2b68] hover:text-white rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>

            {/* Menu items and logout */}
            <div className="flex flex-col flex-1 overflow-hidden pb-8">
              <ul className="flex-1 overflow-y-auto space-y-2 font-medium">
                <li>
                  <Link
                    href="/calendar"
                    className="flex items-center p-4 text-lg font-semibold text-white rounded-xl hover:bg-[#1f2b68] group"
                    onClick={() => setOpen(false)}
                  >
                    <svg
                      className="w-8 h-8 text-white transition duration-75 group-hover:text-gray-200"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="3"
                        fill="currentColor"
                        fillOpacity="0.1"
                      />
                      <rect x="3" y="8" width="18" height="14" rx="2" fill="currentColor" />
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        d="M16 2v4M8 2v4M3 8h18"
                      />
                      <rect x="7" y="12" width="2" height="2" rx="1" fill="white" />
                      <rect x="11" y="12" width="2" height="2" rx="1" fill="white" />
                      <rect x="15" y="12" width="2" height="2" rx="1" fill="white" />
                    </svg>
                    <span className="ms-4">Calendar</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/home"
                    className="flex items-center p-4 text-lg font-semibold text-white rounded-xl hover:bg-[#1f2b68] group"
                    onClick={() => setOpen(false)}
                  >
                    <svg
                      className="w-8 h-8 text-white transition duration-75 group-hover:text-gray-200"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect x="4" y="4" width="16" height="16" rx="3" fill="#2D3E92" />
                      <path stroke="#ffffff" strokeWidth="2" strokeLinecap="round" d="M8 9h8M8 13h5" />
                      <circle cx="7" cy="9" r="1" fill="#ffffff" />
                      <circle cx="7" cy="13" r="1" fill="#ffffff" />
                    </svg>
                    <span className="ms-4">Jobs List</span>
                  </Link>
                </li>

                {/* <li>
                  <Link
                    href="/booking"
                    className="flex items-center p-4 text-lg font-semibold text-white rounded-xl hover:bg-[#1f2b68] group"
                    onClick={() => setOpen(false)}
                  >
                    <svg
                      className="w-8 h-8 text-white transition duration-75 group-hover:text-gray-200"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect x="4" y="4" width="16" height="16" rx="3" fill="#2D3E92" />
                      <path stroke="#ffffff" strokeWidth="2" strokeLinecap="round" d="M8 9h8M8 13h5" />
                      <circle cx="7" cy="9" r="1" fill="#ffffff" />
                      <circle cx="7" cy="13" r="1" fill="#ffffff" />
                    </svg>
                    <span className="ms-4">Booking</span>
                  </Link>
                </li> */}
              </ul>

              {/* Logout button */}
              <div className="mt-auto pt-4">
                <Link
                  href="/"
                  className="flex w-full items-center py-4 px-3 text-red-600 font-medium rounded-lg hover:bg-[#FDECEA] transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 text-red-600 transition duration-75 group-hover:text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                    />
                  </svg>
                  <span className="ms-3">Log Out</span>
                </Link>
              </div>

            </div>
          </nav>
        </>
      )}

      {/* Main content */}
      <main>{children}</main>
      <footer className="bg-white py-4 px-6">
<div className="flex items-center justify-between w-full bg-white px-0 py-2">
<img
  src="https://dth.travel/wp-content/uploads/2023/09/DTH-LOGO-blue.png"
  alt="DTH Logo"
  width={80}
  height={40}
  className="object-contain block ml-[-8px]"
/>

  <p className="text-sm text-gray-500 font-Arial whitespace-nowrap mr-4">
    © 2014–2023 DTH Travel. All Rights Reserved.
  </p>
</div>




</footer>

    </>
  );
}



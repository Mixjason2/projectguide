'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Job } from '../components/types';
import { PaintBrushIcon } from '@heroicons/react/24/outline';

function DashboardPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(80);
  const [textColor, setTextColor] = useState<string>('black');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [showTopBar, setShowTopBar] = useState(true);
  const lastScroll = useRef({ x: 0, y: 0 });
  const ticking = useRef(false);

  const colorOptions = [
    { value: 'black', name: 'Black' },
    { value: 'white', name: 'White' },
    { value: '#dc2626', name: 'Red' },
    { value: '#2563eb', name: 'Blue' },
    { value: '#16a34a', name: 'Green' },
    { value: '#f59e0b', name: 'Orange' },
  ];

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('dashboardJobsData');
      if (!stored) {
        router.replace('/calendar');
        return;
      }
      const parsed = JSON.parse(stored) as Job | Job[];
      setJobs(Array.isArray(parsed) ? parsed : [parsed]);
    } catch {
      router.replace('/calendar');
    }
  }, [router]);

  // ปรับการแสดงผล TopBar ตาม fontSize
  // ถ้า fontSize <= 10 ให้ซ่อน TopBar (ย่อ)
  // ถ้า fontSize > 10 ให้แสดง TopBar
  useEffect(() => {
    if (fontSize <= 10) {
      setShowTopBar(false);
    } else {
      setShowTopBar(true);
    }
  }, [fontSize]);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentX = window.scrollX;
          const currentY = window.scrollY;

          const deltaX = currentX - lastScroll.current.x;
          const deltaY = currentY - lastScroll.current.y;

          const threshold = 3; // กันกระพริบเวลาปัดน้อยๆ

          if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
            if (deltaX > 0 || deltaY > 0) {
              if (showTopBar) setShowTopBar(false);
            } else if (deltaX < 0 || deltaY < 0) {
              if (!showTopBar) setShowTopBar(true);
            }
            lastScroll.current = { x: currentX, y: currentY };
          }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showTopBar]);

  if (jobs === null)
    return (
      <div className="flex h-screen justify-center items-center flex-col font-sans text-xl text-gray-600 bg-white text-black">
        <div className="loader mb-4" />
        Loading dashboard...
        <style>{`
          .loader {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #555;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );

  if (jobs.length === 0) return <div className="text-black">No jobs found.</div>;

  const allPaxNames = jobs.flatMap(job =>
    typeof job.pax_name === 'string'
      ? job.pax_name.split(';').map(name => name.trim())
      : []
  );

  const extractSurname = (fullName: string): string => {
    return fullName.split(' ').find(part => part === part.toUpperCase()) || fullName;
  };

  const surnameToNameMap = new Map<string, string>();
  allPaxNames.forEach(name => {
    const surname = extractSurname(name);
    if (!surnameToNameMap.has(surname)) {
      surnameToNameMap.set(surname, name);
    }
  });

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedText(value || null);
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Top Bar */}
      <div
        className={`fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-lg z-50 px-4 py-3 flex flex-wrap items-center justify-between gap-4 transition-transform duration-300 ease-in-out ${
          showTopBar ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{ height: showTopBar ? '56px' : '0', overflow: 'hidden' }}
      >
        <select
          onChange={handleSelect}
          defaultValue=""
          className="px-4 py-2 text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 transition w-fit max-w-[250px]"
        >
          <option value="" disabled>
            Select a passenger
          </option>
          {[...surnameToNameMap.entries()].map(([surname, name]) => (
            <option key={surname} value={surname}>
              {name}
            </option>
          ))}
          {jobs.map((job, index) => (
            <React.Fragment key={index}>
              {job.PNR && <option value={job.PNR}>PNR: {job.PNR}</option>}
              {typeof job.Booking_Name === 'string' && (
                <option value={job.Booking_Name}>{job.Booking_Name}</option>
              )}
            </React.Fragment>
          ))}
        </select>

        <button
          onClick={() => window.close()}
          className="px-4 py-2 border border-gray-400 rounded-lg bg-gray-50 hover:bg-gray-200 transition shadow-sm"
        >
          Close Tab
        </button>
      </div>

      {/* Content */}
      <div
        className="p-6 transition-all duration-300"
        style={{
          paddingTop: showTopBar
            ? '80px'  // เพิ่มเผื่อพื้นที่ให้พอสำหรับ TopBar ตอนโชว์
            : '0px'   // ลดพื้นที่ว่างเมื่อ TopBar ซ่อน
        }}
      >
        {/* Font Control */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <button
            onClick={() => setFontSize(prev => Math.max(10, prev - 5))}
            className="px-4 py-2 text-2xl font-bold border rounded-lg hover:bg-gray-200 transition"
          >
            -
          </button>

          <div className="flex flex-wrap justify-center items-center gap-4 flex-1">
            <button
              onClick={() => {
                setIsRunning(prev => !prev);
                if (!showTopBar) setShowTopBar(true);
              }}
              className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition ${
                isRunning ? 'bg-green-500 text-white shadow' : 'hover:bg-gray-200'
              }`}
            >
              ⇐𝔸
            </button>

            <div className="flex items-center gap-2">
              <PaintBrushIcon className="h-5 w-5 text-gray-700" />
              <select
                value={textColor}
                onChange={e => setTextColor(e.target.value)}
                className="px-2 py-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 transition"
              >
                {colorOptions.map(color => (
                  <option
                    key={color.value}
                    value={color.value}
                    style={{
                      backgroundColor: color.value,
                      color: ['white', 'black'].includes(color.value) ? '#000' : '#fff',
                    }}
                  >
                    {color.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              setFontSize(prev => {
                const newSize = prev + 5;
                if (!showTopBar) setShowTopBar(true);
                return newSize;
              });
            }}
            className="px-4 py-2 text-2xl font-bold border rounded-lg hover:bg-gray-200 transition"
          >
            +
          </button>
        </div>

        {/* Selected Text Display */}
        {selectedText && (
          <div className="mt-6 px-4 w-full pt-[40px]">
            <div
              className={`font-bold text-center uppercase break-words ${
                isRunning ? 'animate-marquee' : ''
              }`}
              style={{
                fontSize: `${fontSize}px`,
                color: textColor,
                whiteSpace: isRunning ? 'nowrap' : 'normal',
                overflow: 'visible',
              }}
            >
              {selectedText}
            </div>
          </div>
        )}
      </div>

      {/* Marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 10s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default DashboardPage;

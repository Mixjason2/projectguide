'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Job } from '../components/types';
import FadeButtons from './fadeButtons';
import { PaintBrushIcon, SunIcon, MoonIcon, CloudIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

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
  const [bgColor, setBgColor] = useState<string>('white');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<number>(100);

  const colorOptions = [
    { value: 'black', name: 'Black' },
    { value: 'white', name: 'White' },
    { value: '#dc2626', name: 'Red' },
    { value: '#2563eb', name: 'Blue' },
    { value: '#16a34a', name: 'Green' },
    { value: '#f59e0b', name: 'Orange' },
  ];

  const expandedHeight = 56;
  const collapsedHeight = 0;

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
          const threshold = 3;

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
      <div className="flex h-screen justify-center items-center flex-col font-sans text-xl text-gray-600 bg-white">
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

  const allPaxNames = jobs.flatMap(job => {
    if (typeof job.pax_name !== 'string') return [];

    const names: string[] = [];
    let workingString = job.pax_name;

    // ตัดชื่อแรกออกจากวงเล็บ ถ้ามี
    const firstSplit = workingString.split(';');
    if (firstSplit.length > 0) {
      firstSplit[0] = firstSplit[0].replace(/\(([^)]+)\)\s*/, '').trim();
      workingString = firstSplit.join(';');
    }

    const otherNames = workingString
      .split(';')
      .map(n => n.trim())
      .filter(n => n.length > 0);

    names.push(...otherNames);
    return names;
  });

  const extractSurname = (fullName: string): string => {
    const cleanedName = fullName.trim();
    const bracketMatch = cleanedName.match(/^\(([^)]+)\)$/);
    if (bracketMatch) return bracketMatch[1].trim();
    const uppercasePart = cleanedName.split(' ').find(part => part === part.toUpperCase());
    return uppercasePart || cleanedName;
  };

  const surnameToNameMap = new Map<string, string>();
  allPaxNames.forEach(name => {
    const surname = extractSurname(name);
    if (!surnameToNameMap.has(surname)) surnameToNameMap.set(surname, name);
  });

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedText(value || null);
  };

  const toggleBackground = () => {
    if (bgColor === 'white') {
      setBgColor('#000000ff');
      setTextColor('white');
    } else {
      setBgColor('white');
      setTextColor('black');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      alert('กรุณาเลือกไฟล์รูป JPEG หรือ PNG เท่านั้น');
    }
  };

  const toggleTopBar = () => setShowTopBar(prev => !prev);

  return (
    <div className="bg-white min-h-screen font-sans">
      <div
        className="min-h-screen font-sans transition-colors duration-300"
        style={{ backgroundColor: bgColor }}
      >
        {/* Top Bar */}
        <div
          className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-lg z-50 px-4 flex flex-wrap items-center justify-between gap-4 transition-all duration-300 ease-in-out"
          style={{
            height: showTopBar ? expandedHeight : collapsedHeight,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* เนื้อหาบนบาร์ */}
          <div
            className="flex flex-wrap items-center justify-between gap-4 w-full"
            style={{
              opacity: showTopBar ? 1 : 0,
              pointerEvents: showTopBar ? 'auto' : 'none',
              transition: 'opacity 0.3s ease',
            }}
          >
            {/* Left: Select */}
            <select
              onChange={handleSelect}
              defaultValue=""
              className="px-4 py-2 text-base border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 transition w-fit max-w-[250px]"
              style={{
                backgroundColor: bgColor === 'white' ? 'white' : '#333333',
                color: bgColor === 'white' ? 'black' : 'white',
                borderColor: bgColor === 'white' ? '#d1d5db' : '#555555',
              }}
            >
              <option value="" disabled>
                Select a passenger
              </option>
              {[...surnameToNameMap.entries()].map(([surname, name]) => (
                <option key={surname} value={surname}>{name}</option>
              ))}
              {jobs.map((job, index) => (
                <React.Fragment key={index}>
                  {job.PNR && <option value={job.PNR}>PNR: {job.PNR}</option>}


                  <option
                    value={job.agentName}
                  >
                    AgentName: {job.agentName.toLowerCase()}
                  </option>


                  {typeof job.Booking_Name === 'string' && (
                    <option
                      value={job.Booking_Name.split('/').slice(0, 2).map(s => s.trim()).join('  ')}
                    >
                      {job.Booking_Name.split('/').slice(0, 2).map(s => s.trim()).join('  ')}
                    </option>
                  )}
                </React.Fragment>
              ))}
            </select>

            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleImageUpload}
              className="text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border file:border-gray-300 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />

            {/* Center: Toggle Switch */}
            <div className="flex justify-center flex-1">
              <button
                onClick={toggleBackground}
                className={`relative inline-flex items-center justify-center w-14 h-8 rounded-full transition-colors duration-300
                  ${bgColor === 'white' ? 'bg-yellow-500' : 'bg-blue-900'}`}
                aria-label="Toggle dark mode"
              >
                <span
                  className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
                    ${bgColor === 'white' ? 'translate-x-0' : 'translate-x-6'}`}
                />

                {bgColor === 'white' ? (
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-yellow-400">
                    <SunIcon className="h-5 w-4.5" />
                  </span>
                ) : (
                  <span className="absolute left-2 top-1/2 w-10 h-6 transform -translate-y-1/2 ">
                    <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse absolute" style={{ top: '9px', left: '3px' }} />
                    <span className="w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-150 absolute" style={{ top: '3px', left: '16px' }} />
                    <span className="w-1.25 h-1.25 bg-yellow-300 rounded-full animate-pulse delay-300 absolute" style={{ top: '2px', left: '7px' }} />
                    <span className="w-0.75 h-0.75 bg-yellow-300 rounded-full animate-ping delay-450 absolute" style={{ top: '5px', left: '16px' }} />
                    <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse absolute" style={{ top: '-5px', left: '0px' }} />
                  </span>
                )}

                <span
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-300 drop-shadow-[0_0_4px_rgba(147,197,253,0.7)] hover:text-indigo-100 transition-colors duration-300"
                  title={bgColor === 'white' ? 'Cloud mode' : 'Dark mode'}
                >
                  {bgColor === 'white' ? <CloudIcon className="h-6 w-5" /> : <MoonIcon className="h-6 w-5" />}
                </span>
              </button>
            </div>

            {/* Right: Close Button */}
            <button
              onClick={() => window.close()}
              className={`px-4 py-2 border rounded-lg transition shadow-sm ${bgColor === 'white'
                ? 'bg-gray-50 border-gray-400 hover:bg-gray-200 text-black'
                : 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-white'
                }`}
            >
              Close Tab
            </button>
          </div>
        </div>

        {/* ปุ่มพับ/ขยาย ลอยออกมานอกบาร์ */}
        {/* ปุ่มพับ/ขยาย ล็อคติดกับ Top Bar */}
        <button
          onClick={toggleTopBar}
          aria-label={showTopBar ? 'Collapse top bar' : 'Expand top bar'}
          title={showTopBar ? 'Collapse top bar' : 'Expand top bar'}
          className="fixed left-1/2 -translate-x-1/2 bg-white border rounded-full shadow-md w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition"
          style={{
            boxShadow: '0 0 8px rgba(0,0,0,0.12)',
            borderColor: '#ddd',
            zIndex: 60,
            top: showTopBar ? `${expandedHeight - 13}px` : `${collapsedHeight - 6}px`, // <-- ล๊อคติดกับขอบล่างของ Top Bar
            transition: 'top 0.3s ease', // เพิ่ม transition ให้ smooth เวลาย่อ/ขยาย
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-gray-700 transition-transform duration-300 ${showTopBar ? 'rotate-180' : 'rotate-0'
              }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>


        {/* Content */}
        <div
          className="p-6 transition-all duration-300"
          style={{
            paddingTop: showTopBar ? `${expandedHeight + 24}px` : `${collapsedHeight + 24}px`,
          }}
        >
          {/* Wrapper สำหรับ fade effect */}
          <FadeButtons>
            {/* Font Control */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <button
                onClick={() => {
                  setFontSize(prev => Math.max(10, prev - 5));
                  setImageSize(prev => Math.max(10, prev - 5));
                }}
                className={`px-4 py-2 text-2xl font-bold border rounded-lg hover:bg-gray-200 transition ${bgColor === 'white' ? 'text-black' : 'text-white'
                  }`}
              >
                -
              </button>

              <div className="flex flex-wrap justify-center items-center gap-4 flex-1">
                <button
                  onClick={() => {
                    setIsRunning(prev => !prev);
                    if (!showTopBar) setShowTopBar(true);
                  }}
                  className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition ${isRunning
                    ? 'bg-green-500 text-white shadow'
                    : bgColor === 'white'
                      ? 'text-black hover:bg-gray-200'
                      : 'text-white hover:bg-gray-700'
                    }`}
                >
                  ⇐𝔸
                </button>

                <div className="flex items-center gap-2">
                  <PaintBrushIcon
                    className={`h-5 w-5 ${bgColor === 'white' ? 'text-gray-700' : 'text-gray-300'}`}
                  />
                  <select
                    value={textColor}
                    onChange={e => setTextColor(e.target.value)}
                    className="px-2 py-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 transition"
                    style={{
                      backgroundColor: bgColor === 'white' ? 'white' : '#333333',
                      color: bgColor === 'white' ? 'black' : 'white',
                      borderColor: bgColor === 'white' ? '#d1d5db' : '#555555',
                    }}
                  >
                    {colorOptions.map(color => (
                      <option
                        key={color.value}
                        value={color.value}
                        disabled={
                          (bgColor === 'white' && color.value === 'white') ||
                          (bgColor !== 'white' && color.value === 'black')
                        }
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
                  setImageSize(prev => prev + 5);
                }}
                className={`px-4 py-2 text-2xl font-bold border rounded-lg hover:bg-gray-200 transition ${bgColor === 'white' ? 'text-black' : 'text-white'
                  }`}
              >
                +
              </button>
            </div>
          </FadeButtons>

          {/* Selected Text Display */}
          {selectedText && (
            <div className="mt-6 px-4 w-full pt-[40px]">
              <div
                className={`font-bold text-center uppercase break-words ${isRunning ? 'animate-marquee' : ''}`}
                style={{
                  fontSize: `${fontSize}px`,
                  whiteSpace: isRunning ? 'nowrap' : 'normal',
                  overflow: 'visible',
                  color: textColor,
                  paddingTop: '125px',
                }}
              >
                {selectedText}
              </div>
            </div>
          )}
        </div>


        {uploadedImage && (
          <div className="mt-6 flex justify-center relative w-full" style={{ height: 'auto', minHeight: '200px' }}>
            <Image
              src={uploadedImage}
              alt="Uploaded preview"
              width={imageSize * 10} // ปรับให้เหมาะกับขนาดจริง
              height={imageSize * 6} // อัตราส่วนประมาณ
              className="rounded-lg shadow-lg"
              style={{ objectFit: 'contain' }}
            />
          </div>
        )}


        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            display: inline-block;
            animation: marquee 10s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
}

export default DashboardPage;

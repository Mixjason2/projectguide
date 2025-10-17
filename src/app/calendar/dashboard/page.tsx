'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Job } from '../components/types';
import FadeButtons from './fadeButtons';
import DraggableResizableBox from './DraggableResizableBox';
import { PaintBrushIcon, SunIcon, MoonIcon, CloudIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';
import Cookies from 'js-cookie';
import Image from 'next/image';

function DashboardPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [selectedTexts, setSelectedTexts] = useState<string[]>([]); // เปลี่ยนเป็น array
  const [fontSize, setFontSize] = useState<number>(80);
  const [textColor, setTextColor] = useState<string>('black');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [bgColor, setBgColor] = useState<string>('white');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [, setImageSize] = useState<number>(100); // ✅ เก็บไว้แต่ ESLint ไม่เตือน
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownButtonRef = useRef<HTMLButtonElement | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const [logos, setLogos] = useState<{ [key: string]: string | null }>({});

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

  const allPaxNames = jobs?.flatMap(job => {
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
  }) || [];

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


  // toggle checkbox ใน dropdown (เก็บเป็นชื่อเต็ม)
  const handleCheckboxChange = (value: string) => {
    setSelectedTexts(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
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

  // เพิ่มด้านบน: useRef สำหรับ dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ใช้ useEffect เพื่อตรวจสอบ click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !(dropdownButtonRef.current && dropdownButtonRef.current.contains(target))
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, dropdownButtonRef]);

  // keep dropdown positioned when window scrolls/resizes
  useEffect(() => {
    if (!showDropdown) return;
    const updatePos = () => {
      const btn = dropdownButtonRef.current;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      setDropdownPos({ top: Math.round(r.bottom + 6), left: Math.round(r.left) });
    };
    updatePos();
    window.addEventListener('resize', updatePos);
    window.addEventListener('scroll', updatePos, true);
    return () => {
      window.removeEventListener('resize', updatePos);
      window.removeEventListener('scroll', updatePos, true);
    };
  }, [showDropdown]);

  // prevent page scroll / layout shift when the dropdown is open
  useEffect(() => {
    if (!showDropdown) return;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight || '';
    // ชดเชยความกว้างของ scrollbar เพื่อไม่ให้เนื้อหา shift เมื่อซ่อน scrollbar
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow || '';
      document.body.style.paddingRight = prevPaddingRight || '';
    };
  }, [showDropdown]);

  useEffect(() => {
    if (!jobs || jobs.length === 0) return;

    const asmdb = Cookies.get('asmdb'); // ✅ ดึงค่า asmdb จาก cookies
    if (!asmdb) {
      console.warn('No asmdb cookie found');
      return;
    }

    const fetchLogos = async () => {
      const newLogos: { [key: string]: string | null } = {};
      const asmdb = Cookies.get('asmdb');
      if (!asmdb) {
        console.warn('No asmdb cookie found');
        return;
      }

      for (const job of jobs) {
        if (!job.PNR || !job.BSL_ID) continue; // skip invalid job

        const pnrEncoded = encodeURIComponent(job.PNR);
        const bslIdEncoded = encodeURIComponent(job.BSL_ID);
        const asmdbEncoded = encodeURIComponent(asmdb);

        const url = `https://operation.dth.travel:7082/api/booking/${pnrEncoded}/${bslIdEncoded}/${asmdbEncoded}/logo`;
        console.log('PNR:', job.PNR, 'BSL_ID:', job.BSL_ID, 'asmdb:', asmdb);
        try {
          console.log('Fetching logo URL:', url);
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Failed to fetch logo for ${job.PNR}`);
          const data = await res.text();
          newLogos[job.PNR] = data.startsWith('data:image') ? data : data; // ไม่เติมอะไร
        } catch (err) {
          console.warn(err);
          newLogos[job.PNR] = null;
        }
      }
      setLogos(newLogos);
    };
    fetchLogos();
  }, [jobs]);

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
            overflow: showTopBar ? 'visible' : 'hidden', // changed: allow dropdown to overflow when bar expanded
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
            {/* Multi-select Dropdown (replaces single select) */}
            <div className="relative w-fit"> {/* เอา max-w ออกเพื่อให้ dropdown ขยายได้ */}
              <button
                ref={dropdownButtonRef}
                className={`px-4 py-2 text-base border rounded-lg shadow-sm w-full text-left focus:ring-2 focus:ring-blue-400 transition
        ${bgColor === 'white' ? 'bg-white text-black border-gray-300' : 'bg-gray-800 text-white border-gray-600'}
        truncate whitespace-nowrap overflow-hidden`}
                onClick={e => {
                  // toggle and compute fixed position for portal-like overlay
                  const btn = e.currentTarget as HTMLElement;
                  const r = btn.getBoundingClientRect();
                  setDropdownPos({ top: Math.round(r.bottom + 6), left: Math.round(r.left) });
                  setShowDropdown(prev => !prev);
                  btn.blur();
                }}
                title={selectedTexts.length > 0 ? selectedTexts.join(', ') : 'Select passengers'}
              >
                {selectedTexts.length > 0
                  ? selectedTexts.join(', ')
                  : 'Select passengers'}
              </button>
              {showDropdown &&
                createPortal(
                  <div
                    ref={dropdownRef}
                    className="bg-white border rounded-lg shadow-lg overflow-y-auto"
                    style={{
                      position: 'fixed',
                      top: dropdownPos ? `${dropdownPos.top}px` : '0px',
                      left: dropdownPos ? `${dropdownPos.left}px` : '0px',
                      minWidth: 'max-content',
                      maxWidth: 'min(90vw, 900px)',
                      maxHeight: '400px',
                      overflowY: 'auto',
                      zIndex: 9999,
                      pointerEvents: 'auto',
                    }}
                  >
                    {/* ✅ รายชื่อ passenger */}
                    {[...surnameToNameMap.entries()].map(([surname, fullName]) => (
                      <label key={surname} className="flex items-center px-3 py-1 hover:bg-gray-100 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedTexts.includes(surname)}
                          onChange={() => handleCheckboxChange(surname)}
                        />
                        <span className="truncate" title={fullName}>{fullName}</span>
                      </label>
                    ))}

                    {/* ✅ job list */}
                    {jobs.map((job, index) => {
                      const bookingText: string | null = typeof job.Booking_Name === 'string'
                        ? job.Booking_Name.split('/').slice(0, 2).map(s => s.trim()).join('  ')
                        : null;

                      return (
                        <React.Fragment key={`job-${index}`}>
                          {job.PNR && (
                            <label className="flex items-center px-3 py-1 hover:bg-gray-100 cursor-pointer">
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={selectedTexts.includes(job.PNR)}
                                onChange={() => handleCheckboxChange(job.PNR)}
                              />
                              <span className="truncate">PNR: {job.PNR}</span>
                            </label>
                          )}
                          {bookingText && (
                            <label className="flex items-center px-3 py-1 hover:bg-gray-100 cursor-pointer">
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={selectedTexts.includes(bookingText)}
                                onChange={() => handleCheckboxChange(bookingText)}
                              />
                              <span className="truncate">BookingName: {bookingText}</span>
                            </label>
                          )}
                        </React.Fragment>
                      );
                    })}

                    {/* ✅ เพิ่มส่วน logo เข้ามาใน dropdown */}
                    {Object.keys(logos).length > 0 && (
                      <>
                        {/* Section Header */}
                        <div className="px-3 py-2 text-sm font-semibold text-gray-500 border-t bg-gray-50">
                          🖼 Image by PNR
                        </div>

                        {/* Logo List */}
                        {Object.entries(logos)
                          .filter(
                            ([_, url]) =>
                              typeof url === "string" &&
                              !!url && // ไม่ให้เป็น null หรือ undefined
                              url.trim() !== "" &&
                              /^https?:|^\//.test(url)
                          )
                          .map(([pnr, url]) => {
                            // ✅ TypeScript จะเข้าใจว่าถึงตรงนี้ url ไม่เป็น null แล้ว
                            const safeUrl = url!.replace(/^"|"$/g, "");

                            return (
                              <div
                                key={pnr}
                                className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100 transition-all"
                                onClick={() => {
                                  setUploadedImage(safeUrl);
                                  setShowDropdown(false);
                                }}
                              >
                                <div className="w-10 h-10 flex items-center justify-center border rounded-md bg-gray-50 overflow-hidden">
                                  <Image
                                    src={safeUrl}
                                    alt={`Logo ${pnr}`}
                                    width={40}
                                    height={40}
                                    style={{ objectFit: "contain" }}
                                    unoptimized
                                  />
                                </div>

                                <div className="flex-1 text-sm text-gray-700 truncate">
                                  PNR: <span className="font-medium">{pnr}</span>
                                </div>
                              </div>
                            );
                          })}
                      </>
                    )}
                  </div>,
                  document.body
                )
              }
            </div>

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
        <button
          onClick={toggleTopBar}
          aria-label={showTopBar ? 'Collapse top bar' : 'Expand top bar'}
          title={showTopBar ? 'Collapse top bar' : 'Expand top bar'}
          className="fixed left-1/2 -translate-x-1/2 bg-white border rounded-full shadow-md w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition"
          style={{
            boxShadow: '0 0 8px rgba(0,0,0,0.12)',
            borderColor: '#ddd',
            zIndex: 60,
            top: showTopBar ? `${expandedHeight - 13}px` : `${collapsedHeight - 6}px`,
            transition: 'top 0.3s ease',
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
            <div className="flex items-center justify-between mb-0 flex-wrap gap-4">
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

          {/* Selected Texts Display */}
          <div
            className="mt-6 px-4 w-full pt-[40px] relative"
            // ถ้ามีรูป ให้ลด minHeight ลงเพื่อไม่ให้กันพื้นที่ (รูปวางแบบ absolute จะไม่ถูกดัน)
            style={{ minHeight: uploadedImage ? '0' : '400px' }}
          >
            <div className="w-full flex flex-col items-center gap-4">
              {selectedTexts.length === 0 && (
                <div className="text-sm text-gray-500"></div>
              )}

              {selectedTexts.map((text, idx) => (
                <div key={idx} className="w-full flex justify-center items-center">
                  <DraggableResizableBox
                    minWidth={50}
                    minHeight={fontSize * 1.2}
                    lockAspectRatio={false}
                    borderWidth={2}
                    style={{
                      position: 'fixed',
                      top: '80px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 11000,
                    }}
                  >
                    <div
                      className="font-bold text-center uppercase"
                      style={{
                        fontSize: `${fontSize}px`,
                        color: textColor,
                        padding: '4px',
                        whiteSpace: 'normal',        // เปลี่ยนจาก 'nowrap' -> 'normal'
                        display: 'inline-block',
                        wordBreak: 'break-word',     // เพิ่มเพื่อให้ตัดบรรทัด
                        overflowWrap: 'break-word',  // เพิ่มเพื่อให้ตัดบรรทัด
                        animation: isRunning
                          ? 'marquee 5s linear infinite'
                          : 'none',
                      }}
                    >
                      {text}
                    </div>
                  </DraggableResizableBox>
                </div>
              ))}

              {/* ใส่ CSS สำหรับ marquee */}
              {uploadedImage && (
                <DraggableResizableBox
                  defaultWidth={500}
                  defaultHeight={300}
                  minWidth={100}
                  minHeight={100}
                  lockAspectRatio={false}
                  style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
                >
                  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    {/* ใช้ <img> แทน <Image> สำหรับ base64 / dynamic URL */}
                    {uploadedImage && (
                      <Image
                        src={uploadedImage.replace(/^"|"$/g, '')}
                        alt="Uploaded preview"
                        width={500}
                        height={300}
                        style={{ objectFit: 'contain' }}
                      />
                    )}
                  </div>
                </DraggableResizableBox>
              )}
            </div>

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
      </div>
    </div>
  );
}

export default DashboardPage;

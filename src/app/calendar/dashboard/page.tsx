'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Job } from '../components/types';
import { PaintBrushIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

function DashboardPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(80);
  const [textColor, setTextColor] = useState<string>('black');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>('white');

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

  const toggleBackground = () => {
    if (bgColor === 'white') {
      setBgColor('#000000ff'); // Dark
      setTextColor('white');
    } else {
      setBgColor('white'); // Light
      setTextColor('black');
    }
  };

  return (
    <div
      className="min-h-screen p-6 font-sans transition-all"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Control Panel */}
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <button
          onClick={() => setFontSize(prev => Math.max(10, prev - 5))}
          className="px-4 py-2 text-2xl font-bold border rounded-lg hover:bg-gray-200"
        >
          -
        </button>

        <div className="flex flex-wrap justify-center items-center gap-4 flex-1">
          <button
            onClick={() => setIsRunning(prev => !prev)}
            className={`px-4 py-2 border rounded-lg flex items-center gap-2 ${isRunning ? 'bg-green-500 text-white' : 'hover:bg-gray-200'}`}
          >
            🏃 ตัววิ่ง
          </button>

          <div className="flex items-center gap-2">
            <PaintBrushIcon className="h-5 w-5" />
            <select
              value={textColor}
              onChange={e => setTextColor(e.target.value)}
              className="px-2 py-1 border rounded-lg"
              style={{
                backgroundColor: bgColor === 'white' ? '#fff' : '#000',
                color: bgColor === 'white' ? '#000' : '#fff',
              }}
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
            {/* Switch Icon Light/Dark */}
            <button
              onClick={toggleBackground}
              className={`relative inline-flex items-center w-14 h-8 rounded-full transition-colors duration-300
      ${bgColor === 'white' ? 'bg-gray-300' : 'bg-yellow-500'}
    `}
              aria-label="Toggle dark mode"
            >
              <span
                className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
        ${bgColor === 'white' ? 'translate-x-0' : 'translate-x-6'}
      `}
              />
              <span className="absolute left-2 top-1.5 text-gray-700">
                <MoonIcon className="h-5 w-5" />
              </span>
              <span className="absolute right-2 top-1.5 text-yellow-400">
                <SunIcon className="h-5 w-5" />
              </span>
            </button>
          </div>
        </div>

        <button
          onClick={() => setFontSize(prev => prev + 5)}
          className="px-4 py-2 text-2xl font-bold border rounded-lg hover:bg-gray-200"
        >
          +
        </button>
      </div>

      {/* Dropdown + Close Button */}
      <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
        <select
          onChange={handleSelect}
          defaultValue=""
          className="px-4 py-2 text-base border border-gray-300 rounded-lg w-fit max-w-[220px]"
          style={{
            backgroundColor: bgColor === 'white' ? '#fff' : '#000',
            color: bgColor === 'white' ? '#000' : '#fff',
          }}
        >
          <option value="" disabled>Select a passenger</option>
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
          className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100"
        >
          Close Tab
        </button>
      </div>

      {/* Display Selected Text */}
      {selectedText && (
        <div className="mt-8 px-4 w-full">
          <div
            className={`font-bold text-center uppercase break-words ${isRunning ? 'animate-marquee' : ''}`}
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

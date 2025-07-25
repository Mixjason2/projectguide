'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react'; // ✅ เพิ่ม useRef
import CalendarView from './components/CalendarView';
import ErrorMessage from './components/ErrorMessage';
import { Job } from './components/types';
import './calendar.css';
import CssgGuide from '../cssguide';
import { DatesSetArg } from '@fullcalendar/core/index.js';
import type { CalendarApi } from '@fullcalendar/core'; // เพิ่ม type CalendarApi

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// function getDateRanges(start: string, end: string, chunkMonths = 1): { start: string; end: string }[] {
//   const ranges = [];
//   let currentStart = new Date(start);
//   const endDate = new Date(end);

//   while (currentStart < endDate) {
//     const currentEnd = addMonths(currentStart, chunkMonths);
//     ranges.push({
//       start: formatISO(currentStart),
//       end: formatISO(currentEnd < endDate ? currentEnd : endDate),
//     });
//     currentStart = currentEnd;
//   }

//   return ranges;
// }

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // state เก็บวันที่ไม่ลบเลย แต่จะไม่ใช้ fetch ตาม state นี้โดยตรง
  const [dataStartDate] = useState(() => {
    const today = new Date();
    return formatISO(today);
  });

  const [dataEndDate] = useState(() => {
    const d = addMonths(new Date(), 2);
    return formatISO(d);
  });

  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [currentCenterDate, setCurrentCenterDate] = useState<Date | null>(null);

  const [, setFetchedRanges] = useState<{ start: string; end: string }[]>([]);

  // const hasFetchedRange = useCallback((start: string, end: string): boolean => {
  //   return fetchedRanges.some(
  //     (range) => start >= range.start && end <= range.end
  //   );
  // }, [fetchedRanges]);

  const addFetchedRange = useCallback((start: string, end: string) => {
    setFetchedRanges(prev => [...prev, { start, end }]);
  }, []);

  // ✅ เพิ่ม useRef สำหรับ AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  // ✅ เพิ่ม calendarApiRef เพื่อเรียก refetchEvents ได้
  const calendarApiRef = useRef<CalendarApi | null>(null);

  const fetchJobs = useCallback((start: string, end: string, isInitial = false) => {
    abortControllerRef.current?.abort();

    const token = localStorage.getItem('token') || '';
    if (!token) {
      setError('Token not found. Please log in.');
      setLoadingInitial(false);
      setLoadingMore(false);
      setJobs([]); // ล้าง
      return Promise.resolve();
    }

    if (isInitial) {
      setLoadingInitial(true);
      setJobs([]); // ✅ ล้าง jobs รอบแรก
      setFetchedRanges([]); // ✅ ล้าง range cache
    } else {
      setLoadingMore(true);
    }

    setError(null);
    console.time('⏱️ fetchJobs');

    const controller = new AbortController();
    abortControllerRef.current = controller;

    return fetch('https://operation.dth.travel:7082/api/guide/job/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, startdate: start, enddate: end }),
      signal: controller.signal,
    })
      .then(async res => {
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
          throw new Error(await res.text());
        }
        return res.json();
      })
      .then((data: Job[]) => {
        console.timeEnd('⏱️ fetchJobs');

        // เอาตัวกรอง IsConfirmed ออก
        // const confirmedOnly = data.filter(j => j.IsConfirmed); // ❌ ลบออก

        setJobs(prev => {
          const combined = [...prev];
          // ใช้ data ตรงๆ ไม่กรอง
          data.forEach(newJob => {
            if (!combined.find(j => j.key === newJob.key)) {
              combined.push(newJob);
            }
          });
          // ✅ บังคับ refresh FullCalendar
          setTimeout(() => {
            calendarApiRef.current?.refetchEvents?.();
          }, 0);

          return combined;
        });
        addFetchedRange(start, end);
        setError(null);
      })

      .catch(err => {
        console.timeEnd('⏱️ fetchJobs');
        if (err.name === 'AbortError') {
          console.log('🛑 Fetch aborted');
          return;
        }
        setError(err.message || 'Failed to fetch');
      })
      .finally(() => {
        if (isInitial) {
          setLoadingInitial(false);
        } else {
          setLoadingMore(false);
        }
      });
  }, [addFetchedRange]);

  const isFetchingRef = useRef(false);

  const fetchJobsChunked = useCallback(
    async (start: string, end: string, isInitial = false) => {
      if (isFetchingRef.current) {
        console.log("⛔ Already fetching, skip...");
        return;
      }
      isFetchingRef.current = true;

      // จำกัดช่วง fetch ไม่เกิน 1 เดือนต่อครั้ง ถ้าเกิน 1 เดือน ให้แบ่งเป็นช่วงละเดือน
      const startDate = new Date(start);
      const endDate = new Date(end);

      const ranges: { start: string; end: string }[] = [];
      let chunkStart = new Date(startDate);
      while (chunkStart < endDate) {
        let chunkEnd = addMonths(chunkStart, 1);
        if (chunkEnd > endDate) chunkEnd = endDate;
        ranges.push({
          start: formatISO(chunkStart),
          end: formatISO(chunkEnd),
        });
        chunkStart = chunkEnd;
      }

      try {
        // fetch ข้อมูลแต่ละเดือนพร้อมกัน
        await Promise.all(
          ranges.map(range =>
            fetchJobs(range.start, range.end, isInitial)
          )
        );
      } finally {
        isFetchingRef.current = false;
      }
    },
    [fetchJobs]
  );

  // ✅ เพิ่ม ref เก็บวันที่โหลดแล้วแทน state สำหรับ fetch
  const loadedStartRef = useRef(dataStartDate);
  const loadedEndRef = useRef(dataEndDate);

  // ❌ ลบ useEffect เดิมที่ fetch ตาม dataStartDate, dataEndDate ทิ้ง
  // useEffect(() => {
  //   fetchJobsChunked(dataStartDate, dataEndDate, true);
  // }, [dataStartDate, dataEndDate, fetchJobsChunked]);

  // ✅ เพิ่ม useEffect แค่รอบแรก load เท่านั้น
  useEffect(() => {
    const today = new Date();
    const future = addMonths(today, 0);
    const start = formatISO(today);
    const end = formatISO(future);

    fetchJobsChunked(start, end, true);

    loadedStartRef.current = start;
    loadedEndRef.current = end;
  }, [fetchJobsChunked]);

    // ฟังก์ชันจัดการวันที่ที่ปฏิทินเปลี่ยน
const handleDatesSet = (arg: DatesSetArg) => {
  if (isFetchingRef.current) return;

  if (arg.view.type !== currentView) {
    setCurrentView(arg.view.type);
  }

  if (
    !currentCenterDate ||
    arg.view.currentStart.getTime() !== currentCenterDate.getTime()
  ) {
    setCurrentCenterDate(arg.view.currentStart);
  }

  const viewStart = formatISO(arg.start);
  const viewEnd = formatISO(arg.end);

  const loadMoreData = async () => {
    if (viewEnd > loadedEndRef.current) {
      const newEnd = formatISO(addMonths(new Date(loadedEndRef.current), 1));
      await fetchJobsChunked(loadedEndRef.current, newEnd);
      loadedEndRef.current = newEnd;
    }

    if (viewStart < loadedStartRef.current) {
      const newStart = formatISO(addMonths(new Date(loadedStartRef.current), -1));
      await fetchJobsChunked(newStart, loadedStartRef.current);
      loadedStartRef.current = newStart;
    }
  };

  loadMoreData();
};


  if (error && jobs.length === 0) return <ErrorMessage error={error} />;

  return (
    <CssgGuide>
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto p-4 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">Calendar</h1>
          <CalendarView
            jobs={jobs}
            gotoDate={currentCenterDate}
            currentViewProp={currentView}
            onDatesSet={handleDatesSet}
            loading={loadingMore}
            calendarApiRef={calendarApiRef} // ✅ ส่ง ref ไป
          />

          {loadingMore && (
            <div
              className="flex items-center justify-center bg-white bg-opacity-80 rounded-lg shadow-md p-4"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999,
                pointerEvents: 'none',
              }}
            >
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-green-500" />
              <span className="ml-2 text-black-600 text-sm">Loading more data...</span>
            </div>
          )}

          {/* แสดง error เฉพาะตอน loadingMore = false */}
          {!loadingMore && error && <p className="text-red-600">{error}</p>}
        </div>
      </div>
    </CssgGuide>
  );
}

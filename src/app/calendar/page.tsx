'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react'; // ✅ เพิ่ม useRef
import CalendarView from './components/CalendarView';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import { Job } from './components/types';
import './calendar.css';
import CssgGuide from '../cssguide';
import { DatesSetArg } from '@fullcalendar/core/index.js';

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getDateRanges(start: string, end: string, chunkMonths = 3): { start: string; end: string }[] {
  const ranges = [];
  let currentStart = new Date(start);
  const endDate = new Date(end);

  while (currentStart < endDate) {
    const currentEnd = addMonths(currentStart, chunkMonths);
    ranges.push({
      start: formatISO(currentStart),
      end: formatISO(currentEnd < endDate ? currentEnd : endDate),
    });
    currentStart = currentEnd;
  }

  return ranges;
}

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dataStartDate, setDataStartDate] = useState(() => {
    const today = new Date();
    return formatISO(today);
  });

  const [dataEndDate, setDataEndDate] = useState(() => {
    const d = addMonths(new Date(), 2);
    return formatISO(d);
  });

  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [currentCenterDate, setCurrentCenterDate] = useState<Date | null>(null);

  const [fetchedRanges, setFetchedRanges] = useState<{ start: string; end: string }[]>([]);

  const hasFetchedRange = useCallback((start: string, end: string): boolean => {
    return fetchedRanges.some(
      (range) => start >= range.start && end <= range.end
    );
  }, [fetchedRanges]);

  const addFetchedRange = useCallback((start: string, end: string) => {
    setFetchedRanges(prev => [...prev, { start, end }]);
  }, []);

  // ✅ เพิ่ม useRef สำหรับ AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchJobs = useCallback((start: string, end: string, isInitial = false) => {
    if (hasFetchedRange(start, end)) {
      console.log('✅ Already fetched:', start, 'to', end);
      return Promise.resolve();
    }

    // ยกเลิก fetch เก่าก่อน
    abortControllerRef.current?.abort();

    const token = localStorage.getItem('token') || '';
    if (!token) {
      setError('Token not found. Please log in.');
      setLoadingInitial(false);
      setLoadingMore(false);
      setJobs([]);
      return Promise.resolve();
    }

    if (isInitial) {
      setLoadingInitial(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    console.time('⏱️ fetchJobs');

    const controller = new AbortController();
    abortControllerRef.current = controller;

    return fetch('https://operation.dth.travel:7082/api/guide/job', {
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
        setJobs(prev => {
          const combined = [...prev];
          data.forEach(newJob => {
            if (!combined.find(j => j.key === newJob.key)) {
              combined.push(newJob);
            }
          });
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
  }, [hasFetchedRange, addFetchedRange]);

  const isFetchingRef = useRef(false);

  const fetchJobsChunked = useCallback(async (start: string, end: string, isInitial = false) => {
    if (isFetchingRef.current) {
      console.log("⛔ Already fetching, skip...");
      return;
    }
    isFetchingRef.current = true;
    const ranges = getDateRanges(start, end, 3);
    for (const range of ranges) {
      await fetchJobs(range.start, range.end, isInitial);
    }
    isFetchingRef.current = false;
  }, [fetchJobs]);

  useEffect(() => {
    fetchJobsChunked(dataStartDate, dataEndDate, true);
  }, [dataStartDate, dataEndDate, fetchJobsChunked]);

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

    if (viewEnd > dataEndDate) {
      const newEndDate = formatISO(addMonths(new Date(dataEndDate), 3));
      fetchJobsChunked(dataEndDate, newEndDate);
      setDataEndDate(newEndDate);
    }

    if (viewStart < dataStartDate) {
      const newStartDate = formatISO(addMonths(new Date(dataStartDate), -3));
      fetchJobsChunked(newStartDate, dataStartDate);
      setDataStartDate(newStartDate);
    }
  };

  if (loadingInitial && jobs.length === 0) return <Loading />;
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

          {error && <p className="text-red-600">{error}</p>}
        </div>
      </div>
    </CssgGuide>
  );
}

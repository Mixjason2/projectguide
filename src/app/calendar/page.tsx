'use client';

import React, { useState, useEffect } from 'react';

import CalendarView from './components/CalendarView';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import { Job } from './components/types';
import './calendar.css';
import CssgGuide from '../cssguide';
import { DatesSetArg } from '@fullcalendar/core';

function getMonthsAgoISO(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString().slice(0, 10);
}

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// ✅ แปลง ISO string เป็น timestamp (ms)
function toTimestamp(date: string) {
  return new Date(date).getTime();
}

// ✅ รวมงานใหม่แบบไม่ซ้ำ key
function mergeJobs(oldJobs: Job[], newJobs: Job[]): Job[] {
  const map = new Map<string, Job>();
  for (const job of [...oldJobs, ...newJobs]) {
    map.set(job.key, job);
  }
  return Array.from(map.values());
}

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState(getMonthsAgoISO(3));
  const [endDate, setEndDate] = useState(getTodayISO());

  const [fetchedRanges, setFetchedRanges] = useState<{ start: string, end: string }[]>([]);

  const fetchJobs = (start: string, end: string) => {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      setError('Token not found. Please log in.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    console.time('⏱️ fetchJobs');

    fetch('https://operation.dth.travel:7082/api/guide/job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, startdate: start, enddate: end }),
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
      .then(data => {
        console.timeEnd('⏱️ fetchJobs');
        setJobs(prev => mergeJobs(prev, data));
        setFilteredJobs(prev => mergeJobs(prev, data));
        localStorage.setItem('cachedJobs', JSON.stringify(mergeJobs(jobs, data)));
        setFetchedRanges(prev => [...prev, { start, end }]);
      })
      .catch(err => {
        console.timeEnd('⏱️ fetchJobs');
        setError(err.message || 'Failed to fetch');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const cached = localStorage.getItem('cachedJobs');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setJobs(parsed);
        setFilteredJobs(parsed);
      } catch (e) {
        console.warn('⚠️ Failed to parse cached jobs', e);
      }
    }

    if (startDate && endDate) {
      fetchJobs(startDate, endDate);
    }
  }, [startDate, endDate]);

  // ✅ ฟังก์ชันเรียกเมื่อ user เปลี่ยนเดือน/ช่วงวันที่ใน calendar
  const handleDatesSet = (arg: DatesSetArg) => {
    const viewStart = arg.startStr.slice(0, 10);
    const viewEnd = arg.endStr.slice(0, 10);

    const alreadyFetched = fetchedRanges.some(r =>
      toTimestamp(viewStart) >= toTimestamp(r.start) &&
      toTimestamp(viewEnd) <= toTimestamp(r.end)
    );

    if (!alreadyFetched) {
      console.log('📆 Fetching extra range:', viewStart, 'to', viewEnd);
      fetchJobs(viewStart, viewEnd);
    } else {
      console.log('✅ Already fetched:', viewStart, 'to', viewEnd);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <CssgGuide>
      <div className="max-w-4xl mx-auto p-4 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Calendar</h1>
        <CalendarView jobs={filteredJobs} onDatesSet={handleDatesSet} />
      </div>
    </CssgGuide>
  );
}

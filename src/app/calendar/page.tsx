'use client';

import React, { useState, useEffect } from 'react';
import CalendarView from './components/CalendarView';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import { Job } from './components/types';
import './calendar.css';
import CssgGuide from '../cssguide';

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dataStartDate, setDataStartDate] = useState(() => {
    const d = addMonths(new Date(), -2);
    return formatISO(d);
  });

  const [dataEndDate, setDataEndDate] = useState(() => {
    const d = addMonths(new Date(), 2);
    return formatISO(d);
  });

  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [currentCenterDate, setCurrentCenterDate] = useState<Date | null>(null);

  const fetchJobs = (start: string, end: string) => {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      setError('Token not found. Please log in.');
      setLoading(false);
      setJobs([]);
      return;
    }

    setLoading(true);
    setError(null);
    console.time('⏱️ fetchJobs');

    return fetch('https://operation.dth.travel:7082/api/guide/job', {
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
        setError(null);
      })
      .catch(err => {
        console.timeEnd('⏱️ fetchJobs');
        setError(err.message || 'Failed to fetch');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs(dataStartDate, dataEndDate);
  }, []);

  const handleDatesSet = (arg: any) => {
    // เช็คก่อน setCurrentView ว่าต่างจากเดิมไหม
    if (arg.view.type !== currentView) {
      setCurrentView(arg.view.type);
    }

    // เช็คก่อน setCurrentCenterDate ว่าต่างจากเดิมไหม (เทียบด้วยเวลา)
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
      setDataEndDate(newEndDate);
      fetchJobs(dataEndDate, newEndDate);
    }

    if (viewStart < dataStartDate) {
      const newStartDate = formatISO(addMonths(new Date(dataStartDate), -3));
      setDataStartDate(newStartDate);
      fetchJobs(newStartDate, dataStartDate);
    }
  };

  if (loading && jobs.length === 0) return <Loading />;
  if (error && jobs.length === 0) return <ErrorMessage error={error} />;

  return (
    <CssgGuide>
      <div className="max-w-4xl mx-auto p-4 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Calendar</h1>
        <CalendarView
          jobs={jobs}
          gotoDate={currentCenterDate}
          currentViewProp={currentView}
          onDatesSet={handleDatesSet}
        />
        {loading && <p>Loading more data...</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </CssgGuide>
  );
}

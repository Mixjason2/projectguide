'use client';

import React, { useState, useEffect } from 'react';

import CalendarView from './components/CalendarView';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import { Job } from './components/types';
import './calendar.css';
import CssgGuide from '../cssguide';

// ฟังก์ชันช่วยคำนวณวันที่ 3 เดือนก่อน
function getThreeMonthsAgoISO(): string {
  const date = new Date();
  date.setMonth(date.getMonth() - 3);
  return date.toISOString().slice(0, 10);
}

// ฟังก์ชันช่วยคำนวณวันที่วันนี้ (ISO yyyy-MM-dd)
function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // เริ่มต้นเป็น 3 เดือนก่อนจนถึงวันนี้
  const [startDate, setStartDate] = useState(getThreeMonthsAgoISO());
  const [endDate, setEndDate] = useState(getTodayISO());

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

    fetch('https://operation.dth.travel:7082/api/guide/job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, startdate: start, enddate: end }),
    })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(data => setJobs(data))
      .catch(err => {
        setError(err.message || 'Failed to fetch');
        setJobs([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchJobs(startDate, endDate);
    }
  }, [startDate, endDate]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <CssgGuide>
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>

      <CalendarView
        jobs={jobs}
      />
    </div>
    </CssgGuide>
  );
}

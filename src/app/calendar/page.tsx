'use client';

import React, { useState, useEffect } from 'react';

import CalendarView from './components/CalendarView';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import { Job } from './components/types';
import './calendar.css';
import CssgGuide from '../cssguide';

// ✅ ฟังก์ชันคำนวณวันที่ย้อนหลังตามจำนวนเดือนที่กำหนด
function getMonthsAgoISO(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString().slice(0, 10);
}

// ฟังก์ชันคำนวณวันที่วันนี้ (ISO yyyy-MM-dd)
function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState(getMonthsAgoISO(3)); // ✅ ลดเหลือ 3 เดือน
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

    console.time('⏱️ fetchJobs');

    fetch('https://operation.dth.travel:7082/api/guide/job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, startdate: start, enddate: end }),
    })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(data => {
        console.timeEnd('⏱️ fetchJobs');
        setJobs(data);
        localStorage.setItem('cachedJobs', JSON.stringify(data)); // 🔄 cache
      })
      .catch(err => {
        console.timeEnd('⏱️ fetchJobs');
        setError(err.message || 'Failed to fetch');
        setJobs([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // ✅ โหลดจากแคชก่อน (แสดงเร็วขึ้น)
    const cached = localStorage.getItem('cachedJobs');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setJobs(parsed);
      } catch (e) {
        console.warn('⚠️ Failed to parse cached jobs', e);
      }
    }

    // ✅ ดึงข้อมูลล่าสุดจากเซิร์ฟเวอร์
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
        <CalendarView jobs={jobs} />
      </div>
    </CssgGuide>
  );
}

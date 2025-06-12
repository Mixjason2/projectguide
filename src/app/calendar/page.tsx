'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import CssgGuide from '../cssguide';
import './calendar.css';

interface Job {
  PickupDate: string; // สมมติฟิลด์นี้มีวันที่ pickup
  // ... ฟิลด์อื่นๆตาม API
}

export default function CalendarExcel() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    fetch('https://operation.dth.travel:7082/api/guide/job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: "AVM4UmVVMJuXWXzdOvGgaTqNm/Ysfkw0DnscAzbE+J4+Kr7AYjIs7Eu+7ZXBGs+MohOuqTTZkdIiJ5Iw8pQVJ0tWaz/R1sbE8ksM2sKYSTDKrKtQCYfZuq8IArzwBRQ3E1LIlS9Wb7X2G3mKkJ+8jCdb1fFy/76lXpHHWrI9tqt2/IXD20ZFYZ41PTB0tEsgp9VXZP8I5j+363SEnn5erg==",  // ใช้ token จาก localStorage
        startdate: "2025-01-01",
        enddate: "2025-05-31",
      }),
    })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data: Job[]) => {
        console.log("API jobs:", data);
        setJobs(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // สร้าง events สำหรับ FullCalendar จาก jobs
  const events = React.useMemo(() => {
    const countByDate: Record<string, number> = {};

    jobs.forEach(job => {
      if (job.PickupDate) {
        countByDate[job.PickupDate] = (countByDate[job.PickupDate] || 0) + 1;
      }
    });

    return Object.entries(countByDate).map(([date, count]) => ({
      title: `Jobs: ${count}`,
      date,
    }));
  }, [jobs]);

if (loading) return (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontSize: '1.2rem',
    color: '#555'
  }}>
    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
      <span style={dotStyle(0)}></span>
      <span style={dotStyle(1)}></span>
      <span style={dotStyle(2)}></span>
    </div>
    Loading jobs...
    <style>{`
      @keyframes bounce {
        0%, 80%, 100% {
          transform: scale(0);
        } 40% {
          transform: scale(1);
        }
      }
    `}</style>
  </div>
);

// ฟังก์ชันช่วยสร้างสไตล์แต่ละ dot พร้อมดีเลย์
function dotStyle(delayIndex: number) {
  return {
    width: '12px',
    height: '12px',
    backgroundColor: '#95c941', // สีเขียวสดใสเหมือนที่ขอ
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'bounce 1.4s infinite ease-in-out both',
    animationDelay: `${delayIndex * 0.2}s`,
  };
}

  if (error) return (
  <div className="max-w-md mx-auto my-5 p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg font-semibold text-center shadow-md">
    Error: {error}
  </div>
);


  return (

    <CssgGuide>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="100%"
            contentHeight="auto"
            aspectRatio={1.7}
            headerToolbar={{
              start: 'title', // title ชิดซ้าย
              center: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth', // ปุ่มมุมมองไว้กลาง
              end: 'today prev,next', // ปุ่ม today / เลื่อนเดือนไว้ขวา
            }}
            editable={false}
            selectable={true}
            expandRows={true}
          />
    </CssgGuide>
  );
}

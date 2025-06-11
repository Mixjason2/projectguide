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

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <CssgGuide>
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <div className="bg-base-100 rounded-xl shadow-xl border border-base-300 w-full max-w-screen-2xl h-[90vh] flex flex-col">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="100%"
            contentHeight="auto"
            aspectRatio={1.7}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            }}
            editable={false}
            selectable={true}
            expandRows={true}
          />
        </div>
      </div>
    </CssgGuide>
  );
}

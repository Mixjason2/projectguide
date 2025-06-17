'use client';

import React, { useState, useEffect, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { DatesSetArg } from '@fullcalendar/core';
import './calendar.css';

type Job = {
  isChange: boolean;
  key: number;
  PNR: string;
  PickupDate: string;
  Pickup: string;
  AdultQty: number;
  ChildQty: number;
  ChildShareQty: number;
  InfantQty: number;
};

function getTotalPax(job: Job): number {
  return job.AdultQty + job.ChildQty + job.ChildShareQty + job.InfantQty;
}

function getColor(job: Job): string {
  return job.isChange ? '#f97316' /* orange-500 */ : '#0891b2'; /* cyan-600 */
}

const CalendarExcel = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('dayGridMonth');

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    fetch('https://operation.dth.travel:7082/api/guide/job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, startdate: "2025-01-01", enddate: "2025-05-31" }),
    })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(setJobs)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const events = useMemo(() => {
    if (currentView === 'dayGridMonth') {
      // group by date
      const grouped: Record<string, Job[]> = {};
      jobs.forEach(job => {
        const date = job.PickupDate.split('T')[0];
        (grouped[date] ??= []).push(job);
      });

      return Object.entries(grouped).map(([date, jobsOnDate]) => {
        const firstJob = jobsOnDate[0];
        const color = getColor(firstJob);
        return {
          title: `job: ${jobsOnDate.length}`,
          start: date,
          allDay: true,
          backgroundColor: color,
          borderColor: color,
          textColor: 'white',
          extendedProps: {
            jobs: jobsOnDate,
            color,
          },
        };
      });
    } else {
      return jobs.map(job => {
        const color = getColor(job);
        return {
          id: job.key.toString(),
          title: job.PNR,
          start: job.PickupDate,
          backgroundColor: color,
          borderColor: color,
          textColor: 'white',
          extendedProps: {
            job,
            color,
          },
        };
      });
    }
  }, [jobs, currentView]);

  const handleEventClick = (info: any) => {
    if (currentView === 'dayGridMonth') {
      const jobsOnDate: Job[] = info.event.extendedProps.jobs || [];
      const date = info.event.startStr.split('T')[0];

      const detail = jobsOnDate.map((job, idx) => {
        const time = new Date(job.PickupDate).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit'
        });
        return `${idx + 1}. ⏰ ${time} 📍 ${job.Pickup} | 🎫 ${job.PNR}`;
      }).join('\n');

      alert(`📅 ${date}\n\n${detail}`);
    } else {
      const job: Job = info.event.extendedProps.job;
      const time = new Date(job.PickupDate).toLocaleString('en-GB', {
        dateStyle: 'short',
        timeStyle: 'short'
      });

      alert(`🎫 PNR: ${job.PNR}
📍 Pickup: ${job.Pickup}
🕒 Time: ${time}
👤 Pax: ${getTotalPax(job)}`);
    }
  };

  const renderEventContent = (arg: any) => {
    const color = arg.event.extendedProps.color || '#0891b2';
    return (
      <div className="fc-event-main flex items-center">
        <span className="fc-event-dot-custom" style={{ backgroundColor: color }} />
        <span>{arg.event.title}</span>
      </div>
    );
  };

  if (loading) return <p className="text-center py-20 text-lg text-gray-600">⏳ กำลังโหลดข้อมูล...</p>;
  if (error) return <p className="text-red-500 text-center mt-4">❌ {error}</p>;

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        datesSet={(arg: DatesSetArg) => setCurrentView(arg.view.type)}
        height="auto"
        headerToolbar={{
          start: 'title',
          center: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
          end: 'today prev,next',
        }}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
        }}
        dayHeaderFormat={{
          weekday: 'short',
          day: 'numeric',
        }}
      />
    </div>
  );
};

export default CalendarExcel;

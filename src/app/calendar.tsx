'use client';

import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
// import CssgGuide from '../cssguide'; // Removed because the module was not found or does not exist
import './calendar.css';
import { DatesSetArg } from '@fullcalendar/core/index.js';

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
  pax_name: ReactNode;
  Booking_Name: ReactNode;
  serviceProductName: ReactNode;
};

function getTotalPax(job: Job): number {
  return job.AdultQty + job.ChildQty + job.ChildShareQty + job.InfantQty;
}

const getToday = () => new Date().toISOString().slice(0, 10);
const getEndOfMonth = () =>
  new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).toISOString().slice(0, 10);

const Loading = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1.2rem', color: '#555' }}>
    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 12,
          height: 12,
          backgroundColor: '#95c941',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'bounce 1.4s infinite ease-in-out both',
          animationDelay: `${i * 0.2}s`,
        }}></span>
      ))}
    </div>
    Loading jobs...
    <style>{`
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
    `}</style>
  </div>
);

const ErrorMessage = ({ error }: { error: string }) => (
  <div className="max-w-md mx-auto my-5 p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg font-semibold text-center shadow-md">
    Error: {error}
  </div>
);

export default function CalendarExcel() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string>('dayGridMonth');
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getEndOfMonth());

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    if (!token) {
      setError("Token not found. Please log in.");
      setLoading(false);
      setJobs([]);
      return;
    }
    setLoading(true);
    setError(null);

    fetch('https://operation.dth.travel:7082/api/guide/job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, startdate: startDate, enddate: endDate }),
    })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(data => {
        setJobs(data);
      })
      .catch(err => {
        setError(err.message || "Failed to fetch");
        setJobs([]);
      })
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

  const events = useMemo(() => {
    if (currentView === 'dayGridMonth') {
      const grouped: Record<string, Job[]> = {};
      jobs.forEach(job => {
        if (!job.PickupDate) return;
        const date = job.PickupDate.split('T')[0];
        (grouped[date] ??= []).push(job);
      });

      return Object.entries(grouped).map(([date, jobsOnDate]) => ({
        title: `(${jobsOnDate.length}) งาน`,
        start: date,
        allDay: true,
        backgroundColor: '#95c941',
        borderColor: '#0369a1',
        textColor: 'white',
        extendedProps: {
          jobs: jobsOnDate,
          isChanged: jobsOnDate.some(j => j.isChange),
        },
      }));
    } else {
      return jobs.map(job => ({
        id: job.key.toString(),
        title: `${job.serviceProductName}`,
        start: job.PickupDate,
        backgroundColor: job.isChange ? '#fb923c' : '#95c941',
        borderColor: '#0369a1',
        textColor: 'white',
        extendedProps: {
          job,
        },
      }));
    }
  }, [jobs, currentView]);

  const handleEventClick = (info: any) => {
    if (currentView === 'dayGridMonth') {
      const jobsOnDate: Job[] = info.event.extendedProps.jobs || [];
      const clickedDate = info.event.startStr.split('T')[0];
      const details = jobsOnDate.map((job, i) => {
        const pickupTime = new Date(job.PickupDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        const totalPax = getTotalPax(job);
        return `${i + 1}. 🕒 ${pickupTime} 📍 ${job.Pickup} | 👤 ${totalPax} Pax | 🎫 PNR: ${job.PNR}`;
      }).join('\n');
      alert(`📅 Date: ${clickedDate}\n📌 Jobs:\n${details}`);
    } else {
      const job: Job = info.event.extendedProps.job;
      const pickupTime = new Date(job.PickupDate).toLocaleString('en-GB', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
      const totalPax = getTotalPax(job);
      alert(`🎫 PNR: ${job.PNR}
🕒 Pickup: ${pickupTime}
📍 Location: ${job.Pickup}
👤 Pax: ${totalPax} (Adult: ${job.AdultQty}, Child: ${job.ChildQty}, Share: ${job.ChildShareQty}, Infant: ${job.InfantQty})
👤 Name: ${job.pax_name}`);
    }
  };

  const renderEventContent = (arg: any) => {
    const job = arg.event.extendedProps?.job;
    const isChanged = arg.event.extendedProps?.isChanged;
    return (
      <div
        className="fc-event-main flex items-center"
        style={{
          backgroundColor: '#95c941',
          color: 'white',
          borderColor: '#0369a1',
          borderRadius: '4px',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            backgroundColor: isChanged ? '#fb923c' : (job?.isChange ? '#fb923c' : '#0891b2'),
            width: 10,
            height: 10,
            borderRadius: '50%',
            display: 'inline-block',
            marginRight: 8,
            borderWidth: 1,
          }}
        />
        <span>{arg.event.title}</span>
      </div>
    );
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Calendar</h1>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm">Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="input input-bordered"
            />
          </div>
          <div>
            <label className="block text-sm">End date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="input input-bordered"
            />
          </div>
        </div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          datesSet={(arg: DatesSetArg) => setCurrentView(arg.view.type)}
          height="auto"
          contentHeight="auto"
          aspectRatio={1.7}
          headerToolbar={{
            start: 'title',
            center: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
            end: 'today prev,next',
          }}
          editable={false}
          selectable={true}
          expandRows={true}
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
          views={{
            timeGridWeek: {
              slotLabelFormat: {
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false,
              },
              dayHeaderFormat: {
                weekday: 'short',
                day: 'numeric',
              },
            },
          }}
        />
      </div>
  );
}
'use client';

import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { DatesSetArg } from '@fullcalendar/core';
import JobFilter from '@/app/component/JobFilter';

import { Job, getTotalPax } from './types';

type CalendarViewProps = {
  jobs: Job[];
};

const CalendarView: React.FC<CalendarViewProps> = ({ jobs }) => {
  const [currentView, setCurrentView] = useState<string>('dayGridMonth');

  const events = useMemo(() => {
    const confirmedJobs = jobs.filter(job => job.IsConfirmed);

    if (currentView === 'dayGridMonth') {
      const grouped: Record<string, Job[]> = {};
      confirmedJobs.forEach(job => {
        if (!job.PickupDate) return;
        const date = job.PickupDate.split('T')[0];
        (grouped[date] ??= []).push(job);
      });

      return Object.entries(grouped).map(([date, jobsOnDate]) => ({
        title: `(${jobsOnDate.length}) job`,
        start: date,
        allDay: true,
        backgroundColor: '#95c941',
        borderColor: '#0369a1',
        textColor: 'white',
        extendedProps: {
          jobs: jobsOnDate,
        },
      }));
    } else {
      return confirmedJobs.map(job => ({
        id: job.key.toString(),
        title: `${job.serviceProductName}`,
        start: job.PickupDate,
        backgroundColor: '#95c941',
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
      const details = jobsOnDate
        .map((job, i) => {
          const pickupTime = new Date(job.PickupDate).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          });
          const totalPax = getTotalPax(job);
          return `${i + 1}. 🕒 ${pickupTime} 📍 ${job.Pickup} | 👤 ${totalPax} Pax | 🎫 PNR: ${job.PNR}`;
        })
        .join('\n');
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
    const job = arg.event?.extendedProps?.job;
    const jobs: Job[] = arg.event?.extendedProps?.jobs;

    type Status = { color: string; label: string };
    const statusDots: Status[] = [];

    if (jobs && Array.isArray(jobs)) {
      const hasNew = jobs.some(j => j.isNew);
      const hasChange = jobs.some(j => j.isChange);
      if (hasNew) statusDots.push({ color: '#0891b2', label: 'New' });
      if (hasChange) statusDots.push({ color: '#fb923c', label: 'Changed' });
      if (!hasNew && !hasChange) statusDots.push({ color: '#404040', label: 'Normal' });
    }

    if (job) {
      if (job.isNew) statusDots.push({ color: '#0891b2', label: 'New' });
      if (job.isChange) statusDots.push({ color: '#fb923c', label: 'Changed' });
      if (!job.isNew && !job.isChange) statusDots.push({ color: '#404040', label: 'Normal' });
    }

    return (
   <div
  className="fc-event-main"
  style={{
    backgroundColor: '#95c941',
    color: 'white',
    borderColor: '#0369a1',
    borderRadius: 4,
    padding: '2px 4px', // ✅ เพิ่ม padding ด้านในเล็กน้อย
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '100%',
    fontSize: '0.5rem', // ✅ ขยายขนาดตัวอักษรนิดหน่อย
    lineHeight: 1.4, // ✅ เพิ่มความสูงบรรทัด
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minWidth: 0,
    minHeight: 24, // ✅ เพิ่มความสูงขั้นต่ำให้กรอบใหญ่ขึ้น
  }}
>
      <div
        style={{
          display: 'flex',
          flexShrink: 0,
          marginRight: 2, // ✅ ชิดซ้ายสุด แต่เว้นนิดให้ตัวหนังสือไม่ชนวงกลม
        }}
      >
        {statusDots.map(({ color, label }, index) => (
          <span
            key={index}
            title={label}
            style={{
              backgroundColor: color,
              width: 8,
              height: 8,
              borderRadius: '50%',
              border: '1px solid white',
              flexShrink: 0,
              display: 'inline-block',
              marginRight: index < statusDots.length - 1 ? 1 : 0, // ✅ วงกลมติด ๆ กัน
            }}
          />
        ))}
      </div>
      <span
        style={{
          flexShrink: 1,
          minWidth: 0,
        }}
      >
        {arg.event.title}
      </span>
    </div>
    );
  };

  return (
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
  );
};

export default CalendarView;

'use client';

import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { DatesSetArg } from '@fullcalendar/core';

import { Job, getTotalPax } from './types';

type CalendarViewProps = {
  jobs: Job[];
};

const CalendarView: React.FC<CalendarViewProps> = ({ jobs }) => {
  const [currentView, setCurrentView] = useState<string>('dayGridMonth');

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
    const job = arg.event.extendedProps?.job;
    const isChanged = arg.event.extendedProps?.isChanged;
    return (
      <div
        className="fc-event-main flex items-center"
        style={{
          backgroundColor: '#95c941',
          color: 'white',
          borderColor: '#0369a1',
          borderRadius: 4,
          padding: '2px 6px',
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          width: '100%',
          fontSize: '0.75rem',
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        <span
          style={{
            backgroundColor: isChanged ? '#fb923c' : job?.isChange ? '#fb923c' : '#0891b2',
            width: 8,
            height: 8,
            borderRadius: '50%',
            display: 'inline-block',
            marginRight: 6,
            borderWidth: 1,
            borderStyle: 'solid',
            boxSizing: 'border-box',
            flexShrink: 0,
          }}
        />
        <span>{arg.event.title}</span>
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
        weekday: 'short', // แสดงชื่อวันแบบสั้น (Sun, Mon, Tue, ...)
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
            day: 'numeric', // แสดงชื่อวันและเลขวันที่ในโหมด week
          },
        },
      }}
    />
  );
};

export default CalendarView;

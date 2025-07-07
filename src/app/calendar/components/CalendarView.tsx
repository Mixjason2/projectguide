'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react'; // ✅ เพิ่ม useState
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { DatesSetArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import { Job, getTotalPax } from './types';

type CalendarViewProps = {
  jobs: Job[];
  onDatesSet?: (arg: DatesSetArg) => void;
  gotoDate?: Date | null;
  currentViewProp?: string;
};

function getStatusDots(input: Job | Job[] | 'all'): { color: string; label: string }[] {
  if (input === 'all') return [{ color: '#404040', label: 'All Jobs' }];
  const jobs = Array.isArray(input) ? input : [input];
  const hasNew = jobs.some(j => j.isNew);
  const hasChange = jobs.some(j => j.isChange);
  if (hasNew || hasChange) {
    return [
      ...(hasNew ? [{ color: '#0891b2', label: 'New' }] : []),
      ...(hasChange ? [{ color: '#fb923c', label: 'Changed' }] : []),
    ];
  }
  return [{ color: '#404040', label: 'Normal' }];
}

function generateICS(jobs: Job[]): string {
  const pad = (n: number) => String(n).padStart(2, '0');

  const formatDateTime = (date: Date) => {
    return (
      date.getFullYear() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      pad(date.getSeconds())
    );
  };

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'PRODID:-//Test Calendar//EN',
  ].join('\r\n') + '\r\n';

  for (const job of jobs) {
    const start = new Date(job.PickupDate);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    ics += [
      'BEGIN:VEVENT',
      `UID:${job.key}@example.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;TZID=Asia/Bangkok:${formatDateTime(start)}`,
      `DTEND;TZID=Asia/Bangkok:${formatDateTime(end)}`,
      `SUMMARY:${job.serviceProductName}`,
      `DESCRIPTION:${job.PNR ? `PNR: ${job.PNR}, ` : ''}Pickup: ${job.Pickup}`,
      `LOCATION:${job.Pickup}`,
      'END:VEVENT',
    ].join('\r\n') + '\r\n';
  }

  ics += 'END:VCALENDAR\r\n';

  return ics;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  jobs,
  onDatesSet,
  gotoDate,
  currentViewProp = 'dayGridMonth',
}) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [icsFilename, setIcsFilename] = useState('dth-calendar.ics'); // ✅ เพิ่ม state

  const handleDownloadICS = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    const viewStart = calendarApi.view.currentStart;
    const viewEnd = calendarApi.view.currentEnd;

    const confirmedJobs = jobs.filter((job: Job) => {
      const pickupDate = new Date(job.PickupDate);
      return job.IsConfirmed && pickupDate >= viewStart && pickupDate < viewEnd;
    });

    const icsContent = generateICS(confirmedJobs);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = icsFilename; // ✅ ใช้ filename จาก state
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const calendarEl = calendarRef.current;
      if (calendarEl) {
        const calendarApi = calendarEl.getApi();
        if (calendarApi.view.type !== currentViewProp) {
          calendarApi.changeView(currentViewProp);
        }
        if (gotoDate) {
          calendarApi.gotoDate(gotoDate);
        }
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [currentViewProp, gotoDate]);

  const events = useMemo(() => {
    const confirmedJobs = jobs.filter(job => job.IsConfirmed);
    if (currentViewProp === 'dayGridMonth') {
      const grouped: Record<string, Job[]> = {};
      jobs.forEach(job => {
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
          type: 'confirmed',
        },
      }));
    }

    return confirmedJobs.map(job => ({
      id: `job-${job.key}`,
      title: `${job.serviceProductName}`,
      start: job.PickupDate,
      backgroundColor: '#95c941',
      borderColor: '#0369a1',
      textColor: 'white',
      extendedProps: { job },
    }));
  }, [jobs, currentViewProp]);

const handleEventClick = (info: EventClickArg) => {
  if (currentViewProp === 'dayGridMonth') {
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

  const generateSingleICS = (job: Job): string => {
    const pad = (n: number) => String(n).padStart(2, '0');

    const formatDateTime = (date: Date) => {
      return (
        date.getFullYear() +
        pad(date.getMonth() + 1) +
        pad(date.getDate()) +
        'T' +
        pad(date.getHours()) +
        pad(date.getMinutes()) +
        pad(date.getSeconds())
      );
    };

    const start = new Date(job.PickupDate);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'CALSCALE:GREGORIAN',
      'PRODID:-//Test Calendar//EN',
      'BEGIN:VTIMEZONE',
      'TZID:Asia/Bangkok',
      'X-LIC-LOCATION:Asia/Bangkok',
      'BEGIN:STANDARD',
      'TZOFFSETFROM:+0700',
      'TZOFFSETTO:+0700',
      'TZNAME:ICT',
      'DTSTART:19700101T000000',
      'END:STANDARD',
      'END:VTIMEZONE',
      'BEGIN:VEVENT',
      `UID:${job.key}@example.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;TZID=Asia/Bangkok:${formatDateTime(start)}`,
      `DTEND;TZID=Asia/Bangkok:${formatDateTime(end)}`,
      `SUMMARY:${job.serviceProductName}`,
      `DESCRIPTION:${job.PNR ? `PNR: ${job.PNR}, ` : ''}Pickup: ${job.Pickup}`,
      `LOCATION:${job.Pickup}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n') + '\r\n';

    return ics;
  };

  const handleDownloadSingleICS = (job: Job) => {
    const icsContent = generateSingleICS(job);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = job.PickupDate.split('T')[0];
    link.download = `${job.PNR ?? job.key}-${dateStr}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

const renderEventContent = (arg: EventContentArg) => {
  const job = arg.event.extendedProps?.job;
  const jobs: Job[] = arg.event.extendedProps?.jobs;
  const statusDots = getStatusDots(job ?? jobs ?? []);

    return (
      <div
        className="fc-event-main"
        style={{
          backgroundColor: '#95c941',
          color: 'white',
          border: '1px solid #0369a1',
          borderRadius: 6,
          padding: '4px 6px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          fontSize: '0.65rem',
          lineHeight: 1.5,
          overflow: 'hidden',
          gap: 6,
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 4,
            alignItems: 'center',
            flexShrink: 1,
            minWidth: 0,
          }}
        >
          {statusDots.map(({ color, label }, index) => (
            <span
              key={index}
              title={label}
              style={{
                backgroundColor: color,
                width: 10,
                height: 10,
                borderRadius: '50%',
                border: '1px solid white',
                flexShrink: 0,
              }}
            />
          ))}
          <span style={{ flexShrink: 1, minWidth: 0 }}>{arg.event.title}</span>
        </div>
        {job && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadSingleICS(job);
            }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              border: 'none',
              borderRadius: 5,
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.90rem',
              padding: '4px 6px',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease',
            }}
            title="Download ICS for this event"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)')}
          >
            📥
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="mb-2">
        <button
          onClick={handleDownloadICS}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          📥 Download ({icsFilename})
        </button>
      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[listPlugin, interactionPlugin]}
        initialView="listMonth"
        events={events}
        datesSet={(arg: DatesSetArg) => {
          const year = arg.start.getFullYear();
          const month = String(arg.start.getMonth() + 1).padStart(2, '0');
          setIcsFilename(`dth-calendar-${year}-${month}`);
          onDatesSet?.(arg);
        }}
        height="auto"
        contentHeight="auto"
        aspectRatio={1.7}
        headerToolbar={{
          start: 'title',
          center: '',
          end: 'today prev,next',
        }}
        editable={false}
        selectable={true}
        expandRows={true}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        slotLabelFormat={{ hour: '2-digit', minute: '2-digit', meridiem: false }}
        dayHeaderFormat={{ weekday: 'short' }}
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
    </>
  );
};

export default CalendarView;

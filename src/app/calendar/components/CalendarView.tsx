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

function getStatusDots(input: Job | Job[] | "all"): { color: string; label: string }[] {
  if (input === "all") {
    return [{ color: '#404040', label: 'All Jobs' }];
  }

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

const CalendarView: React.FC<CalendarViewProps> = ({ jobs }) => {
  const [currentView, setCurrentView] = useState<string>('dayGridMonth');

  const events = useMemo(() => {
    const confirmedJobs = jobs.filter(job => job.IsConfirmed);

    if (currentView === 'dayGridMonth') {
      const allJobsGrouped: Record<string, Job[]> = {};
      const groupedConfirmed: Record<string, Job[]> = {};

      jobs.forEach(job => {
        if (!job.PickupDate) return;
        const date = job.PickupDate.split('T')[0];
        (allJobsGrouped[date] ??= []).push(job);
        if (job.IsConfirmed) (groupedConfirmed[date] ??= []).push(job);
      });

      const allDates = Array.from(new Set([
        ...Object.keys(allJobsGrouped),
        ...Object.keys(groupedConfirmed),
      ]));

      return allDates.flatMap(date => {
        const confirmed = groupedConfirmed[date] || [];
        const all = allJobsGrouped[date] || [];

        const result = [];

        if (confirmed.length > 0) {
          result.push({
            title: `(${confirmed.length}) job`,
            start: date,
            allDay: true,
            backgroundColor: '#95c941',
            borderColor: '#0369a1',
            textColor: 'white',
            extendedProps: {
              jobs: confirmed,
              type: 'confirmed',
            },
          });
        }

        result.push({
          title: `All (${all.length})`,
          start: date,
          allDay: true,
          backgroundColor: '#404040',
          borderColor: '#0369a1',
          textColor: 'white',
          extendedProps: {
            jobs: all,
            type: 'viewAll',
          },
        });

        return result;
      });
    } else {
      return confirmedJobs.map(job => ({
        id: `job-${job.key}`,
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
    const type = arg.event.extendedProps?.type;
    const job = arg.event.extendedProps?.job;
    const jobs: Job[] = arg.event.extendedProps?.jobs;

    const statusDots = getStatusDots(
      type === 'viewAll' ? 'all' : job ?? jobs ?? []
    );

    const backgroundColor = type === 'viewAll' ? '#404040' : '#95c941';

    return (
      <div
        className="fc-event-main"
        style={{
          backgroundColor,
          color: 'white',
          borderColor: '#0369a1',
          borderRadius: 4,
          padding: '2px 0px',
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          width: '100%',
          fontSize: '0.52rem',
          lineHeight: 1.4,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minWidth: 0,
          minHeight: 24,
          gap: 2,
        }}
      >
        <div style={{ display: 'flex', flexShrink: 0, gap: 1 }}>
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
              }}
            />
          ))}
        </div>
        <span style={{ flexShrink: 1, minWidth: 0 }}>{arg.event.title}</span>
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

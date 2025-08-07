'use client';

import React, {
  useMemo, useRef, useEffect, useState, useCallback
} from 'react';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { DatesSetArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import { Job, getTotalPax } from './types';
import type { CalendarApi } from '@fullcalendar/core';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/navigation';

import CalendarEventContent from './CalendarEventContent';
import { generateICS, generateSingleICS } from './icsGenerator';
import { getStatusDots } from './calendarUtils';

dayjs.extend(utc);

type JobWithDate = Omit<Job, 'PickupDate' | 'DropoffDate'> & {
  PickupDate: string;
  DropoffDate: string;
};

type CalendarViewProps = {
  jobs: Job[];
  onDatesSet?: (arg: DatesSetArg) => void;
  gotoDate?: string | null;
  currentViewProp?: string;
  loading?: boolean;
  calendarApiRef?: React.RefObject<CalendarApi | null>;
};

const CalendarView: React.FC<CalendarViewProps> = ({
  jobs,
  onDatesSet,
  gotoDate,
  currentViewProp = 'dayGridMonth',
  loading = false,
  calendarApiRef,
}) => {
  const calendarRef = useRef<FullCalendar>(null);
  const icsFilename = 'dth-calendar.ics';

  const fetchedRangesRef = useRef<string[]>([]);
  const [stepTarget, setStepTarget] = useState<string | null>(null);
  const [isStepping, setIsStepping] = useState(false);
  const stepLockRef = useRef(false);

  const stepwiseGotoDate = useCallback((targetDateStr: string) => {
    setStepTarget(targetDateStr);
    setIsStepping(true);
  }, []);

  useEffect(() => {
    if (!gotoDate) return;
    stepwiseGotoDate(gotoDate);
    fetchedRangesRef.current = [];
  }, [gotoDate, stepwiseGotoDate]);

  const handleDatesSet = useCallback(
    async (arg: DatesSetArg) => {
      const key = `${arg.startStr}::${arg.endStr}`;
      if (!fetchedRangesRef.current.includes(key)) {
        fetchedRangesRef.current.push(key);
        stepLockRef.current = true;
        await onDatesSet?.(arg);
        stepLockRef.current = false;
      }

      if (isStepping && stepTarget) {
        const calendarApi = calendarApiRef?.current;
        if (!calendarApi) return;

        const currentDate = dayjs(calendarApi.getDate());
        const targetDate = dayjs(stepTarget);

        if (currentDate.isSame(targetDate, 'month')) {
          setIsStepping(false);
          setStepTarget(null);
          return;
        }

        if (!stepLockRef.current) {
          const nextDate = currentDate.isBefore(targetDate)
            ? currentDate.add(1, 'month')
            : currentDate.subtract(1, 'month');

          calendarApi.gotoDate(nextDate.toDate());
        }
      }
    },
    [calendarApiRef, isStepping, stepTarget, onDatesSet]
  );

  const jobsWithDate: JobWithDate[] = useMemo(() => {
    return jobs.map(job => ({
      ...job,
      PickupDate: dayjs(job.PickupDate).utc().toISOString(),
      DropoffDate: dayjs(job.DropoffDate).utc().toISOString(),
    }));
  }, [jobs]);

  const handleDownloadICS = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    const viewStart = calendarApi.view.currentStart;
    const viewEnd = calendarApi.view.currentEnd;

    const viewStartStr = dayjs(viewStart).toISOString();
    const viewEndStr = dayjs(viewEnd).toISOString();

    const confirmedJobs = jobsWithDate.filter((job: JobWithDate) => {
      return (
        job.IsConfirmed &&
        job.PickupDate >= viewStartStr &&
        job.PickupDate < viewEndStr
      );
    });

    const icsContent = generateICS(confirmedJobs);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = icsFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const calendarApi = calendarRef.current?.getApi();
      if (!calendarApi) return;

      if (calendarApiRef) {
        calendarApiRef.current = calendarApi;
      }

      if (calendarApi.view.type !== currentViewProp) {
        calendarApi.changeView(currentViewProp);
      }

      if (gotoDate) {
        calendarApi.gotoDate(gotoDate);

        onDatesSet?.({
          start: calendarApi.view.currentStart,
          end: calendarApi.view.currentEnd,
          startStr: calendarApi.view.currentStart.toISOString(),
          endStr: calendarApi.view.currentEnd.toISOString(),
          timeZone: calendarApi.getOption('timeZone') || 'local',
          view: calendarApi.view,
        });
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [currentViewProp, gotoDate, calendarApiRef, onDatesSet]);

  useEffect(() => {
    const disableNavButtons = () => {
      const prevBtn = document.querySelector('.fc-prev-button') as HTMLButtonElement | null;
      const nextBtn = document.querySelector('.fc-next-button') as HTMLButtonElement | null;
      const todayBtn = document.querySelector('.fc-today-button') as HTMLButtonElement | null;

      const shouldDisable = loading || isStepping;

      [prevBtn, nextBtn, todayBtn].forEach((btn) => {
        if (btn) {
          btn.disabled = shouldDisable;
          btn.style.opacity = shouldDisable ? '0.5' : '1';
          btn.style.pointerEvents = shouldDisable ? 'none' : 'auto';
          btn.style.cursor = shouldDisable ? 'not-allowed' : 'pointer';
        }
      });
    };

    disableNavButtons();
    const calendarEl = document.querySelector('.fc-header-toolbar');
    const observer = new MutationObserver(disableNavButtons);

    if (calendarEl) {
      observer.observe(calendarEl, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, [loading, isStepping]);

  const events = useMemo(() => {
    if (currentViewProp === 'dayGridMonth') {
      const grouped: Record<string, JobWithDate[]> = {};
      jobsWithDate.forEach(job => {
        if (!job.PickupDate) return;
        const dateStr = job.PickupDate.split('T')[0];
        (grouped[dateStr] ??= []).push(job);
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

    return jobsWithDate.map(job => ({
      id: `job-${job.key}`,
      title: '',
      start: job.PickupDate,
      backgroundColor: '#95c941',
      borderColor: '#0369a1',
      textColor: 'white',
      extendedProps: { job },
    }));
  }, [jobsWithDate, currentViewProp]);

  const handleEventClick = (info: EventClickArg) => {
    const jobs: Job[] = info.event.extendedProps.jobs;
    const job: Job = info.event.extendedProps.job;
    const clickedDate = info.event.startStr.split('T')[0];

    if (jobs) {
      const details = jobs
        .map((j, i) => {
          const pickupTime = dayjs.utc(j.PickupDate).format('HH:mm');
          const totalPax = getTotalPax(j);
          return `${i + 1}. 🕒 ${pickupTime} 📍 ${j.Pickup} | 👤 ${totalPax} Pax | 🎫 PNR: ${j.PNR}`;
        })
        .join('\n');

      alert(`📅 Date: ${clickedDate}\n📌 Jobs:\n${details}`);
    } else if (job) {
      const pickupTime = dayjs.utc(job.PickupDate).format('DD/MM/YYYY HH:mm');
      const totalPax = getTotalPax(job);

      alert(`🎫 PNR: ${job.PNR}
🕒 Pickup: ${pickupTime}
📍 Location: ${job.Pickup}
👤 Pax: ${totalPax} (Adult: ${job.AdultQty}, Child: ${job.ChildQty}, Share: ${job.ChildShareQty}, Infant: ${job.InfantQty})
👤 Name: ${job.pax_name}`);
    }
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

  const router = useRouter();

const handleDashboardClick = (jobOrJobs: Job | Job[]) => {
  try {
    // เก็บข้อมูล job หรือ jobs ลง sessionStorage
    sessionStorage.setItem('dashboardJobsData', JSON.stringify(jobOrJobs));
    // เปิดหน้า /calendar/dashboard ในแท็บใหม่ (new tab)
    window.open('/calendar/dashboard', '_blank');
  } catch (error) {
    console.error('Failed to open new tab or store data:', error);
  }
};


  return (
    <>
      <div className="mb-2">
        <button
          onClick={handleDownloadICS}
          disabled={loading}
          className={`px-3 py-1 text-white rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          title={loading ? 'Please wait for data to load' : 'Download calendar as ICS'}
        >
          📥 Download ({icsFilename})
        </button>

      </div>

      <FullCalendar
        timeZone='UTC'
        ref={calendarRef}
        plugins={[listPlugin, interactionPlugin]}
        initialView="listMonth"
        events={events}
        datesSet={handleDatesSet}
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
        eventContent={(arg: EventContentArg) => (
          <CalendarEventContent
            arg={arg}
            getStatusDots={getStatusDots}
            handleDownloadSingleICS={handleDownloadSingleICS}
            onDashboardClick={handleDashboardClick}  // เปลี่ยนจาก goToDashboard เป็น onDashboardClick
          />
        )}
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

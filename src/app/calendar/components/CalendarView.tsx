'use client';
 
import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { DatesSetArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import { Job, getTotalPax } from './types';
import type { CalendarApi } from '@fullcalendar/core';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import CalendarEventContent from './CalendarEventContent';
import { generateICS, generateSingleICS } from './icsGenerator';
import { getStatusDots } from './calendarUtils';
 
dayjs.extend(utc);
 
// Note: we reuse the same crypto helpers as in Page for decrypting debug cache in sessionStorage.
// For simplicity and to avoid code duplication across files, we implement minimal helper here too.
// In a real project you might export them to a shared util.
 
async function getCryptoKeyFromSecret(secret: string) {
  const enc = new TextEncoder();
  const secretBytes = enc.encode(secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', secretBytes);
  return crypto.subtle.importKey('raw', hashBuffer, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

function base64ToArrayBuffer(base64: string) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
async function decryptObjectFromBase64(payloadStr: string): Promise<string | null> {
  try {
    const payload = JSON.parse(payloadStr);
    const secret = process.env.NEXT_PUBLIC_CACHE_SECRET || '';
    const key = await getCryptoKeyFromSecret(secret || 'fallback_secret_use_env');
    const iv = new Uint8Array(base64ToArrayBuffer(payload.iv));
    const ct = base64ToArrayBuffer(payload.ct);
    const plainBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
    const dec = new TextDecoder();
    const json = dec.decode(plainBuffer);
    return JSON.parse(json);
  } catch  {
    return null;
  }
}
async function getEncryptedSession(key: string) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return await decryptObjectFromBase64(raw);
  } catch {
    return null;
  }
}
 
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
  onDashboardClick?: (jobOrJobs: Job | Job[]) => void;
};
 
const CalendarView: React.FC<CalendarViewProps> = ({
  jobs,
  onDatesSet,
  gotoDate,
  currentViewProp = 'dayGridMonth',
  loading = false,
  calendarApiRef,
  onDashboardClick,
}) => {
  const calendarRef = useRef<FullCalendar>(null);
  const icsFilename = 'dth-calendar.ics';
 
  // fetchedRangesRef is debug-only; authoritative cache is in Page sessionStorage
  const fetchedRangesRef = useRef<Set<string>>(new Set());
 
  const handleDatesSet = useCallback(
    async (arg: DatesSetArg) => {
      const key = `${arg.startStr}::${arg.endStr}`;
      fetchedRangesRef.current.add(key);
      try {
        await onDatesSet?.(arg);
      } catch (err) {
        console.error('[CalendarView] onDatesSet threw', err);
      }
    },
    [onDatesSet]
  );
 
  // restore debug ranges from sessionStorage (encrypted) if available (not authoritative)
  useEffect(() => {
    (async () => {
      try {
        const raw = await getEncryptedSession('calendar_cachedMonths');
        if (Array.isArray(raw)) {
          const arr: string[] = raw;
          // convert to the same range key format for debug visibility
          arr.forEach(mk => {
            const start = `${mk}-01T00:00:00Z`;
            const endMonth = new Date(parseInt(mk.slice(0, 4), 10), parseInt(mk.slice(5, 7), 10), 1);
            endMonth.setMonth(endMonth.getMonth() + 1);
            const end = endMonth.toISOString();
            fetchedRangesRef.current.add(`${start}::${end}`);
          });
          if (process.env.NODE_ENV === 'development') console.debug('[CalendarView] restored debug ranges from session storage', Array.from(fetchedRangesRef.current));
        }
      } catch {
        // ignore
      }
    })();
  }, []);
 
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
        console.log('[useEffect] calendarApi.gotoDate', gotoDate);
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
 
      alert(`🎫 PNR: ${job.PNR}\n🕒 Pickup: ${pickupTime}\n📍 Location: ${job.Pickup}\n👤 Pax: ${totalPax} (Adult: ${job.AdultQty}, Child: ${job.ChildQty}, Share: ${job.ChildShareQty}, Infant: ${job.InfantQty})\n👤 Name: ${job.pax_name}`);
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
 
  const handleDashboardClick = (jobOrJobs: Job | Job[]) => {
    try {
      // to be compatible with new storage scheme: store encrypted in sessionStorage by Page,
      // but for safety here we just call the callback if provided (parent handles storage).
      onDashboardClick?.(jobOrJobs);
    } catch (error) {
      console.error('Failed to open dashboard:', error);
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
            onDashboardClick={handleDashboardClick}
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
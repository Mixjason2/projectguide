'use client';

import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react'; // ✅ เพิ่ม useState
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { DatesSetArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import { Job, getTotalPax } from './types';
import type { CalendarApi } from '@fullcalendar/core'; // เพิ่ม type CalendarApi
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

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
  calendarApiRef?: React.RefObject<CalendarApi | null>; // เปลี่ยน any เป็น CalendarApi | null
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


function generateICS(jobs: JobWithDate[]): string {
  const formatDateTime = (d: dayjs.Dayjs) => d.utc().format('YYYYMMDDTHHmmss');

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'PRODID:-//Test Calendar//EN',
  ].join('\r\n') + '\r\n';

  for (const job of jobs) {
    const start = dayjs(job.PickupDate).utc(); // ไม่ต้องใช้ new Date()
    const end = start.add(1, 'hour');          // บวกเวลา 1 ชั่วโมงด้วย dayjs

    ics += [
      'BEGIN:VEVENT',
      `UID:${job.key}@example.com`,
      `DTSTAMP:${dayjs().utc().format('YYYYMMDDTHHmmss')}Z`,
      `DTSTART:${formatDateTime(start)}`, // ไม่ใส่ timezone
      `DTEND:${formatDateTime(end)}`,     // ไม่ใส่ timezone
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
  loading = false,
  calendarApiRef,
}) => {
  const calendarRef = useRef<FullCalendar>(null);
  const icsFilename = 'dth-calendar.ics';

  // สำหรับกัน fetch ซ้ำ
  const fetchedRangesRef = useRef<string[]>([]);
  // สำหรับ stepwise gotoDate
  const [stepTarget, setStepTarget] = useState<string | null>(null);
  const [isStepping, setIsStepping] = useState(false);
  const stepLockRef = useRef(false);

  // ฟังก์ชันเลื่อนทีละเดือน
  const stepwiseGotoDate = useCallback((targetDateStr: string) => {
    setStepTarget(targetDateStr);
    setIsStepping(true);
  }, []);



  // เมื่อ gotoDate เปลี่ยน ให้เริ่ม stepwiseGotoDate
  useEffect(() => {
    if (!gotoDate) return;
    stepwiseGotoDate(gotoDate);
    // reset fetchedRanges เมื่อเปลี่ยนช่วง
    fetchedRangesRef.current = [];
  }, [gotoDate, stepwiseGotoDate]);

  const handleDatesSet = useCallback(
    async (arg: DatesSetArg) => {
      // กัน fetch ซ้ำ
      const key = `${arg.startStr}::${arg.endStr}`;
      if (!fetchedRangesRef.current.includes(key)) {
        fetchedRangesRef.current.push(key);
        stepLockRef.current = true;
        await onDatesSet?.(arg); // ถ้า onDatesSet เป็น async, ถ้าไม่ใช่ลบ await ออก
        stepLockRef.current = false;
      }

      // ถ้าอยู่ในโหมด stepwise และยังไม่ถึงเป้าหมาย
      if (isStepping && stepTarget) {
        const calendarApi = calendarApiRef?.current;
        if (!calendarApi) return;

        const currentDate = dayjs(calendarApi.getDate());
        const targetDate = dayjs(stepTarget); // 👈 แปลง string เป็น dayjs

        if (currentDate.isSame(targetDate, 'month')) {
          setIsStepping(false);
          setStepTarget(null);
          return;
        }

        // รอให้ fetch เสร็จก่อนค่อยไปเดือนถัดไป

        if (!stepLockRef.current) {
          const nextDate = currentDate.isBefore(targetDate)
            ? currentDate.add(1, 'month')
            : currentDate.subtract(1, 'month');

          calendarApi.gotoDate(nextDate.toDate()); // 👈 แปลงกลับเป็น Date
        }
      }
    },
    [calendarApiRef, isStepping, stepTarget, onDatesSet]
  );


  // ✅ ใช้ useMemo เพื่อแปลง jobs ให้เป็นเวลาประเทศไทยทันที
const jobsWithDate: JobWithDate[] = useMemo(() => {
  return jobs.map(job => ({
    ...job,
    PickupDate: dayjs(job.PickupDate).utc().toISOString(),
    DropoffDate: dayjs(job.DropoffDate).utc().toISOString(),
  }));
}, [jobs]);
  console.log('jobsWithDate', jobsWithDate);


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

    const icsContent = generateICS(confirmedJobs); // ✅ ใช้ตัวแปรใหม่ที่ถูก map แล้ว
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




  // ใน useEffect ที่จัดการ calendarRef:
  useEffect(() => {
    const timeout = setTimeout(() => {
      const calendarApi = calendarRef.current?.getApi();
      if (!calendarApi) return;

      // ✅ เชื่อม calendarApiRef ให้ Page ใช้ได้
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

    // Run on initial mount and whenever loading/isStepping changes
    disableNavButtons();

    // Observe DOM changes to reapply button state (important for FC re-renders)
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
      start: date, // ใช้ YYYY-MM-DD string
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
          console.log(pickupTime);
          const totalPax = getTotalPax(j);
          return `${i + 1}. 🕒 ${pickupTime} 📍 ${j.Pickup} | 👤 ${totalPax} Pax | 🎫 PNR: ${j.PNR}`;
        })
        .join('\n');

      alert(`📅 Date: ${clickedDate}\n📌 Jobs:\n${details}`);
    } else if (job) {
const pickupTime = dayjs.utc(job.PickupDate).format('DD/MM/YYYY HH:mm'); // แสดงวันที่+เวลาแบบ UTC
      const totalPax = getTotalPax(job);

      alert(`🎫 PNR: ${job.PNR}
🕒 Pickup: ${pickupTime}
📍 Location: ${job.Pickup}
👤 Pax: ${totalPax} (Adult: ${job.AdultQty}, Child: ${job.ChildQty}, Share: ${job.ChildShareQty}, Infant: ${job.InfantQty})
👤 Name: ${job.pax_name}`);
    }
  };

const formatStringDateTime = (isoString: string): string => {
  const d = dayjs(isoString).utc();
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    d.year() +
    pad(d.month() + 1) +
    pad(d.date()) +
    'T' +
    pad(d.hour()) +
    pad(d.minute()) +
    pad(d.second()) 
  );
};

const generateSingleICS = (job: Job): string => {
  const pickupUtc = dayjs(job.PickupDate).utc(); // ✅ แปลง local → UTC ชัดเจน
  const startStr = formatStringDateTime(pickupUtc.toISOString());
  const endStr = formatStringDateTime(pickupUtc.add(1, 'hour').toISOString());
  const dtstamp = formatStringDateTime(dayjs.utc().toISOString());

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'PRODID:-//Test Calendar//EN',
    'BEGIN:VEVENT',
    `UID:${job.key}@example.com`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:P: ${job.Pickup} | D: ${job.Dropoff}`,
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
          {job && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="text-neutral-800">P: {job.Pickup}</span>
              <span className="text-neutral-600">D: {job.Dropoff}</span>

            </div>
          )}
          {!job && <span style={{ flexShrink: 1, minWidth: 0 }}>{arg.event.title}</span>}
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
          disabled={loading}
          className={`px-3 py-1 text-white rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
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

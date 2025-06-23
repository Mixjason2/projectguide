'use client';

import React, { useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { DatesSetArg } from '@fullcalendar/core';

import CssgGuide from '../cssguide';
import useFetchJobs from '../component/useFetchJobs';
import { getTotalPax, findDuplicateNames } from '../component/jobHelpers';
import LoadingIndicator from '../component/LoadingIndicator';
import ErrorMessage from '../component/ErrorMessage';
import CalendarEventRenderer from '../component/CalendarEventRenderer';
import JobAction from '../component/JobAction';
import './calendar.css';

// ใช้ type Job จากไฟล์กลาง
import type { Job } from '../types/job';

export default function CalendarExcel() {
  // ดึงข้อมูล jobs พร้อมสถานะการโหลดและ error
  const { jobs, loading, error, setJobs } = useFetchJobs();

  // เก็บ view ปัจจุบันของปฏิทิน (dayGridMonth, timeGridWeek, ฯลฯ)
  const [currentView, setCurrentView] = useState<string>('dayGridMonth');

  // เก็บ job ที่ถูกเลือกเพื่อแสดง action ด้านล่าง
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // สร้าง event list สำหรับ FullCalendar ตาม view และ jobs
  const events = useMemo(() => {
    if (currentView === 'dayGridMonth') {
      // รวม jobs ตามวันที่ PickupDate (เฉพาะ job ที่ยืนยันแล้ว)
      const grouped: Record<string, Job[]> = {};
      jobs
        .filter(j => j.IsConfirmed)
        .forEach(job => {
          const date = job.PickupDate.split('T')[0];
          (grouped[date] ??= []).push(job);
        });

      // สร้าง event group แบบแสดงจำนวน job ต่อวัน
      return Object.entries(grouped).map(([date, jobsOnDate]) => ({
        title: `(${jobsOnDate.length}): job`,
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
      // สำหรับ view อื่นๆ แสดง event แยกตาม job
      return jobs
        .filter(j => j.IsConfirmed)
        .map(job => ({
          id: job.key.toString(),
          title: ` ${job.serviceProductName} `,
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

  // ฟังก์ชันจัดการคลิก event ในปฏิทิน
  const handleEventClick = (info: any) => {
    if (currentView === 'dayGridMonth') {
      // กรณี month view แสดงรายละเอียด job ในวันนั้นพร้อมตรวจหาชื่อซ้ำ
      const jobsOnDate: Job[] = info.event.extendedProps.jobs || [];
      const clickedDate = info.event.startStr.split('T')[0];
      const duplicateNames = findDuplicateNames(jobsOnDate);
      const details = jobsOnDate.map((job, i) => {
        const pickupTime = new Date(job.PickupDate).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const totalPax = getTotalPax(job);
        return `${i + 1}. 🕒 ${pickupTime} 📍 ${job.Pickup} | 👤 ${totalPax} Pax | 🎫 PNR: ${job.PNR}`;
      }).join('\n');

      alert(`📅 Date: ${clickedDate}
👤 Duplicate Names: ${duplicateNames.length > 0 ? duplicateNames.join(', ') : 'None'}
📌 Jobs:\n${details}`);
    } else {
      // กรณี view อื่นๆ เลือก job เดียว
      const job: Job = info.event.extendedProps.job;
      setSelectedJob(job);
    }
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <CssgGuide>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="timeGridWeek"
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
        eventContent={CalendarEventRenderer}
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

      {/* แสดง JobAction ด้านล่างเมื่อคลิก job ที่ยังไม่ Confirm และไม่ Cancel */}
      {selectedJob && !selectedJob.IsConfirmed && !selectedJob.IsCancel && (
        <div className="mt-6 max-w-xl mx-auto">
          <JobAction
            job={{
              ...selectedJob,
              all: [selectedJob],
              keys: selectedJob.key
            }}
            setJobs={setJobs}
          />
        </div>
      )}
    </CssgGuide>
  );
}

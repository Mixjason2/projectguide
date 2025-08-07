import React from 'react';
import { EventContentArg } from '@fullcalendar/core';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Job } from './types';

dayjs.extend(utc);

type StatusDot = {
  color: string;
  label: string;
};

function CalendarEventContent({
  arg,
  getStatusDots,
  handleDownloadSingleICS,
  onDashboardClick, // เปลี่ยนจาก goToDashboard เป็น onDashboardClick ที่รับงาน
}: {
  arg: EventContentArg;
  getStatusDots: (input: Job | Job[]) => StatusDot[];
  handleDownloadSingleICS: (job: Job) => void;
  onDashboardClick: (jobOrJobs: Job | Job[]) => void;
}) {
  const job = arg.event.extendedProps?.job as Job | undefined;
  const jobs = arg.event.extendedProps?.jobs as Job[] | undefined;
  const statusDots = getStatusDots(job ?? jobs ?? []);

  const dashboardData = job ?? jobs ?? [];

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
        {(job || (Array.isArray(jobs) && jobs.length > 0)) && (
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDashboardClick(dashboardData);
              }}
              style={{
                backgroundColor: 'rgba(0, 128, 0, 0.5)',
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
              title="Go to Dashboard"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 128, 0, 0.7)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 128, 0, 0.5)')}
            >
              📊
            </button>
          </div>
        )}

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
}

export default CalendarEventContent;

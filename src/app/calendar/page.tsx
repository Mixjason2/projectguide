'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import CssgGuide from '../cssguide';
import './calendar.css';



export default function CalendarExcel() {
  return (
    <CssgGuide>
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <div className="bg-base-100 rounded-xl shadow-xl border border-base-300 w-full max-w-screen-2xl h-[90vh] flex flex-col">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={[
              { title: 'event 1', date: '2024-06-01' },
              { title: 'event 2', date: '2024-06-02' }
            ]}
            height="100%"
            contentHeight="auto"
            aspectRatio={1.7}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            }}
            editable={false}
            selectable={true}
            expandRows={true}
          />
        </div>
      </div>
    </CssgGuide>
  );
}
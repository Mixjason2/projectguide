import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import type { Job } from './types';

type JobWithDate = Omit<Job, 'PickupDate' | 'DropoffDate'> & {
  PickupDate: string;
  DropoffDate: string;
};

function formatDateTime(d: dayjs.Dayjs): string {
  return d.utc().format('YYYYMMDDTHHmmss');
}

export function generateICS(jobs: JobWithDate[]): string {
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'PRODID:-//Test Calendar//EN',
  ].join('\r\n') + '\r\n';

  for (const job of jobs) {
    const start = dayjs(job.PickupDate).utc();
    const end = start.add(1, 'hour');

    ics += [
      'BEGIN:VEVENT',
      `UID:${job.key}@example.com`,
      `DTSTAMP:${dayjs().utc().format('YYYYMMDDTHHmmss')}Z`,
      `DTSTART:${formatDateTime(start)}`,
      `DTEND:${formatDateTime(end)}`,
      `SUMMARY:${job.serviceProductName}`,
      `DESCRIPTION:${job.PNR ? `PNR: ${job.PNR},  : ` : ''}Pickup: ${job.Pickup}`,
      `LOCATION:${job.Pickup}`,
      'END:VEVENT',
    ].join('\r\n') + '\r\n';
  }

  ics += 'END:VCALENDAR\r\n';
  return ics;
}

export function generateSingleICS(job: Job): string {
  const pickupUtc = dayjs(job.PickupDate).utc();
  const startStr = formatDateTime(pickupUtc);
  const endStr = formatDateTime(pickupUtc.add(1, 'hour'));
  const dtstamp = formatDateTime(dayjs.utc());

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
    `DESCRIPTION:${job.PNR ? `PNR: ${job.PNR},  : ` : ''}Pickup: ${job.Pickup}`,
    `LOCATION:${job.Pickup}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n') + '\r\n';

  return ics;
}

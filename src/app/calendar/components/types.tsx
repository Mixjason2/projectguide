import { ReactNode } from 'react';

export interface Job {
  key: number | string;
  PNR: string;
  PickupDate: string;
  DropoffDate: string;
  serviceProductName: string;
  Pickup: string;
  Dropoff: string;
  pax_name: string;
  AdultQty: number;
  ChildQty: number;
  ChildShareQty: number;
  InfantQty: number;
  IsConfirmed?: boolean;
  IsCancel?: boolean;

  // ✅ เพิ่มสองบรรทัดนี้เข้าไป
  isNew?: boolean;
  isChange?: boolean;
}


export function getTotalPax(job: Job): number {
  return job.AdultQty + job.ChildQty + job.ChildShareQty + job.InfantQty;
}

export const getToday = () => new Date().toISOString().slice(0, 10);

export const getEndOfMonth = () =>
  new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).toISOString().slice(0, 10);

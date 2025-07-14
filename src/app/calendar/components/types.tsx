import type { ReactNode } from 'react';

export type Job = {
  isNew: unknown;
  IsConfirmed: unknown;
  isChange: boolean;
  key: number;
  PNR: string;
  PickupDate: string;
  Pickup: string;
  Dropoff:string;
  DropoffDate:string;
  AdultQty: number;
  ChildQty: number;
  ChildShareQty: number;
  InfantQty: number;
  pax_name: ReactNode;
  Booking_Name: ReactNode;
  serviceProductName: ReactNode;
};



export function getTotalPax(job: Job): number {
  return job.AdultQty + job.ChildQty + job.ChildShareQty + job.InfantQty;
}

export const getToday = () => new Date().toISOString().slice(0, 10);

export const getEndOfMonth = () =>
  new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).toISOString().slice(0, 10);

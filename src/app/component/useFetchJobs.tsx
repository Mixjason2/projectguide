import { useState, useEffect } from 'react';

export type Job = {
  IsConfirmed: boolean; // เปลี่ยน unknown -> boolean
  isChange: boolean;
  key: number;
  PNR: string;
  PickupDate: string; // ต้องเป็น ISO string
  Pickup: string;
  AdultQty: number;
  ChildQty: number;
  ChildShareQty: number;
  InfantQty: number;
  pax_name: React.ReactNode;
  Booking_Name: React.ReactNode;
  serviceProductName: React.ReactNode;
};

export default function useFetchJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    if (!token) {
      setError("Token not found. Please log in.");
      setLoading(false);
      return;
    }

    const getToday = () => new Date().toISOString().slice(0, 10);
    const getEndOfMonth = () =>
      new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).toISOString().slice(0, 10);

    const startDate = localStorage.getItem("startDate") || getToday();
    const endDate = localStorage.getItem("endDate") || getEndOfMonth();

    fetch('https://operation.dth.travel:7082/api/guide/job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, startdate: startDate, enddate: endDate }),
    })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(data => {
        console.log("Fetched jobs:", data);
        setJobs(data);
        localStorage.setItem(`jobs_${startDate}_${endDate}`, JSON.stringify(data));
      })
      .catch(err => {
        setError(err.message || "Failed to fetch");
      })
      .finally(() => setLoading(false));
  }, []);

  return { jobs, loading, error, setJobs }; // return setJobs ด้วย
}

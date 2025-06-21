'use client';

import { useEffect, useState } from 'react';
import CssgGuide from '../cssguide';
import axios from 'axios';

type Job = {
  key: number;
  PNR: string;
  PickupDate: string;
  Pickup: string;
  DropoffDate: string;
  Dropoff: string;
  serviceProductName: string;
  IsConfirmed: boolean;
  isChange: boolean;
  // ... เพิ่ม field อื่นๆ ตามที่ต้องการ ...
};

const getToday = () => new Date().toISOString().slice(0, 10);
const getEndOfMonth = () =>
  new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).toISOString().slice(0, 10);

export default function JobsList() {
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getEndOfMonth());
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setJobs([]);
      setError("Token not found. Please log in.");
      return;
    }
    setLoading(true);
    setError(null);
    axios.post('https://operation.dth.travel:7082/api/guide/job', {
      token,
      startdate: startDate,
      enddate: endDate,
    })
      .then(res => {
        setJobs(res.data);
      })
      .catch(err => {
        setError(err.message || 'Error fetching jobs');
        setJobs([]);
      })
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

  return (
    <CssgGuide>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Jobs List</h1>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm">Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="input input-bordered"
            />
          </div>
          <div>
            <label className="block text-sm">End date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="input input-bordered"
            />
          </div>
        </div>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && jobs.length === 0 && <div>No jobs found.</div>}
        <ul className="divide-y">
          {jobs.map(job => (
            <li key={job.key} className="py-3">
              <div className="font-semibold">{job.PNR} - {job.serviceProductName}</div>
              <div>Pickup: {job.Pickup} ({job.PickupDate})</div>
              <div>Dropoff: {job.Dropoff} ({job.DropoffDate})</div>
              <div>Status: {job.IsConfirmed ? "Confirmed" : "Not Confirmed"} {job.isChange && <span className="text-orange-500">(Changed)</span>}</div>
            </li>
          ))}
        </ul>
      </div>
    </CssgGuide>
  );
}
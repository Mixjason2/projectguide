'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Job } from '../components/types';

function DashboardPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[] | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('dashboardJobsData');
      if (!stored) {
        router.replace('/calendar'); // ถ้าไม่มีข้อมูล ให้กลับหน้า Calendar
        return;
      }
      const parsed = JSON.parse(stored) as Job | Job[];
      setJobs(Array.isArray(parsed) ? parsed : [parsed]);
    } catch {
      router.replace('/calendar');
    }
  }, [router]);

  if (jobs === null) return <div>Loading...</div>;
  if (jobs.length === 0) return <div>No jobs found.</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => router.back()}>Back</button>
      <ul>
        {jobs.map((job, i) => (
          <li key={job.key ?? i}>
            PNR: {job.PNR} — Pax Name: {job.pax_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardPage;

'use client';

import { useEffect, useState } from 'react';
import CssgGuide from '../cssguide';
import axios from 'axios';
import { Job } from "@/app/types/job";
import { MergedJob } from "@/app/types/job";
import StatusMessage from "@/app/component/StatusMessage";
import ConfirmedFilter from '@/app/component/ConfirmedFilter';
import JobsSummary from '@/app/component/JobsSummary';
import JobCard from '@/app/component/JobCard';
import AllJobDetailsModal from "@/app/component/AllJobDetailsModal";

// Merge jobs by PNR, combine fields that are different into arrays
function mergeJobsByPNR(jobs: Job[]): MergedJob[] {
  const map: Record<string, { merged: MergedJob; all: Job[] }> = {};

  for (const job of jobs) {
    if (!map[job.PNR]) {
      map[job.PNR] = {
        merged: { ...job, keys: [job.key], all: [job] },
        all: [job],
      };
    } else {
      map[job.PNR].merged.keys.push(job.key);
      map[job.PNR].all.push(job);

      for (const k of Object.keys(job) as (keyof Job)[]) {
        if (k === "key" || k === "Photo" || k === "Remark") continue;

        const prev = map[job.PNR].merged[k];
        const curr = job[k];

        if (k === "IsConfirmed") {
          const mergedVal = Boolean(prev) || Boolean(curr);
          map[job.PNR].merged[k] = mergedVal;
          continue;
        }

        if (k === "IsCancel") {
          const mergedVal = Boolean(prev) || Boolean(curr);
          map[job.PNR].merged[k] = mergedVal;
          continue;
        }

        if (Array.isArray(prev)) {
          if (!prev.includes(curr)) {
            (prev as any[]).push(curr);
          }
        } else if (prev !== curr) {
          (map[job.PNR].merged as any)[k] = [prev, curr].filter(
            (v, i, arr) => arr.indexOf(v) === i
          );
        }
      }
    }
  }
  return Object.values(map).map((entry) => entry.merged);
}

const getToday = () => new Date().toISOString().slice(0, 10);

const getEndOfMonth = () => new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).toISOString().slice(0, 10);

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailJobs, setDetailJobs] = useState<Job[] | null>(null);
  const [startDate, setStartDate] = useState<string>(getToday());
  const [endDate, setEndDate] = useState<string>(getEndOfMonth());
  const [page, setPage] = useState(1);
  const [expandedPNRs, setExpandedPNRs] = useState<{ [pnr: string]: boolean }>({});
  const [showConfirmedOnly, setShowConfirmedOnly] = useState(false);
  const pageSize = 6;

  useEffect(() => { 
    const token = localStorage.getItem('token') || '';
    setLoading(true);
    fetch('https://operation.dth.travel:7082/api/guide/job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token, // ✅ ใช้ token จาก localStorage
        startdate: startDate,
        enddate: endDate
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text(); // แปลง error เป็นข้อความ
          throw new Error(text);
        }
        return res.json(); // ✅ แปลงเป็น JSON
      })
      .then((data) => {
        // console.log("Job data:", data);
        setJobs(data); // ✅ เซ็ตข้อมูลให้ state
      })
      .catch((err) => {
        // console.error("Fetch error:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [startDate, endDate]);

  const filteredByDate = jobs.filter(job => {
    const pickup = job.PickupDate, dropoff = job.DropoffDate;
    return (!startDate && !endDate) || (startDate && pickup >= startDate) || (endDate && dropoff <= endDate);
  });

  const filteredJobs = showConfirmedOnly
    ? filteredByDate.filter(job => job.IsConfirmed === true)
    : filteredByDate;

  const mergedJobs = mergeJobsByPNR(filteredJobs);
  console.log('Merged Jobs with isConfirmed/isCancel:', mergedJobs);
  const totalPages = Math.ceil(mergedJobs.length / pageSize);

  const pagedJobs = mergedJobs.slice((page - 1) * pageSize, page * pageSize);
  // console.log("Merged Jobs:", pagedJobs);
<<<<<<< HEAD
  const summary = (
    <div className="w-full flex justify-end mb-6">
      <div className="flex flex-row flex-wrap gap-6 bg-white border border-blue-300 rounded-xl shadow-lg px-8 py-4 items-center max-w-3xl">
        {['All Jobs', 'New Jobs', 'Changed Jobs'].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${['bg-neutral-700', 'bg-cyan-600', 'bg-orange-400'][i]}`}></span>  
            <span className="text-gray-500">{label}:</span>
            <span className="font-Arial text-[#2D3E92]">
              {i === 0 ? filteredByDate.length : filteredByDate.filter(job => i === 1 ? job.isNew : job.isChange).length}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
=======
>>>>>>> 8beeca7153f907fd9a37802ecd108c1d679bcc06
  const fetchJobs = async (token: string, startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('https://operation.dth.travel:7082/api/guide/job', { token, startdate: startDate, enddate: endDate });
      setJobs(res.data);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <CssgGuide>
      <div className="flex flex-col items-center py-8 min-h-screen bg-base-200 relative bg-[#9EE4F6]">
        <JobsSummary filteredByDate={filteredByDate} />
        <div className="bg-[#F9FAFB] rounded-3xl shadow-lg border border-gray-300 w-full max-w-7xl p-6">
          <div className="p-4 w-full overflow-auto bg-[#F9FAFB]">
            <h1 className="text-2xl font-Arial mb-4">Jobs List</h1>
            <div className="mb-6 flex flex-col items-center w-full px-4">
              <div className="w-full rounded-xl shadow-md px-4 py-4 flex flex-row items-center justify-between gap-2" style={{ backgroundColor: '#E6F0FA', border: '1px solid #2D3E92' }}>
                {['Start date', 'End date'].map((label, i) => (
                  <div key={i} className="flex flex-col w-[48%]">
                    <label htmlFor={`${label.toLowerCase().replace(' ', '-')}`} className="mb-1 text-xs text-gray-500 font-Arial">{label}</label>
                    <input
                      id={`${label.toLowerCase().replace(' ', '-')}`}
                      type="date"
                      value={i === 0 ? startDate : endDate}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        i === 0 ? setStartDate(newDate) : setEndDate(newDate);
                        fetchJobs(localStorage.getItem('token') || '', i === 0 ? newDate : startDate, i === 0 ? endDate : newDate);
                      }}
                      className="input input-bordered w-full"
                    />
                  </div>
                ))}
              </div>
              <span className="mt-2 text-xs text-gray-400 text-center px-2">Please select a date range to filter the desired tasks.</span>
            </div>
            <ConfirmedFilter showConfirmedOnly={showConfirmedOnly} onChange={setShowConfirmedOnly} />
            <StatusMessage loading={loading} error={error} filteredJobsLength={filteredByDate.length} />
            {!loading && !error && filteredByDate.length > 0 && (
              // render list jobs
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pagedJobs.map((job) => (
                    <JobCard
                      key={job.PNR}
                      job={job}
                      expandedPNRs={expandedPNRs}
                      setExpandedPNRs={setExpandedPNRs}
                      setDetailJobs={setDetailJobs}
                      jobs={jobs}
                      setJobs={setJobs}
                    />
                  ))}
                </div>
                <div className="w-full flex justify-center mt-6">
                  <div className="inline-flex items-center gap-2 bg-base-100 border border-base-300 rounded-full shadow px-4 py-2">
                    <button className="btn btn-outline btn-sm rounded-full min-w-[64px]" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                    <span className="px-2 py-1 font-Arial text-base-content">{page} <span className="text-gray-400">/</span> {totalPages}</span>
                    <button className="btn btn-outline btn-sm rounded-full min-w-[64px]" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                  </div>
                </div>
                <AllJobDetailsModal detailJobs={detailJobs} setDetailJobs={setDetailJobs} />
              </>
            )}
          </div>
        </div>
      </div>
    </CssgGuide>
  );
}
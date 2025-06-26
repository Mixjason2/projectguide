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
import PendingFilter from "@/app/component/PendingFilter";

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

const get30DaysAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().slice(0, 10);
};

const getEndOfLastMonth = () => {
  const date = new Date();
  date.setDate(0); // วันที่ 0 ของเดือนปัจจุบัน = วันสุดท้ายของเดือนก่อนหน้า
  return date.toISOString().slice(0, 10);
};

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailJobs, setDetailJobs] = useState<Job[] | null>(null);
  const [startDate, setStartDate] = useState<string>(get30DaysAgo());
  const [endDate, setEndDate] = useState<string>(getEndOfLastMonth());
  const [page, setPage] = useState(1);
  const [expandedPNRs, setExpandedPNRs] = useState<{ [pnr: string]: boolean }>({});
  const [showConfirmedOnly, setShowConfirmedOnly] = useState(false);
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const pageSize = 6;

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    setLoading(true);
    // ทำการ fetch ข้อมูลที่ต้องการแค่ครั้งเดียว
    fetchJobs(token, startDate, endDate);
  }, []); // เรียกครั้งเดียวเมื่อ component โหลด

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

  const filteredByDate = jobs.filter(job => {
    const pickup = job.PickupDate, dropoff = job.DropoffDate;
    return (!startDate && !endDate) || (startDate && pickup >= startDate) || (endDate && dropoff <= endDate);
  });

  const filteredJobs = filteredByDate.filter(job => {
    if (showConfirmedOnly) return job.IsConfirmed === true;
    if (showPendingOnly) return job.IsConfirmed === false && job.IsCancel === false;
    return true; // แสดงทั้งหมด
  });

  const mergedJobs = mergeJobsByPNR(filteredJobs);

  const totalPages = Math.ceil(mergedJobs.length / pageSize);

  const pagedJobs = mergedJobs.slice((page - 1) * pageSize, page * pageSize);
  // console.log("Merged Jobs:", pagedJobs);
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
            <div className="px-4 mb-4">
              <label className="block mb-1 font-medium text-gray-700">Filter by Status</label>
              <select
                className="w-full md:w-60 border rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
                value={
                  showConfirmedOnly ? "confirmed" :
                    showPendingOnly ? "pending" :
                      "all"
                }
                onChange={(e) => {
                  const value = e.target.value;
                  setShowConfirmedOnly(value === "confirmed");
                  setShowPendingOnly(value === "pending");
                }}
              >
                <option value="all">🟡 All Jobs</option>
                <option value="confirmed">✅ Confirmed Only</option>
                <option value="pending">🕒 Pending Only</option>
              </select>
            </div>


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
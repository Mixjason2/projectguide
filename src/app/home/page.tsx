'use client';

import { useEffect, useMemo, useState } from 'react';
import CssgGuide from '../cssguide';
import axios from 'axios';
import { Job } from "@/app/types/job";
import StatusMessage from "@/app/component/StatusMessage";
import JobsSummary from '@/app/component/JobsSummary';
import JobCard from '@/app/component/JobCard';
import AllJobDetailsModal from "@/app/component/AllJobDetailsModal";

// Group jobs by their PNRDate
function groupJobsByPNRDate(jobs: Job[]): Record<string, Job[]> {
  return jobs.reduce((acc, job) => {
    if (!acc[job.PNRDate]) {
      acc[job.PNRDate] = [];
    }
    acc[job.PNRDate].push(job);
    return acc;
  }, {} as Record<string, Job[]>);
}

// Get the date of 30 days ago
const get30DaysAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().slice(0, 10);
};

// Get the last date of the previous month
const getEndOfLastMonth = () => {
  const date = new Date();
  date.setDate(0);
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
    fetchJobs(token, startDate, endDate);
  }, [startDate, endDate]);

  const fetchJobs = async (token: string, startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('https://operation.dth.travel:7082/api/guide/job', { token, startdate: startDate, enddate: endDate });
      console.log("Fetched jobs:", res.data);
      setJobs(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredByDate = useMemo(() => {
    return jobs.filter(job => {
      const pickup = job.PickupDate, dropoff = job.DropoffDate;
      return (!startDate && !endDate) || (startDate && pickup >= startDate) || (endDate && dropoff <= endDate);
    });
  }, [jobs, startDate, endDate]);

  const groupedByPNRDate = useMemo(() => {
    const grouped = groupJobsByPNRDate(filteredByDate);
    const entries = Object.entries(grouped).filter(([_, jobs]) => {
      if (showConfirmedOnly) return jobs.some(j => j.IsConfirmed);
      if (showPendingOnly) return jobs.some(j => !j.IsConfirmed && !j.IsCancel);
      return true;
    });
    return entries.sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
  }, [filteredByDate, showConfirmedOnly, showPendingOnly]);

  const totalPages = Math.ceil(groupedByPNRDate.length / pageSize);
  const pagedGroups = groupedByPNRDate.slice((page - 1) * pageSize, page * pageSize);

  // Ensure mergedJob is properly defined before use
  // สร้าง mergedJob จากข้อมูล jobs ที่ดึงมาและจัดกลุ่ม

  return (
    <CssgGuide>
      <div className="flex flex-col items-center py-8 min-h-screen bg-base-200 relative bg-[#9EE4F6]">
        <JobsSummary filteredByDate={filteredByDate} />
        <div className="bg-[#F9FAFB] rounded-3xl shadow-lg border border-gray-300 w-full max-w-7xl p-6">
          <div className="p-4 w-full overflow-auto bg-[#F9FAFB]">
            <h1 className="text-2xl font-Arial mb-4">Jobs List</h1>

            {/* Filter date input */}
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
                        if (i === 0) setStartDate(newDate);
                        else setEndDate(newDate);
                      }}
                      className="input input-bordered w-full"
                    />
                  </div>
                ))}
              </div>
              <span className="mt-2 text-xs text-gray-400 text-center px-2">Please select a date range to filter the desired tasks.</span>
            </div>

            {/* Filter by Status */}
            <div className="px-4 mb-4">
              <label className="block mb-1 font-medium text-gray-700">Filter by Status</label>
              <select
                className="w-full md:w-60 border rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
                value={showConfirmedOnly ? "confirmed" : showPendingOnly ? "pending" : "all"}
                onChange={(e) => {
                  const value = e.target.value;
                  setShowConfirmedOnly(value === "confirmed");
                  setShowPendingOnly(value === "pending");
                }}
              >
                <option value="all">⚫️ All Jobs</option>
                <option value="confirmed">✅ Confirmed Only</option>
                <option value="pending">🕒 Pending Only</option>
              </select>
            </div>

            <StatusMessage loading={loading} error={error} filteredJobsLength={filteredByDate.length} />
            {!loading && !error && filteredByDate.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pagedGroups.map(([pnrDate, jobs]) => (
                    <div key={pnrDate} className="w-full border rounded-lg p-4 shadow bg-white">
                      <JobCard
                        job={jobs}
                        expandedPNRs={expandedPNRs}
                        setExpandedPNRs={setExpandedPNRs}
                        setDetailJobs={setDetailJobs}
                        jobs={jobs}
                        setJobs={setJobs}
                      />
                    </div>
                  ))}
                </div>

                <div className="w-full flex justify-center mt-6">
                  <div className="inline-flex items-center gap-2 bg-base-100 border border-base-300 rounded-full shadow px-4 py-2 ">
                    <button className="btn btn-outline btn-sm rounded-full min-w-[64px]" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                    <span className="px-2 py-1 font-Arial text-base-content">{page} <span className="text-gray-400">/</span> {totalPages}</span>
                    <button className="btn btn-outline btn-sm rounded-full min-w-[64px]" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                  </div>
                </div>

                {detailJobs && (
                  <AllJobDetailsModal
                    detailJobs={detailJobs}
                    setDetailJobs={setDetailJobs}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </CssgGuide>
  );
}

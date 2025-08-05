'use client';

import Cookies from 'js-cookie';
import { useEffect, useMemo, useState } from 'react';
import CssgGuide from '../cssguide';
import axios from 'axios';
import { Job } from "@/app/types/job";
import StatusMessage from "@/app/component/StatusMessage";
import JobsSummary from '@/app/component/JobsSummary';
import JobCard from '@/app/component/JobCard';
import AllJobDetailsModal from "@/app/component/AllJobDetailsModal";
import debounce from 'lodash.debounce';
import AuthGuard from "@/app/component/AuthGuard";


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
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

// Get the last date of the previous month
const getEndOfLastMonth = () => {
  const date = new Date();
  date.setDate(date.getDate() + 31);
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
  const [showAllFilteredJobs, setShowAllFilteredJobs] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [asmdbValue, setAsmdbValue] = useState('');
  const pageSize = 6;

useEffect(() => {
  // โหลด asmdb จาก Cookie แทน localStorage
  const storedAsmdb = Cookies.get('asmdb');
  if (storedAsmdb) {
    setAsmdbValue(storedAsmdb);
  }
}, []);
 
useEffect(() => {
  // โหลด token จาก Cookie แทน localStorage
  const token = Cookies.get('token') || '';
  const debouncedFetch = debounce(() => {
    setLoading(true);
    fetchJobs(token, startDate, endDate);
  }, 800);
  debouncedFetch();
  return () => {
    debouncedFetch.cancel();
  };
}, [startDate, endDate]);

  const fetchJobs = async (token: string, startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('https://operation.dth.travel:7082/api/guide/job', { token, startdate: startDate, enddate: endDate });
      console.log("Fetched jobs:", res.data);
      setJobs(res.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };


  const filteredByDate = useMemo(() => {
    return jobs.filter(job => {
      const pickup = job.PickupDate, dropoff = job.DropoffDate;
      // กรองงานที่ IsCancel = true ออก
      return (!job.IsCancel) &&
        ((!startDate && !endDate) ||
          (startDate && pickup >= startDate) ||
          (endDate && dropoff <= endDate));
    });
  }, [jobs, startDate, endDate]);

  const groupedByPNRDate = useMemo(() => {
    const grouped = groupJobsByPNRDate(filteredByDate);
    const entries = Object.entries(grouped).filter(([, jobs]) => {
      if (showNewOnly) return jobs.some(j => j.isNew);
      if (showConfirmedOnly) return jobs.some(j => j.IsConfirmed);
      if (showPendingOnly) return jobs.some(j => !j.IsConfirmed && !j.IsCancel);
      return true;
    });
    return entries.sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
  }, [filteredByDate, showConfirmedOnly, showPendingOnly, showNewOnly]);

  const totalPages = Math.ceil(groupedByPNRDate.length / pageSize);
  const pagedGroups = useMemo(() => {
    if ((showConfirmedOnly || showPendingOnly || showNewOnly) && showAllFilteredJobs) {
      return groupedByPNRDate;
    }
    return groupedByPNRDate.slice((page - 1) * pageSize, page * pageSize);
  }, [groupedByPNRDate, page, showConfirmedOnly, showPendingOnly, showAllFilteredJobs, showNewOnly]);

  return (
    <AuthGuard>
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
                        const maxDiffMs = 91 * 24 * 60 * 60 * 1000; // 90 วัน

                        if (i === 0) {
                          // --- เปลี่ยน Start Date ---
                          const newStart = new Date(newDate);
                          const currentEnd = new Date(endDate);

                          // ถ้า start > end → end = start
                          let adjustedEnd = currentEnd;
                          if (newStart > currentEnd) {
                            adjustedEnd = newStart;
                          }

                          // ถ้า end - start > 90 วัน → end = start + 90 วัน
                          if (adjustedEnd.getTime() - newStart.getTime() > maxDiffMs) {
                            adjustedEnd = new Date(newStart.getTime() + maxDiffMs);
                          }

                          setStartDate(newDate);
                          setEndDate(adjustedEnd.toISOString().slice(0, 10));
                        } else {
                          // --- เปลี่ยน End Date ---
                          const newEnd = new Date(newDate);
                          const currentStart = new Date(startDate);

                          // ถ้า end < start → start = end
                          let adjustedStart = currentStart;
                          if (newEnd < currentStart) {
                            adjustedStart = newEnd;
                          }

                          // ถ้า end - start > 90 วัน → start = end - 90 วัน
                          if (newEnd.getTime() - adjustedStart.getTime() > maxDiffMs) {
                            adjustedStart = new Date(newEnd.getTime() - maxDiffMs);
                          }

                          setEndDate(newDate);
                          setStartDate(adjustedStart.toISOString().slice(0, 10));
                        }
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
                value={showConfirmedOnly ? "confirmed" : showPendingOnly ? "pending" : showNewOnly ? "new" : "all"}
                onChange={(e) => {
                  const value = e.target.value;
                  setShowConfirmedOnly(value === "confirmed");
                  setShowPendingOnly(value === "pending");
                  setShowNewOnly(value === "new");
                }}
              >
                <option value="all">⚫️ All Jobs</option>
                <option value="confirmed">✅ Confirmed Only</option>
                <option value="pending">🕒 Pending Only</option>
                <option value="new">🆕 New Only</option>
              </select>
            </div>

            <StatusMessage loading={loading} error={error} filteredJobsLength={filteredByDate.length} />
            {!loading && !error && filteredByDate.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pagedGroups.map(([pnrDate, jobs]) => (
                    <div key={pnrDate} className="w-full p-2.5 border-gray-300"> {/* กรอบแสดง PNRDate */}
                      <JobCard
                        job={jobs}
                        expandedPNRs={expandedPNRs}
                        setExpandedPNRs={setExpandedPNRs}
                        setDetailJobs={setDetailJobs}
                        jobs={jobs}
                        setJobs={setJobs} asmdbValue={asmdbValue} />
                    </div>
                  ))}
                </div>

                <div className="w-full flex justify-center mt-6">
                  {(showConfirmedOnly || showPendingOnly || showNewOnly) ? (
                    <button
                      onClick={() => setShowAllFilteredJobs(prev => !prev)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-white bg-[#2D3E92] hover:bg-[#1f2b68] transition-colors"
                      title={showAllFilteredJobs ? 'Show less' : 'Load more'}
                    >
                      {showAllFilteredJobs ? (
                        // Show less icon
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="white"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
                          />
                        </svg>
                      ) : (
                        // Load more icon
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="white"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"
                          />
                        </svg>
                      )}
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-2 bg-base-100 border border-base-300 rounded-full shadow px-4 py-2">
                      <button
                        className="btn btn-outline btn-sm rounded-full min-w-[64px]"
                        disabled={page === 1}
                        onClick={() => {
                          setPage(page - 1);
                          setExpandedPNRs({});
                        }}
                      >
                        Prev
                      </button>
                      <span className="px-2 py-1 font-Arial text-base-content">
                        {page} <span className="text-gray-400">/</span> {totalPages}
                      </span>
                      <button
                        className="btn btn-outline btn-sm rounded-full min-w-[64px]"
                        disabled={page === totalPages}
                        onClick={() => {
                          setPage(page + 1);
                          setExpandedPNRs({});
                        }}
                      >
                        Next
                      </button>
                    </div>
                  )}
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
    </AuthGuard>
  );
}

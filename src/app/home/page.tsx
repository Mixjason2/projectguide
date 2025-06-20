'use client';

import { useEffect, useState } from 'react';
import CssgGuide from '../cssguide';
import axios from 'axios';
import { formatDate } from '@fullcalendar/core/index.js';
import { Job } from "@/app/types/job";
import { MergedJob } from "@/app/types/job";
import ExpandedJobDetail from '@/app/component/ExpandedJobDetail';
import JobAction from "@/app/component/JobAction";
import StatusMessage from "@/app/component/StatusMessage";
import AllJobDetails from "@/app/component/AllJobDetails";

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


  // ✅ Only one map block here
  // const result = Object.entries(map).map(([pnr, data]) => {
  //   const merged = { ...data.merged }
  //   // Force isConfirmed to true always
  //   merged.isConfirmed = true
  //   return {
  //     ...merged,
  //     PNR: pnr,
  //     all: data.all,
  //   }
  // })
  // console.log(result)
  // return result

// const result = Object.entries(map).map(([pnr, data]) => {
//   const merged = { ...data.merged };
//   // Force isCancel to true always
//   merged.isCancel = true;
//   return {
//     ...merged,
//     PNR: pnr,
//     all: data.all,
//   };
// });
// console.log(result);
// return result;
// }

const getToday = () => new Date().toISOString().slice(0, 10);

const getEndOfMonth = () => new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).toISOString().slice(0, 10);

const renderPlaceDate = (place: string, date: string, label: string) => (
  place || date ? (
    <div>
      <span className="font-Arial">{label}:</span> {place}{place && date ? ' - ' : ''}{date}
    </div>
  ) : null
);

const renderField = (label: string, value: any) => (
  Array.isArray(value) ? (
    <div>
      <span className="font-Arial">{label}:</span>
      <ul className="list-disc ml-6">{value.map((v, i) => <li key={i}>{String(v)}</li>)}</ul>
    </div>
  ) : (
    <div>
      <span className="font-Arial">{label}:</span> {String(value)}
    </div>
  )
);

const renderAllDetails = (jobs: Job[]) => {
  // Step 1: Group jobs by their common properties (excluding TypeName)
  const groupedJobs: Record<string, { job: Job; typeNames: string[] }> = {};

  jobs.forEach((job) => {
    const groupKey = JSON.stringify({
      PNR: job.PNR,
      Pickup: job.Pickup,
      PickupDate: job.PickupDate,
      Dropoff: job.Dropoff,
      DropoffDate: job.DropoffDate,
      PNRDate: job.PNRDate,
      GuideName: job.Guide,
      Vehicle: job.Vehicle,
      // add other fields that should be merged
    });

    const typeName = job.serviceTypeName || job.TypeName || "Unknown";

    if (!groupedJobs[groupKey]) {
      groupedJobs[groupKey] = {
        job: { ...job },
        typeNames: [typeName],
      };
    } else {
      groupedJobs[groupKey].typeNames.push(typeName);
    }
  });
  return (
    <AllJobDetails jobs={jobs} formatDate={formatDate} />
)};

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailJobs, setDetailJobs] = useState<Job[] | null>(null);
  const [startDate, setStartDate] = useState<string>(getToday());
  const [endDate, setEndDate] = useState<string>(getEndOfMonth());
  const [page, setPage] = useState(1);
  const [expandedPNRs, setExpandedPNRs] = useState<{ [pnr: string]: boolean }>({});
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

  const filteredJobs = jobs.filter(job => {
    const pickup = job.PickupDate, dropoff = job.DropoffDate;
    return (!startDate && !endDate) || (startDate && pickup >= startDate) || (endDate && dropoff <= endDate);
  });

  const mergedJobs = mergeJobsByPNR(filteredJobs);
  console.log('Merged Jobs with isConfirmed/isCancel:', mergedJobs);
  const totalPages = Math.ceil(mergedJobs.length / pageSize);

  const pagedJobs = mergedJobs.slice((page - 1) * pageSize, page * pageSize);
  // console.log("Merged Jobs:", pagedJobs);
  const summary = (
    <div className="w-full flex justify-end mb-6">
      <div className="flex flex-row flex-wrap gap-6 bg-white border border-blue-300 rounded-xl shadow-lg px-8 py-4 items-center max-w-3xl">
        {['All Jobs', 'New Jobs', 'Changed Jobs'].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${['bg-gray-400', 'bg-cyan-600', 'bg-orange-400'][i]}`}></span>
            <span className="text-gray-500">{label}:</span>
            <span className="font-Arial text-[#2D3E92]">
              {i === 0 ? filteredJobs.length : filteredJobs.filter(job => i === 1 ? job.isNew : job.isChange).length}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
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
        {summary}
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
            <StatusMessage loading={loading} error={error} filteredJobsLength={filteredJobs.length} />
            {!loading && !error && filteredJobs.length > 0 && (
              // render list jobs
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pagedJobs.map((job) => (
                    <div
                      key={job.PNR}
                      className="relative bg-white border border-[#9EE4F6] rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                    >
                      <div
                        className="absolute top-2 left-1 text-[#ffffff] font-Arial rounded-full px-3 py-1 text-sm shadow z-10"
                        style={{
                          backgroundColor: job.IsCancel
                            ? "#ef4444"
                            : job.IsConfirmed
                              ? "#22c55e"
                              : job.isNew
                                ? "#0891b2"
                                : job.isChange
                                  ? "#fb923c"
                                  : "#E0E7FF",
                        }}
                      >
                        {job.all?.filter(
                          (j) =>
                            j.Pickup !== job.Pickup ||
                            j.PickupDate !== job.PickupDate ||
                            j.Dropoff !== job.Dropoff ||
                            j.DropoffDate !== job.DropoffDate ||
                            j.PNRDate !== job.PNRDate
                        ).length + 1 || 1}
                      </div>

                      <button
                        className="absolute top-3.5 right-2 w-8 h-8 rounded-full bg-white border-2 border-[#2D3E92] shadow-[0_4px_10px_rgba(45,62,146,0.3)] hover:shadow-[0_6px_14px_rgba(45,62,146,0.4)] transition-all duration-200 flex items-center justify-center"
                        title="Show all details"
                        onClick={() => setDetailJobs(job.all)}
                        style={{ zIndex: 2 }}
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" fill="#F0F8FF" />
                          <text
                            x="12"
                            y="12"
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="18"
                            fill="#2D3E92"
                            fontFamily="Arial"
                            fontWeight="bold"
                          >
                            i
                          </text>
                        </svg>
                      </button>

                      <div
                        className="inline-block p-6 pb-0 cursor-pointer mx-auto items-center gap-3"
                        onClick={() =>
                          setExpandedPNRs((prev) => ({ ...prev, [job.PNR]: !expandedPNRs[job.PNR] }))
                        }
                      >
                        <h2
                          className="font-Arial mt-0 mb-0 underline underline-offset-4"
                          style={{ color: "#2D3E92", fontSize: "28px" }}
                        >
                          {job.PNR}
                        </h2>
                      </div>
                      <ExpandedJobDetail
                        job={job}
                        jobs={jobs}
                        expandedPNRs={expandedPNRs}
                        renderPlaceDate={renderPlaceDate}
                        renderField={renderField}
                      />
                      {/* ✅ ตรงนี้เรียกใช้ JobAction */}
                      <JobAction job={job} setJobs={setJobs} />
                    </div>
                  ))}
                </div>
                <div className="w-full flex justify-center mt-6">
                  <div className="inline-flex items-center gap-2 bg-base-100 border border-base-300 rounded-full shadow px-4 py-2">
                    <button className="btn btn-outline btn-sm rounded-full min-w-[64px]" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                    <span className="px-2 py-1 font-Arial text-base-content">{page} <span className="text-gray-400">/</span> {totalPages}</span>
                    <button className="btn btn-outline btn-sm rounded-full min-w-[64px]" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                  </div>
                </div>
                {detailJobs && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl border-4 border-blue-400 p-8 max-w-2xl w-full relative animate-fade-in">
                      <button className="absolute top-2 right-2 btn btn-sm btn-error" onClick={() => setDetailJobs(null)}>✕</button>
                      <h2 className="text-xl font-Arial mb-4">All Job Details</h2>
                      {renderAllDetails(detailJobs)}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </CssgGuide>
  );
}
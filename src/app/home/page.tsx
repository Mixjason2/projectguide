'use client'

import { useEffect, useState } from 'react'
import CssgGuide from '../cssguide'
import axios from "axios";

type Job = {
  key: number
  PNR: string
  PNRDate: string
  BSL_ID: string
  PickupDate: string
  Pickup: string
  DropoffDate: string
  Dropoff: string
  Source: string
  Pax: number
  isConfirmed: boolean
  isCancel: boolean
  NotAvailable: any
  Photo?: string
  Remark?: string
}

// Merge jobs by PNR, combine fields that are different into arrays
type MergedJob = {
  [K in keyof Omit<Job, 'key'>]: Job[K] | Job[K][]
} & { keys: number[] }

function mergeJobsByPNR(jobs: Job[]) {
  const map: Record<string, { merged: MergedJob, all: Job[] }> = {}
  for (const job of jobs) {
    if (!map[job.PNR]) {
      map[job.PNR] = { merged: { ...job, keys: [job.key] }, all: [job] }
    } else {
      map[job.PNR].merged.keys.push(job.key)
      map[job.PNR].all.push(job)
      // Merge fields: if different, make array of unique values
      for (const k of Object.keys(job) as (keyof Job)[]) {
        if (k === 'key' || k === 'Photo' || k === 'Remark') continue
        const prev = map[job.PNR].merged[k]
        const curr = job[k]
        if (Array.isArray(prev)) {
          if (!prev.includes(curr)) (prev as any[]).push(curr)
        } else if (prev !== curr) {
          (map[job.PNR].merged as any)[k] = [prev, curr].filter((v, i, arr) => arr.indexOf(v) === i)
        }
      }
    }
  }
  return Object.entries(map).map(([pnr, data]) => ({ ...data.merged, PNR: pnr, all: data.all }))
}

function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function getEndOfMonth() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1, 0); // set to last day of this month
  return d.toISOString().slice(0, 10);
}

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detailJobs, setDetailJobs] = useState<Job[] | null>(null)
  const [startDate, setStartDate] = useState<string>(getToday());
  const [endDate, setEndDate] = useState<string>(getEndOfMonth());
  const [page, setPage] = useState(1)
  const [uploadJob, setUploadJob] = useState<Job | null>(null)
  const [expandedPNRs, setExpandedPNRs] = useState<{ [pnr: string]: boolean }>({});


  const pageSize = 6

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    fetch('https://operation.dth.travel:7082/api/guide/job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: "AVM4UmVVMJuXWXzdOvGgaTqNm/Ysfkw0DnscAzbE+J4+Kr7AYjIs7Eu+7ZXBGs+MohOuqTTZkdIiJ5Iw8pQVJ0tWaz/R1sbE8ksM2sKYSTDKrKtQCYfZuq8IArzwBRQ3E1LIlS9Wb7X2G3mKkJ+8jCdb1fFy/76lXpHHWrI9tqt2/IXD20ZFYZ41PTB0tEsgp9VXZP8I5j+363SEnn5erg==",
        startdate: "2025-01-01",
        enddate: "2025-05-31",
      }),
    })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      .then((data: Job[]) => {
        console.log("API jobs:", data)
        setJobs(data)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, []);

  const filteredJobs = jobs.filter(job => {
    const pickup = job.PickupDate
    const dropoff = job.DropoffDate
    if (!startDate && !endDate) return true
    if (startDate && !endDate)
      return (pickup >= startDate || dropoff >= startDate)
    if (!startDate && endDate)
      return (pickup <= endDate || dropoff <= endDate)
    return (
      (pickup >= startDate && pickup <= endDate) ||
      (dropoff >= startDate && dropoff <= endDate)
    )
  })

  const mergedJobs = mergeJobsByPNR(filteredJobs)
  const totalPages = Math.ceil(mergedJobs.length / pageSize)
  const pagedJobs = mergedJobs.slice((page - 1) * pageSize, page * pageSize)

  // Helper to format date and time, keep only วัน/เดือน/ปี (YYYY-MM-DD)
  function formatDate(dateStr: string) {
    if (!dateStr) return ''
    const match = dateStr.match(/^\d{4}-\d{2}-\d{2}/)
    return match ? match[0] : dateStr
  }

  // Helper to combine Pickup + PickupDate, Dropoff + DropoffDate
  function renderPlaceDate(place: string, date: string, label: string) {
    if (!place && !date) return null
    return (
      <div>
        <span className="font-Arial">{label}:</span>{' '}
        {place ? place : ''}{place && date ? ' - ' : ''}{date ? formatDate(date) : ''}
      </div>
    )
  }

  // Helper to render value or array of values
  const renderField = (label: string, value: any) => {
    if (label === 'BSL ID' || label === 'Pickup' || label === 'PickupDate' || label === 'Dropoff' || label === 'DropoffDate') return null // Remove BSL ID and handled fields
    if (Array.isArray(value)) {
      return (
        <div>
          <span className="font-Arial">{label}:</span>
          <ul className="list-disc ml-6">
            {value.map((v, i) => (
              <li key={i}>{String(v)}</li>
            ))}
          </ul>
        </div>
      )
    }
    return (
      <div>
        <span className="font-Arial">{label}:</span> {String(value)}
      </div>
    )
  }

  // Render all job details for a PNR
  const renderAllDetails = (jobs: Job[]) => (
    <div className="max-h-[60vh] overflow-auto">
      {jobs.map((job, idx) => (
        <div key={job.key} className="mb-4 border-b border-blue-200 pb-2 last:border-b-0 last:pb-0">
          <div className="font-Arial  text-[#2D3E92] mb-1 underline underline-offset-4">
            PNR: {job.PNR}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {/* Pickup + PickupDate */}
            <div className="flex flex-wrap">
              <span className="font-Arial w-28 shrink-0">Pickup:</span>
              <span className="break-words ml-2">{job.Pickup}{job.Pickup && job.PickupDate ? ' - ' : ''}{job.PickupDate ? formatDate(job.PickupDate) : ''}</span>
            </div>
            {/* Dropoff + DropoffDate */}
            <div className="flex flex-wrap">
              <span className="font-semibold w-28 shrink-0">Dropoff:</span>
              <span className="break-words ml-2">{job.Dropoff}{job.Dropoff && job.DropoffDate ? ' - ' : ''}{job.DropoffDate ? formatDate(job.DropoffDate) : ''}</span>
            </div>
            {/* PNRDate */}
            <div className="flex flex-wrap">
              <span className="font-Arial w-28 shrink-0">PNRDate:</span>
              <span className="break-words ml-2">{formatDate(job.PNRDate)}</span>
            </div>
            {Object.entries(job)
              .filter(([k]) =>
                k !== "IsConfirmed" &&
                k !== "IsCancel" &&
                k !== "key" &&
                k !== "BSL_ID" &&
                k !== "Pickup" &&
                k !== "PickupDate" &&
                k !== "Dropoff" &&
                k !== "DropoffDate" &&
                k !== "PNRDate"
              )
              .map(([k, v]) => {
                // ถ้า key คือ serviceSupplierCode_TP หรือ serviceProductName ให้ตัดคำว่า "service" ออก
                let label = k;
                if (k === "serviceSupplierCode_TP") label = "SupplierCode_TP";
                if (k === "serviceProductName") label = "ProductName";
                if (k === "serviceTypeName") label = "TypeName";
                return (
                  <div key={k} className="flex flex-wrap">
                    <span className="font-Arial w-28 shrink-0">{label}:</span>
                    <span className="break-words ml-2">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  )

  // ปรับ summary เป็นแถวแนวนอน สวยงาม และวางไว้บนหัว card Jobs List
  const summary = (
    <div className="w-full flex justify-end mb-6">
      <div className="flex flex-row flex-wrap gap-6 bg-white border border-blue-300 rounded-xl shadow-lg px-8 py-4 items-center max-w-3xl">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-orange-400"></span>
          <span className="text-gray-500">All Jobs:</span>
          <span className="font-Arial text-[#2D3E92]">{filteredJobs.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Unique PNR:</span>
          <span className="font-Arial text-[#2D3E92]">{mergedJobs.length}</span>
        </div>
      </div>
    </div>
  )

  async function fetchJobs(token: string, startDate: string, endDate: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://operation.dth.travel:7082/api/guide/job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, startdate: startDate, enddate: endDate }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data: Job[] = await res.json();
      setJobs(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CssgGuide>
      <div className="flex flex-col items-center py-8 min-h-screen bg-base-200 relative bg-[#9EE4F6]">
        {/* Summary bar */}
        {summary}
        <div className="bg-[#F9FAFB] rounded-3xl shadow-lg border border-gray-300 w-full max-w-7xl p-6">
          <div className="p-4 w-full /* min-h-screen */ overflow-auto bg-[#F9FAFB]">
            <h1 className="text-2xl font-Arial mb-4">Jobs List</h1>
            {/* ปรับ UI ช่วงเลือกวันที่ */}
            <div className="mb-8 flex flex-col items-center">
              <div className="bg-base-100 border border-base-300 rounded-xl shadow-md px-6 py-4 flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl" style={{
                backgroundColor: '#E6F0FA',
                borderColor: '#2D3E92',
              }}>
                <div className="flex flex-col items-start w-full">
                  <label className="mb-1 text-xs text-gray-500 font-Arial" htmlFor="start-date">
                    Start date
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    max={endDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="Start date"
                  />
                </div>
                <span className="mx-2 mt-6 sm:mt-8 text-gray-400 font-Arial hidden sm:inline">to</span>
                <div className="flex flex-col items-start w-full">
                  <label className="mb-1 text-xs text-gray-500 font-Arial" htmlFor="end-date">
                    End date
                  </label>
                  <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="End date"
                  />
                </div>
              </div>
              <span className="mt-2 text-xs text-gray-400">
                Please select a date range to filter the desired tasks.
              </span>
            </div>
            {loading ? (
              <div className="p-4 ">Loading jobs...</div>
            ) : error ? (
              <div className="p-4 text-red-600">Error: {error}</div>
            ) : !pagedJobs.length ? (
              <div className="p-4">No jobs found</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pagedJobs.map((job: any) => {
                    const isExpanded = expandedPNRs[job.PNR] ?? false;

                    const toggleExpand = () => {
                      setExpandedPNRs(prev => ({
                        ...prev,
                        [job.PNR]: !isExpanded
                      }));
                    };

                    return (
                      <div
                        key={job.PNR}
                        className="relative bg-white border border-base-300 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col " style={{
                          backgroundColor: '#ffffff',
                          borderColor: '#9EE4F6',
                          borderWidth: '1px',
                        }}
                      >
                        {/* Show number of jobs in this PNR at top-left */}
                        <div className="absolute top-6 left-0 bg-blue-100 text-[#2D3E92] font-Arial rounded-full px-3 py-1 text-sm shadow z-10">
                          {job.all?.length ?? 1}
                        </div>

                        {/* Logo button */}
                        <button
                          className="absolute top-4 right-0 w-10 h-10 rounded-full bg-white border-2 border-[#2D3E92] shadow-[0_4px_10px_rgba(45,62,146,0.3)] hover:shadow-[0_6px_14px_rgba(45,62,146,0.4)] transition-all duration-200 flex items-center justify-center"
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



                        {/* PNR header (click to toggle) */}
                        <div
                          className="inline-block p-6 pb-0 cursor-pointer mx-auto"
                          onClick={toggleExpand}                        >
                          <h2
                            className="text-xl font-Arial mb-2 text-primary underline underline-offset-4"
                            style={{ color: '#2D3E92' }}
                          >
                            PNR: {job.PNR}
                            <span
                              className={`ml-2 text-sm px-2 py-1 rounded-full cursor-pointer transition-all duration-200 ${isExpanded ? 'bg-[#6A5ACD] text-white' : 'bg-[#2D3E92] text-white'
                                } hover:shadow-md`}
                            >
                              {isExpanded ? '▲' : '▼'}
                            </span>
                          </h2>
                        </div>

                        {/* Expanded content */}
                        {isExpanded && (
                          <div className="p-6 pt-0 flex-1 flex flex-col">
                            <div className="text-sm text-gray-600 space-y-1 mb-4">
                              {renderPlaceDate(job.Pickup, job.PickupDate, 'Pickup')}
                              {renderPlaceDate(job.Dropoff, job.DropoffDate, 'Dropoff')}
                              {renderField('Pax', job.Pax)}
                              {renderField('Source', job.Source)}
                            </div>

                            <div className="flex gap-3 mt-auto flex-wrap">
                              {/* Accept Button */}
                              <button
                                className="btn btn-success flex-1 text-base font-Arial py-2 rounded-full shadow  text-white bg-[#95c941] hover:opacity-90"
                                onClick={async () => {
                                  try {
                                    const token = localStorage.getItem("token") || "";
                                    const response = await axios.post(
                                      `https://operation.dth.travel:7082/api/guide/job/${job.key}/update`,
                                      {
                                        token: "AVM4UmVVMJuXWXzdOvGgaTqNm/Ysfkw0DnscAzbE+J4+Kr7AYjIs7Eu+7ZXBGs+MohOuqTTZkdIiJ5Iw8pQVJ0tWaz/R1sbE8ksM2sKYSTDKrKtQCYfZuq8IArzwBRQ3E1LIlS9Wb7X2G3mKkJ+8jCdb1fFy/76lXpHHWrI9tqt2/IXD20ZFYZ41PTB0tEsgp9VXZP8I5j+363SEnn5erg==",
                                        data: { isConfirmed: true }
                                      }
                                    );
                                    const result = response.data;
                                    if (result.success) {
                                      alert("Accept งานสำเร็จ");
                                    } else {
                                      alert("Accept งานไม่สำเร็จ: " + (result?.error || "Unknown error"));
                                    }
                                  } catch (e: any) {
                                    alert("เกิดข้อผิดพลาด: " + e.message);
                                  }
                                }}
                              >
                                Accept
                              </button>

                              {/* Reject Button */}
                              <button
                                className="btn flex-1 text-base font-Arial py-2 rounded-full shadow text-white bg-[#E44949] hover:opacity-90"

                                onClick={async () => {
                                  try {
                                    const token = localStorage.getItem("token") || "";
                                    const response = await axios.post(
                                      `https://operation.dth.travel:7082/api/guide/job/${job.key}/update`,
                                      {
                                        token: "AVM4UmVVMJuXWXzdOvGgaTqNm/Ysfkw0DnscAzbE+J4+Kr7AYjIs7Eu+7ZXBGs+MohOuqTTZkdIiJ5Iw8pQVJ0tWaz/R1sbE8ksM2sKYSTDKrKtQCYfZuq8IArzwBRQ3E1LIlS9Wb7X2G3mKkJ+8jCdb1fFy/76lXpHHWrI9tqt2/IXD20ZFYZ41PTB0tEsgp9VXZP8I5j+363SEnn5erg==",
                                        data: { isCancel: true }
                                      }
                                    );
                                    const result = response.data;
                                    if (result.success) {
                                      alert("Reject งานสำเร็จ");
                                    } else {
                                      alert("Reject งานไม่สำเร็จ: " + (result?.error || "Unknown error"));
                                    }
                                  } catch (e: any) {
                                    alert("เกิดข้อผิดพลาด: " + e.message);
                                  }
                                }}
                              >
                                Reject Job
                              </button>

                              {/* Upload Button */}
                              <button
                                className="btn btn-info btn-sm btn-circle"
                                onClick={() => setUploadJob(job)}
                                title="Upload Photo & Remark"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Pagination */}
                <div className="w-full flex justify-center mt-6">
                  <div className="inline-flex items-center gap-2 bg-base-100 border border-base-300 rounded-full shadow px-4 py-2">
                    <button
                      className="btn btn-outline btn-sm rounded-full min-w-[64px]"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Prev
                    </button>
                    <span className="px-2 py-1 font-Arial text-base-content">{page} <span className="text-gray-400">/</span> {totalPages}</span>
                    <button
                      className="btn btn-outline btn-sm rounded-full min-w-[64px]"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
                {/* All Details Modal */}
                {detailJobs && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl border-4 border-blue-400 p-8 max-w-2xl w-full relative animate-fade-in">
                      <button
                        className="absolute top-2 right-2 btn btn-sm btn-error"
                        onClick={() => setDetailJobs(null)}
                      >
                        ✕
                      </button>
                      <h2 className="text-xl font-Arial mb-4">All Job Details</h2>
                      {renderAllDetails(detailJobs)}
                    </div>
                  </div>
                )}
                {/* Modal สำหรับอัปโหลดรูปและเนื้อหา */}
                {uploadJob && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl border-4 border-blue-400 p-8 max-w-md w-full relative animate-fade-in">
                      <button
                        className="absolute top-2 right-2 btn btn-sm btn-error"
                        onClick={() => setUploadJob(null)}
                      >
                        ✕
                      </button>
                      <h2 className="text-xl font-Arial mb-4">Upload Photo & Remark</h2>
                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          // handle upload logic here
                          alert('Uploaded!');
                          setUploadJob(null);
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block font-Arial mb-1">Photo</label>
                          <input
                            type="file"
                            accept="image/*"
                            className="file-input file-input-bordered w-full"
                            onChange={e => {
                              // handle file select
                            }}
                          />
                        </div>
                        <div>
                          <label className="block font-Arial mb-1">Remark</label>
                          <textarea
                            className="textarea textarea-bordered w-full"
                            rows={3}
                            placeholder="Enter remark..."
                          // onChange={...}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => setUploadJob(null)}
                          >
                            Cancel
                          </button>
                          <button type="submit" className="btn btn-primary">
                            Upload
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </CssgGuide>
  )
}
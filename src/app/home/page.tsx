'use client';

import { ReactNode, useEffect, useState } from 'react';
import CssgGuide from '../cssguide';
import axios from 'axios';
import { Ripple } from 'react-spinners-css';
import { formatDate } from '@fullcalendar/core/index.js';
import { get } from 'http';


// 
type Job = {
  Driver: any;
  Vehicle: any;
  Guide: any;
  serviceSupplierName: string;
  Comment: any;
  pax_name: ReactNode;
  Class: any;
  Booking_Name: ReactNode;
  AdultQty: number;
  ChildQty: number;
  ChildShareQty: number;
  InfantQty: number;
  Phone: any;
  Booking_Consultant: ReactNode;
  TypeName: any;
  serviceTypeName: any;
  isChange: boolean;
  isNew: boolean;
  keys:number[];
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
    <div className="max-h-[60vh] overflow-auto text-xs"> {/* ลดขนาดตัวอักษรรวม */}
      {Object.values(groupedJobs).map(({ job, typeNames }, idx) => (
        <div
          key={job.key + "-" + idx}
          className="mb-3 border-b border-gray-200 pb-3 last:border-b-0" style={{
            borderBottom: "5px solid #000000", // Increased border width and changed color
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Add shadow effect
          }}
        >
          {/* PNR Header */}
          <div className="font-Arial text-sm bg-gray-100 p-3 shadow text-black mb-3 flex items-center gap-2">
            <span>PNR: {job.PNR}</span>
            {job.PNR && job.serviceSupplierName && (
              <span>/ SupplierName: {job.serviceSupplierName}</span>
            )}
          </div>
          {/* Details Section */}
          <div className="grid grid-cols-1 gap-y-2 text-xs"> {/* ลด gap */}
            <div className="flex items-start">
              <span className="font-bold text-gray-600 w-24 shrink-0">Comment:</span>
              <span className="text-gray-800 break-words">
                {job.Comment}
              </span>
            </div>

            {/* Pickup */}
            <div className="flex items-start">
              <span className="font-bold text-gray-600 w-24 shrink-0">Pickup:</span>
              <span className="text-gray-800 break-words">
                <span className="font-Arial">
                  {job.Pickup}
                  {job.Pickup && job.PickupDate ? " / " : ""}
                </span>
                <span className="font-Arial font-bold">
                  {job.PickupDate ? formatDate(job.PickupDate) : ""}
                </span>
              </span>
            </div>

            {/* Dropoff */}
            <div className="flex items-start">
              <span className="font-bold text-gray-600 w-24 shrink-0">Dropoff:</span>
              <span className="text-gray-800 break-words">
                {job.Dropoff}
                {job.Dropoff && job.DropoffDate ? " / " : ""}
                <span className="font-Arial font-bold">
                  {job.DropoffDate ? formatDate(job.DropoffDate) : ""}
                </span>
              </span>
            </div>

            {/* Booking Consultant */}
            <div className="flex items-start">
              <span className="font-bold text-gray-600 w-24 shrink-0">Consultant:</span>
              <span className="text-gray-800 break-words">
                {job.Booking_Consultant}
                {job.Booking_Consultant && job.Phone ? "," : ""}
                {job.Phone}
              </span>
            </div>

            {/* Booking Name */}
            <div className="flex items-start">
              <span className="font-bold text-gray-600 w-24 shrink-0">Booking Name:</span>
              <span className="text-gray-800 break-words">
                {[job.Booking_Name].filter(Boolean).join(", ")}
              </span>
            </div>

            {/* Client Name */}
            <div className="flex items-start">
              <span className="font-bold text-gray-600 w-24 shrink-0">Client Name:</span>
              <span className="text-gray-800 break-words">{job.pax_name}</span>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto mt-2">
              <table className="table-auto border text-xs w-full">
                <thead className="bg-[#2D3E92] text-white">
                  <tr>
                    <th className="px-1 py-1 text-left">Adult</th>
                    <th className="px-1 py-1 text-left">Child</th>
                    <th className="px-1 py-1 text-left">Share</th>
                    <th className="px-1 py-1 text-left">Infant</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-1 py-1 text-left">{job.AdultQty || 0}</td>
                    <td className="px-1 py-1 text-left">{job.ChildQty || 0}</td>
                    <td className="px-1 py-1 text-left">{job.ChildShareQty || 0}</td>
                    <td className="px-1 py-1 text-left">{job.InfantQty || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-start">
              <span className="font-bold text-gray-600 w-24 shrink-0">Guide:</span>
              <span className="text-gray-800 break-words">
                {[job.Guide, job.Vehicle, job.Driver].filter(Boolean).join(", ")}
              </span>
            </div>

            {/* Render Other Fields */}
            {Object.entries(job)
              .filter(([k]) =>
                ![
                  "IsConfirmed", "IsCancel", "key", "BSL_ID",
                  "Pickup", "PickupDate", "Dropoff", "DropoffDate", "PNRDate", "all",
                  "keys", "isNew", "isChange", "isDelete", "PNR", "NotAvailable",
                  "agentCode", "agentLogo", "serviceTypeName", "TypeName",
                  "SupplierCode_TP", "SupplierName_TP", "ProductName_TP", "ServiceLocationName",
                  "serviceSupplierCode_TP", "serviceProductName", "serviceSupplierName",
                  "ServiceLocationName_TP", "Source", "Phone", "Booking_Consultant",
                  "AdultQty", "ChildQty", "ChildShareQty", "InfantQty", "pax_name",
                  "Booking_Name", "Class", "Comment", "Guide", "Vehicle", "Driver"
                ].includes(k)
              )
              .map(([k, v]) => {
                let label = k;
                if (k === "serviceSupplierCode_TP") label = "SupplierCode_TP";
                if (k === "serviceProductName") label = "ProductName";
                if (k === "serviceSupplierName") label = "Supplier";
                if (k === "ServiceLocationName") label = "Location";
                if (k === "pax_name") label = "Client Name";
                return (
                  <div key={k} className="flex items-start">
                    <span className="font-bold text-gray-600 w-24 shrink-0">{label}:</span>
                    <span className="text-gray-800 break-words">
                      {typeof v === "object" ? JSON.stringify(v) : String(v)}
                    </span>
                  </div>
                );
              })}
          </div>

          {/* TypeName */}
          <div className="flex items-center mt-3">
            <span className="font-bold text-gray-600 w-24 shrink-0">TypeName:</span>
            <span className="text-gray-800 break-words">
              {[...new Set(typeNames)].join(", ")}
            </span>
          </div>
        </div>
      ))}
    </div>

  );
};

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailJobs, setDetailJobs] = useState<Job[] | null>(null);
  const [startDate, setStartDate] = useState<string>(getToday());
  const [endDate, setEndDate] = useState<string>(getEndOfMonth());
  const [page, setPage] = useState(1);
  const [expandedPNRs, setExpandedPNRs] = useState<{ [pnr: string]: boolean }>({});
  const [acceptedPNRs, setAcceptedPNRs] = useState<string[]>([]);
  const [rejectPNRs, setRejectPNRs] = useState<string[]>([]);
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
      console.log("Job data:", data);
      setJobs(data); // ✅ เซ็ตข้อมูลให้ state
    })
    .catch((err) => {
      console.error("Fetch error:", err);
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
  const totalPages = Math.ceil(mergedJobs.length / pageSize);
  const pagedJobs = mergedJobs.slice((page - 1) * pageSize, page * pageSize);

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
            {loading ? (
              <div className="w-full py-10 flex flex-col items-center justify-center text-gray-600">
                <Ripple color="#32cd32" size="medium" />
                <p className="mt-4 text-lg font-medium">Loading jobs, please wait...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-red-600 text-center bg-red-100 border border-red-300 rounded-md max-w-md mx-auto">
                <p className="text-lg font-semibold">Oops! Something went wrong.</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            ) : !filteredJobs.length ? (
              <div className="p-6 text-center text-gray-500">
                <p className="text-lg font-semibold">No jobs found</p>
                <p className="text-sm mt-1">Try adjusting your filters or search keyword.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pagedJobs.map((job) => (
                    <div key={job.PNR} className="relative bg-white border border-[#9EE4F6] rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                      <div className="absolute top-2 left-1 text-[#ffffff] font-Arial rounded-full px-3 py-1 text-sm shadow z-10" style={{ backgroundColor: job.isCancel ? '#ef4444' : job.isConfirmed ? '#22c55e' : job.isNew ? '#0891b2' : job.isChange ? '#fb923c' : '#E0E7FF' }}>
                        {job.all?.filter(j => j.Pickup !== job.Pickup || j.PickupDate !== job.PickupDate || j.Dropoff !== job.Dropoff || j.DropoffDate !== job.DropoffDate || j.PNRDate !== job.PNRDate).length + 1 || 1}
                      </div>
                      <button className="absolute top-3.5 right-2 w-8 h-8 rounded-full bg-white border-2 border-[#2D3E92] shadow-[0_4px_10px_rgba(45,62,146,0.3)] hover:shadow-[0_6px_14px_rgba(45,62,146,0.4)] transition-all duration-200 flex items-center justify-center" title="Show all details" onClick={() => setDetailJobs(job.all)} style={{ zIndex: 2 }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" fill="#F0F8FF" />
                          <text x="12" y="12" textAnchor="middle" dominantBaseline="central" fontSize="18" fill="#2D3E92" fontFamily="Arial" fontWeight="bold">i</text>
                        </svg>
                      </button>
                      <div className="inline-block p-6 pb-0 cursor-pointer mx-auto items-center gap-3" onClick={() => setExpandedPNRs(prev => ({ ...prev, [job.PNR]: !expandedPNRs[job.PNR] }))}>
                        <h2 className="font-Arial mt-0 mb-0 underline underline-offset-4" style={{ color: '#2D3E92', fontSize: '28px' }}>{job.PNR}</h2>
                      </div>
                      {expandedPNRs[job.PNR] && (
                        <div className="p-6 pt-0 flex-1 flex flex-col">
                          <div className="text-sm text-gray-600 space-y-1 mb-4">
                            {renderPlaceDate(
                              Array.isArray(job.Pickup) ? job.Pickup.join(', ') : job.Pickup,
                              Array.isArray(job.PickupDate) ? job.PickupDate.join(', ') : job.PickupDate,
                              'Pickup'
                            )}
                            {renderPlaceDate(
                              Array.isArray(job.Dropoff) ? job.Dropoff.join(', ') : job.Dropoff,
                              Array.isArray(job.DropoffDate) ? job.DropoffDate.join(', ') : job.DropoffDate,
                              'Dropoff'
                            )}
                            {renderField('Pax', job.Pax)}
                            {renderField('Source', job.Source)}
                          </div>
                          {jobs.filter(j => j.PNR === job.PNR && !job.keys.includes(j.key)).map(relatedJob => (
                            <div key={relatedJob.key} className="bg-gray-100 border border-gray-300 rounded p-3 mb-4 text-sm text-gray-700">
                              <div className="font-semibold text-gray-800 mb-1">Another PNR</div>
                              {renderPlaceDate(relatedJob.Pickup, relatedJob.PickupDate, 'Pickup')}
                              {renderPlaceDate(relatedJob.Dropoff, relatedJob.DropoffDate, 'Dropoff')}
                              {renderField('Pax', relatedJob.Pax)}
                              {renderField('Source', relatedJob.Source)}
                            </div>
                          ))}
                          <div className="relative border rounded-xl p-4 shadow bg-white">
                            {/* ปุ่ม Accept/Reject */}
                            {!(acceptedPNRs.includes(job.PNR) || rejectPNRs.includes(job.PNR) || job.isConfirmed || job.isCancel) && (
                                <div className="flex gap-3">
                                  <button
                                    className="btn flex-1 py-2 rounded-full shadow text-white bg-[#95c941] hover:opacity-90"
                                    onClick={async () => {
                                      try {
                                        const token = localStorage.getItem("token") || "";
                                        const response = await axios.post(
                                          `https://operation.dth.travel:7082/api/guide/job/${job.keys}/update`,
                                          {
                                            token,
                                            data: { isConfirmed: true, isCancel: false },
                                          }
                                        );
                                        const result = response.data;
                                        if (result.success) {
                                          alert("Accept งานสำเร็จ");
                                          setAcceptedPNRs(prev =>
                                            !prev.includes(job.PNR) ? [...prev, job.PNR] : prev
                                          );
                                          setRejectPNRs(prev => prev.filter(pnr => pnr !== job.PNR));
                                          setJobs(prevJobs =>
                                            prevJobs.map(j =>
                                              job.keys.includes(j.key)
                                                ? { ...j, isConfirmed: true, isCancel: false }
                                                : j
                                            )
                                          );
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

                                  <button
                                    className="btn flex-1 py-2 rounded-full shadow text-white bg-[#ef4444] hover:opacity-90"
                                    onClick={async () => {
                                      try {
                                        const token = localStorage.getItem("token") || "";
                                        const response = await axios.post(
                                          `https://operation.dth.travel:7082/api/guide/job/${job.keys}/update`,
                                          {
                                            token,
                                            data: { isCancel: true, isConfirmed: false },
                                          }
                                        );
                                        const result = response.data;
                                        if (result.success) {
                                          alert("Cancel งานสำเร็จ");
                                          setRejectPNRs(prev =>
                                            !prev.includes(job.PNR) ? [...prev, job.PNR] : prev
                                          );
                                          setAcceptedPNRs(prev => prev.filter(pnr => pnr !== job.PNR));
                                          setJobs(prevJobs =>
                                            prevJobs.map(j =>
                                              job.keys.includes(j.key)
                                                ? { ...j, isCancel: true, isConfirmed: false }
                                                : j
                                            )
                                          );
                                        } else {
                                          alert("Cancel งานไม่สำเร็จ: " + (result?.error || "Unknown error"));
                                        }
                                      } catch (e: any) {
                                        alert("เกิดข้อผิดพลาด: " + e.message);
                                      }
                                    }}
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}

                            {/* ปุ่ม Upload หลัง Accept แล้ว */}
                            {(acceptedPNRs.includes(job.PNR) || job.isConfirmed) && (
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[80%]">
                                <input
                                  type="file"
                                  multiple
                                  onChange={async (e) => {
                                    const files = e.target.files;
                                    if (files && files.length > 0) {
                                      const token = localStorage.getItem("token") || "";
                                      const imagePromises = Array.from(files).map(
                                        (file) =>
                                          new Promise<{ ImageBase64: string }>((resolve, reject) => {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                              resolve({ ImageBase64: reader.result as string });
                                            };
                                            reader.onerror = reject;
                                            reader.readAsDataURL(file);
                                          })
                                      );

                                      try {
                                        const images = await Promise.all(imagePromises);
                                        const response = await axios.post(
                                          'https://operation.dth.travel:7082/api/upload',
                                          {
                                            token,
                                            data: {
                                              key: job.keys, // ใช้ job.key แทนเลข 2588 ที่ fix ไว้
                                              Remark: "แนบไฟล์หลายรูป",
                                              Images: images,
                                            },
                                          },
                                          {
                                            headers: { 'Content-Type': 'application/json' },
                                          }
                                        );

                                        if (response.data.success) {
                                          alert("อัปโหลดสำเร็จ ID: " + response.data.id);
                                        } else {
                                          alert("Error: " + (response.data.error || "Unknown error"));
                                        }
                                      } catch (error: any) {
                                        alert("เกิดข้อผิดพลาด: " + error.message);
                                      }
                                    }
                                  }}
                                  accept="image/*,application/pdf"
                                  className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                              </div>
                            )}

                          </div>

                        </div>
                      )}
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
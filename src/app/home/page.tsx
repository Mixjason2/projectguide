'use client'

import { ReactNode, useEffect, useState } from 'react'
import CssgGuide from '../cssguide'
import axios from "axios";
import { Ripple } from 'react-spinners-css';
type Job = {
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detailJobs, setDetailJobs] = useState<Job[] | null>(null)
  const [startDate, setStartDate] = useState<string>(getToday());
  const [endDate, setEndDate] = useState<string>(getEndOfMonth());
  const [page, setPage] = useState(1)
  const [uploadJob, setUploadJob] = useState<Job | null>(null)
  const [expandedPNRs, setExpandedPNRs] = useState<{ [pnr: string]: boolean }>({});
  const [acceptedPNRs, setAcceptedPNRs] = useState<string[]>([]);
  const [rejectPNRs, setrejectPNRs] = useState<string[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  const pageSize = 6

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    setLoading(true); // ตั้งค่า loading เป็น true ก่อนเริ่ม fetch
    fetch('https://operation.dth.travel:7082/api/guide/job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: "yMaEinVpfboebobeC8x5fsVRXjKf4Gw2xrpnVaNpIyv8YaCuVFaqsyjnDdWt66IpXm8LNYpPcWnTNf0uF0VbfcKMfY7HdatLCHNLw3f8kQtk/qTyUEcIkQTzUG45tLh+lVMJc++IZ9eoCi/NFpd4iTyhYWUaB1RC+Ef7nwNJ6zY=",
        startdate: "2025-05-01",
        enddate: "2025-05-31",
      }),
    })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data: Job[]) => {
        console.log("API jobs:", data);
        setJobs(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false)); // ตั้งค่า loading เป็น false หลังจาก fetch เสร็จ
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
  function formatDate(dateStr: any) {
    if (!dateStr) return '';
    if (typeof dateStr !== 'string') {
      // ถ้าไม่ใช่ string แปลงเป็น string ก่อน
      dateStr = String(dateStr);
    }
    const match = dateStr.match(/^\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : dateStr;
  }

  // Helper to combine Pickup + PickupDate, Dropoff + DropoffDate
  function renderPlaceDate(place: string, date: string, label: string) {
    if (!place && !date) return null
    return (
      <div>
        <span className="font-Arial font-semibold">{label}:</span>{' '}
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
          <span className="font-Arial font-semibold">{label}:</span>
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
        <span className="font-Arial font-semibold">{label}:</span> {String(value)}
      </div>
    )
  }


  // Render all job details for a PNR
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
      <div className="max-h-[60vh] overflow-auto">
        {Object.values(groupedJobs).map(({ job, typeNames }, idx) => (
          <div
            key={job.key + "-" + idx}
            className="mb-4 border-b border-gray-200 pb-4 last:border-b-0"
          >
            {/* PNR Header */}
            <div className="font-Arial text-[#2D3E92] mb-2 underline underline-offset-4">
              PNR: {job.PNR}
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm">
              {/* Pickup + PickupDate */}
              <div className="flex items-center">
                <span className="font-bold text-gray-600 w-28 shrink-0">Pickup:</span>
                <span className="text-gray-800">
                  {job.Pickup}
                  {job.Pickup && job.PickupDate ? " - " : ""}
                  {job.PickupDate ? formatDate(job.PickupDate) : ""}
                </span>
              </div>

              {/* Dropoff + DropoffDate */}
              <div className="flex items-center">
                <span className="font-bold text-gray-600 w-28 shrink-0">Dropoff:</span>
                <span className="text-gray-800">
                  {job.Dropoff}
                  {job.Dropoff && job.DropoffDate ? " - " : ""}
                  {job.DropoffDate ? formatDate(job.DropoffDate) : ""}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-gray-600 w-28 shrink-0">Booking_Consultant:</span>
                <span className="text-gray-800">
                  {job.Booking_Consultant}
                  {job.Booking_Consultant && job.Phone ? "," : ""}
                  {job.Phone}
                </span>
              </div>

              {/* Render Other Fields */}
              {Object.entries(job)
                .filter(([k]) =>
                  ![
                    "IsConfirmed",
                    "IsCancel",
                    "key",
                    "BSL_ID",
                    "Pickup",
                    "PickupDate",
                    "Dropoff",
                    "DropoffDate",
                    "PNRDate",
                    "all",
                    "keys",
                    "isNew",
                    "isChange",
                    "isDelete",
                    "PNR",
                    "NotAvailable",
                    "agentCode",
                    "agentLogo",
                    "serviceTypeName",
                    "TypeName",
                    "SupplierCode_TP",
                    "SupplierName_TP",
                    "ProductName_TP",
                    "ServiceLocationName",
                    "serviceSupplierCode_TP",
                    "serviceProductName",
                    "serviceSupplierName",
                    "ServiceLocationName_TP",
                    "Source",
                    "Phone",
                    "Booking_Consultant",
                    "AdultQty",
                    "ChildQty",
                    "ChildShareQty",
                    "InfantQty",
                  ].includes(k)
                )
                .map(([k, v]) => {
                  let label = k;
                  if (k === "serviceSupplierCode_TP") label = "SupplierCode_TP";
                  if (k === "serviceProductName") label = "ProductName";
                  if (k === "serviceSupplierName") label = "Supplier";
                  if (k === "ServiceLocationName") label = "Location";
                  return (
                    <div key={k} className="flex items-center">
                      <span className="font-bold text-gray-600 w-28 shrink-0">{label}:</span>
                      <span className="text-gray-800">
                        {typeof v === "object" ? JSON.stringify(v) : String(v)}
                      </span>
                    </div>
                  );
                })}
            </div>

            {/* Show Merged TypeNames */}
            <div className="flex items-center mt-4">
              <span className="font-bold text-gray-600 w-28 shrink-0">TypeName:</span>
              <span className="text-gray-800">{[...new Set(typeNames)].join(", ")}</span>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto mt-4">
              <table className="table-auto min-w-full border text-sm">
                <thead className="bg-[#2D3E92] text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">AdultQty</th>
                    <th className="px-3 py-2 text-left">ChildQty</th>
                    <th className="px-3 py-2 text-left">ChildShareQty</th>
                    <th className="px-3 py-2 text-left">InfantQty</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2 text-left">{job.AdultQty || 0}</td>
                    <td className="px-3 py-2 text-left">{job.ChildQty || 0}</td>
                    <td className="px-3 py-2 text-left">{job.ChildShareQty || 0}</td>
                    <td className="px-3 py-2 text-left">{job.InfantQty || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ปรับ summary เป็นแถวแนวนอน สวยงาม และวางไว้บนหัว card Jobs List
  const summary = (
    <div className="w-full flex justify-end mb-6">
      <div className="flex flex-row flex-wrap gap-6 bg-white border border-blue-300 rounded-xl shadow-lg px-8 py-4 items-center max-w-3xl">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-gray-400"></span>
          <span className="text-gray-500">All Jobs:</span>
          <span className="font-Arial text-[#2D3E92]">{filteredJobs.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-cyan-600"></span>
          <span className="text-gray-500">New Jobs:</span>
          <span className="font-Arial text-[#2D3E92]">
            {filteredJobs.filter(job => job.isNew === true).length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-orange-400"></span>
          <span className="text-gray-500">Changed Jobs:</span>
          <span className="font-Arial text-[#2D3E92]">
            {filteredJobs.filter(job => job.isChange === true).length}
          </span>
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
            <div className="mb-6 flex flex-col items-center w-full px-4">
              <div
                className="w-full rounded-xl shadow-md px-4 py-4 flex flex-row items-end justify-between gap-2"
                style={{
                  backgroundColor: '#E6F0FA',
                  border: '1px solid #2D3E92',
                }}
              >
                {/* Start Date */}
                <div className="flex flex-col w-[48%]">
                  <label htmlFor="start-date" className="mb-1 text-xs text-gray-500 font-Arial">
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

                {/* End Date */}
                <div className="flex flex-col w-[48%]">
                  <label htmlFor="end-date" className="mb-1 text-xs text-gray-500 font-Arial">
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

              <span className="mt-2 text-xs text-gray-400 text-center px-2">
                Please select a date range to filter the desired tasks.
              </span>
            </div>
            {loading ? (
              <div className="w-full py-10 flex flex-col items-center justify-center text-gray-600">
                <Ripple color="#32cd32" size="medium" text="" textColor="" />
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
                        className="relative bg-white border border-[#9EE4F6] border-[1px] rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                      >

                        {/* Show number of jobs in this PNR at top-left */}
                        <div
                          className="absolute top-2 left-1 text-[#ffffff] font-Arial rounded-full px-3 py-1 text-sm shadow z-10"
                          style={{
                            backgroundColor: job.isNew
                              ? '#0891b2'
                              : job.isChange
                                ? '#fb923c'
                                : '#E0E7FF',
                          }}
                        >
                          {job.all
                            ? job.all.filter((j: { Pickup: any; PickupDate: any; Dropoff: any; DropoffDate: any; PNRDate: any; }) =>
                              j.Pickup !== job.Pickup ||
                              j.PickupDate !== job.PickupDate ||
                              j.Dropoff !== job.Dropoff ||
                              j.DropoffDate !== job.DropoffDate ||
                              j.PNRDate !== job.PNRDate
                            ).length + 1 // รวม job หลักด้วย
                            : 1}
                        </div>
                        {/* Logo button */}
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
                        {/* PNR header (click to toggle) */}
                        <div
                          className="inline-block p-6 pb-0 cursor-pointer mx-auto items-center gap-3"
                          onClick={toggleExpand}
                        >
                          {/* Status indicator circles */}
                          <h2
                            className="font-Arial mt-0 mb-0 underline underline-offset-4"
                            style={{ color: '#2D3E92', fontSize: '28px' }}
                          >
                            {job.PNR}
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

                            {/* รายการอื่นที่มี PNR เดียวกัน */}
                            {jobs
                              .filter(j => j.PNR === job.PNR && j.key !== job.key)
                              .filter(j =>
                                j.Pickup !== job.Pickup ||
                                j.PickupDate !== job.PickupDate ||
                                j.Dropoff !== job.Dropoff ||
                                j.DropoffDate !== job.DropoffDate ||
                                j.Pax !== job.Pax ||
                                j.Source !== job.Source
                              )
                              .map(relatedJob => (
                                <div
                                  key={relatedJob.key}
                                  className="bg-gray-100 border border-gray-300 rounded p-3 mb-4 text-sm text-gray-700"
                                >
                                  <div className="font-semibold text-gray-800 mb-1">
                                    Another PNR
                                  </div>
                                  {renderPlaceDate(relatedJob.Pickup, relatedJob.PickupDate, 'Pickup')}
                                  {renderPlaceDate(relatedJob.Dropoff, relatedJob.DropoffDate, 'Dropoff')}
                                  {renderField('Pax', relatedJob.Pax)}
                                  {renderField('Source', relatedJob.Source)}
                                </div>
                              ))}


                            {!acceptedPNRs.includes(job.PNR) && !rejectPNRs.includes(job.PNR) && (
                              <div className="flex gap-3 mt-auto flex-wrap">
                                {/* Accept Button */}
                                <button
                                  className="btn btn-success flex-1 text-base font-Arial py-2 rounded-full shadow text-white bg-[#95c941] hover:opacity-90"
                                  onClick={async () => {
                                    try {
                                      const token = localStorage.getItem("token") || "";
                                      const response = await axios.post(
                                        `https://operation.dth.travel:7082/api/guide/job/${job.key}/update`,
                                        {
                                          token:
                                            "AVM4UmVVMJuXWXzdOvGgaTqNm/Ysfkw0DnscAzbE+J4+Kr7AYjIs7Eu+7ZXBGs+MohOuqTTZkdIiJ5Iw8pQVJ0tWaz/R1sbE8ksM2sKYSTDKrKtQCYfZuq8IArzwBRQ3E1LIlS9Wb7X2G3mKkJ+8jCdb1fFy/76lXpHHWrI9tqt2/IXD20ZFYZ41PTB0tEsgp9VXZP8I5j+363SEnn5erg==",
                                          data: { isConfirmed: true },
                                        }
                                      );
                                      const result = response.data;
                                      if (result.success) {
                                        alert("Accept งานสำเร็จ");

                                        setAcceptedPNRs(prev => [...prev, job.PNR]);

                                        setJobs(prevJobs => {
                                          const remaining = prevJobs.filter(j => j.key !== job.key);
                                          return [job, ...remaining];
                                        });

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
                                        alert("แจ้งยกเลิกงานสำเร็จ กรุณารอหลังบ้านส่งอีเมลยืนยันสักครู่");
                                        // เพิ่มตรงนี้เพื่อให้ปุ่มหายเหมือน Accept
                                        setrejectPNRs(prev => [...prev, job.PNR]);
                                        setJobs(prevJobs => {
                                          const remaining = prevJobs.filter(j => j.key !== job.key);
                                          return [job, ...remaining];
                                        });

                                      } else {
                                        alert("แจ้งยกเลิกงานไม่สำเร็จ: " + (result?.error || "Unknown error"));
                                      }
                                    } catch (e: any) {
                                      alert("เกิดข้อผิดพลาด: " + e.message);
                                    }
                                  }}
                                >
                                  Reject Job
                                </button>

                              </div>
                            )}
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
              </>
            )}
          </div>
        </div>
      </div>
    </CssgGuide>
  )
}
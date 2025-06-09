'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CssgGuide from '../cssguide'

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
  IsConfirmed: boolean
  IsCancel: boolean
  NotAvailable: any
  Photo?: string
  Remark?: string
}

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detailJob, setDetailJob] = useState<Job | null>(null)
  const [startDate, setStartDate] = useState<string>('2025-01-01')
  const [endDate, setEndDate] = useState<string>('2025-01-31')
  const [page, setPage] = useState(1)

  const pageSize = 6
  const totalPages = Math.ceil(jobs.length / pageSize)

  useEffect(() => {
    setLoading(true)
    // Mock ข้อมูล 10 รายการ
    const mockJobs: Job[] = Array.from({ length: 10 }).map((_, i) => ({
      key: i + 1,
      PNR: `PNR${i + 1}`,
      PNRDate: `2025-01-${String(i + 1).padStart(2, '0')}`,
      BSL_ID: `BSL${i + 1}`,
      PickupDate: `2025-01-${String(i + 1).padStart(2, '0')}`,
      Pickup: `Pickup${i + 1}`,
      DropoffDate: `2025-01-${String(i + 2).padStart(2, '0')}`,
      Dropoff: `Dropoff${i + 1}`,
      Source: `Source${i + 1}`,
      Pax: Math.floor(Math.random() * 5) + 1,
      IsConfirmed: i % 2 === 0,
      IsCancel: i % 3 === 0,
      NotAvailable: null,
      Photo: "",
      Remark: ""
    }))
    setTimeout(() => {
      setJobs(mockJobs)
      setLoading(false)
    }, 500)
  }, [])

  const columns = jobs.length > 0
    ? [
      ...Object.keys(jobs[0]).filter(k => k !== 'Photo' && k !== 'Remark'),
      'Photo',
      'Remark'
    ]
    : ['Photo', 'Remark']

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

  const pagedJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize)

  const handlePhotoChange = (jobKey: number, file: File | null) => {
    if (!file) return
    setJobs(prev =>
      prev.map(job =>
        job.key === jobKey ? { ...job, Photo: URL.createObjectURL(file) } : job
      )
    )
  }

  const handleRemarkChange = (jobKey: number, remark: string) => {
    setJobs(prev =>
      prev.map(job =>
        job.key === jobKey ? { ...job, Remark: remark } : job
      )
    )
  }

  const sendRemark = (jobKey: number, remark: string) => {
    alert(`ส่ง Remark "${remark}" สำหรับ job #${jobKey} (mock)`)
  }

  const closeDetail = () => setDetailJob(null)

  return (
    <CssgGuide>
      <div className="flex justify-center items-start py-8 min-h-screen bg-base-200">
        <div className="bg-base-100 rounded-xl shadow-xl border border-base-300 w-full max-w-full p-0">
          <div className="p-4 w-full min-h-screen overflow-auto">
            <h1 className="text-2xl font-bold mb-4">Jobs List</h1>
            {/* ปรับ UI ช่วงเลือกวันที่ */}
            <div className="mb-8 flex flex-col items-center">
              <div className="bg-base-100 border border-base-300 rounded-xl shadow-md px-6 py-4 flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl">
                <div className="flex flex-col items-start w-full">
                  <label className="mb-1 text-xs text-gray-500 font-semibold" htmlFor="start-date">
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
                <span className="mx-2 mt-6 sm:mt-8 text-gray-400 font-semibold hidden sm:inline">to</span>
                <div className="flex flex-col items-start w-full">
                  <label className="mb-1 text-xs text-gray-500 font-semibold" htmlFor="end-date">
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
            ) : !jobs.length ? (
              <div className="p-4">No jobs found</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pagedJobs.map(job => (
                    <div key={job.key} className="relative bg-white border border-base-300 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                      {/* Detail Icon */}
                      <button
                        className="btn btn-ghost btn-circle absolute top-4 right-4"
                        title="Detail"
                        onClick={() => setDetailJob(job)}
                        style={{ zIndex: 2 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-8 h-8 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5-9 9-9 9s-9-4-9-9a9 9 0 1118 0z"
                          />
                        </svg>
                      </button>
                      <div className="p-6 flex-1 flex flex-col">
                        <h2 className="text-xl font-bold mb-2 text-primary">Job #{job.key}</h2>
                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                          <div><span className="font-semibold">PNR:</span> {job.PNR}</div>
                          <div><span className="font-semibold">Pickup:</span> {job.Pickup} <span className="text-xs text-gray-400">({job.PickupDate})</span></div>
                          <div><span className="font-semibold">Dropoff:</span> {job.Dropoff} <span className="text-xs text-gray-400">({job.DropoffDate})</span></div>
                          <div><span className="font-semibold">Pax:</span> {job.Pax}</div>
                          <div><span className="font-semibold">BSL ID:</span> {job.BSL_ID}</div>
                          <div><span className="font-semibold">Source:</span> {job.Source}</div>
                          {/* เพิ่มข้อมูลอื่นๆ ที่ต้องการแสดงแทน Status ได้ที่นี่ */}
                        </div>
                        <div className="flex gap-3 mt-auto">
                          <button
                            className="btn btn-success flex-1 text-base font-bold py-2 rounded-full shadow"
                            onClick={() => alert(`Accepted job #${job.key}`)}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-error flex-1 text-base font-bold py-2 rounded-full shadow"
                            onClick={() => alert(`Rejected job #${job.key}`)}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination */}
                <div className="flex justify-center mt-6 gap-2">
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Prev
                  </button>
                  <span className="px-2 py-1">{page} / {totalPages}</span>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
                {/* Detail Modal */}
                {detailJob && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
                      <button
                        className="absolute top-2 right-2 btn btn-sm btn-error"
                        onClick={closeDetail}
                      >
                        ✕
                      </button>
                      <h2 className="text-xl font-bold mb-4">Job Detail</h2>
                      <div className="space-y-2 mb-4">
                        {Object.entries(detailJob)
                          .filter(([k]) => k !== "IsConfirmed" && k !== "IsCancel")
                          .map(([k, v]) => (
                            <div key={k} className="flex">
                              <span className="font-semibold w-40">{k}:</span>
                              <span className="break-all">
                                {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                              </span>
                            </div>
                        ))}
                      </div>
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
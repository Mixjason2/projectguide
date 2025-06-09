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
  const [page, setPage] = useState(1)
  const pageSize = 5

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

  const [startDate, setStartDate] = useState<string>('2025-01-01')
  const [endDate, setEndDate] = useState<string>('2025-01-31')

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

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / pageSize)
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
      <div className="overflow-x-auto flex justify-center py-8">
        <div className="bg-base-100 rounded-xl shadow-xl border border-base-300 w-full max-w-5xl">
          <div className="p-4 w-full min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Jobs List</h1>
            <div className="mb-4 flex gap-2 items-center">
              <input
                type="date"
                value={startDate}
                max={endDate}
                onChange={e => setStartDate(e.target.value)}
                className="input input-bordered"
                placeholder="Start date"
              />
              <span className="mx-2">to</span>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={e => setEndDate(e.target.value)}
                className="input input-bordered"
                placeholder="End date"
              />
            </div>
            {loading ? (
              <div className="p-4 ">Loading jobs...</div>
            ) : error ? (
              <div className="p-4 text-red-600">Error: {error}</div>
            ) : !pagedJobs.length ? (
              <div className="p-4">No jobs found</div>
            ) : (
              <>
                <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                  <table className="table table-zebra table-bordered table-auto divide-y divide-base-300">
                    <thead className="divide-y divide-base-300">
                      <tr>
                        <th className="border border-base-300 whitespace-nowrap px-8 py-4 bg-base-200 text-lg font-semibold text-gray-700">
                          Detail
                        </th>
                        {columns.map(key => (
                          <th
                            key={key}
                            className="border border-base-300 whitespace-nowrap px-8 py-4 bg-base-200 text-lg font-semibold text-gray-700"
                          >
                            {key}
                          </th>
                        ))}
                        <th className="border border-base-300 whitespace-nowrap px-8 py-4 bg-base-200 text-lg font-semibold text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-base-300">
                      {pagedJobs.map(job => (
                        <tr key={job.key} className="divide-x divide-base-300">
                          {/* Detail button */}
                          <td className="border border-base-300 whitespace-nowrap px-8 py-4 text-base">
                            <button
                              className="btn btn-sm font-bold flex items-center gap-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white border-2 border-blue-600 shadow-lg rounded-lg px-4 py-2 hover:from-blue-500 hover:to-blue-700 hover:scale-105 transition"
                              onClick={() => setDetailJob(job)}
                              style={{ boxShadow: '0 4px 16px 0 rgba(59,130,246,0.15)' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Detail
                            </button>
                          </td>
                          {columns.map(key =>
                            key === 'Photo' ? (
                              <td
                                key={key}
                                className="border border-base-300 whitespace-nowrap px-8 py-4 text-base"
                              >
                                {job.Photo ? (
                                  <img
                                    src={job.Photo}
                                    alt="Job Photo"
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                ) : (
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e =>
                                      handlePhotoChange(
                                        job.key,
                                        e.target.files ? e.target.files[0] : null
                                      )
                                    }
                                  />
                                )}
                              </td>
                            ) : key === 'Remark' ? (
                              <td
                                key={key}
                                className="border border-base-300 whitespace-nowrap px-8 py-4 text-base"
                              >
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="text"
                                    value={job.Remark ?? ''}
                                    onChange={e =>
                                      handleRemarkChange(job.key, e.target.value)
                                    }
                                    className="input input-bordered"
                                    placeholder="Remark"
                                  />
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => sendRemark(job.key, job.Remark ?? '')}
                                  >
                                    Send
                                  </button>
                                </div>
                              </td>
                            ) : key === 'NotAvailable' ? (
                              <td
                                key={key}
                                className="border border-base-300 whitespace-nowrap px-8 py-4 text-base"
                              >
                                {typeof job.NotAvailable === 'object'
                                  ? JSON.stringify(job.NotAvailable)
                                  : String(job.NotAvailable ?? '')}
                              </td>
                            ) : (
                              <td
                                key={key}
                                className="border border-base-300 whitespace-nowrap px-8 py-4 text-base"
                              >
                                {String(job[key as keyof Job] ?? '')}
                              </td>
                            )
                          )}
                          <td className="border border-base-300 whitespace-nowrap px-8 py-4 text-base">
                            <div className="flex gap-2">
                              <button
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                onClick={() => alert(`Accepted job #${job.key}`)}
                              >
                                Accept
                              </button>
                              <button
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                onClick={() => alert(`Rejected job #${job.key}`)}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                <div className="flex justify-center items-center gap-4 mt-4">
                  <button
                    className="btn btn-sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="btn btn-sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>
                {/* Detail Modal */}
                {detailJob && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl border-4 border-blue-400 p-8 max-w-lg w-full relative animate-fade-in">
                      <button
                        className="absolute top-2 right-2 btn btn-sm btn-error"
                        onClick={closeDetail}
                      >
                        ✕
                      </button>
                      <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        Job Detail
                      </h2>
                      <div className="space-y-3 mb-6 border-2 border-blue-200 rounded-lg bg-blue-50 p-4 shadow-inner">
                        {Object.entries(detailJob).map(([k, v]) => (
                          <div key={k} className="flex items-center">
                            <span className="font-semibold w-40 text-gray-700">{k}:</span>
                            <span className="break-all text-gray-900 bg-white rounded px-2 py-1 border border-blue-100 ml-2">
                              {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-4 justify-end">
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                          onClick={() => {
                            alert(`Accepted job #${detailJob.key}`)
                            closeDetail()
                          }}
                        >
                          Accept
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                          onClick={() => {
                            alert(`Rejected job #${detailJob.key}`)
                            closeDetail()
                          }}
                        >
                          Reject
                        </button>
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
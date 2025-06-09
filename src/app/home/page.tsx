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

<<<<<<< HEAD
<<<<<<< HEAD
  // Set your default start and end date here (YYYY-MM-DD)
  const defaultStart = '2025-01-01'   // <-- change as needed
  const defaultEnd = '2025-01-31'     // <-- change as needed

  const [startDate, setStartDate] = useState<string>(defaultStart)
  const [endDate, setEndDate] = useState<string>(defaultEnd)
  const [page, setPage] = useState(1)

  const router = useRouter()

=======
  // เพิ่ม: mock ข้อมูล 10 รายการ ถ้า API จริงยังไม่มี
>>>>>>> 15e2377c3894cc6eaac4b774e66972ba080ebd38
=======
>>>>>>> d03e2452a8b85048074bbda95d3b9cabb9b1e9aa
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

<<<<<<< HEAD
  // Pagination
  const pageSize = 6
  const totalPages = Math.ceil(filteredJobs.length / pageSize)
  const pagedJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize)

  // Handle photo upload (optional, for demo only, not persistent)
=======
>>>>>>> 15e2377c3894cc6eaac4b774e66972ba080ebd38
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
            ) : !jobs.length ? (
              <div className="p-4">No jobs found</div>
            ) : (
<<<<<<< HEAD
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pagedJobs.map(job => (
                    <div key={job.key} className="card bg-base-200 shadow-md border border-base-300">
                      <div className="card-body">
                        <h2 className="card-title">Job #{job.key}</h2>
                        <div className="text-sm">
                          <div><b>PNR:</b> {job.PNR}</div>
                          <div><b>Pickup:</b> {job.Pickup} ({job.PickupDate})</div>
                          <div><b>Dropoff:</b> {job.Dropoff} ({job.DropoffDate})</div>
                          <div><b>Pax:</b> {job.Pax}</div>
                          <div><b>Confirmed:</b> {job.IsConfirmed ? "Yes" : "No"}</div>
                          <div><b>Cancel:</b> {job.IsCancel ? "Yes" : "No"}</div>
                          {/* เพิ่ม field อื่นๆ ตามต้องการ */}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => alert(`Accepted job #${job.key}`)}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-error btn-sm"
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
              </>
=======
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-300">
                    {filteredJobs.map(job => (
                      <tr key={job.key} className="divide-x divide-base-300">
                        {/* Detail button */}
                        <td className="border border-base-300 whitespace-nowrap px-8 py-4 text-base">
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => setDetailJob(job)}
                          >
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
                        {Object.entries(detailJob).map(([k, v]) => (
                          <div key={k} className="flex">
                            <span className="font-semibold w-40">{k}:</span>
                            <span className="break-all">
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
              </div>
>>>>>>> 15e2377c3894cc6eaac4b774e66972ba080ebd38
            )}
          </div>
        </div>
      </div>
    </CssgGuide>
  )
}
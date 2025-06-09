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
  Photo?: string // Add Photo field (URL or file name)
  Remark?: string // Add Remark field
}

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Set your default start and end date here (YYYY-MM-DD)
  const defaultStart = '2025-01-01'   // <-- change as needed
  const defaultEnd = '2025-01-31'     // <-- change as needed

  const [startDate, setStartDate] = useState<string>(defaultStart)
  const [endDate, setEndDate] = useState<string>(defaultEnd)
  const [page, setPage] = useState(1)

  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    fetch('/api/guide/job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token:
          'AVM4UmVVMJuXWXzdOvGgaTqNm/Ysfkw0DnscAzbE+J4+Kr7AYjIs7Eu+7ZXBGs+MohOuqTTZkdIiJ5Iw8pQVJ0tWaz/R1sbE8ksM2sKYSTDKrKtQCYfZuq8IArzwBRQ3E1LIlS9Wb7X2G3mKkJ+8jCdb1fFy/76lXpHHWrI9tquHz0YvTfZ//YHCHoAonEi4',
        startdate: '2025-01-01',
        enddate: '2025-01-31',
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then(data => {
        // Add Remark field to each job if not present
        setJobs(
          data.map((job: Job) => ({
            ...job,
            Remark: job.Remark ?? '',
          }))
        )
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Move "Remark" to the last column, "Photo" before it
  const columns = jobs.length > 0
    ? [
        ...Object.keys(jobs[0]).filter(k => k !== 'Photo' && k !== 'Remark'),
        'Photo',
        'Remark'
      ]
    : ['Photo', 'Remark']

  // Filter jobs by date range (PickupDate or DropoffDate within range)
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
  const pageSize = 6
  const totalPages = Math.ceil(filteredJobs.length / pageSize)
  const pagedJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize)

  // Handle photo upload (optional, for demo only, not persistent)
  const handlePhotoChange = (jobKey: number, file: File | null) => {
    if (!file) return
    setJobs(prev =>
      prev.map(job =>
        job.key === jobKey ? { ...job, Photo: URL.createObjectURL(file) } : job
      )
    )
  }

  // Handle remark change
  const handleRemarkChange = (jobKey: number, remark: string) => {
    setJobs(prev =>
      prev.map(job =>
        job.key === jobKey ? { ...job, Remark: remark } : job
      )
    )
  }

  // Example function to send remark to API server
  const sendRemark = (jobKey: number, remark: string) => {
    fetch('/api/guide/remark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobKey, remark }),
    })
      .then(res => res.json())
      .then(data => {
        alert('Remark sent!')
      })
      .catch(err => {
        alert('Failed to send remark')
      })
  }

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
            )}
          </div>
        </div>
      </div>
    </CssgGuide>
  )
}
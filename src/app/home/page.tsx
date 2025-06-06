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
        setJobs(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const columns = jobs.length > 0 ? Object.keys(jobs[0]) : []

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
              <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                <table className="table table-zebra table-bordered table-auto divide-y divide-base-300">
                  <thead className="divide-y divide-base-300">
                    <tr>
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
                        {columns.map(key => (
                          <td
                            key={key}
                            className="border border-base-300 whitespace-nowrap px-8 py-4 text-base"
                          >
                            {String(job[key as keyof Job])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </CssgGuide>
  )
}
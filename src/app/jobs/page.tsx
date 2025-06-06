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
  const [searchKey, setSearchKey] = useState<string>('PNR')
  const [searchTerm, setSearchTerm] = useState<string>('')

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

  const filteredJobs = jobs.filter(job => {
    const value = job[searchKey as keyof Job]
    if (value === null || value === undefined) return false
    return String(value).toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <CssgGuide>
      <div className="overflow-x-auto flex justify-center py-8">
        <div className="bg-base-100 rounded-xl shadow-xl border border-base-300 w-full max-w-5xl">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Jobs List</h1>
            <div className="mb-4 flex gap-2">
              <select
                value={searchKey}
                onChange={e => setSearchKey(e.target.value)}
                className="input input-bordered"
              >
                {columns.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input input-bordered"
              />
            </div>
            {loading ? (
              <div className="p-4">Loading jobs...</div>
            ) : error ? (
              <div className="p-4 text-red-600">Error: {error}</div>
            ) : !jobs.length ? (
              <div className="p-4">No jobs found</div>
            ) : (
              <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                <table className="table table-zebra table-bordered w-full divide-y divide-base-300">
                  <thead className="divide-y divide-base-300">
                    <tr>
                      {columns.map(key => (
                        <th key={key} className="border border-base-300">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-300">
                    {filteredJobs.map(job => (
                      <tr key={job.key} className="divide-x divide-base-300">
                        {columns.map(key => (
                          <td key={key} className="border border-base-300">{String(job[key as keyof Job])}</td>
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
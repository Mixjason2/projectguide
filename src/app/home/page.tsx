'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchKey, setSearchKey] = useState<string>('PNR')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showMenu, setShowMenu] = useState<boolean>(false)

  const router = useRouter()

  const handleLogout = () => {
    alert('Logout clicked')
    router.push('/login')
  }

  const handleMenuToggle = () => {
    setShowMenu(prev => !prev)
  }

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

  if (loading) {
    return <div className="p-4">Loading jobs...</div>
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>
  }

  if (!jobs.length) {
    return <div className="p-4">No jobs found</div>
  }

  return (
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
      <table className="table w-full">
        <thead>
          <tr>
            {columns.map(key => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map(job => (
            <tr key={job.key}>
              {columns.map(key => (
                <td key={key}>{String(job[key as keyof Job])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
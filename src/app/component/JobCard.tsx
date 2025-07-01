import ExpandedJobDetail from '@/app/component/ExpandedJobDetail';
import { Job, JobCardProps } from "@/app/types/job";
import AllJobDetailsModal from '@/app/component/AllJobDetailsModal';
import { useState } from 'react';

const renderPlaceDate = (place: string, date: string, label: string) => (
  place || date ? (
    <div>
      <span className="font-Arial font-bold">{label}:</span> {place}{place && date ? ' - ' : ''}{date}
    </div>
  ) : null
);

const renderField = (label: string, value: any) => (
  Array.isArray(value) ? (
    <div>
      <span className="font-Arial font-bold">{label}:</span>
      <ul className="list-disc ml-6">{value.map((v, i) => <li key={i}>{String(v)}</li>)}</ul>
    </div>
  ) : (
    <div>
      <span className="font-Arial font-bold">{label}:</span> {String(value)}
    </div>
  )
);

const customFormatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const JobCard: React.FC<JobCardProps> = ({
  job,              // job เป็น array ของ Job[]
  expandedPNRs,
  setExpandedPNRs,
  jobs,
  setJobs,
}) => {
  const [detailJobs, setDetailJobsState] = useState<Job[] | null>(null);

  return (
    <div
      key={job[0]?.PNRDate}
      className="relative bg-white border border-[#9EE4F6] rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
    >
      {/* แสดงสถานะรวมของ job[0] */}
      <div
        className="absolute top-2 left-1 text-[#ffffff] font-Arial rounded-full px-3 py-1 text-sm shadow z-10 flex items-center"
      >
        {/* แสดงจุดตามจำนวนงาน */}
        {job.map((_, idx) => (
          <span
            key={idx}
            className="inline-block w-2.5 h-2.5 rounded-full mx-1"
            style={{
              backgroundColor: job[idx]?.IsConfirmed ? "#22c55e" : "#d1d5db",  // สีเขียวถ้า IsConfirmed เป็น true, สีเทาถ้า false
              border: '2px solid #2D3E92',  // กรอบสีน้ำเงิน
            }}
          ></span>
        ))}
      </div>

      <button
        className="absolute top-3.5 right-2 w-8 h-8 rounded-full bg-white border-2 border-[#2D3E92] shadow-[0_4px_10px_rgba(45,62,146,0.3)] hover:shadow-[0_6px_14px_rgba(45,62,146,0.4)] transition-all duration-200 flex items-center justify-center"
        title="Show all details"
        onClick={() => setDetailJobsState(job)}
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
      {detailJobs && (
        <AllJobDetailsModal
          detailJobs={detailJobs}
          setDetailJobs={setDetailJobsState}
        />
      )}
      {/* หัวข้อวันที่และเปิด/ปิดรายละเอียดตาม PNRDate */}
      <div
        className="inline-block p-6 pb-0 cursor-pointer mx-auto items-center gap-3 text-center"
        onClick={() => setExpandedPNRs((prev) => ({ ...prev, [job[0]?.PNRDate]: !expandedPNRs[job[0]?.PNRDate] }))}
      >
        <h2
          className="font-Arial mt-0 mb-0 text-[24px]"
          style={{ color: "#2D3E92", textDecoration: "none" }}
        >
          {customFormatDate(job[0]?.PNRDate)}
        </h2>
      </div>
      {/* วนลูปแสดง ExpandedJobDetail ของแต่ละงาน */}
      {expandedPNRs[job[0]?.PNRDate] && job.map((singleJob, idx) => (
        <ExpandedJobDetail
          key={singleJob.JobKey || idx}   // ใส่ key ให้ unique (เช่น JobKey หรือ idx)
          job={singleJob}
          jobs={jobs}
          expandedPNRs={expandedPNRs}
          renderPlaceDate={renderPlaceDate}
          renderField={renderField}
          setJobs={setJobs}
        />
      ))}
    </div>
  );
};

export default JobCard;

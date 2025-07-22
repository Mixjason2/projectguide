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

const renderField = (label: string, value: unknown) => (
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

const JobCard: React.FC<JobCardProps & { asmdbValue: string }> = ({
  job,              // job เป็น array ของ Job[]
  expandedPNRs,
  setExpandedPNRs,
  jobs,
  setJobs,
  asmdbValue,  // รับมาจาก prop
}) => {
  const [detailJobs, setDetailJobsState] = useState<Job[] | null>(null);

  return (
    <div
      key={job[0]?.PNRDate}
      className="relative  bg-white border border-[#9EE4F6] rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
    >
      {/* แสดงสถานะรวมของ job[0] */}
      <div
        className="absolute top-1 left-2 bg-white text-gray-800 font-Arial rounded-full px-3 py-1 text-sm shadow-none border-none z-10 flex items-center"
      >
        {/* แสดงจุดตามจำนวนงาน */}
        {job.map((_, idx) => (
          <span
            key={idx}
            className="inline-block w-3 h-3 rounded-full mx-1"
            style={{
              backgroundColor:
                job[idx]?.IsConfirmed ? "#22c55e" :     // ✅ สีเขียวมาก่อนทุกเงื่อนไข
                  job[idx]?.isChange ? "#f97316" :        // สีส้มถ้า isChange
                    job[idx]?.isNew ? "#0ea5e9" :           // สีฟ้าถ้า isNew
                      "#d1d5db",                              // สีเทาถ้าไม่มี flag ใดเลย
              border: '2px solid #2D3E92',
            }}
          ></span>
        ))}

      </div>

<button
  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border-2 border-[#2D3E92] shadow-[0_4px_10px_rgba(45,62,146,0.3)] hover:shadow-[0_6px_14px_rgba(45,62,146,0.4)] transition-all duration-200 flex items-center justify-center hover:text-[#1B2A68]"
  title="Show all details"
  onClick={() => setDetailJobsState(job)}
  style={{ zIndex: 2 }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6 text-[#2D3E92]"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
    />
  </svg>
</button>
 {/* ปุ่มแสดงรายละเอียดทั้งหมด */}

      {detailJobs && (
        <AllJobDetailsModal
          detailJobs={detailJobs}
          setDetailJobs={setDetailJobsState}
        />
      )}
      {/* หัวข้อวันที่และเปิด/ปิดรายละเอียดตาม PNRDate */}
      <div
        className="inline-block p-6 pb-0 cursor-pointer mx-auto items-center gap-3 text-center "
        onClick={() => setExpandedPNRs((prev) => ({ ...prev, [job[0]?.PNRDate]: !expandedPNRs[job[0]?.PNRDate] }))}
      >
        <h2
          className="font-Arial -mt-1.5 mb-3.5 text-[24px]  p-0 " // หัวข้อวันที่
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
          asmdbValue={asmdbValue}  // ส่งต่อจาก prop
        />
      ))}
    </div>
  );
};

export default JobCard;

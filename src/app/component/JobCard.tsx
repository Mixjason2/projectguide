import ExpandedJobDetail from '@/app/component/ExpandedJobDetail';
import { Job, JobCardProps } from "@/app/types/job";
import AllJobDetailsModal from '@/app/component/AllJobDetailsModal';
import { useState } from 'react';

const renderPlaceDate = (place: string, date: string, label: string) => (
  place || date ? (
    <div>
      <span className="font-Arial">{label}:</span> {place}{place && date ? ' - ' : ''}{date}
    </div>
  ) : null
);

const renderField = (label: string, value: any) => (
  Array.isArray(value) ? (
    <div>
      <span className="font-Arial">{label}:</span>
      <ul className="list-disc ml-6">{value.map((v, i) => <li key={i}>{String(v)}</li>)}</ul>
    </div>
  ) : (
    <div>
      <span className="font-Arial">{label}:</span> {String(value)}
    </div>
  )
);

// ✅ ฟังก์ชันแปลงวันที่ให้เหลือแค่ dd-mm-yyyy
const customFormatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const JobCard: React.FC<JobCardProps> = ({
  job,
  expandedPNRs,
  setExpandedPNRs,
  setDetailJobs,
  jobs,
  setJobs
}) => {
const [detailJobs, setLocalDetailJobs] = useState<Job[] | null>(null); // เพิ่ม state สำหรับ detailJobs
  return (
    <div
      key={job.PNRDate}
      className="relative bg-white border border-[#9EE4F6] rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
    >
      <div
        className="absolute top-2 left-1 text-[#ffffff] font-Arial rounded-full px-3 py-1 text-sm shadow z-10"
        style={{
          backgroundColor: job.IsCancel
            ? "#ef4444"
            : job.IsConfirmed
              ? "#22c55e"
              : job.isNew
                ? "#0891b2"
                : job.isChange
                  ? "#fb923c"
                  : "#404040",
        }}
      >
        {job.all?.filter(
          (j) =>
            j.Pickup !== job.Pickup ||
            j.PickupDate !== job.PickupDate ||
            j.Dropoff !== job.Dropoff ||
            j.DropoffDate !== job.DropoffDate ||
            j.PNRDate !== job.PNRDate
        ).length + 1 || 1}
      </div>

      <button
        className="absolute top-3.5 right-2 w-8 h-8 rounded-full bg-white border-2 border-[#2D3E92] shadow-[0_4px_10px_rgba(45,62,146,0.3)] hover:shadow-[0_6px_14px_rgba(45,62,146,0.4)] transition-all duration-200 flex items-center justify-center"
        title="Show all details"
        onClick={() => {
          // รวม jobs ทั้งหมดในวันนั้นจากทุก PNR (flatten array)
          const allJobsInDate = Object.values(job.allByPNR).flat();
          console.log("Detail jobs to set:", allJobsInDate);
          setLocalDetailJobs(allJobsInDate);  // ตั้งค่า local state ของ detailJobs
          setDetailJobs(allJobsInDate); // ถ้าต้องการส่งค่าไปยัง parent component ก็ส่งไปที่ setDetailJobs ที่นี่
        }}
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
      {/* Modal แสดงรายละเอียด */}
      {detailJobs && (
        <AllJobDetailsModal
          detailJobs={detailJobs}  // ส่งข้อมูลจริงๆ ของ detailJobs ไปที่ Modal
          setDetailJobs={setDetailJobs}  // ฟังก์ชันที่ใช้ตั้งค่า detailJobs หรือปิด Modal
          mergedJob={job}  // ส่ง mergedJob ไปยัง modal
        />
      )}

      <div
        className="inline-block p-6 pb-0 cursor-pointer mx-auto items-center gap-3 text-center"
        onClick={() =>
          setExpandedPNRs((prev) => ({ ...prev, [job.PNRDate]: !expandedPNRs[job.PNRDate] }))
        }
      >
        {/* ✅ บรรทัดนี้แสดง PNR และวันที่ Pickup/Dropoff */}
        <h2
          className="font-Arial mt-0 mb-0 text-[24px]"
          style={{ color: "#2D3E92", textDecoration: "none" }} // เอาขีดเส้นออก
        >
          {customFormatDate(job.PNRDate)} {/* แสดงวันที่ไม่ต้องมีขีดเส้น */}
        </h2>
      </div>

      <ExpandedJobDetail
        job={job}
        jobs={jobs}
        expandedPNRs={expandedPNRs}
        renderPlaceDate={renderPlaceDate}
        renderField={renderField}
        setJobs={setJobs}
      />
    </div>
  );
};

export default JobCard;

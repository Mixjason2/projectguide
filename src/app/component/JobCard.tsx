import ExpandedJobDetail from '@/app/component/ExpandedJobDetail';
import JobAction from '@/app/component/JobAction';
import { JobCardProps } from "@/app/types/job"; // ปรับ path ตามโครงสร้างของคุณ

const renderPlaceDate = (pickupDate: string) => {
  return (
    <div className="mb-2">
      <span className="text-gray-500 ml-2">
        ({pickupDate})
      </span>
    </div>
  );
};

const formatDateTime = (input: string | string[]): string => {
  const format = (dateStr: string) => {
    const d = new Date(dateStr);

    if (isNaN(d.getTime())) {
      return dateStr; // คืนค่ากลับไปหากไม่ใช่วัน
    }

    // แสดงผลวันที่ที่ถูกต้องในรูปแบบที่ต้องการ
    const formattedDate = d.toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    return formattedDate;
  };

  if (Array.isArray(input)) {
    return input.map(format).join(", ");
  }

  return format(input);
};

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

const JobCard: React.FC<JobCardProps> = ({
  job,
  expandedPNRs,
  setExpandedPNRs,
  setDetailJobs,
  jobs,
  setJobs
}) => (
  <div
    key={job.PNR}
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
      onClick={() => setDetailJobs(job.all)}
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

    <div
      className="inline-block p-6 pb-0 cursor-pointer mx-auto items-center gap-3"
      onClick={() =>
        setExpandedPNRs((prev) => ({ ...prev, [job.PNR]: !expandedPNRs[job.PNR] }))
      }
    >
      <h2
        className="font-Arial mt-0 mb-0 underline underline-offset-4"
        style={{ color: "#2D3E92", fontSize: "28px" }}
      >
        {job.PNR} 
        {job.all
        .sort((a, b) => new Date(a.PickupDate).getTime() - new Date(b.PickupDate).getTime())
        .map((j, index) => {
          return (
            <div key={index} className="mb-2">
              {renderPlaceDate(
                formatDateTime(job.PickupDate),
              )}
            </div>
          );
        })}
      </h2>
    </div>

    <ExpandedJobDetail
      job={job}
      jobs={jobs}
      expandedPNRs={expandedPNRs}
      renderPlaceDate={renderPlaceDate}
      renderField={renderField}
    />
    <JobAction job={job} setJobs={setJobs} />
  </div>
);
export default JobCard;

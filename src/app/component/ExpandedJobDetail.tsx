import React from "react";
import { ExpandedJobDetailProps } from "@/app/types/job"; // ปรับ path ตามโครงสร้างของคุณ

const formatDateTime = (input: string | string[]): string => {
  const format = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr; // กันพังกรณีไม่ใช่วัน
    return d.toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (Array.isArray(input)) {
    return input.map(format).join(", ");
  }

  return format(input);
};
const ExpandedJobDetail: React.FC<ExpandedJobDetailProps> = ({
  job,
  expandedPNRs,
  renderPlaceDate,
  renderField,
}) => {
  if (!expandedPNRs[job.PNR]) return null;

  return (
    <div className="p-6 pt-0 flex-1 flex flex-col">
      <div className="text-sm text-gray-600 space-y-1 mb-4">
        {renderPlaceDate(
          Array.isArray(job.Pickup) ? job.Pickup.join(", ") : job.Pickup,
          formatDateTime(job.PickupDate),
          "Pickup"
        )}
        {renderPlaceDate(
          Array.isArray(job.Dropoff) ? job.Dropoff.join(", ") : job.Dropoff,
          formatDateTime(job.DropoffDate),
          "Dropoff"
        )}
        {renderField(
          "Pax",
          (job.AdultQty || 0) +
          (job.ChildQty || 0) +
          (job.ChildShareQty || 0) +
          (job.InfantQty || 0)
        )}
        {renderField("Source", job.Source)}
      </div>
    </div>
  );
};

export default ExpandedJobDetail;

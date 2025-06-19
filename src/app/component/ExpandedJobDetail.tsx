import React from "react";
import { ExpandedJobDetailProps } from "@/app/types/job"; // ปรับ path ตามโครงสร้างของคุณ


const ExpandedJobDetail: React.FC<ExpandedJobDetailProps> = ({
  job,
  jobs,
  expandedPNRs,
  renderPlaceDate,
  renderField,
}) => {
  if (!expandedPNRs[job.PNR]) return null;

  const confirme = Array.isArray(job.isConfirmed)
    ? job.isConfirmed.some((c) => c === true)
    : job.isConfirmed ?? false;

  return (
    <div className="p-6 pt-0 flex-1 flex flex-col">
      <div className="text-sm text-gray-600 space-y-1 mb-4">
        {renderPlaceDate(
          Array.isArray(job.Pickup) ? job.Pickup.join(", ") : job.Pickup,
          Array.isArray(job.PickupDate) ? job.PickupDate.join(", ") : job.PickupDate,
          "Pickup"
        )}
        {renderPlaceDate(
          Array.isArray(job.Dropoff) ? job.Dropoff.join(", ") : job.Dropoff,
          Array.isArray(job.DropoffDate) ? job.DropoffDate.join(", ") : job.DropoffDate,
          "Dropoff"
        )}
        {renderField("Pax", job.Pax)}
        {renderField("Source", job.Source)}
      </div>
    </div>
  );
};

export default ExpandedJobDetail;

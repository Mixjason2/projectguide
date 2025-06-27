import React from "react";
import { ExpandedJobDetailProps } from "@/app/types/job";

const formatDateTime = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const ExpandedJobDetail: React.FC<ExpandedJobDetailProps> = ({
  job,
  expandedPNRs,
  renderPlaceDate,
  renderField,
}) => {
  // console.log("ExpandedJobDetail received job:", job);
  if (!expandedPNRs[job.PNRDate]) return null;

  // ✅ สร้างรายการ Pickup + Date
  function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

const pickupItems = toArray(job.Pickup).map((pickup, index) => ({
  place: pickup,
  date: Array.isArray(job.PickupDate)
    ? job.PickupDate[index] || ""
    : job.PickupDate,
}));
const dropoffItems = toArray(job.Dropoff).map((dropoff, index) => ({
  place: dropoff,
  date: Array.isArray(job.DropoffDate)
    ? job.DropoffDate[index] || ""
    : job.DropoffDate,
}));

const adultArr = toArray(job.AdultQty);
const childArr = toArray(job.ChildQty);
const childShareArr = toArray(job.ChildShareQty);
const infantArr = toArray(job.InfantQty);

const paxItems = adultArr.map((_, index) => ({
  adult: adultArr[index] || 0,
  child: childArr[index] || 0,
  childShare: childShareArr[index] || 0,
  infant: infantArr[index] || 0,
}));


  return (
    <div className="p-6 pt-0 flex-1 flex flex-col">
      <div className="text-sm text-gray-600 space-y-2 mb-4">
        {/* ✅ Pickup List */}
        {pickupItems.map((item, idx) => (
          <div key={`pickup-${idx}`}>
            {renderPlaceDate(item.place, formatDateTime(item.date), `Pickup ${pickupItems.length > 1 ? idx + 1 : ""}`)}
          </div>
        ))}

        {/* ✅ Dropoff List */}
        {dropoffItems.map((item: { place: string; date: string; }, idx: number) => (
          <div key={`dropoff-${idx}`}>
            {renderPlaceDate(item.place, formatDateTime(item.date), `Dropoff ${dropoffItems.length > 1 ? idx + 1 : ""}`)}
          </div>
        ))}

        {/* ✅ Pax List */}
        {paxItems.map((pax, idx) => (
          <div key={`pax-${idx}`}>
            {renderField(
              `Pax ${paxItems.length > 1 ? idx + 1 : ""}`,
              pax.adult + pax.child + pax.childShare + pax.infant
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpandedJobDetail;

import React from "react";
import { ExpandedJobDetailProps } from "@/app/types/job";
import JobAction from "./JobAction";

const customFormatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const ExpandedJobDetail: React.FC<ExpandedJobDetailProps & {
  onAccept?: (jobKey: string) => void;
  onReject?: (jobKey: string) => void;
}> = ({
  job,
  expandedPNRs,
  renderPlaceDate,
  renderField,
  setJobs,
  onAccept,
  onReject,
}) => {
    if (!expandedPNRs[job.PNRDate]) return null;

    function toArray<T>(value: T | T[]): T[] {
      return Array.isArray(value) ? value : [value];
    }

    const pnrArr = toArray(job.PNR);
    const pickupArr = toArray(job.Pickup);
    const pickupDateArr = toArray(job.PickupDate);
    const dropoffArr = toArray(job.Dropoff);
    const dropoffDateArr = toArray(job.DropoffDate);
    const adultArr = toArray(job.AdultQty);
    const childArr = toArray(job.ChildQty);
    const childShareArr = toArray(job.ChildShareQty);
    const infantArr = toArray(job.InfantQty);

    const combinedItems = pnrArr.map((pnr, index) => ({
      pnr,
      pickup: pickupArr[index] || "",
      pickupDate: pickupDateArr[index] || "",
      dropoff: dropoffArr[index] || "",
      dropoffDate: dropoffDateArr[index] || "",
      adult: adultArr[index] || 0,
      child: childArr[index] || 0,
      childShare: childShareArr[index] || 0,
      infant: infantArr[index] || 0,
      key: `${job.key}`,
      IsConfirmed: Array.isArray(job.IsConfirmed) ? job.IsConfirmed[index] : job.IsConfirmed,
      IsCancel: Array.isArray(job.IsCancel) ? job.IsCancel[index] : job.IsCancel,
    }));

    const groupedByPNR: Record<string, typeof combinedItems> = {};
    combinedItems.forEach((item) => {
      if (!groupedByPNR[item.pnr]) {
        groupedByPNR[item.pnr] = [];
      }
      groupedByPNR[item.pnr].push(item);
    });

    return (
      <div className="p-6 pt-0 flex-1 flex flex-col">
        <div className="text-sm text-gray-00 space-y-4 mb-4">
          {Object.entries(groupedByPNR).map(([pnr, items]) => {
            const firstItem = items[0];
            const miniJob = {
              ...job,
              PNR: firstItem.pnr,
              Pickup: firstItem.pickup,
              PickupDate: firstItem.pickupDate,
              Dropoff: firstItem.dropoff,
              DropoffDate: firstItem.dropoffDate,
              AdultQty: firstItem.adult,
              ChildQty: firstItem.child,
              ChildShareQty: firstItem.childShare,
              InfantQty: firstItem.infant,
              key: Number(firstItem.key),  // Convert the `key` to a number
              IsConfirmed: firstItem.IsConfirmed,
              IsCancel: firstItem.IsCancel,
            };

          return (
            <div
              key={pnr}
              className="rounded-xl bg-white border border-gray-300 shadow-sm max-w-xs mx-auto"
            >
              {/* กรอบเนื้อหา */}
              <div className="bg-gray-50 border border-gray-200 rounded-t-lg space-y-3 break-words p-6">
                <h3 className="font-bold text-blue-800 text-lg leading-tight">
                  PNR: {pnr}
                </h3>
                {items.map((item) => (
                  <div
                    key={item.key}
                    className="text-gray-700 text-sm leading-relaxed whitespace-pre-line"
                  >
                    {renderPlaceDate(
                      item.pickup,
                      customFormatDate(item.pickupDate),
                      "Pickup"
                    )}
                    {renderPlaceDate(
                      item.dropoff,
                      customFormatDate(item.dropoffDate),
                      "Dropoff"
                    )}
                    {renderField(
                      "Pax",
                      item.adult + item.child + item.childShare + item.infant
                    )}
                  </div>
                ))}
              </div>



              {/* กรอบปุ่ม ชิดกรอบเนื้อหา */}
              <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg flex justify-center w-auto p-6">
                <JobAction job={miniJob} setJobs={setJobs} />
              </div>
            </div>
          );
        })}
      </div>
    </div>


  );
};

export default ExpandedJobDetail;

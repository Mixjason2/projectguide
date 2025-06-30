import React from "react";
import { Job, MergedJob } from "@/app/types/job";
import { JobDetailsProps } from "@/app/types/job";

const AllJobDetails: React.FC<JobDetailsProps> = ({ job, jobs, formatDate }) => {
  // ฟังก์ชัน customFormatDate สำหรับการแปลงวันที่ในรูปแบบ DD-MMM-YYYY HH:mm
  const customFormatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

  // ตัวอย่างกลุ่ม jobs ตาม PNRDate (ตามเดิม)
  const groupedByDate: Record<string, Record<string, Job[]>> = {};

  jobs.forEach((j) => {
    const pnrDate = j.PNRDate || "UnknownDate";
    const pnr = j.PNR || "UnknownPNR";

    if (!groupedByDate[pnrDate]) groupedByDate[pnrDate] = {};
    if (!groupedByDate[pnrDate][pnr]) groupedByDate[pnrDate][pnr] = [];
    groupedByDate[pnrDate][pnr].push(j);
  });

  return (
    <div className="max-h-[60vh] overflow-auto text-xs">
      {/* แสดงข้อมูล merged job (ตัวอย่าง) */}
      <div className="mb-4 p-2 bg-blue-100 rounded shadow-sm">
        <h3 className="font-bold mb-2 text-base">Summary for Merged Job</h3>
        <div><strong>PNRs:</strong> {job.PNR.join(", ")}</div>
        <div><strong>Keys:</strong> {job.keys.join(", ")}</div>
        <div><strong>PNR Date:</strong> {customFormatDate(job.PNRDate)}</div> {/* เปลี่ยนเป็น customFormatDate */}
      </div>

      {/* แสดงรายละเอียดแบบเดิม */}
      {Object.entries(groupedByDate).map(([pnrDate, pnrGroups]) => (
        <div key={pnrDate} className="mb-8">
          <h2 className="text-lg font-bold mb-4 border-b border-gray-400">
            Date: {customFormatDate(pnrDate)} {/* เปลี่ยนเป็น customFormatDate */}
          </h2>

          {Object.entries(pnrGroups).map(([pnr, jobsForPNR]) => {
            const typeNames = Array.from(
              new Set(
                jobsForPNR.map((j) => j.serviceTypeName || j.TypeName || "Unknown")
              )
            );

            return (
              <div
                key={`${pnrDate}-${pnr}`}
                className="mb-6 border-b border-gray-200 pb-3 last:border-b-0"
                style={{
                  borderBottom: "5px solid #000000",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="font-Arial text-sm bg-gray-100 p-3 shadow text-black mb-3 flex items-center gap-2">
                  <span>PNR: {pnr}</span>
                  {jobsForPNR[0]?.serviceSupplierName && (
                    <span>/ SupplierName: {jobsForPNR[0].serviceSupplierName}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-y-2 text-xs">
                  {/* Comment */}
                  <div className="flex items-start">
                    <span className="font-bold text-gray-600 w-24 shrink-0">Comment:</span>
                    <span className="text-gray-800 break-words">{jobsForPNR[0].Comment}</span>
                  </div>

                  {/* Pickup */}
                  <div className="flex items-start">
                    <span className="font-bold text-gray-600 w-24 shrink-0">Pickup:</span>
                    <span className="text-gray-800 break-words">
                      {jobsForPNR.map((j, idx) => (
                        <span key={idx}>
                          <span className="font-Arial">{j.Pickup}</span>
                          {j.Pickup && j.PickupDate ? " / " : ""}
                          <span className="font-Arial font-bold">{j.PickupDate ? customFormatDate(j.PickupDate) : ""}</span>
                          {idx < jobsForPNR.length - 1 && ", "}
                        </span>
                      ))}
                    </span>
                  </div>

                  {/* Dropoff */}
                  <div className="flex items-start">
                    <span className="font-bold text-gray-600 w-24 shrink-0">Dropoff:</span>
                    <span className="text-gray-800 break-words">
                      {jobsForPNR.map((j, idx) => (
                        <span key={idx}>
                          <span className="font-Arial">{j.Dropoff}</span>
                          {j.Dropoff && j.DropoffDate ? " / " : ""}
                          <span className="font-Arial font-bold">{j.DropoffDate ? customFormatDate(j.DropoffDate) : ""}</span>
                          {idx < jobsForPNR.length - 1 && ", "}
                        </span>
                      ))}
                    </span>
                  </div>

                  {/* Consultant */}
                  <div className="flex items-start">
                    <span className="font-bold text-gray-600 w-24 shrink-0">Consultant:</span>
                    <span className="text-gray-800 break-words">
                      {jobsForPNR[0].Booking_Consultant}
                      {jobsForPNR[0].Booking_Consultant && jobsForPNR[0].Phone ? ", " : ""}
                      {jobsForPNR[0].Phone && (
                        <a href={`tel:${jobsForPNR[0].Phone}`} className="text-blue-600 underline">
                          {jobsForPNR[0].Phone}
                        </a>
                      )}
                    </span>
                  </div>

                  {/* Booking Name */}
                  <div className="flex items-start">
                    <span className="font-bold text-gray-600 w-24 shrink-0">Booking Name:</span>
                    <span className="text-gray-800 break-words">{[jobsForPNR[0].Booking_Name].filter(Boolean).join(", ")}</span>
                  </div>

                  {/* Client Name */}
                  <div className="flex items-start">
                    <span className="font-bold text-gray-600 w-24 shrink-0">Client Name:</span>
                    <span className="text-gray-800 break-words">{jobsForPNR[0].pax_name}</span>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto mt-2">
                    <table className="table-auto border text-xs w-full">
                      <thead className="bg-[#2D3E92] text-white">
                        <tr>
                          <th className="px-1 py-1 text-left">Adult</th>
                          <th className="px-1 py-1 text-left">Child</th>
                          <th className="px-1 py-1 text-left">Share</th>
                          <th className="px-1 py-1 text-left">Infant</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-1 py-1 text-left">{jobsForPNR[0].AdultQty || 0}</td>
                          <td className="px-1 py-1 text-left">{jobsForPNR[0].ChildQty || 0}</td>
                          <td className="px-1 py-1 text-left">{jobsForPNR[0].ChildShareQty || 0}</td>
                          <td className="px-1 py-1 text-left">{jobsForPNR[0].InfantQty || 0}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Guide, Vehicle, Driver */}
                  <div className="flex items-start">
                    <span className="font-bold text-gray-600 w-24 shrink-0">Guide:</span>
                    <span className="text-gray-800 break-words">{[jobsForPNR[0].Guide, jobsForPNR[0].Vehicle, jobsForPNR[0].Driver].filter(Boolean).join(", ")}</span>
                  </div>

                  {/* Other fields */}
                  {Object.entries(jobsForPNR[0])
                    .filter(([k]) =>
                      ![
                        "IsConfirmed", "IsCancel", "key", "BSL_ID",
                        "Pickup", "PickupDate", "Dropoff", "DropoffDate", "PNRDate", "all",
                        "keys", "isNew", "isChange", "isDelete", "PNR", "NotAvailable",
                        "agentCode", "agentLogo", "serviceTypeName", "TypeName",
                        "SupplierCode_TP", "SupplierName_TP", "ProductName_TP", "ServiceLocationName",
                        "serviceSupplierCode_TP", "serviceProductName", "serviceSupplierName",
                        "ServiceLocationName_TP", "Source", "Phone", "Booking_Consultant",
                        "AdultQty", "ChildQty", "ChildShareQty", "InfantQty", "pax_name",
                        "Booking_Name", "Class", "Comment", "Guide", "Vehicle", "Driver"
                      ].includes(k)
                    )
                    .map(([k, v]) => {
                      let label = k;
                      return (
                        <div key={k} className="flex items-start">
                          <span className="font-bold text-gray-600 w-24 shrink-0">{label}:</span>
                          <span className="text-gray-800 break-words">{typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
                        </div>
                      );
                    })}
                </div>

                <div className="flex items-center mt-3">
                  <span className="font-bold text-gray-600 w-24 shrink-0">TypeName:</span>
                  <span className="text-gray-800 break-words">{typeNames.join(", ")}</span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default AllJobDetails;

import React from "react";
import { Job } from "@/app/types/job"; // ปรับ path ตามโครงสร้างของคุณ
import { JobDetailsProps } from "@/app/types/job"; // ปรับ path ตามโครงสร้างของคุณ

const AllJobDetails: React.FC<JobDetailsProps> = ({ jobs, formatDate }) => {
  // Group jobs by key fields (excluding TypeName)
  const groupedJobs: Record<string, { job: Job; typeNames: string[] }> = {};

  jobs.forEach((job) => {
    const groupKey = JSON.stringify({
      PNR: job.PNR,
      Pickup: job.Pickup,
      PickupDate: job.PickupDate,
      Dropoff: job.Dropoff,
      DropoffDate: job.DropoffDate,
      PNRDate: job.PNRDate,
      GuideName: job.Guide,
      Vehicle: job.Vehicle,
    });

    const typeName = job.serviceTypeName || job.TypeName || "Unknown";

    if (!groupedJobs[groupKey]) {
      groupedJobs[groupKey] = {
        job: { ...job },
        typeNames: [typeName],
      };
    } else {
      groupedJobs[groupKey].typeNames.push(typeName);
    }
  });

  return (
    <div className="max-h-[60vh] overflow-auto text-xs">
      {Object.values(groupedJobs).map(({ job, typeNames }, idx) => (
        <div
          key={job.key + "-" + idx}
          className="mb-3 border-b border-gray-200 pb-3 last:border-b-0"
          style={{
            borderBottom: "5px solid #000000",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* PNR Header */}
          <div className="font-Arial text-sm bg-gray-100 p-3 shadow text-black mb-3 flex items-center gap-2">
            <span>PNR: {job.PNR}</span>
            {job.PNR && job.serviceSupplierName && (
              <span>/ SupplierName: {job.serviceSupplierName}</span>
            )}
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 gap-y-2 text-xs">
            {/* Comment */}
            <div className="flex items-start">
              <span className="font-bold text-gray-600 w-24 shrink-0">Comment:</span>
              <span className="text-gray-800 break-words">{job.Comment}</span>
            </div>

            {/* Pickup */}
            <div className="flex items-start">
              <span className="font-bold text-gray-600 w-24 shrink-0">Pickup:</span>
              <span className="text-gray-800 break-words">
                <span className="font-Arial">{job.Pickup}{job.Pickup && job.PickupDate ? " / " : ""}</span>
                <span className="font-Arial font-bold">{job.PickupDate ? formatDate(job.PickupDate) : ""}</span>
              </span>
            </div>

            {/* Dropoff */}
            <div className="flex items-start">
              <span className="font-bold text-gray-600 w-24 shrink-0">Dropoff:</span>
              <span className="text-gray-800 break-words">
                {job.Dropoff}{job.Dropoff && job.DropoffDate ? " / " : ""}
                <span className="font-Arial font-bold">{job.DropoffDate ? formatDate(job.DropoffDate) : ""}</span>
              </span>
            </div>

            {/* Consultant */}
            <div className="flex items-start">
              <span className="font-bold text-gray-600 w-24 shrink-0">Consultant:</span>
              <span className="text-gray-800 break-words">{job.Booking_Consultant}{job.Booking_Consultant && job.Phone ? ", " : ""}{job.Phone}</span>
            </div>

            {/* Booking Name */}
            <div className="flex items-start">
              <span className="font-bold text-gray-600 w-24 shrink-0">Booking Name:</span>
              <span className="text-gray-800 break-words">{[job.Booking_Name].filter(Boolean).join(", ")}</span>
            </div>

            {/* Client Name */}
            <div className="flex items-start">
              <span className="font-bold text-gray-600 w-24 shrink-0">Client Name:</span>
              <span className="text-gray-800 break-words">{job.pax_name}</span>
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
                    <td className="px-1 py-1 text-left">{job.AdultQty || 0}</td>
                    <td className="px-1 py-1 text-left">{job.ChildQty || 0}</td>
                    <td className="px-1 py-1 text-left">{job.ChildShareQty || 0}</td>
                    <td className="px-1 py-1 text-left">{job.InfantQty || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Guide, Vehicle, Driver */}
            <div className="flex items-start">
              <span className="font-bold text-gray-600 w-24 shrink-0">Guide:</span>
              <span className="text-gray-800 break-words">{[job.Guide, job.Vehicle, job.Driver].filter(Boolean).join(", ")}</span>
            </div>

            {/* Other fields */}
            {Object.entries(job)
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
                if (k === "serviceSupplierCode_TP") label = "SupplierCode_TP";
                if (k === "serviceProductName") label = "ProductName";
                if (k === "serviceSupplierName") label = "Supplier";
                if (k === "ServiceLocationName") label = "Location";
                if (k === "pax_name") label = "Client Name";
                return (
                  <div key={k} className="flex items-start">
                    <span className="font-bold text-gray-600 w-24 shrink-0">{label}:</span>
                    <span className="text-gray-800 break-words">{typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
                  </div>
                );
              })}
          </div>

          {/* TypeName */}
          <div className="flex items-center mt-3">
            <span className="font-bold text-gray-600 w-24 shrink-0">TypeName:</span>
            <span className="text-gray-800 break-words">{[...new Set(typeNames)].join(", ")}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllJobDetails;

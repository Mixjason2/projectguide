import React, { useState } from "react";
import { ExpandedJobDetailProps, JobActionProps } from "@/app/types/job";
import axios from "axios";
import { CheckCircleIcon, XCircleIcon, DocumentIcon, ArrowUpTrayIcon } from '@heroicons/react/24/solid'
import UploadImagesWithRemark from "./FileToBase64";

const sendEmail = async ({
  emails,
  emails_CC,
  subject,
  body,
}: {
  emails: string[];
  emails_CC: string;
  subject: string;
  body: string;
}) => {
  try {
    const res = await axios.post("https://onlinedt.diethelmtravel.com:5281/api/EmailSender", {
      emails,
      emails_CC,
      subject,
      body,
    });
    alert("📧 Email sent successfully!");
    return res.data;
  } catch (error) {
    console.error("❌ Failed to send email", error);
    alert("❌ Failed to send email");
  }
};

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

const JobAction: React.FC<JobActionProps> = ({ job, setJobs }) => {
  const [accepted, setAccepted] = useState(job.IsConfirmed);
  const [showUploadModal, setShowUploadModal] = useState(false); // ใช้สำหรับเปิดปิด modal
  const [statusMessage, setStatusMessage] = useState("");

  const handleAccept = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const response = await axios.post(
        `https://operation.dth.travel:7082/api/guide/job/${job.key}/update`,
        { token, data: { isConfirmed: true } }
      );
      const result = response.data;
      if (result.success) {
        alert("Job successfully accepted.");
        setAccepted(true);
        setShowUploadModal(true);

        // ✅ อัปเดตค่าลง jobs ทั้งชุด (fullJob)
        setJobs(prev =>
          prev.map(j => {
            if (job.fullJob && j.key === job.fullJob.key) {
              // คัดลอก job.all แล้วอัปเดต index ที่ต้องการ
              const updatedAll = j.all.map((original: any, idx: any) =>
                idx === job.indexInGroup ? { ...original, IsConfirmed: true } : original
              );
              return {
                ...j,
                IsConfirmed: true, // รวมของ merged job
                all: updatedAll
              };
            }
            return j;
          })
        );

        await sendEmail({
          emails: ["veeratha.p@dth.travel"],
          emails_CC: "",
          subject: `Job Accepted: ${job.key}`,
          body: `The job with reference number ${job.PNR} has been accepted.`,
        });
      }
    } catch (error) {
      alert("Error: " + String(error));
    }
  };

  const handleReject = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const response = await axios.post(
        `https://operation.dth.travel:7082/api/guide/job/${job.key}/update`,
        { token, data: { isCancel: true } }
      );
      const result = response.data;
      if (result.success) {
        alert("Job successfully canceled.");
        setShowUploadModal(false);

        // ✅ อัปเดต jobs
        setJobs(prev =>
          prev.map(j => {
            if (job.fullJob && j.key === job.fullJob.key) {
              const updatedAll = j.all.map((original: any, idx: any) =>
                idx === job.indexInGroup ? { ...original, IsCancel: true } : original
              );
              return {
                ...j,
                IsCancel: true,
                all: updatedAll
              };
            }
            return j;
          })
        );

        await sendEmail({
          emails: ["veeratha.p@dth.travel"],
          emails_CC: "",
          subject: `Job Rejected: ${job.key}`,
          body: `The job with reference number ${job.PNR} has been rejected.`,
        });
      }
    } catch (error) {
      alert("Error: " + String(error));
    }
  };

  return (
<div className="w-full border rounded-xl p-2 shadow bg-white">
  {job.IsCancel ? null : accepted ? (
    <>
      <button
        onClick={() => setShowUploadModal(true)}
        className="w-full py-2 rounded-lg text-blue-700 hover:bg-gray-100 flex items-center justify-center transition"
        title="Upload Documents"
      >
        <ArrowUpTrayIcon className="w-6 h-6" />
      </button>
    </>
  ) : (
    <>
      <div className="flex gap-2 w-full">
        <button
          className="flex-1 py-2 rounded-lg bg-[#95c941] hover:opacity-90 flex items-center justify-center transition"
          onClick={handleAccept}
          title="Accept"
        >
          <CheckCircleIcon className="w-6 h-6 text-white" />
        </button>
        <button
          className="flex-1 py-2 rounded-lg bg-[#ef4444] hover:opacity-90 flex items-center justify-center transition"
          onClick={handleReject}
          title="Reject"
        >
          <XCircleIcon className="w-6 h-6 text-white" />
        </button>
      </div>
    </>
  )}
</div>
  );
};

const ExpandedJobDetail: React.FC<ExpandedJobDetailProps> = ({
  job,
  expandedPNRs,
  renderPlaceDate,
  renderField,
  setJobs,
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
    key: `${job.key}-${index}`, // key ที่แตกต่างกัน
    IsConfirmed: Array.isArray(job.IsConfirmed) ? job.IsConfirmed[index] : job.IsConfirmed,
    IsCancel: Array.isArray(job.IsCancel) ? job.IsCancel[index] : job.IsCancel,
    fullJob: job, // เก็บต้นฉบับไว้ใช้ update
    indexInGroup: index
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
          const firstItem = items[0]; // ใช้ item แรกในการสร้าง miniJob
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
            key: firstItem.key,
            IsConfirmed: firstItem.IsConfirmed,
            IsCancel: firstItem.IsCancel,
          };

          return (
            <div
              key={pnr}
              className="rounded-xl bg-white border border-gray-300 p-6 shadow-sm max-w-xs mx-auto"
            >
              {/* กรอบเนื้อหา */}
              <div className="bg-gray-50 border border-gray-200 rounded-t-lg p-4 space-y-3 break-words">
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
<div className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-0 flex justify-center w-auto">
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


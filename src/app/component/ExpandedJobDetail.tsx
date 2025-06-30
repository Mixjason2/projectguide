import React, { useState } from "react";
import { ExpandedJobDetailProps, JobActionProps } from "@/app/types/job";
import axios from "axios";
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

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

const JobAction: React.FC<JobActionProps> = ({ job, setJobs }) => {
  const [accepted, setAccepted] = useState(job.IsConfirmed);
  const [showUploadModal, setShowUploadModal] = useState(false); // ใช้สำหรับเปิดปิด modal
  const [statusMessage, setStatusMessage] = useState("");

  const handleAccept = async () => {
    try {
      setStatusMessage("");
      const token = localStorage.getItem("token") || "";
      const response = await axios.post(
        `https://operation.dth.travel:7082/api/guide/job/${job.key}/update`,
        { token, data: { isConfirmed: true } }
      );
      const result = response.data;
      if (result.success) {
        alert("Job successfully accepted.");
        setAccepted(true);
        setShowUploadModal(true); // เปิด modal เมื่อ job ถูก accept
        setJobs((prevJobs) =>
          prevJobs.map((j) => (j.key === job.key ? { ...j, IsConfirmed: true } : j))
        );

        // ส่ง Email หลังจาก accept
        await sendEmail({
          emails: ["veeratha.p@dth.travel"],
          emails_CC: "",
          subject: `Job Accepted: ${job.key}`,
          body: `The job with reference number ${job.PNR} has been accepted by the assigned guide.

Please proceed with the necessary arrangements or check the system for details.`,
        });
      } else {
        alert("Failed to accept the job: " + (result?.error || "Unknown error"));
      }
    } catch (error) {
      alert("Error: " + String(error));
    }
  };

  const handleReject = async () => {
    try {
      setStatusMessage("");
      const token = localStorage.getItem("token") || "";
      const response = await axios.post(
        `https://operation.dth.travel:7082/api/guide/job/${job.key}/update`,
        { token, data: { isCancel: true } }
      );
      const result = response.data;
      if (result.success) {
        alert("Job successfully canceled.");
        setShowUploadModal(false); // ซ่อน modal เมื่อ job ถูก reject
        setJobs((prevJobs) =>
          prevJobs.map((j) => (j.key === job.key ? { ...j, IsCancel: true } : j))
        );
        await sendEmail({
          emails: ["veeratha.p@dth.travel"],
          emails_CC: "",
          subject: `Job Accepted: ${job.key}`,
          body: `The job with reference number ${job.PNR} has been rejected by the assigned guide.

Please proceed with the necessary arrangements or check the system for details.`,
        });
      } else {
        alert("Failed to cancel the job: " + (result?.error || "Unknown error"));
      }
    } catch (error) {
      alert("Error: " + String(error));
    }
  };

  return (
    <div className="relative border rounded-xl p-4 shadow bg-white">
      {/* ถ้า job ถูก cancel ไม่แสดงอะไร */}
      {job.IsCancel ? null : accepted ? (
        <>
          <div className="flex justify-center">
            <button
              onClick={() => setShowUploadModal(true)}
              className="w-12 h-12 rounded-full bg-white border-2 border-[#2D3E92] shadow hover:shadow-md flex items-center justify-center text-2xl"
              title="Upload Documents"
            >
              📄
            </button>
          </div>

          {/* Modal สำหรับการอัปโหลด */}
          {showUploadModal && (
            <div
              className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
              onClick={() => setShowUploadModal(false)} // คลิกที่พื้นหลังจะปิด modal
            >
              <div
                className="bg-white rounded-2xl shadow-lg p-6 relative max-w-3xl w-full"
                onClick={(e) => e.stopPropagation()} // กันคลิกหลุดจาก modal
              >
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
                  aria-label="Close modal"
                >
                  ×
                </button>

                {/* เรียกใช้ UploadImagesWithRemark เพื่อแสดงฟอร์มการอัปโหลด */}
                <UploadImagesWithRemark
                  token={localStorage.getItem("token") || ""}
                  keyValue={job.key}
                  job={job}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex gap-3">
            <button
              className="btn flex-1 py-2 rounded-full shadow text-white bg-[#95c941] hover:opacity-90"
              onClick={handleAccept}
            >
              Accept
            </button>
            <button
              className="btn flex-1 py-2 rounded-full shadow text-white bg-[#ef4444] hover:opacity-90"
              onClick={handleReject}
            >
              Reject
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
      <div className="text-sm text-gray-00 space-y-2 mb-4">
        {Object.entries(groupedByPNR).map(([pnr, items]) => (
          <div key={pnr} className="bg-gray-200 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-lg text-blue-800">PNR: {pnr}</h3>

            {items.map((item, idx) => {
              const miniJob = {
                ...job,
                PNR: item.pnr,
                Pickup: item.pickup,
                PickupDate: item.pickupDate,
                Dropoff: item.dropoff,
                DropoffDate: item.dropoffDate,
                AdultQty: item.adult,
                ChildQty: item.child,
                ChildShareQty: item.childShare,
                InfantQty: item.infant,
                key: item.key,
                IsConfirmed: item.IsConfirmed,
                IsCancel: item.IsCancel,
              };

              return (
                <div key={item.key} className="mb-4 border-b pb-4">
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

                  {/* 🎯 JobAction แยกต่อ PNR */}
                  <JobAction job={miniJob} setJobs={setJobs} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpandedJobDetail;

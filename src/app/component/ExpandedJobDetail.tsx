import React, { useState } from "react";
import { ExpandedJobDetailProps, JobActionProps } from "@/app/types/job";
import axios from "axios";
import UploadImagesWithRemark from "./FileToBase64";

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
        setShowUploadModal(true);  // เปิด modal เมื่อ job ถูก accept
        setJobs((prevJobs) =>
          prevJobs.map((j) => (j.key === job.key ? { ...j, IsConfirmed: true } : j))
        );
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
  // ถ้าข้อมูล PNRDate ไม่แสดงผล ก็คือไม่ต้องแสดงบล็อกนี้
  if (!expandedPNRs[job.PNRDate]) return null;

  // ✅ สร้างรายการ Pickup + Date
  function toArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
  }

  const pickupItems = toArray(job.Pickup).map((pickup, index) => ({
    place: pickup,
    date: Array.isArray(job.PickupDate) ? job.PickupDate[index] || "" : job.PickupDate,
  }));

  const dropoffItems = toArray(job.Dropoff).map((dropoff, index) => ({
    place: dropoff,
    date: Array.isArray(job.DropoffDate) ? job.DropoffDate[index] || "" : job.DropoffDate,
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
   <div className="bg-gray-100 p-4 rounded-lg">
  {/* หัวเรื่อง PNR */}
  <h2 className="text-lg font-bold text-blue-800 mb-2">PNR: {job.PNR}</h2>

  {/* Pickup + Dropoff + Pax + ปุ่ม */}
  <div className="text-sm text-gray-700">
    {/* Pickup */}
    <div className="mb-2">
      <h4 className="text-sm font-semibold text-gray-800 mb-1">Pickup</h4>
      {pickupItems.map((item, idx) => (
        <div key={`pickup-${idx}`} className="mb-1">
          {renderPlaceDate(item.place, customFormatDate(item.date), `Pickup ${pickupItems.length > 1 ? idx + 1 : ""}`)}
        </div>
      ))}
    </div>

    {/* Dropoff */}
    <div className="mb-2">
      <h4 className="text-sm font-semibold text-gray-800 mb-1">Dropoff</h4>
      {dropoffItems.map((item, idx) => (
        <div key={`dropoff-${idx}`} className="mb-1">
          {renderPlaceDate(item.place, customFormatDate(item.date), `Dropoff ${dropoffItems.length > 1 ? idx + 1 : ""}`)}
        </div>
      ))}
    </div>

    {/* Pax */}
    <div className="mb-2">
      <h4 className="text-sm font-semibold text-gray-800 mb-1">Pax</h4>
      {paxItems.map((pax, idx) => (
        <div key={`pax-${idx}`} className="mb-1">
          {renderField(
            `Pax ${paxItems.length > 1 ? idx + 1 : ""}`,
            pax.adult + pax.child + pax.childShare + pax.infant
          )}
        </div>
      ))}
    </div>

    {/* ปุ่ม */}
    <div className="pt-1">
      <JobAction job={job} setJobs={setJobs} />
    </div>
  </div>
</div>
      );
};

<<<<<<< HEAD
export default ExpandedJobDetail;
=======
      export default ExpandedJobDetail;

>>>>>>> 9859a365f1891a7f86ce73bcf2c5e0e5147b7a56

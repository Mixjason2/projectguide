import React, { useState } from "react";
import axios from "axios";
import UploadImagesWithRemark from "@/app/component/FileToBase64"; // แก้ import ให้ถูกต้อง
import { JobActionProps } from "@/app/types/job";

const JobAction: React.FC<JobActionProps> = ({ job, setJobs }) => {
  const [accepted, setAccepted] = useState(job.IsConfirmed); // ใช้สถานะจาก job เริ่มต้น
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

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
      const response = await axios.post("https://onlinedt.diethelmtravel.com:5281/api/EmailSender", {
        emails,
        emails_CC,
        subject,
        body,
      });
      alert("Email sent successfully!");
      return response.data;
    } catch (error) {
      alert("Failed to send email.");
      console.error(error);
      throw error;
    }
  };

  const handleAccept = async () => {
    try {
      setStatusMessage("");
      const token = localStorage.getItem("token") || "";
      const response = await axios.post(
        `https://operation.dth.travel:7082/api/guide/job/${job.key}/update`,
        {
          token,
          data: { isConfirmed: true },
        }
      );
      const result = response.data;
      if (result.success) {
        alert("Job successfully accepted.");
        setAccepted(true); // เปลี่ยนสถานะ accepted

        setJobs((prevJobs) =>
          prevJobs.map((j) => (j.key === job.key ? { ...j, IsConfirmed: true } : j))
        );

        await sendEmail({
          emails: ["fomexii@hotmail.com"],
          emails_CC: "",
          subject: `Job Accepted: ${job.PNR}`,
          body: `The job for service ${job.serviceProductName} has been successfully accepted.

Please note that this confirmation is part of the scheduled PNR: ${job.PNR}.

If you have any questions or require further details, please feel free to contact us.`,
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
        {
          token,
          data: { isCancel: true },
        }
      );
      const result = response.data;
      if (result.success) {
        alert("Job successfully canceled.");
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

          {showUploadModal && (
            <div
              className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
              onClick={() => setShowUploadModal(false)}
            >
              <div
                className="bg-white rounded-2xl shadow-lg p-6 relative max-w-3xl w-full"
                onClick={(e) => e.stopPropagation()} // กันคลิกหลุด modal
              >
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
                  aria-label="Close modal"
                >
                  ×
                </button>

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

          {statusMessage && <p>{statusMessage}</p>}
        </>
      )}
    </div>
  );
};

export default JobAction;

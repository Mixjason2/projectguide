import React, { useState } from "react";
import { JobActionProps } from "@/app/types/job";
import axios from "axios";
import { CheckCircleIcon, XCircleIcon, ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import UploadImagesWithRemark from "./FileToBase64";
import toast from "react-hot-toast";  // เพิ่ม import toast

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
    toast.success("📧 Email sent successfully!");  // แก้ alert เป็น toast
    return res.data;
  } catch (error) {
    console.error("❌ Failed to send email", error);
    toast.error("❌ Failed to send email");  // แก้ alert เป็น toast
  }
};

// **แก้ไข** เพิ่ม props onAccept, onReject
interface ExtendedJobActionProps extends JobActionProps {
  onAccept?: (jobKey: string) => void;
  onReject?: (jobKey: string) => void;
}

const JobAction: React.FC<ExtendedJobActionProps> = ({ job, setJobs, onAccept, onReject }) => {
  const [accepted, setAccepted] = useState(job.IsConfirmed);
  const [showUploadModal, setShowUploadModal] = useState(false); // modal state
  const [statusMessage, setStatusMessage] = useState("");

  const handleAccept = async () => {
    console.log("[ACCEPT] job.key =", job.key); // ✅ log key ที่กำลังจะ accept
    if (onAccept) {
      onAccept(job.key.toString());
      setAccepted(true);
      return;
    }

    // fallback ถ้าไม่ส่ง callback มาจะใช้ logic เดิม
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
        toast.success("Job successfully accepted.");  // แก้ alert เป็น toast
        setAccepted(true);

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
        toast.error("Failed to accept the job: " + (result?.error || "Unknown error"));  // แก้ alert เป็น toast
      }
    } catch (error) {
      toast.error("Error: " + String(error));  // แก้ alert เป็น toast
    }
  };

  const handleReject = async () => {
    if (onReject) {
      onReject(job.key.toString());
      return;
    }

    // fallback ถ้าไม่ส่ง callback มาจะใช้ logic เดิม
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
        toast.success("Job successfully canceled.");  // แก้ alert เป็น toast
        setJobs((prevJobs) =>
          prevJobs.map((j) => (j.key === job.key ? { ...j, IsCancel: true } : j))
        );
      } else {
        toast.error("Failed to cancel the job: " + (result?.error || "Unknown error"));  // แก้ alert เป็น toast
      }
    } catch (error) {
      toast.error("Error: " + String(error));  // แก้ alert เป็น toast
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
          {showUploadModal && (
            <div
              className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
              onClick={() => setShowUploadModal(false)}
            >
              <div
                className="bg-white rounded-2xl shadow-lg p-6 relative max-w-3xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
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
      )}
    </div>
  );
};

export default JobAction;

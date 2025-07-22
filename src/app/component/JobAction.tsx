import React, { useState } from "react";
import { JobActionProps } from "@/app/types/job";
import axios from "axios";
import { CheckCircleIcon, XCircleIcon, ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import UploadImagesWithRemark from "./FileToBase64";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

const customFormatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

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
    await Swal.fire({
      icon: "success",
      title: "📧 Email sent successfully!",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      toast: true,
      position: "top",
      didOpen: (toast) => {
        toast.style.margin = '0 auto';
        toast.style.left = '0';
        toast.style.right = '0';
      }
    });
    return res.data;
  } catch (error) {
    console.error("❌ Failed to send email", error);
    await Swal.fire({
      icon: "error",
      title: "❌ Failed to send email",
      showConfirmButton: false,
      timer: 2500,
      toast: true,
      position: "top",
      didOpen: (toast) => {
        toast.style.margin = '0 auto';
        toast.style.left = '0';
        toast.style.right = '0';
      }
    });
  }
};

interface ExtendedJobActionProps extends JobActionProps {
  onAccept?: (jobKey: string) => void;
  onReject?: (jobKey: string) => void;
  asmdbValue: string;  // เพิ่มบรรทัดนี้ (ถ้าเป็น required ก็เอา ? ออก)
}

const JobAction: React.FC<ExtendedJobActionProps> = ({ job, setJobs, onAccept, onReject,asmdbValue}) => {
  const [accepted, setAccepted] = useState(job.IsConfirmed);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [, setStatusMessage] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const handleAccept = async () => {
    if (onAccept) {
      onAccept(job.key.toString());
      setAccepted(true);
      return;
    }
    try {
      setStatusMessage("");
      const token = localStorage.getItem("token") || "";
      const response = await axios.post(
        `https://operation.dth.travel:7082/api/guide/job/${job.key}/update`,
        { token, data: { isConfirmed: true } }
      );
      const result = response.data;
      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Job successfully accepted.",
          showConfirmButton: false,
          timer: 2500,
          toast: true,
          position: "top",
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.style.margin = '0 auto';
            toast.style.left = '0';
            toast.style.right = '0';
          }
        });
        setAccepted(true);
        setJobs((prevJobs) =>
          prevJobs.map((j) => (j.key === job.key ? { ...j, IsConfirmed: true } : j))
        );
        await sendEmail({
          emails: ["fomexii@hotmail.com"],
          emails_CC: "",
          subject: `Confirmation ${job.PNR}`,
          body: `<table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%;">
<thead style="background-color: #f2f2f2;"><tr><th>Information</th><th>Details</th></tr></thead>
<tbody>
<tr><td>DTH Ref. No.</td><td>${job.PNR}</td></tr>
<tr><td>Service Name</td><td>${job.serviceProductName}</td></tr>
<tr><td>Service Date</td><td>${customFormatDate(job.PNRDate)}</td></tr>
<tr><td>Comment</td><td>${job.Comment}</td></tr>
<tr><td>Class</td><td>${job.Class}</td></tr>
<tr><td>Booking Status</td><td>${job.serviceTypeName}</td></tr>
<tr><td>Client name</td><td>${job.pax_name}</td></tr>
<tr><td>Pickup Date & Time</td><td>${customFormatDate(job.PickupDate)}</td></tr>
<tr><td>Pickup Location</td><td>${job.Pickup}</td></tr>
<tr><td>Dropoff Date & Time</td><td>${customFormatDate(job.DropoffDate)}</td></tr>
<tr><td>Dropoff Location</td><td>${job.Dropoff}</td></tr>
<tr><td>Guide</td><td>${job.Guide}</td></tr>
<tr><td>Vehicle</td><td>${job.Vehicle}</td></tr>
<tr><td>Driver</td><td>${job.Driver}</td></tr>
<tr><td>Sending by</td><td>User: </td></tr>
</tbody></table>`
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error: " + String(error),
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        position: "top",
        didOpen: (toast) => {
          toast.style.margin = '0 auto';
          toast.style.left = '0';
          toast.style.right = '0';
        }
      });
    }
  };

  const handleReject = async () => {
    if (onReject) {
      onReject(job.key.toString());
      return;
    }
    try {
      setStatusMessage("");
      const token = localStorage.getItem("token") || "";
      const response = await axios.post(
        `https://operation.dth.travel:7082/api/guide/job/${job.key}/update`,
        {
          token,
          data: { isCancel: true, reason: rejectReason },
        }
      );
      const result = response.data;
      if (result.success) {
        await sendEmail({
          emails: ["fomexii@hotmail.com"],
          emails_CC: "",
          subject: `Canceled ${job.PNR}`,
          body: `<table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%;">
<thead style="background-color: #f2f2f2;"><tr><th>Information</th><th>Details</th></tr></thead>
<tbody>
<tr><td>DTH Ref. No.</td><td>${job.PNR}</td></tr>
<tr><td>Service Name</td><td>${job.serviceProductName}</td></tr>
<tr><td>Service Date</td><td>${customFormatDate(job.PNRDate)}</td></tr>
<tr><td>Comment</td><td>${job.Comment}</td></tr>
<tr><td>Class</td><td>${job.Class}</td></tr>
<tr><td>Booking Status</td><td>${job.serviceTypeName}</td></tr>
<tr><td>Client name</td><td>${job.pax_name}</td></tr>
<tr><td>Pickup Date & Time</td><td>${customFormatDate(job.PickupDate)}</td></tr>
<tr><td>Pickup Location</td><td>${job.Pickup}</td></tr>
<tr><td>Dropoff Date & Time</td><td>${customFormatDate(job.DropoffDate)}</td></tr>
<tr><td>Dropoff Location</td><td>${job.Dropoff}</td></tr>
<tr><td>Guide</td><td>${job.Guide}</td></tr>
<tr><td>Vehicle</td><td>${job.Vehicle}</td></tr>
<tr><td>Driver</td><td>${job.Driver}</td></tr>
<tr>
  <td><strong style="color:red;">❗ Rejection Reason</strong></td>
  <td><strong>${rejectReason}</strong></td>
</tr>
<tr><td>Sending by</td><td>User: </td></tr>
</tbody></table>`
        });
        await Swal.fire({
          icon: "success",
          title: "Job successfully canceled.",
          showConfirmButton: false,
          timer: 2500,
          toast: true,
          position: "top",
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.style.margin = '0 auto';
            toast.style.left = '0';
            toast.style.right = '0';
          }
        });
        setJobs((prevJobs) =>
          prevJobs.map((j) => (j.key === job.key ? { ...j, IsCancel: true } : j))
        );
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error: " + String(error),
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        position: "top",
        didOpen: (toast) => {
          toast.style.margin = '0 auto';
          toast.style.left = '0';
          toast.style.right = '0';
        }
      });
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
                  asmdbValue={asmdbValue}                />
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
            onClick={() => setShowRejectModal(true)}
            title="Reject"
          >
            <XCircleIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">Reason for Rejection</h2>
            <textarea
              className="w-full border rounded-lg p-2 mb-4"
              rows={4}
              placeholder="Please provide your reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleReject();
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobAction;

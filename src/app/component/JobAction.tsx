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
        toast.style.margin = '0 auto';       // ✅ จัดให้อยู่ตรงกลางแนวนอน
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
        toast.style.margin = '0 auto';       // ✅ จัดให้อยู่ตรงกลางแนวนอน
        toast.style.left = '0';
        toast.style.right = '0';
      }
    });
  }
};

interface ExtendedJobActionProps extends JobActionProps {
  onAccept?: (jobKey: string) => void;
  onReject?: (jobKey: string) => void;
}

const JobAction: React.FC<ExtendedJobActionProps> = ({ job, setJobs, onAccept, onReject }) => {
  const [accepted, setAccepted] = useState(job.IsConfirmed);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleAccept = async () => {
    console.log("[ACCEPT] job.key =", job.key);
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
        {
          token,
          data: { isConfirmed: true },
        }
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
            toast.style.margin = '0 auto';       // ✅ จัดให้อยู่ตรงกลางแนวนอน
            toast.style.left = '0';
            toast.style.right = '0';
          }
        });
        setAccepted(true);

        setJobs((prevJobs) =>
          prevJobs.map((j) => (j.key === job.key ? { ...j, IsConfirmed: true } : j))
        );

        await sendEmail({
          emails: ["pakinnat.patthanajiranan@g.swu.ac.th"],
          emails_CC: "",
          subject: `Confirmation ${job.PNR}`,
          body: `<table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="text-align: left;">Information</th>
      <th style="text-align: left;">Details</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>DTH Ref. No.</td><td>${job.PNR}</td></tr>
    <tr><td>Service Name</td><td>${job.serviceProductName}</td></tr>
    <tr><td>Service Date</td><td>${customFormatDate(job.PNRDate)}</td></tr>
    <tr><td>Comment</td><td>${job.Comment}</td></tr>
    <tr><td>Class</td><td>${job.Class}</td></tr>
    <tr><td>Booking Status</td><td>${job.serviceTypeName}</td></tr>
    <tr>
      <td>Client name</td>
      <td>
        ${job.pax_name}
      </td>
    </tr>
    <tr><td>Pickup Date & Time</td><td>${customFormatDate(job.PickupDate)}</td></tr>
    <tr><td>Pickup Location</td><td>${job.Pickup}</td></tr>
    <tr><td>Dropoff Date & Time</td><td>${customFormatDate(job.DropoffDate)}</td></tr>
    <tr><td>Dropoff Location</td><td>${job.Dropoff}</td></tr>
    <tr><td>Guide</td><td>${job.Guide}</td></tr>
    <tr><td>Vehicle</td><td>${job.Vehicle}</td></tr>
    <tr><td>Driver</td><td>${job.Driver}</td></tr>
    <tr><td>Remarks</td><td>${job.Remark}</td></tr>
    <tr><td>Sending by</td><td>User: </td></tr>
  </tbody>
</table>`,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Failed to accept the job: " + (result?.error || "Unknown error"),
          showConfirmButton: false,
          timer: 3000,
          toast: true,
          position: "top", didOpen: (toast) => {
            toast.style.margin = '0 auto';       // ✅ จัดให้อยู่ตรงกลางแนวนอน
            toast.style.left = '0';
            toast.style.right = '0';
          }
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
          toast.style.margin = '0 auto';       // ✅ จัดให้อยู่ตรงกลางแนวนอน
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
          data: { isCancel: true },
        }
      );
      const result = response.data;
      if (result.success) {
        await sendEmail({
          emails: ["pakinnat.patthanajiranan@g.swu.ac.th"],
          emails_CC: "",
          subject: `Canceled ${job.PNR}`,
          body: `<table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="text-align: left;">Information</th>
      <th style="text-align: left;">Details</th>
    </tr>
  </thead>
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
    <tr><td>Remarks</td><td>${job.Remark}</td></tr>
    <tr><td>Sending by</td><td>User: </td></tr>
  </tbody>
</table>`,
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
            toast.style.margin = '0 auto';       // ✅ จัดให้อยู่ตรงกลางแนวนอน
            toast.style.left = '0';
            toast.style.right = '0';
          }
        });
        setJobs((prevJobs) =>
          prevJobs.map((j) => (j.key === job.key ? { ...j, IsCancel: true } : j))
        );
      } else {
        await Swal.fire({
          icon: "error",
          title: "Failed to cancel the job: " + (result?.error || "Unknown error"),
          showConfirmButton: false,
          timer: 3000,
          toast: true,
          position: "top", didOpen: (toast) => {
            toast.style.margin = '0 auto';       // ✅ จัดให้อยู่ตรงกลางแนวนอน
            toast.style.left = '0';
            toast.style.right = '0';
          }
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
          toast.style.margin = '0 auto';       // ✅ จัดให้อยู่ตรงกลางแนวนอน
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
                />
              </div>
            </div>
          )}
          {statusMessage && (
            <div className="mt-2 text-sm text-gray-600 text-center">
              {statusMessage}
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

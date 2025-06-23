import React, { useState } from "react";
import axios from "axios";
import FileToBase64 from "@/app/component/FileToBase64";
import { JobActionProps } from "@/app/types/job";

const JobAction: React.FC<JobActionProps> = ({ job, setJobs }) => {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadedRemark, setUploadedRemark] = useState<string>("");

  // เพิ่ม state สำหรับสถานะการส่งอีเมล
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
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
      // axios จะ throw error เองถ้า status ไม่ใช่ 2xx
      alert("Email sent successfully!"); // แจ้งผลสำเร็จ
      return response.data;
    } catch (error) {
      alert("Failed to send email."); // แจ้งล้มเหลว
      console.error(error);
      throw error;
    }
  };

  const handleAccept = async () => {
    try {
      setEmailStatus(null); // รีเซ็ตสถานะก่อนเริ่ม
      const token = localStorage.getItem("token") || "";
      const response = await axios.post(
        `https://operation.dth.travel:7082/api/guide/job/${job.keys}/update`,
        {
          token,
          data: { isConfirmed: true },
        }
      );
      const result = response.data;
      if (result.success) {
        alert("Job successfully accepted.");
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            job.all.some((orig: { key: any }) => orig.key === j.key) ? { ...j, IsConfirmed: true } : j
          )
        );

        await sendEmail({
          emails: ["veeratha.p@dth.travel"],
          emails_CC: "",
          subject: `Job Accepted: ${job.key}`,
          body: `The job with key ${job.key} has been accepted successfully.`,
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
      setEmailStatus(null); // รีเซ็ตสถานะก่อนเริ่ม
      const token = localStorage.getItem("token") || "";
      const response = await axios.post(
        `https://operation.dth.travel:7082/api/guide/job/${job.keys}/update`,
        {
          token,
          data: { isCancel: true },
        }
      );
      const result = response.data;
      if (result.success) {
        alert("Job successfully canceled.");
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            job.all.some((orig: { key: any }) => orig.key === j.key) ? { ...j, IsCancel: true } : j
          )
        );

        await sendEmail({
          emails: ["veeratha.p@dth.travel"],
          emails_CC: "",
          subject: `Job Canceled: ${job.key}`,
          body: `The job with key ${job.key} has been canceled.`,
        });
      } else {
        alert("Failed to cancel the job: " + (result?.error || "Unknown error"));
      }
    } catch (error) {
      alert("Error: " + String(error));
    }
  };

  const handleBase64ListReady = (base64List: string[], remark: string) => {
    setUploadedFiles(base64List);
    setUploadedRemark(remark);
    console.log("Received base64 list:", base64List);
    console.log("Received remark:", remark);
  };

  return (
    <div className="relative border rounded-xl p-4 shadow bg-white">
      {job.IsCancel ? null : job.IsConfirmed ? (
        <FileToBase64 bookingAssignmentId={job.key} onBase64ListReady={handleBase64ListReady} />
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

          {/* กรอบแสดงสถานะส่งอีเมล */}
          {statusMessage && <p>{statusMessage}</p>}
        </>
      )}
    </div>
  );
};

export default JobAction;

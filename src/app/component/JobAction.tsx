import React, { useState } from "react";
import axios from "axios";
import FileToBase64 from "@/app/component/FileToBase64";
import { JobActionProps } from "@/app/types/job"; // ปรับ path ตามโครงสร้างของคุณ


const JobAction: React.FC<JobActionProps> = ({ job, setJobs }) => {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadedRemark, setUploadedRemark] = useState<string>("");  // ประกาศ state สำหรับ remark
  const handleAccept = async () => {
    try {
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
        alert("Accept งานสำเร็จ");
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            job.all.some((orig: { key: any; }) => orig.key === j.key)
              ? { ...j, IsConfirmed: true }
              : j
          )
        );
      } else {
        alert("Accept งานไม่สำเร็จ: " + (result?.error || "Unknown error"));
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาด: " + String(error));
    }
  };

  const handleReject = async () => {
    try {
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
        alert("Cancel งานสำเร็จ");
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            job.all.some((orig: { key: any; }) => orig.key === j.key)
              ? { ...j, IsCancel: true }
              : j
          )
        );

      } else {
        alert("Cancel งานไม่สำเร็จ: " + (result?.error || "Unknown error"));
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาด: " + String(error));
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
      {job.IsCancel ? null : (job.IsConfirmed ? (
        <FileToBase64 bookingAssignmentId={job.key} onBase64ListReady={handleBase64ListReady} />
      ) : (
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
      )
      )}
    </div>
  );
};

export default JobAction;



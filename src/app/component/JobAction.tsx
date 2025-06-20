import React from "react";
import axios from "axios";
import FileToBase64 from "@/app/component/FileToBase64";
import { JobActionProps } from "@/app/types/job"; // ปรับ path ตามโครงสร้างของคุณ

const JobAction: React.FC<JobActionProps> = ({ job, setJobs }) => {
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
              ? { ...j, isConfirmed: true }
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
              ? { ...j, isCancel: true }
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

  const handleUpload = async (base64List: string[]) => {
    const token = localStorage.getItem("token") || "";
    try {
      const response = await axios.post(
        "https://operation.dth.travel:7082/api/upload",
        {
          token,
          data: {
            key: 2588, // คุณอาจต้องเปลี่ยนให้เป็น job.key หรืออื่นๆ ที่เหมาะสม
            Remark: "Test Remark",
            Images: base64List.map((b64) => ({ ImageBase64: b64 })),
          },
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        alert("อัปโหลดสำเร็จ ID: " + response.data.id);
      } else {
        alert("Error: " + (response.data.error || "Unknown error"));
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาด: " + String(error));
    }
  };
  console.log("isConfirmed:", job.isConfirmed, "isCancel:", job.isCancel);
  console.log("Confirmed jobs:", job.all?.filter((j: { isConfirmed: any; }) => j.isConfirmed).length, "/", job.all?.length);

  return (
    <div className="relative border rounded-xl p-4 shadow bg-white">
      {job.isCancel ? null : ( job.isConfirmed ? (
        <FileToBase64 onBase64ListReady={handleUpload} />
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

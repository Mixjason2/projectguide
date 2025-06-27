import { useEffect, useState } from "react";
import { Job, MergedJob } from "@/app/types/job";
import AllJobDetails from "./AllJobDetails";

interface Props {
  detailJobs: Job[] | null;
  mergedJob: MergedJob;
  setDetailJobs: React.Dispatch<React.SetStateAction<Job[] | null>>;
}

const AllJobDetailsModal: React.FC<Props> = ({ detailJobs, mergedJob, setDetailJobs }) => {
  console.log("AllJobDetailsModal is rendering...");

  // ถ้าไม่มีข้อมูล หรือ mergedJob ไม่พร้อม ให้ไม่แสดง Modal
  if (!detailJobs || !mergedJob) return null;

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(true); // สร้าง state สำหรับเปิด/ปิด modal

  // เมื่อ modal ปิด
  const handleCloseModal = (e: React.MouseEvent | React.SyntheticEvent) => {
    console.log("Closing modal...");
    setModalIsOpen(false); // ตั้งค่าให้ modal ปิด
    setDetailJobs(null); // Close modal by setting detailJobs to null
    console.log("setDetailJobs called with null");
  };

  useEffect(() => {
    // เมื่อ `detailJobs` ถูกตั้งค่าใหม่ (ไม่เป็น null) ให้เปิด modal
    if (detailJobs !== null) {
      setModalIsOpen(true); // เปิด modal
    }
  }, [detailJobs]); // ใช้ `detailJobs` เป็น dependency เพื่อให้ modal เปิดใหม่เมื่อข้อมูลถูกตั้งค่า

  return (
    modalIsOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        onClick={handleCloseModal} // คลิกพื้นหลังจะปิด modal
      >
        <div
          className="bg-white rounded-xl shadow-2xl border-4 border-blue-400 p-8 max-w-2xl w-full relative animate-fade-in"
          onClick={(e) => e.stopPropagation()} // ป้องกันไม่ให้คลิกใน modal ปิด modal
        >
          <button
            className="absolute top-2 right-2 btn btn-sm btn-error"
            onClick={(e) => {
              e.stopPropagation(); // หยุดการ bubble ของ event ที่มาจากการคลิกปุ่ม
              handleCloseModal(e); // ปิด modal
            }}
          >
            ✕
          </button>
          <h2 className="text-xl font-Arial mb-4">All Job Details</h2>
          <AllJobDetails
            job={mergedJob}
            jobs={detailJobs}
            formatDate={(d) => new Date(d).toLocaleDateString()}
          />
        </div>
      </div>
    )
  );
};

export default AllJobDetailsModal;

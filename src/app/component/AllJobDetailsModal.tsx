import { useEffect, useState } from "react";
import { Job } from "@/app/types/job";
import AllJobDetails from "./AllJobDetails";

interface Props {
  detailJobs: Job[] | null;
  setDetailJobs: React.Dispatch<React.SetStateAction<Job[] | null>>;
}

const AllJobDetailsModal: React.FC<Props> = ({ detailJobs, setDetailJobs}) => {
  console.log("AllJobDetailsModal is rendering...");

  // Modal open/close state
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(true);

  // Close modal
  const handleCloseModal = () => {
    console.log("Closing modal...");
    setModalIsOpen(false);
    setDetailJobs(null); // Close modal by setting detailJobs to null
    console.log("setDetailJobs called with null");
  };

  useEffect(() => {
    // Open modal when detailJobs is set
    if (detailJobs !== null) {
      setModalIsOpen(true);
    }
  }, [detailJobs]); // Use detailJobs as dependency to reopen modal when data is updated

  return (
    modalIsOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        onClick={handleCloseModal}
      >
        <div
          className="bg-white rounded-xl shadow-2xl border-4 border-blue-400 p-8 max-w-2xl w-full relative animate-fade-in"
          onClick={(e) => e.stopPropagation()} // Prevent click event from closing modal
        >
          <button
            className="absolute top-2 right-2 btn btn-sm btn-error text-3xl text-red-600"
            onClick={(e) => {
              e.stopPropagation(); // Stop event bubbling
              handleCloseModal(); // Close modal
            }}
          >
            ✕
          </button>
          <h2 className="text-xl font-Arial mb-4">All Job Details</h2>
          {detailJobs && (
            <AllJobDetails
              job={detailJobs[0]}  // Or another appropriate job if required
              jobs={detailJobs}  // Pass the entire array of jobs
              formatDate={(d) => new Date(d).toLocaleDateString()}  // Date formatting function
            />
          )}
        </div>
      </div>
    )
  );
};

export default AllJobDetailsModal;

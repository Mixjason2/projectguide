// component/AllJobDetailsModal.tsx

import { Job } from "@/app/types/job";
import AllJobDetails from "./AllJobDetails";

interface Props {
  detailJobs: Job[] | null;
  setDetailJobs: React.Dispatch<React.SetStateAction<Job[] | null>>;
}

const AllJobDetailsModal: React.FC<Props> = ({ detailJobs, setDetailJobs }) => {
  if (!detailJobs) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl border-4 border-blue-400 p-8 max-w-2xl w-full relative animate-fade-in">
        <button
          className="absolute top-2 right-2 btn btn-sm btn-error"
          onClick={() => setDetailJobs(null)}
        >
          ✕
        </button>
        <h2 className="text-xl font-Arial mb-4">All Job Details</h2>
        <AllJobDetails jobs={detailJobs} formatDate={(d) => new Date(d).toLocaleDateString()} />
      </div>
    </div>
  );
};

export default AllJobDetailsModal;

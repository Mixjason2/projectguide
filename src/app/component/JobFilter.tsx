import { FilterStatus } from "@/app/types/job"; // Ensure 'FilterStatus' is exported from this module or replace with the correct type.
import { FilterProps } from "@/app/types/job"; // ปรับ path ตามโครงสร้างของคุณ

const JobFilter: React.FC<FilterProps> = ({ value, onChange }) => {
  return (
    <div className="flex gap-2 mb-4">
      {(["all", "confirmed", "cancelled"] as FilterStatus[]).map((status) => (
        <button
          key={status}
          onClick={() => onChange(status)}
          className={`px-4 py-1 rounded ${
            value === status
              ? status === "confirmed"
                ? "bg-green-500 text-white"
                : status === "cancelled"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          {status === "all"
            ? "All Jobs"
            : status === "confirmed"
            ? "Confirmed"
            : "Cancelled"}
        </button>
      ))}
    </div>
  );
};

export default JobFilter;

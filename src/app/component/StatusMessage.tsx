import React from "react";
import { Ripple } from 'react-spinners-css';
import { Props } from "@/app/types/job"; // ปรับ path ตามโครงสร้างของคุณ

const StatusMessage: React.FC<Props> = ({ loading, error, filteredJobsLength }) => {
  if (loading) {
    return (
      <div className="w-full py-10 flex flex-col items-center justify-center text-gray-600">
        <Ripple color="#32cd32" size="medium" />
        <p className="mt-4 text-lg font-medium">Loading jobs, please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 text-center bg-red-100 border border-red-300 rounded-md max-w-md mx-auto">
        <p className="text-lg font-semibold">Oops! Something went wrong.</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (filteredJobsLength === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p className="text-lg font-semibold">No jobs found</p>
        <p className="text-sm mt-1">Try adjusting your filters or search keyword.</p>
      </div>
    );
  }

  return null;
};

export default StatusMessage;

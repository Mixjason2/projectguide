import React from 'react';
import { JobsSummaryProps } from "@/app/types/job"; // ปรับ path ตามโครงสร้างของคุณ

const JobsSummary: React.FC<JobsSummaryProps> = ({ filteredByDate }) => {
  return (
    <div className="w-full flex justify-end mb-6">
      <div className="flex flex-row flex-wrap gap-6 bg-white border border-blue-300 rounded-xl shadow-lg px-8 py-4 items-center max-w-3xl">
        {['All Jobs', 'New Jobs', 'Changed Jobs'].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                ['bg-neutral-700', 'bg-cyan-600', 'bg-orange-400'][i]
              }`}
            ></span>
            <span className="text-gray-500">{label}:</span>
            <span className="font-Arial text-[#2D3E92]">
              {i === 0
                ? filteredByDate.length
                : filteredByDate.filter(job => (i === 1 ? job.isNew : job.isChange)).length}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsSummary;

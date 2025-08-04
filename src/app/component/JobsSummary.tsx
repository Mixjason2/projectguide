import React from 'react';
import { JobsSummaryProps } from "@/app/types/job"; // ปรับ path ตามโครงสร้างของคุณ

const JobsSummary: React.FC<JobsSummaryProps> = ({ filteredByDate }) => {
  const labels = ['All Jobs', 'New Jobs', 'Changed Jobs', 'Confirmed Jobs'];
  const colors = ['bg-neutral-700', 'bg-cyan-600', 'bg-orange-400', 'bg-green-600'];

  return (
    <div className="w-full flex justify-end mb-6">
      <div className="flex flex-row flex-wrap gap-6 bg-white border border-blue-300 rounded-xl shadow-lg px-8 py-4 items-center max-w-4xl">
        {labels.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${colors[i]}`}></span>
            <span className="text-gray-500">{label}:</span>
            <span className="font-Arial text-[#2D3E92]">
              {i === 0
                ? filteredByDate.length
                : i === 1
                ? filteredByDate.filter(job => job.isNew).length
                : i === 2
                ? filteredByDate.filter(job => job.isChange).length
                : filteredByDate.filter(job => job.IsConfirmed === true).length}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsSummary;

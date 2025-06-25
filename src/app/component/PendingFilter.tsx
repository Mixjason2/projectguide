import React from "react";
import { PendingFilterProps } from "@/app/types/job"; // ปรับ path ตามโครงสร้างของคุณ

const PendingFilter: React.FC<PendingFilterProps> = ({ showPendingOnly, onChange }) => {
  return (
    <div className="flex flex-col items-center w-32 text-sm text-gray-700">
      <span className="mb-1 text-center">Show Pending</span>
      <input
        type="checkbox"
        checked={showPendingOnly}
        onChange={e => onChange(e.target.checked)}
        className="checkbox checkbox-secondary"
      />
    </div>
  );
};

export default PendingFilter;

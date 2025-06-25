import React from "react";
import { PendingFilterProps } from "@/app/types/job"; // ปรับ path ตามโครงสร้างของคุณ

const PendingFilter: React.FC<PendingFilterProps> = ({ showPendingOnly, onChange }) => {
  return (
    <div className="mb-4 flex items-center gap-2 px-4">
      <input
        type="checkbox"
        id="showPendingOnly"
        checked={showPendingOnly}
        onChange={e => onChange(e.target.checked)}
        className="checkbox checkbox-secondary"
      />
      <label htmlFor="showPendingOnly" className="font-Arial text-sm text-gray-700 cursor-pointer">
        Show Pending Only
      </label>
    </div>
  );
};

export default PendingFilter;

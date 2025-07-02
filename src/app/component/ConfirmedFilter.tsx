import React from "react";
import { ConfirmedFilterProps } from "@/app/types/job"; // ปรับ path ตามโครงสร้างของคุณ

const ConfirmedFilter: React.FC<ConfirmedFilterProps> = ({ showConfirmedOnly, onChange }) => {
  return (
    <div className="flex flex-col items-center w-32 text-sm text-gray-700">
      <span className="mb-1 text-center">Show Confirmed</span>
      <input
        type="checkbox"
        checked={showConfirmedOnly}
        onChange={e => onChange(e.target.checked)}
        className="checkbox checkbox-primary"
      />
    </div>
  );
};

export default ConfirmedFilter;
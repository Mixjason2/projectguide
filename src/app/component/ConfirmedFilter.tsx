import React from "react";
import { ConfirmedFilterProps } from "@/app/types/job"; // ปรับ path ตามโครงสร้างของคุณ

const ConfirmedFilter: React.FC<ConfirmedFilterProps> = ({ showConfirmedOnly, onChange }) => {
  return (
    <div className="mb-4 flex items-center gap-2 px-4">
      <input
        type="checkbox"
        id="showConfirmedOnly"
        checked={showConfirmedOnly}
        onChange={e => onChange(e.target.checked)}
        className="checkbox checkbox-primary"
      />
      <label htmlFor="showConfirmedOnly" className="font-Arial text-sm text-gray-700 cursor-pointer">
        Show Confirmed Only
      </label>
    </div>
  );
};

export default ConfirmedFilter;
'use client'
import CssgGuide from "../cssguide";
import { useState } from "react";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function CalendarExcel() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed

  const days = getDaysInMonth(year, month);

  // Create a 6x7 grid (weeks x days)
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sunday
  const cells: (number | null)[] = Array(firstDay).fill(null)
    .concat(Array.from({ length: days }, (_, i) => i + 1));
  while (cells.length % 7 !== 0) cells.push(null);

  // Editable cell state
  const [data, setData] = useState<{ [key: number]: string }>({});

  // Month navigation handlers
  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };

  return (
    <CssgGuide>
      <div className="flex justify-center py-8">
        <div className="overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <button className="btn btn-sm btn-outline" onClick={prevMonth}>&lt;</button>
            <span className="font-bold text-lg">{monthNames[month]} {year}</span>
            <button className="btn btn-sm btn-outline" onClick={nextMonth}>&gt;</button>
          </div>
          <table className="table table-bordered border border-base-300 bg-base-100 shadow-lg rounded-box min-w-[600px]">
            <thead>
              <tr>
                <th className="text-center">Sun</th>
                <th className="text-center">Mon</th>
                <th className="text-center">Tue</th>
                <th className="text-center">Wed</th>
                <th className="text-center">Thu</th>
                <th className="text-center">Fri</th>
                <th className="text-center">Sat</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: cells.length / 7 }).map((_, week) => (
                <tr key={week}>
                  {cells.slice(week * 7, week * 7 + 7).map((day, i) => (
                    <td key={i} className="p-0">
                      {day ? (
                        <input
                          className="w-full h-12 px-2 border-none focus:outline-none"
                          type="text"
                          placeholder={String(day)}
                          value={data[day] || ""}
                          onChange={e =>
                            setData({ ...data, [day]: e.target.value })
                          }
                        />
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CssgGuide>
  );
}
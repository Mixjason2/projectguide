'use client'

import CssgGuide from '../cssguide'

export default function HomePage() {
  return (
    <CssgGuide>
      <div className="overflow-x-auto flex justify-center py-8">
        <div className="bg-base-100 rounded-xl shadow-xl border border-base-300 w-full max-w-5xl">
          <table className="table table-zebra w-full">
            {/* head */}
            <thead>
              <tr>
                <th>
                  <label>
                  </label>
                </th>
                <th>Name</th>
                <th>Job</th>
                <th>Favorite Color</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* No data row */}
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-12">
                  No data available.
                </td>
              </tr>
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Job</th>
                <th>Favorite Color</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </CssgGuide>
  )
}
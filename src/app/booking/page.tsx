"use client";

import React, { useEffect, useState } from "react";
import CssgGuide from "../cssguide";

type Job = {
  Service_Date: string;
  Source: string;
  Booking_Reference: string;
  BookinName: string;
  DAY: number;
  SEQ: number;
  ServiceType: string;
  ServiceProductCode: string;
  ServiceProductName: string;
  ServiceLocationCode: string;
  ServiceLocationName: string;
  ServiceTypeName: string;
  Productdescript: string;
  ServiceSupplierCode: string;
  ServiceSupplierName: string;
  Pickup_Date: string;
  Pickup_Time: string;
  Pickup: string;
  Dropoff_Date: string;
  Dropoff_Time: string;
  Dropoff: string;
  Remarks: string;
  PKG_Name: string;
  AdultQty: number;
  ChildQty: number;
  ChildShareQty: number;
  InfantQty: number;
  Pax: number;
  PCM_ID: number;
  PCM_SEQ: number;
  Class: string;
  Comment: string;
  BookingName: string;
  Pax_name: string;
  AgentCode: string;
  AgentName: string;
  AgentCountry: string;
  AgentReference: string;
  VoucherNumber: number;
  ServiceStatusCode: string;
  Booking_Name: string;
  Booking_Type: string;
  Booking_Status: string;
  Booking_Consultant: string;
  Booking_DepartmentCode: string;
  Booking_Department: string;
  Supplier: string;
  COST: string;
  RETAIL: string;
  Profit: string;
  EMAIL: string;
  Consultant: string;
  Phone: string;
  LastWorkDate: string;
};

export default function Booking() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailJobs, setDetailJobs] = useState<Job | null>(null);


  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    setLoading(true);
    fetch("https://operation.dth.travel:7082/api/booking/THTA129605", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: "AVM4UmVVMJuXWXzdOvGgaTqNm/Ysfkw0DnscAzbE+J4+Kr7AYjIs7Eu+7ZXBGs+MohOuqTTZkdIiJ5Iw8pQVJ0tWaz/R1sbE8ksM2sKYSTDKrKtQCYfZuq8IArzwBRQ3E1LIlS9Wb7X2G3mKkJ+8jCdb1fFy/76lXpHHWrI9tqt2/IXD20ZFYZ41PTB0tEsgp9VXZP8I5j+363SEnn5erg==",
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        const jobsArray = Array.isArray(data) ? data : [data];
        setJobs(jobsArray);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }
  return (
    <CssgGuide>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-1">
          Booking Reference:{" "}
          <span className="text-[#2D3E92]">{jobs[0]?.Booking_Reference || "-"}</span>
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-[#2D3E92] text-white">
              <tr>
                <th className="px-3 py-2 text-left">Day/Seq</th>
                <th className="px-3 py-2 text-left">Location</th>
                <th className="px-3 py-2 text-left">Service</th>
                <th className="px-3 py-2 text-left">Supplier Name</th>
                <th className="px-3 py-2 text-left">Product Description</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Voucher No.</th>
                <th className="px-3 py-2 text-left">Cost</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {[...jobs]
                // .sort(
                //   // (a, b) =>
                //   //   new Date(a.Service_Date).getTime() -
                //   //   new Date(b.Service_Date).getTime()
                // )
                .map((job, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2">{`${job.DAY}/${job.SEQ}`}</td>
                    <td className="px-3 py-2">{job.ServiceLocationCode}</td> 
                    <td className="px-3 py-2">{job.ServiceTypeName}</td>
                    <td className="px-3 py-2">
                      {job.ServiceSupplierName} ({job.Class})
                    </td>
                    <td className="px-3 py-2">
                      {job.Productdescript} ({job.Class})
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {new Date(job.Service_Date).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2">{job.Booking_Status}</td>
                    <td className="px-3 py-2">{job.VoucherNumber}</td>
                    <td className="px-3 py-2">{job.COST}</td>                   
                  </tr>
                ))}
            </tbody>

          </table>
        </div>

      </div>
    </CssgGuide>
  );

}

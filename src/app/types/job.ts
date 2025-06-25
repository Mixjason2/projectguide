import { ChangeEvent, ReactNode } from "react";

export type Job = {
  Driver: any;
  Vehicle: any;
  Guide: any;
  serviceSupplierName: string;
  Comment: any;
  pax_name: ReactNode;
  Class: any;
  Booking_Name: ReactNode;
  AdultQty: number;
  ChildQty: number;
  ChildShareQty: number;
  InfantQty: number;
  Phone: any;
  Booking_Consultant: ReactNode;
  TypeName: any;
  serviceTypeName: any;
  isChange: boolean;
  isNew: boolean;
  keys: number[];
  key: number;
  PNR: string;
  PNRDate: string;
  BSL_ID: string;
  PickupDate: string;
  Pickup: string;
  DropoffDate: string;
  Dropoff: string;
  Source: string;
  Pax: number;
  IsConfirmed: boolean;
  IsCancel: boolean;
  NotAvailable: any;
  Photo?: string;
  Remark?: string;
};

export type MergedJob = Job & {
  keys: number[]; // ถูกเซ็ตไว้ในฟังก์ชันแล้ว
  all: Job[];     // เก็บ job ทุกตัวที่รวมกันด้วย PNR เดียวกัน
};

export type ExpandedJobDetailProps = {
  job: Job;
  jobs: Job[];
  expandedPNRs: Record<string, boolean>;
  renderPlaceDate: (place: string, date: string, label: string) => ReactNode;
  renderField: (label: string, value: any) => ReactNode;
};

export type FetchStatusProps = {
  loading: boolean;
  error: string | null;
  filteredJobsLength: number;
};

export type JobDetailsProps = {
  jobs: Job[];
  formatDate: (dateStr: string) => string;
};

export type JobActionProps = {
  job: any; // หรือ Job ถ้ามี type
  setJobs: React.Dispatch<React.SetStateAction<any[]>>; // หรือ Job[]
};

export type FilterStatus = "all" | "confirmed" | "cancelled";

export type FilterProps = {
  value: FilterStatus;
  onChange: (status: FilterStatus) => void;
};

export type ConfirmedFilterProps = {
  showConfirmedOnly: boolean;
  onChange: (checked: boolean) => void;
};

export type JobsSummaryProps = {
  filteredByDate: Job[];
};

export type JobCardProps = {
  job: MergedJob;
  expandedPNRs: { [pnr: string]: boolean };
  setExpandedPNRs: React.Dispatch<React.SetStateAction<{ [pnr: string]: boolean }>>;
  setDetailJobs: React.Dispatch<React.SetStateAction<Job[] | null>>;
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
};

export type Props = {
    onBase64ListReady: (b64List: string[], remark: string) => void;
};

export interface EditFormProps {
    token:string;
    bookingAssignmentId:number;
    uploadedBy:string;
    remark: string;
    previewBase64List: string[];
    loading: boolean;
    responseMsg: string | null;
    setRemark: React.Dispatch<React.SetStateAction<string>>;
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleUpload: () => void;
    handleRemovePreviewImage: (indexToDelete: number) => void;
}
import { ChangeEvent, ReactNode } from "react";

export type Job = {
  allByPNR: {};
  all: any;
  serviceProductName: any;
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

export type MergedJob = Omit<Job, 'PNR'> & {
  PNR: string[];          // เปลี่ยนจาก string เป็น array ของ PNR
  keys: number[];         // Array ของ key เพื่อเก็บงานทั้งหมดใน PNRDate
  all: Job[];             // เก็บ job ทั้งหมดที่รวมกันใน PNRDate
  allByPNR: Record<string, Job[]>;  // เก็บ job แยกตาม PNR (คือออบเจ็กต์ที่มี PNR เป็น key และ array ของ Job เป็น value)
};

export interface JobActionProps {
  job: Job;
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}

export type ExpandedJobDetailProps = {
  job: Job;
  jobs: Job[];
  expandedPNRs: Record<string, boolean>;
  renderPlaceDate: (place: string, date: string, label: string) => ReactNode;
  renderField: (label: string, value: any) => ReactNode;
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>; // เพิ่ม prop นี้เพื่อส่งไปอัปเดต jobs
};

export type FetchStatusProps = {
  loading: boolean;
  error: string | null;
  filteredJobsLength: number;
};

export interface JobDetailsProps {
  job: Job;  // Add job prop
  jobs: Job[]; // Add jobs prop
  formatDate: (date: string) => string;
}

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

export interface JobCardProps {
  job: Job[];  // Add jobGroup to the props
  expandedPNRs: { [key: string]: boolean };
  setExpandedPNRs: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  setDetailJobs: React.Dispatch<React.SetStateAction<Job[] | null>>;
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}

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

export interface PendingFilterProps {
  showPendingOnly: boolean;
  onChange: (checked: boolean) => void;
}

export interface JobKeyObj {
  key: number;
  PNR: string;
  PNRDate: string;
  Booking_Name: string;
  serviceSupplierCode_TP: string;
  // ใส่ properties อื่น ๆ ตามที่ใช้จริง
}

export interface JobToAccept {
  key: JobKeyObj[]; // เพราะ job.key คือ array ของ object แบบนี้
  IsConfirmed?: boolean[]; // หรือประเภทที่ตรงกับข้อมูลจริง
  indexInGroup: number;
  // ใส่ propertiesอื่น ๆ ที่ใช้ในฟังก์ชัน
}
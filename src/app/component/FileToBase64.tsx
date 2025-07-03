import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
import axios from "axios";
import { Job, UploadGroup, ImageData } from "@/app/types/job"; // แก้ path ให้ถูกต้อง
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';
import Image from "next/image";

const customFormatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const UploadImagesWithRemark: React.FC<{ token: string; keyValue: number; job: Job }> = ({ token, keyValue, job }) => {
    const [remark, setRemark] = useState<string>("");
    // ลบ selectedFiles เพราะไม่ได้ใช้
    const [previewBase64List, setPreviewBase64List] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [responseMsg, setResponseMsg] = useState<string | null>(null);
    const [uploadedData, setUploadedData] = useState<UploadGroup[]>([]);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [hasUploaded, setHasUploaded] = useState<boolean>(false);
    const [previewModal, setPreviewModal] = useState<{ base64: string; index: number } | null>(null);

    // useCallback เพื่อแก้ warning react-hooks/exhaustive-deps
    const fetchUploadedData = useCallback(async () => {
        console.log("🔄 กำลังโหลดข้อมูลจาก API...");
        try {
            const res = await axios.post(`https://operation.dth.travel:7082/api/upload/${keyValue}`, { token });
            console.log("✅ ได้ข้อมูลจาก API:", res.data);

            if (Array.isArray(res.data)) {
                const matched = res.data.find((item: UploadGroup) => item.BookingAssignmentId === keyValue);
                if (matched) {
                    console.log("✅ พบข้อมูลที่ตรงกับ key:", keyValue);
                    setUploadedData(res.data);
                    setHasUploaded(true);
                    setIsEditing(false);
                } else {
                    console.log("❌ ไม่มีข้อมูลที่ตรงกับ key:", keyValue);
                    setUploadedData([]);
                    setHasUploaded(false);
                    setIsEditing(false);
                }
            } else {
                console.log("❌ ข้อมูลที่ได้ไม่ใช่ array");
                setUploadedData([]);
                setHasUploaded(false);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("❌ ดึงข้อมูลไม่สำเร็จ:", error);
            setUploadedData([]);
            setHasUploaded(false);
            setIsEditing(false);
        } finally {
            setInitialLoading(false);
        }
    }, [keyValue, token]);

    useEffect(() => {
        fetchUploadedData();
    }, [fetchUploadedData]);

    const sendEmail = async ({
        emails,
        emails_CC,
        subject,
        body,
    }: {
        emails: string[];
        emails_CC: string;
        subject: string;
        body: string;
    }) => {
        try {
            const res = await axios.post("https://onlinedt.diethelmtravel.com:5281/api/EmailSender", {
                emails,
                emails_CC,
                subject,
                body,
            });
            Swal.fire({
                icon: "success",
                title: "📧 Email sent successfully!",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                toast: true,
                position: "top-end",
            });
            return res.data;
        } catch (error) {
            console.error("❌ Failed to send email", error);
            Swal.fire({
                icon: "error",
                title: "❌ Failed to send email",
                showConfirmButton: false,
                timer: 2500,
                toast: true,
                position: "top-end",
            });
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        console.log("📁 เริ่มแปลงไฟล์:", file.name);
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                console.log("✅ แปลงสำเร็จ:", file.name);
                resolve(reader.result as string);
            };
            reader.onerror = error => {
                console.error("❌ แปลงไฟล์ล้มเหลว:", error);
                reject(error);
            };
        });
    };

    // กรณีผู้ใช้คลิก Edit
    const handleEdit = () => {
        if (uploadedData && Array.isArray(uploadedData) && uploadedData.length > 0) {
            setRemark(uploadedData[0].Remark || "");
            setPreviewBase64List(uploadedData[0].Images.map((img: ImageData) => img.ImageBase64));
            setIsEditing(true);
        }
    };

    const openPreview = (base64: string, index: number) => {
        setPreviewModal({ base64, index });
    };

    // ฟังก์ชันปิด modal
    const closePreview = () => {
        setPreviewModal(null);
    };

    const handleRemovePreviewImage = async (groupIndex: number, imageIndex: number) => {
        if (!uploadedData) return;

        const updatedData = [...uploadedData];
        const target = updatedData[groupIndex];

        const updatedImages = target.Images.filter((_: ImageData, idx: number) => idx !== imageIndex);

        updatedData[groupIndex] = {
            ...target,
            Images: updatedImages,
        };

        setUploadedData(updatedData);

        if (groupIndex === 0) {
            const updatedBase64List = updatedImages.map((img: ImageData) => img.ImageBase64);
            setPreviewBase64List(updatedBase64List);
        }

        // ✅ ส่ง payload ไปยัง backend
        const payload = {
            token,
            data: {
                key: target.key,
                Remark: target.Remark,
                BookingAssignmentId: keyValue,
                UploadBy: target.UploadBy || "Your Name",
                UploadDate: new Date().toISOString(),
                Images: updatedImages,
            },
        };

        try {
            await axios.post(`https://operation.dth.travel:7082/api/upload/${keyValue}/update`, payload);
            console.log("✅ Deleted image from server");
        } catch (error) {
            console.error("❌ Failed to delete image from server", error);
        }
    };

    const handleSave = async () => {
        if (!uploadedData || !Array.isArray(uploadedData) || uploadedData.length === 0) return;
        setLoading(true);
        setResponseMsg(null);
        const payload = {
            token,
            data: {
                key: uploadedData[0].key, // หรือ BookingAssignmentId ถ้าคุณใช้เป็น key
                Remark: remark,
                BookingAssignmentId: keyValue,
                UploadBy: uploadedData[0].UploadBy || "Your Name",
                UploadDate: new Date().toISOString(),
                Images: previewBase64List.map(base64 => ({ ImageBase64: base64 })),
            },
        };
        console.log(payload);
        try {
            const res = await axios.post(
                `https://operation.dth.travel:7082/api/upload/${keyValue}/update`,
                payload
            );
            setResponseMsg(res.data.message || "อัปเดตสำเร็จ");
            await fetchUploadedData();
            await sendEmail({
                emails: ["veeratha.p@dth.travel"],
                emails_CC: "",
                subject: `Updated: ${keyValue}`,
                body: `<table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="text-align: left;">Information</th>
      <th style="text-align: left;">Details</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>DTH Ref. No.</td><td>${job.PNR}</td></tr>
    <tr><td>Service Name</td><td>${job.serviceProductName}</td></tr>
    <tr><td>Service Date</td><td>${customFormatDate(job.PNRDate)}</td></tr>
    <tr><td>Comment</td><td>${job.Comment}</td></tr>
    <tr><td>Class</td><td>${job.Class}</td></tr>
    <tr><td>Booking Status</td><td>${job.serviceTypeName}</td></tr>
    <tr>
      <td>Client name</td>
      <td>
        ${job.pax_name}
      </td>
    </tr>
    <tr><td>Pickup Date & Time</td><td>${customFormatDate(job.PickupDate)}</td></tr>
    <tr><td>Pickup Location</td><td>${job.Pickup}</td></tr>
    <tr><td>Dropoff Date & Time</td><td>${customFormatDate(job.DropoffDate)}</td></tr>
    <tr><td>Dropoff Location</td><td>${job.Dropoff}</td></tr>
    <tr><td>Guide</td><td>${job.Guide}</td></tr>
    <tr><td>Vehicle</td><td>${job.Vehicle}</td></tr>
    <tr><td>Driver</td><td>${job.Driver}</td></tr>
    <tr><td>Remarks</td><td>${job.Remark}</td></tr>
    <tr><td>Sending by</td><td>User: </td></tr>
  </tbody>
</table>`,
            });
            setIsEditing(false);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("❌ อัปเดตล้มเหลว:", error.message);
                setResponseMsg("เกิดข้อผิดพลาด: " + error.message);
            } else {
                console.error("❌ อัปเดตล้มเหลว:", error);
                setResponseMsg("เกิดข้อผิดพลาด: Unknown error");
            }

        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const filesArray = Array.from(files);
        console.log("📂 เลือกไฟล์:", filesArray.map(f => f.name));
        // ไม่ใช้ selectedFiles แล้ว จึงไม่ต้อง set

        const base64List = await Promise.all(filesArray.map(fileToBase64));
        setPreviewBase64List(prev => [...prev, ...base64List]);
        console.log("🖼 Preview base64 พร้อม:", previewBase64List.length + base64List.length, "ไฟล์");
    };

    const handleUpload = async () => {
        setLoading(true);
        setResponseMsg(null);
        if (previewBase64List.length === 0 && remark.trim()) {
            setResponseMsg("❌ ไม่สามารถใส่ Remark โดยไม่มีรูปภาพได้");
            setLoading(false);
            return;
        }
        try {
            const payload = {
                token,
                data: {
                    Remark: remark,
                    key: keyValue,
                    Images: previewBase64List.map(base64 => ({ ImageBase64: base64 })),
                },
            };
            const res = await axios.post(`https://operation.dth.travel:7082/api/upload/`, payload);
            setResponseMsg(res.data.message || "Upload สำเร็จ");
            await fetchUploadedData();
            await sendEmail({
                emails: ["veeratha.p@dth.travel"],
                emails_CC: "",
                subject: `Uploaded: ${keyValue}`,
                body: `<table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="text-align: left;">Information</th>
      <th style="text-align: left;">Details</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>DTH Ref. No.</td><td>${job.PNR}</td></tr>
    <tr><td>Service Name</td><td>${job.serviceProductName}</td></tr>
    <tr><td>Service Date</td><td>${customFormatDate(job.PNRDate)}</td></tr>
    <tr><td>Comment</td><td>${job.Comment}</td></tr>
    <tr><td>Class</td><td>${job.Class}</td></tr>
    <tr><td>Booking Status</td><td>${job.serviceTypeName}</td></tr>
    <tr>
      <td>Client name</td>
      <td>
        ${job.pax_name}
      </td>
    </tr>
    <tr><td>Pickup Date & Time</td><td>${customFormatDate(job.PickupDate)}</td></tr>
    <tr><td>Pickup Location</td><td>${job.Pickup}</td></tr>
    <tr><td>Dropoff Date & Time</td><td>${customFormatDate(job.DropoffDate)}</td></tr>
    <tr><td>Dropoff Location</td><td>${job.Dropoff}</td></tr>
    <tr><td>Guide</td><td>${job.Guide}</td></tr>
    <tr><td>Vehicle</td><td>${job.Vehicle}</td></tr>
    <tr><td>Driver</td><td>${job.Driver}</td></tr>
    <tr><td>Remarks</td><td>${job.Remark}</td></tr>
    <tr><td>Sending by</td><td>User: </td></tr>
  </tbody>
</table>`,
            });
            setIsEditing(false);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("❌ อัปเดตล้มเหลว:", error.message);
                setResponseMsg("เกิดข้อผิดพลาด: " + error.message);
            } else {
                console.error("❌ อัปเดตล้มเหลว:", error);
                setResponseMsg("เกิดข้อผิดพลาด: Unknown error");
            }

        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <p className="text-center text-gray-500">⏳ กำลังโหลดข้อมูล...</p>;
    }
    if (uploadedData && Array.isArray(uploadedData) && hasUploaded && !isEditing) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-green-600">📦 Uploaded Summary</h2>

                {uploadedData.map((src: UploadGroup, idx: number) => (
                    <div key={idx} className="mb-4 border-b pb-4">
                        <p className="mb-2"><strong>Remark:</strong> {src.Remark}</p>
                        <div className="flex flex-wrap gap-3">
                            {src.Images?.map((img: ImageData, imgIdx: number) => (
                                <div key={imgIdx} className="relative inline-block">
                                    {img.ImageBase64.startsWith("data:application/pdf") ? (
                                        <a
                                            href={img.ImageBase64}
                                            download={`file-${imgIdx}.pdf`}
                                            className="w-20 h-20 flex items-center justify-center bg-gray-100 border rounded-lg text-blue-600 text-xs font-medium text-center hover:underline"
                                            title="ดาวน์โหลด PDF"
                                        >
                                            📄 Download PDF
                                        </a>
                                    ) : (
                                        <Image
                                            src={img.ImageBase64}
                                            alt={`uploaded-${imgIdx}`}
                                            width={80}
                                            height={80}
                                            className="object-cover rounded-lg border shadow-sm"
                                        />
                                    )}
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                                        onClick={() => handleRemovePreviewImage(idx, imgIdx)}
                                        title="ลบรูปภาพนี้"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                        </div>
                    </div>
                ))}

                <button
                    onClick={handleEdit}
                    className="mt-4 w-full py-2 px-4 rounded-full bg-yellow-500 text-white font-semibold hover:bg-yellow-600"
                >
                    ✏️ Edit
                </button>
            </div>
        );
    }
    console.log("📝 แสดงหน้าสำหรับอัปโหลดใหม่");
    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">📤 Upload Images with Remark</h2>

            <textarea
                value={remark}
                onChange={e => setRemark(e.target.value)}
                placeholder="Write your remark here..."
                className="w-full p-2 mb-4 border rounded-md resize-none"
                rows={3}
            />

            <input
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="mb-4"
            />

            <div className="flex flex-wrap gap-4 mb-4">
                {previewBase64List.map((base64, idx) => (
                    base64.startsWith("data:application/pdf") ? (
                        <a
                            key={idx}
                            href={base64}
                            download={`file-${idx}.pdf`}
                            className="w-20 h-20 flex items-center justify-center bg-gray-100 border rounded-lg text-blue-600 text-xs font-medium text-center hover:underline"
                            title="ดาวน์โหลด PDF"
                        >
                            📄 PDF {idx + 1}
                        </a>
                    ) : (
                        <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border shadow-sm">
                            <Image
                                src={base64}
                                alt={`preview-${idx}`}
                                width={500}        // กำหนดขนาดที่เหมาะสม (ปรับตามต้องการ)
                                height={300}       // กำหนดขนาดที่เหมาะสม (ปรับตามต้องการ)
                                className="object-cover cursor-pointer"
                                onClick={() => openPreview(base64, idx)}
                                style={{ width: "100%", height: "100%" }} // ถ้าต้องการให้เต็ม container
                            />
                            <button
                                type="button"
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                onClick={() => {
                                    setPreviewBase64List(prev => prev.filter((_, i) => i !== idx));
                                }}
                            >
                                ×
                            </button>
                        </div>
                    )
                ))}
            </div>

            {loading && <p className="text-blue-600 mb-2">⏳ Processing...</p>}
            {responseMsg && <p className="mb-2">{responseMsg}</p>}

            <button
                disabled={loading}
                onClick={hasUploaded ? handleSave : handleUpload}
                className={`w-full py-2 px-4 rounded-full text-white font-semibold ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
            >
                {hasUploaded ? "💾 Save" : "📤 Upload"}
            </button>

            {/* Preview modal */}
            {previewModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={closePreview}
                >
                    <Image
                        src={previewModal.base64}
                        alt={`preview-modal-${previewModal.index}`}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-lg"
                        priority // ถ้าอยากโหลดไว
                    />
                    <button
                        type="button"
                        className="absolute top-5 right-5 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
                        onClick={closePreview}
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadImagesWithRemark;

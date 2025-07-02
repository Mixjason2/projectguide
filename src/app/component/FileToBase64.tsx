import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { Job } from "@/app/types/job"; // แก้ path ให้ถูกต้อง
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

interface UploadedImage {
    ImageBase64: string;
}

interface UploadResponse {
    remark: string;
    images: UploadedImage[];
}

const UploadImagesWithRemark: React.FC<{ token: string; keyValue: number; job: Job }> = ({ token, keyValue, job }) => {
    const [remark, setRemark] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewBase64List, setPreviewBase64List] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [responseMsg, setResponseMsg] = useState<string | null>(null);
    const [uploadedData, setUploadedData] = useState<any>();
    const [initialLoading, setInitialLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [hasUploaded, setHasUploaded] = useState(false); // เคยอัปโหลดหรือยัง
    const [previewModal, setPreviewModal] = useState<{ base64: string; index: number } | null>(null);

    // โหลดข้อมูลที่เคยอัปโหลดไว้ (ถ้ามี)
    const fetchUploadedData = async () => {
        console.log("🔄 กำลังโหลดข้อมูลจาก API...");
        try {
            const res = await axios.post(`https://operation.dth.travel:7082/api/upload/${keyValue}`, { token });
            console.log("✅ ได้ข้อมูลจาก API:", res.data);

            if (Array.isArray(res.data)) {
                const flatData = res.data.flat(); // แปลง array ซ้อนให้เป็น array ปกติ
                const matched = res.data.find((item: any) => item.BookingAssignmentId === keyValue);
                if (matched) {
                    console.log("✅ พบข้อมูลที่ตรงกับ key:", keyValue);
                    setUploadedData(res.data);
                    setHasUploaded(true);
                    setIsEditing(false);
                } else {
                    console.log("❌ ไม่มีข้อมูลที่ตรงกับ key:", keyValue);
                    setUploadedData([]);
                    setHasUploaded(false);
                    setIsEditing(false); // ให้แสดงหน้า UploadsetUploadedData([]);
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
    };

    useEffect(() => {
        fetchUploadedData();
    }, [keyValue, token]);

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
            setPreviewBase64List(uploadedData[0].Images.map((img: any) => img.ImageBase64));
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

        // สร้างข้อมูลใหม่จาก state เก่า (immutable update)
        const updatedData = [...uploadedData];
        const target = updatedData[groupIndex];

        // ลบภาพออกจาก Images ใน group ที่ระบุ
        const updatedImages = target.Images.filter((_: any, idx: number) => idx !== imageIndex);

        updatedData[groupIndex] = {
            ...target,
            Images: updatedImages,
        };

        // อัพเดต state ทันทีให้ UI รีเฟรช
        setUploadedData(updatedData);

        // *** อัพเดต previewBase64List ให้ตรงกับ uploadedData[0].Images ***
        if (groupIndex === 0) {
            const updatedBase64List = updatedImages.map((img: any) => img.ImageBase64);
            setPreviewBase64List(updatedBase64List);
        }

        // ส่งลบภาพไป backend
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
        console.log(payload)
        try {
            const res = await axios.post(
                `https://operation.dth.travel:7082/api/upload/${keyValue}/update`, // <-- ใช้ endpoint แก้ไขจริง
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
    <tr><td>Service Date</td><td>${job.PNRDate}</td></tr>
    <tr><td>Comment</td><td>${job.Comment}</td></tr>
    <tr><td>Class</td><td>${job.Class}</td></tr>
    <tr><td>Booking Status</td><td>${job.serviceTypeName}</td></tr>
    <tr>
      <td>Client name</td>
      <td>
        ${job.pax_name}
      </td>
    </tr>
    <tr><td>Pickup Date & Time</td><td>${job.PickupDate}</td></tr>
    <tr><td>Pickup Location</td><td>${job.Pickup}</td></tr>
    <tr><td>Dropoff Date & Time</td><td>${job.DropoffDate}</td></tr>
    <tr><td>Dropoff Location</td><td>${job.Dropoff}</td></tr>
    <tr><td>Guide</td><td>${job.Guide}</td></tr>
    <tr><td>Vehicle</td><td>${job.Vehicle}</td></tr>
    <tr><td>Driver</td><td>${job.Driver}</td></tr>
    <tr><td>Remarks</td><td>${job.Remark}</td></tr>
    <tr><td>Sending by</td><td>User: </td></tr>
  </tbody>
</table>`
,
            });
            setIsEditing(false);
        } catch (error: any) {
            console.error("❌ อัปเดตล้มเหลว:", error);
            setResponseMsg("เกิดข้อผิดพลาด: " + (error.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const filesArray = Array.from(files);
        console.log("📂 เลือกไฟล์:", filesArray.map(f => f.name));
        setSelectedFiles(filesArray);

        const base64List = await Promise.all(filesArray.map(fileToBase64));
        setPreviewBase64List(prev => [...prev, ...base64List]); // append รูป base64
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
    <tr><td>Service Date</td><td>${job.PNRDate}</td></tr>
    <tr><td>Comment</td><td>${job.Comment}</td></tr>
    <tr><td>Class</td><td>${job.Class}</td></tr>
    <tr><td>Booking Status</td><td>${job.serviceTypeName}</td></tr>
    <tr>
      <td>Client name</td>
      <td>
        ${job.pax_name}
      </td>
    </tr>
    <tr><td>Pickup Date & Time</td><td>${job.PickupDate}</td></tr>
    <tr><td>Pickup Location</td><td>${job.Pickup}</td></tr>
    <tr><td>Dropoff Date & Time</td><td>${job.DropoffDate}</td></tr>
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
        } catch (error: any) {
            setResponseMsg("เกิดข้อผิดพลาด: " + (error.message || "Unknown error"));
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

                {uploadedData.map((src: any, idx: number) => (
                    <div key={idx} className="mb-4 border-b pb-4">
                        <p className="mb-2"><strong>Remark:</strong> {src.Remark}</p>
                        <div className="flex flex-wrap gap-3">
                            {src.Images?.map((img: any, imgIdx: number) => (
                                img.ImageBase64.startsWith("data:application/pdf") ? (
                                    <a
                                        key={imgIdx}
                                        href={img.ImageBase64}
                                        download={`file-${imgIdx}.pdf`}
                                        className="w-20 h-20 flex items-center justify-center bg-gray-100 border rounded-lg text-blue-600 text-xs font-medium text-center hover:underline"
                                        title="ดาวน์โหลด PDF"
                                    >
                                        📄 Download PDF
                                    </a>
                                ) : (
                                    <img
                                        key={imgIdx}
                                        src={img.ImageBase64}
                                        alt={`uploaded-${imgIdx}`}
                                        className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                                    />
                                )
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
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                placeholder="กรอก Remark"
                value={remark}
                rows={3}
                onChange={e => setRemark(e.target.value)}
            />
            <input
                type="file"
                accept="image/*,application/pdf" // 👈 เพิ่ม pdf
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-100 file:text-blue-700
          hover:file:bg-blue-200 mb-4"
            />
            <div className="flex flex-wrap gap-3 mb-4">
                {uploadedData && uploadedData.map((src: any, groupIdx: number) => (
                    <div key={groupIdx} className="mb-4 border-b pb-4">
                        <p className="mb-2"><strong>Remark:</strong> {src.Remark}</p>
                        <div className="flex flex-wrap gap-3">
                            {src.Images?.map((img: any, imgIdx: number) => (
                                <div key={imgIdx} className="relative group">
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
                                        <img
                                            src={img.ImageBase64}
                                            alt={`uploaded-${imgIdx}`}
                                            className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                                            onClick={() => openPreview(img.ImageBase64, imgIdx)}  // <-- เพิ่มตรงนี้
                                        />
                                    )}

                                    <button
                                        onClick={() => handleRemovePreviewImage(groupIdx, imgIdx)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
                                        title="Delete"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                        </div>
                    </div>
                ))}
                {previewModal && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                        onClick={closePreview}
                    >
                        <div
                            className="relative max-w-3xl max-h-[80vh] p-4 bg-white rounded-lg shadow-lg"
                            onClick={(e) => e.stopPropagation()} // กันคลิกหลุดจาก modal
                        >
                            {/* รูปภาพใหญ่ */}
                            {/* รูปภาพใหญ่ */}
                            {previewModal.base64.startsWith("data:application/pdf") ? (
                                <iframe
                                    src={previewModal.base64}
                                    className="w-full h-[70vh]"
                                    title="PDF Preview"
                                />
                            ) : (
                                <img
                                    src={previewModal.base64}
                                    alt={`Preview-${previewModal.index}`}
                                    className="max-w-full max-h-[70vh] rounded"
                                />
                            )}

                            {/* ปุ่มดาวน์โหลด */}
                            <div className="flex justify-center mt-4">
                                <a
                                    href={previewModal.base64}
                                    download={`file-${previewModal.index}${previewModal.base64.startsWith("data:application/pdf") ? ".pdf" : ".png"}`}
                                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    ⬇️ Download
                                </a>
                            </div>


                            {/* ปุ่มปิด */}
                            <button
                                onClick={closePreview}
                                className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-2xl font-bold"
                                aria-label="Close Preview"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {!hasUploaded && (
                <button
                    onClick={handleUpload}
                    disabled={loading || (previewBase64List.length === 0 && !!remark.trim())}
                    className={`w-full py-2 px-4 rounded-full font-semibold transition ${loading || (previewBase64List.length === 0 && !!remark.trim())
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                >
                    {loading ? "Uploading..." : "📤 Upload"}
                </button>
            )}
            {hasUploaded && isEditing && (
                <button
                    onClick={handleSave}
                    disabled={loading || (previewBase64List.length === 0 && !!remark.trim())}
                    className={`w-full py-2 px-4 rounded-full font-semibold transition ${loading || (previewBase64List.length === 0 && !!remark.trim())
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                >
                    {loading ? "Saving..." : "💾 Save"}
                </button>
            )}
            {responseMsg && (
                <p className="mt-4 text-center text-sm text-green-600">{responseMsg}</p>
            )}
        </div>
    );
};

export default UploadImagesWithRemark;

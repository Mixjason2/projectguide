import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
import axios from "axios";
import { Job, UploadGroup, ImageData, PreviewImage } from "@/app/types/job"; // แก้ path ให้ถูกต้อง
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Image from 'next/image';


const UploadImagesWithRemark: React.FC<{
  token: string;
  keyValue: number;
  job: Job;
  asmdbValue: string; // เพิ่ม prop นี้เพื่อรับ asmdbValue
}> = ({ token, keyValue, job, asmdbValue }) => {
  console.log("🔍 asmdbValue received:", asmdbValue);
  const [remark, setRemark] = useState<string>("");
  const [previewBase64List, setPreviewBase64List] = useState<PreviewImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [responseMsg, setResponseMsg] = useState<string | null>(null);
  const [uploadedData, setUploadedData] = useState<UploadGroup[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hasUploaded, setHasUploaded] = useState<boolean>(false);
  const [previewModal, setPreviewModal] = useState<{ base64: string; index: number } | null>(null);

  const imagesPerRow = 4;

  const getImageRowsHtml = (images: PreviewImage[]) => {
    let rowsHtml = "";
    for (let i = 0; i < images.length; i += imagesPerRow) {
      const rowImages = images.slice(i, i + imagesPerRow);
      const tds = rowImages
        .map(
          (img, idx) => `
          <td style="padding:5px; text-align:center;">
            <img
              src="${img.base64}"
              alt="Image ${i + idx + 1}"
              style="width: 80px; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);"
            />
          </td>
        `
        )
        .join("");

      rowsHtml += `<tr>${tds}</tr>`;
    }
    return rowsHtml;
  };
  // สร้าง id แบบ UUID หรือ fallback เป็น timestamp+random
  const generateUniqueId = (): string => {
    return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  // โหลดข้อมูลที่เคยอัพโหลดมา
  const fetchUploadedData = useCallback(
    async (preserveEditMode: boolean = false) => {
      try {
        const res = await axios.post(`https://operation.dth.travel:7082/api/upload/${keyValue}`, { token });
        if (Array.isArray(res.data)) {
          const matched = res.data.find((item: UploadGroup) => item.BookingAssignmentId === keyValue);
          if (matched) {
            setUploadedData(res.data);
            setHasUploaded(true);
            if (!preserveEditMode) setIsEditing(false); // ✅ เปลี่ยนตรงนี้
            // ตอนโหลดรูปจาก backend ให้ map มาใส่ id ใหม่
            setPreviewBase64List(
              matched.Images.map((img: ImageData) => ({
                id: generateUniqueId(),
                base64: img.ImageBase64,
              }))
            );

            setRemark(matched.Remark || "");
          } else {
            setUploadedData([]);
            setHasUploaded(false);
            setIsEditing(false);
            setPreviewBase64List([]);
            setRemark("");
          }
        } else {
          setUploadedData([]);
          setHasUploaded(false);
          setIsEditing(false);
          setPreviewBase64List([]);
          setRemark("");
        }
      } catch (error) {
        console.error("❌ ดึงข้อมูลไม่สำเร็จ:", error);
        setUploadedData([]);
        setHasUploaded(false);
        setIsEditing(false);
        setPreviewBase64List([]);
        setRemark("");
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
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const closePreview = () => {
    setPreviewModal(null);
  };

  const handleRemovePreviewImage = async (idToRemove: string) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Are you sure you want to delete this image?",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      setPreviewBase64List((prev) => prev.filter((img) => img.id !== idToRemove));
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
        Images: previewBase64List.map((img) => ({
          Id: img.id, // ส่ง id unique ไป backend ด้วย
          ImageBase64: img.base64,
        })),
      },
    };
    try {
      const res = await axios.post(`https://operation.dth.travel:7082/api/upload/${keyValue}/update`, payload);
      setResponseMsg(res.data.message || "อัปเดตสำเร็จ");
      await fetchUploadedData();
      await sendEmail({
        emails: ["fomexii@hotmail.com"],
        emails_CC: "",
        subject: `Updated: ${job.PNR}`,
        body: `
    <p><strong>📌 Remark:</strong> ${remark || "-"}</p>
    <p><strong>📎 Attachments (via URL):</strong></p>
    ${previewBase64List
            .map(
              (_img, idx) =>
                `<p><a href="https://operation.dth.travel:7082/api/download/image/${asmdbValue}/${_img.id}" target="_blank">📸 View Image ${idx + 1}</a></p>`
            )
            .join("")}
  `,
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

    const imageFiles = Array.from(files).filter(
      (file) => file.type === "image/jpeg" || file.type === "image/png"
    );

    if (imageFiles.length === 0) {
      Swal.fire({
        icon: "error",
        title: "❌ Unsupported file type",
        text: "Please upload only JPEG or PNG images.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    // ✅ ตรวจสอบขนาดแต่ละไฟล์ (ห้ามเกิน 1MB)
    const oversizedFiles = imageFiles.filter((file) => file.size > 1024 * 1024); // >1MB
    if (oversizedFiles.length > 0) {
      Swal.fire({
        icon: "error",
        title: "❌ Image too large",
        text: "Each image must be less than 1MB.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    // ✅ ตรวจสอบขนาดรวม (ห้ามเกิน 10MB)
    const existingSize = previewBase64List.reduce((acc, img) => {
      // base64 size ≈ (string length × 3/4) - padding
      const sizeInBytes = (img.base64.length * 3) / 4;
      return acc + sizeInBytes;
    }, 0);

    const newTotalSize = imageFiles.reduce((acc, file) => acc + file.size, 0);
    const total = existingSize + newTotalSize;

    if (total > 10 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "❌ Total size too large",
        text: "Combined image size must be less than 10MB.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    // 🧪 แปลงและเพิ่มเข้า preview
    const base64List = await Promise.all(imageFiles.map(fileToBase64));
    const newImages: PreviewImage[] = base64List.map((base64) => ({
      id: generateUniqueId(),
      base64,
    }));

    setPreviewBase64List((prev) => [...prev, ...newImages]);
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
          Images: previewBase64List.map((img) => ({
            Id: img.id, // ส่ง id unique ไป backend ด้วย
            ImageBase64: img.base64,
          })),
        },
      };
      console.log("📤 Upload Payload:", payload);  // <-- log ตรงนี้
      const res = await axios.post(`https://operation.dth.travel:7082/api/upload/`, payload);
      setResponseMsg(res.data.message || "Upload สำเร็จ");
      await fetchUploadedData();
      await sendEmail({
        emails: ["fomexii@hotmail.com"],
        emails_CC: "",
        subject: `Upload: ${job.PNR}`,
        body: `
  <p><strong>📌 Remark:</strong> ${remark || "-"}</p>
  <p><strong>📎 Attachments (preview):</strong></p>
  <table style="border-collapse: collapse;">
    ${getImageRowsHtml(previewBase64List)}
  </table>
  <p><strong>🔗 View Images (Download URL):</strong></p>
  ${previewBase64List
            .map(
              (_img, idx) =>
                `<p><a href="https://operation.dth.travel:7082/api/download/image/${asmdbValue}/${_img.id}" target="_blank">📸 View Image ${idx + 1}</a></p>`
            )
            .join("")}
`,
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

  return (
    <div className="w-full max-w-[400px] mx-auto p-6 bg-white rounded-2xl shadow-md overflow-y-auto"
      style={{ maxHeight: "90vh" }}>
      {initialLoading ? (
        <p className="text-center text-gray-500">⏳ Loading Files...</p>
      ) : hasUploaded && !isEditing ? (
        <>
          <h2 className="text-xl font-semibold mb-4 text-green-600">📦 Uploaded Summary</h2>
          {uploadedData.map((src: UploadGroup, idx: number) => (
            <div key={idx} className="mb-4 border-b pb-4">
              <p className="mb-2">
                <strong>Remark:</strong> {src.Remark}
              </p>
              <div className="flex flex-wrap gap-3">
                {src.Images?.map((img: ImageData, imgIdx: number) => (
                  <div key={imgIdx} className="relative inline-block">
                    <Image
                      src={img.ImageBase64}
                      alt={`uploaded-${imgIdx}`}
                      width={80}
                      height={80}
                      className="object-cover rounded-lg border shadow-sm cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 w-full py-2 px-4 rounded-full bg-yellow-500 text-white font-semibold hover:bg-yellow-600"
          >
            ✏️ Edit
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">📤 Upload Images with Remark</h2>

          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Write your remark here..."
            className="w-full p-2 mb-4 border rounded-md resize-none"
            rows={3}
          />

          <input
            type="file"
            multiple
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            className="mb-4"
          />
          <div className="bg-yellow-50 text-yellow-700 text-sm p-2 rounded-md mb-2 border border-yellow-100">
            ⚠️ Each image must be smaller than <strong>1MB</strong>, and the total size of all images must not exceed <strong>10MB</strong>.
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            {previewBase64List.map((img, idx) =>
              img.base64 ? (
                <div
                  key={img.id}
                  className="relative w-20 h-20 rounded-lg overflow-hidden border shadow-sm"
                >
                  <Image
                    src={img.base64}
                    alt={`preview-${idx}`}
                    width={80}
                    height={80}
                    className="object-cover rounded-lg cursor-pointer"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    onClick={() => {
                      handleRemovePreviewImage(img.id);
                    }}
                    title="ลบรูปภาพนี้"
                  >
                    ×
                  </button>
                </div>
              ) : null
            )}
          </div>

          {loading && <p className="text-blue-600 mb-2">⏳ Processing...</p>}
          {responseMsg && <p className="mb-2">{responseMsg}</p>}

          <button
            disabled={loading}
            onClick={hasUploaded ? handleSave : handleUpload}
            className={`w-full py-2 px-4 rounded-full text-white font-semibold ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {hasUploaded ? "💾 Save" : "📤 Upload"}
          </button>
        </>
      )}

      {previewModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closePreview}
        >
          <div className="relative w-[90vw] h-[90vh] max-w-4xl mx-auto" onClick={(e) => e.stopPropagation()}>
            <Image
              src={previewModal.base64}
              alt={`preview-modal-${previewModal.index}`}
              className="object-contain rounded-lg"
            />

            <a
              href={previewModal.base64}
              download={`image-${previewModal.index}.jpg`}
              className="absolute bottom-5 left-5 bg-blue-600 text-white py-1 px-4 rounded-md hover:bg-blue-700 text-sm"
            >
              ⬇️ Download
            </a>
          </div>

          <button
            type="button"
            className="absolute top-5 right-5 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
            onClick={(e) => {
              e.stopPropagation();
              closePreview();
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadImagesWithRemark;

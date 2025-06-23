import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";

interface UploadedImage {
    ImageBase64: string;
}

interface UploadResponse {
    remark: string;
    images: UploadedImage[];
}

const UploadImagesWithRemark: React.FC<{ token: string; keyValue: number }> = ({ token, keyValue }) => {
    const [remark, setRemark] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewBase64List, setPreviewBase64List] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [responseMsg, setResponseMsg] = useState<string | null>(null);
    const [uploadedData, setUploadedData] = useState<any>();
    const [initialLoading, setInitialLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    // โหลดข้อมูลที่เคยอัปโหลดไว้ (ถ้ามี)
    useEffect(() => {
        const fetchUploadedData = async () => {
            console.log("🔄 กำลังโหลดข้อมูลจาก API...");
            try {
                const res = await axios.post(`https://operation.dth.travel:7082/api/upload/${keyValue}`, { token });
                console.log("✅ ได้ข้อมูลจาก API:", res.data);

                if (Array.isArray(res.data)) {
                    const matched = res.data.find((item: any) => item.BookingAssignmentId === keyValue);
                    if (matched) {
                        console.log("✅ พบข้อมูลที่ตรงกับ key:", keyValue);
                        setUploadedData(res.data);
                    } else {
                        console.log("❌ ไม่มีข้อมูลที่ตรงกับ key:", keyValue);
                    }
                } else {
                    console.log("❌ ข้อมูลที่ได้ไม่ใช่ array");
                }
            } catch (error) {
                console.error("❌ ดึงข้อมูลไม่สำเร็จ:", error);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchUploadedData();
    }, [keyValue, token]);


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

    // ลบภาพที่ preview
    const handleDeleteImage = async (indexToDelete: number) => {
        const updatedList = previewBase64List.filter((_, i) => i !== indexToDelete);
        setPreviewBase64List(updatedList);
        setLoading(true);
        setResponseMsg(null);
        try {
            const payload = {
                token,
                data: {
                    key:indexToDelete,
                    // keyValue: src.key,
                    Remark: remark,
                    BookingAssignmentId: keyValue,
                    UploadBy: "Your Name",
                    UploadDate: new Date().toISOString(),
                    Images: updatedList.map(base64 => ({ ImageBase64: base64 })),
                },
            };

            console.log("📦 Payload ที่จะส่ง:", payload);
            const res = await axios.post(`https://operation.dth.travel:7082/api/upload/${keyValue}/delete`, payload);
            console.log("✅ Delete สำเร็จ:", res.data);

            setResponseMsg(res.data.message || "delete สำเร็จ");
            setUploadedData(res.data.data);
        } catch (error: any) {
            console.error("❌ delete ล้มเหลว:", error);
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
        setPreviewBase64List(base64List);
        console.log("🖼 Preview base64 พร้อม:", base64List.length, "ไฟล์");
    };

    const handleUpload = async (obj: any) => {
        if (!remark) {
            alert("กรุณากรอก Remark");
            return;
        }
        if (previewBase64List.length === 0) {
            alert("กรุณาเลือกไฟล์รูปภาพ");
            return;
        }

        setLoading(true);
        setResponseMsg(null);
        console.log("📤 เริ่มอัปโหลดข้อมูล...");

        try {
            const payload = {
                token,
                data: {
                    // keyValue: src.key,
                    Remark: remark,
                    key: keyValue,
                    Images: previewBase64List.map(base64 => ({ ImageBase64: base64 })),
                },
            };

            console.log("📦 Payload ที่จะส่ง:", payload);
            const res = await axios.post(`https://operation.dth.travel:7082/api/upload/`, payload);
            console.log("✅ Upload สำเร็จ:", res.data);

            setResponseMsg(res.data.message || "Upload สำเร็จ");
            setUploadedData(res.data.data);
        } catch (error: any) {
            console.error("❌ Upload ล้มเหลว:", error);
            setResponseMsg("เกิดข้อผิดพลาด: " + (error.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        console.log("⏳ กำลังโหลด initial data...");
        return <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>;
    }

    if (uploadedData && !isEditing) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-green-600">📦 Uploaded Summary</h2>

                {uploadedData.map((src: any, idx: number) => (
                    <div key={idx} className="mb-4 border-b pb-4">
                        <p className="mb-2"><strong>Remark:</strong> {src.Remark}</p>
                        <div className="flex flex-wrap gap-3">
                            {src.Images.map((img: any, imgIdx: number) => (
                                <img
                                    key={imgIdx}
                                    src={img.ImageBase64}
                                    alt={`uploaded-${imgIdx}`}
                                    className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                                />
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
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-100 file:text-blue-700
          hover:file:bg-blue-200 mb-4"
            />

            <div className="flex flex-wrap gap-3 mb-4">
                {uploadedData && uploadedData.map((src: any,idx:number) => (
                    <div key={idx} className="relative group">
                    <img
                        src={src.Images[0].ImageBase64}
                        alt={`uploaded-${src}`}
                        className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                    />
                    <button
                        onClick={() => handleDeleteImage(src.key)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
                        title="Delete"
                    >
                        ✕
                    </button>
                    </div>
                ))}
            </div>

            <button
                onClick={handleUpload}
                disabled={loading}
                className={`w-full py-2 px-4 rounded-full font-semibold transition ${loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
            >
                {loading ? "Uploading..." : "📨 Upload"}
            </button>

            {responseMsg && (
                <p className="mt-4 text-center text-sm text-green-600">{responseMsg}</p>
            )}
        </div>
    );
};

export default UploadImagesWithRemark;

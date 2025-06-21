import axios from "axios";
import React, { useState, ChangeEvent, useEffect } from "react";
import { HiUpload } from "react-icons/hi";
import { bookingAssignmentProps } from "@/app/types/job";

const FileToBase64: React.FC<bookingAssignmentProps> = ({ onBase64ListReady, bookingAssignmentId }) => {
    const [showBox, setShowBox] = useState(false);
    const [showResultBox, setShowResultBox] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);
    const [remark, setRemark] = useState("");
    const [base64ListToUpload, setBase64ListToUpload] = useState<string[]>([]);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // โหลดข้อมูลตอน mount หรือ bookingAssignmentId เปลี่ยน
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token") || "";
            try {
                const res = await axios.post(`https://operation.dth.travel:7082/api/upload/${bookingAssignmentId}`, { token });
                console.log("API response:", res.data);
                const data = res.data?.data; // สมมติ data เป็น array ตามตัวอย่าง

                if (data && Array.isArray(data) && data.length > 0) {
                    // สมมติ data[0] คือ object ที่เราต้องการ
                    const first = res.data;
                    console.log("First entry:", first);
                    setRemark(first.Remark || "");

                    const base64s: string[] = [];

                    if (Array.isArray(first.Images)) {
                        for (const img of first.Images) {
                            if (img.ImageBase64 && img.ImageBase64.trim() !== "") {
                                let base64 = img.ImageBase64;
                                if (!base64.startsWith("data:")) {
                                    base64 = `data:image/jpeg;base64,${base64}`;
                                }
                                base64s.push(base64);
                            }
                        }
                    }

                    setPreviews(base64s);
                    setShowResultBox(true);
                    setShowBox(false);
                    console.log("Remark set to:", first.Remark);
                    console.log("Previews set to:", base64s);
                    console.log("showResultBox set to true");
                } else {
                    setRemark("");
                    setPreviews([]);
                    setShowBox(false);
                    setShowResultBox(false);
                    console.log("No data or empty data, hide showResultBox");
                }
            } catch (error) {
                console.error("Error loading data:", error);
                setShowBox(false);
                setShowResultBox(false);
            }
        };

        if (bookingAssignmentId) {
            console.log("BookingAssignmentId changed:", bookingAssignmentId);
            fetchData();
        } else {
            console.log("No bookingAssignmentId available");
        }
    }, [bookingAssignmentId]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const fileArray = Array.from(files);

        const promises = fileArray.map(
            (file) =>
                new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (typeof reader.result === "string") {
                            resolve(reader.result);
                        } else {
                            reject("Failed to read file");
                        }
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                })
        );

        Promise.all(promises)
            .then((base64s) => {
                setBase64ListToUpload((prev) => [...prev, ...base64s]);
                setPreviews((prev) => [...prev, ...base64s]);
                setShowBox(true); // เปิดกล่อง upload เมื่อเลือกไฟล์
                setShowResultBox(false); // ปิดกล่องแสดงผลเดิมถ้ามี
            })
            .catch((err) => {
                console.error("Error converting files:", err);
            });
    };

    const handleSubmit = async () => {
        if (!base64ListToUpload.length) {
            alert("Please upload at least one file");
            return;
        }

        const token = localStorage.getItem("token") || "";

        try {
            const payload = {
                token,
                data: {
                    key: bookingAssignmentId,
                    Remark: remark,
                    Images: base64ListToUpload.map((base64) => ({ ImageBase64: base64 })),
                },
            };

            const response = await axios.post("https://operation.dth.travel:7082/api/upload", payload);

            if (response.data.success) {
                alert("Upload success!");
                onBase64ListReady(base64ListToUpload, remark);
                setShowBox(false);
                setShowResultBox(true);
                setUploadSuccess(true);
            } else {
                alert("Upload failed: " + (response.data.error || "Unknown error"));
                setUploadSuccess(false);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed.");
            setUploadSuccess(false);
        }
    };

    const handleCloseBox = () => {
        setShowBox(false);
        setRemark("");
        setPreviews([]);
        setBase64ListToUpload([]);
        setUploadSuccess(false);
    };

    return (
        <div className="relative flex flex-col justify-center items-center mt-6">
            <button
                onClick={() => {
                    console.log("uploadSuccess:", uploadSuccess);
                    console.log("showResultBox:", showResultBox);
                    console.log("showBox:", showBox);
                    // เปิดกล่อง upload หรือ show result ตามสถานะ
                    if (uploadSuccess || showResultBox) {
                        setShowResultBox(true);
                        setShowBox(false);
                        console.log("Show Result Box forced open");
                    } else {
                        setShowBox(true);
                        setShowResultBox(false);
                        console.log("Show Upload Box forced open");
                    }
                }}
                title="Attach files"
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-300 border-2 border-blue-700 shadow-md hover:shadow-lg text-white flex items-center justify-center gap-3"
            >
                <HiUpload className="text-2xl" />
                <span className="text-base font-semibold">Upload</span>
            </button>

            {showBox && (
                <>
                    <div
                        onClick={handleCloseBox}
                        className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity"
                        aria-label="Close popup"
                    ></div>

                    <div className="fixed inset-0 flex justify-center items-center z-50 p-2">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto p-6 space-y-5 relative border border-blue-200">
                            <button
                                onClick={handleCloseBox}
                                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
                                aria-label="Close"
                            >
                                &times;
                            </button>

                            <div>
                                <label className="block text-sm font-semibold text-black-700 mb-1">Remark</label>
                                <input
                                    type="text"
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                    className="w-full border border-blue-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    placeholder="Enter your remark"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-black-700 mb-1">Upload File</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    accept="image/*,application/pdf"
                                    className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-black-700 hover:file:bg-blue-100"
                                />
                            </div>

                            {previews.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {previews.map((src, idx) =>
                                        src.startsWith("data:image") ? (
                                            <img
                                                key={idx}
                                                src={src}
                                                alt={`preview-${idx}`}
                                                className="w-20 h-20 object-cover rounded border"
                                            />
                                        ) : (
                                            <div key={idx} className="flex items-center gap-1 text-blue-700">
                                                <span className="text-xl">📄</span> PDF attached
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={handleCloseBox}
                                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {showResultBox && (
                <div className="fixed inset-0 flex justify-center items-center z-50 p-2">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto p-6 space-y-5 relative border border-green-300">
                        <button
                            onClick={() => setShowResultBox(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
                            aria-label="Close"
                        >
                            &times;
                        </button>

                        <h2 className="text-lg font-semibold text-green-700">Upload Summary</h2>

                        <div className="text-sm text-gray-700">
                            <strong>Remark:</strong> {remark || "(No remark)"}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {previews.length > 0 ? previews.map((src, idx) =>
                                src.startsWith("data:image") ? (
                                    <img
                                        key={idx}
                                        src={src}
                                        alt={`preview-${idx}`}
                                        className="w-20 h-20 object-cover rounded border"
                                    />
                                ) : (
                                    <div key={idx} className="flex items-center gap-1 text-blue-700">
                                        <span className="text-xl">📄</span> PDF attached
                                    </div>
                                )
                            ) : (
                                <div className="text-gray-500 italic">No images uploaded.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileToBase64;

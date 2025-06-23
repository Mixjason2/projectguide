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

    // โหลดข้อมูลตอน mount หรือ bookingAssignmentId เปลี่ยน (ดึงข้อมูลเดิมเก็บไว้ก่อน)
    useEffect(() => {
        if (!bookingAssignmentId || typeof bookingAssignmentId !== "string" && typeof bookingAssignmentId !== "number") {
            console.log("Invalid bookingAssignmentId, skipping fetch");
            return;
        }

        const fetchData = async () => {
            const token = localStorage.getItem("token") || "";
            try {
                console.log("Fetching data for bookingAssignmentId:", bookingAssignmentId);
                const res = await axios.post(`https://operation.dth.travel:7082/api/upload/${bookingAssignmentId}`, { token });
                console.log("API response data:", res.data);
                const dataArray = res.data;

                if (!Array.isArray(dataArray) || dataArray.length === 0) {
                    console.log("No data or empty array received");
                    setRemark("");
                    setPreviews([]);
                    return;
                }

                const firstRemark = dataArray.find(entry => entry.Remark)?.Remark || "";
                console.log("First remark found:", firstRemark);

                const base64s: string[] = dataArray.flatMap(entry =>
                    Array.isArray(entry.Images)
                        ? entry.Images
                            .filter((img: { ImageBase64: string }) => img.ImageBase64 && img.ImageBase64.trim() !== "")
                            .map((img: { ImageBase64: string }) => img.ImageBase64.startsWith("data:") ? img.ImageBase64 : `data:image/jpeg;base64,${img.ImageBase64}`)
                        : []
                );

                console.log("Extracted base64 images count:", base64s.length);
                setRemark(firstRemark);
                setPreviews(base64s);
            } catch (error) {
                console.error("Error loading data:", error);
                setRemark("");
                setPreviews([]);
            }
        };

        fetchData();
    }, [bookingAssignmentId]);


    // ฟังก์ชันโหลดข้อมูลซ้ำ (ใช้ตอนกดปุ่ม Upload เพื่อตรวจสอบข้อมูลล่าสุด)
    const fetchDataAndShowSummary = async () => {
        const token = localStorage.getItem("token") || "";
        try {
            const res = await axios.post(`https://operation.dth.travel:7082/api/upload/${bookingAssignmentId}`, { token });
            const dataArray = res.data;

            if (!Array.isArray(dataArray) || dataArray.length === 0) {
                alert("No data to show in summary");
                return;
            }

            const firstRemark = dataArray.find(entry => entry.Remark)?.Remark || "";
            const base64s: string[] = dataArray.flatMap(entry =>
                Array.isArray(entry.Images)
                    ? entry.Images
                        .filter((img: { ImageBase64: string }) => img.ImageBase64 && img.ImageBase64.trim() !== "")
                        .map((img: { ImageBase64: string }) => img.ImageBase64.startsWith("data:") ? img.ImageBase64 : `data:image/jpeg;base64,${img.ImageBase64}`)
                    : []
            );

            setRemark(firstRemark);
            setPreviews(base64s);
            setShowResultBox(true);
            setShowBox(false);
        } catch (error) {
            console.error("Error loading data:", error);
            alert("Failed to load data for summary.");
        }
    };

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
                setShowBox(true);
                setShowResultBox(false);
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
                    if ((remark && remark.trim() !== "") || (previews && previews.length > 0)) {
                        setShowResultBox(true);
                        setShowBox(false);
                    } else {
                        // ถ้าไม่มีข้อมูล ให้เปิดหน้าป้อนข้อมูลเลย
                        setShowBox(true);
                        setShowResultBox(false);
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
                                    <a
                                        key={idx}
                                        href={src.startsWith("data:application/pdf") ? src : `data:application/pdf;base64,${src}`}
                                        download={`attachment-${idx + 1}.pdf`}
                                        className="flex items-center gap-1 text-blue-700 hover:underline"
                                    >
                                        <span className="text-xl">📄</span> Download PDF
                                    </a>
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

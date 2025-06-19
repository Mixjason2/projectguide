import React, { useState, ChangeEvent } from "react";

type Props = {
    onBase64ListReady: (b64List: string[], remark: string) => void;
};

const FileToBase64: React.FC<Props> = ({ onBase64ListReady }) => {
    const [showBox, setShowBox] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);
    const [remark, setRemark] = useState("");
    const [base64List, setBase64List] = useState<string[]>([]);

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
                setBase64List(base64s);
                setPreviews(base64s);
            })
            .catch((err) => {
                console.error("Error converting files:", err);
            });
    };

    const handleSubmit = () => {
        if (!base64List.length) {
            alert("Please upload at least one file");
            return;
        }
        onBase64ListReady(base64List, remark);
        setShowBox(false);
        setRemark("");
        setPreviews([]);
        setBase64List([]);
    };

    return (
        <div className="relative flex justify-center items-center mt-6">
            {/* ไอคอน 📎 ขนาดเล็กลง มีเงาเด่นขึ้น */}
            <button
                onClick={() => setShowBox(true)}
                title="Attach files"
                className="text-white hover:text-blue-100 shadow-xl rounded-full p-3 text-4xl select-none transition-all duration-300 border-4 border-blue-700 bg-blue-700"
                style={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)" }}
            >
                📎
            </button>


            {/* Overlay และ Popup */}
            {showBox && (
                <>
                    {/* Backdrop มืดทึบขึ้น */}
                    <div
                        onClick={() => setShowBox(false)} // กดพื้นที่มืดปิดกล่อง
                        className="fixed inset-0 bg-black bg-opacity-70 z-40"
                    ></div>

                    {/* กล่อง popup ตรงกลางหน้าจอ */}
                    <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-auto p-6 space-y-6 relative">
                            <button
                                onClick={() => setShowBox(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
                                aria-label="Close"
                            >
                                &times;
                            </button>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                                <input
                                    type="text"
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter remark here"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    accept="image/*,application/pdf"
                                    className="block w-full text-sm text-gray-500"
                                />
                            </div>

                            <div className="flex gap-3 flex-wrap max-h-48 overflow-auto">
                                {previews.map((src, idx) =>
                                    src.startsWith("data:image") ? (
                                        <img
                                            key={idx}
                                            src={src}
                                            alt={`preview-${idx}`}
                                            className="w-24 h-24 object-cover rounded shadow"
                                        />
                                    ) : (
                                        <div
                                            key={idx}
                                            className="text-sm text-gray-600 flex items-center gap-1 px-3 py-1 border rounded shadow"
                                        >
                                            📄 PDF {idx + 1}
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="flex justify-end gap-4">
                                {/* ลบปุ่ม Cancel ออก */}
                                <button
                                    onClick={handleSubmit}
                                    className="bg-blue-600 text-white text-sm font-semibold px-6 py-2 rounded hover:bg-blue-700"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FileToBase64;

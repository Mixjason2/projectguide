import axios from "axios";
import React, { useState, ChangeEvent } from "react";
import { HiUpload } from "react-icons/hi";

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

    const handleSubmit = async () => {
        if (!base64List.length) {
            alert("Please upload at least one file");
            return;
        }

        try {
            const res = await axios.post("https://onlinedt.diethelmtravel.com:5281/api/EmailSender", {
                emails: ['veeratha.p@dth.travel'],
                subject: 'Upload Completed',
                body: `mail body....`,
                Emails_CC: "",
            });

            alert("Email sent successfully!");

            // ค่อยแจ้งผลให้ parent หลังส่งเมลสำเร็จ
            onBase64ListReady(base64List, remark);

            // reset form
            setShowBox(false);
            setRemark("");
            setPreviews([]);
            setBase64List([]);
        } catch (error) {
            console.error("Failed to send email:", error);
            alert("Failed to send email.");
        }
    };

    return (
        // ตกแต่งตรงนี้เพิ่มเติมให้สวยงาม
        <div className="relative flex justify-center items-center mt-6">
            <button
                onClick={() => setShowBox(true)}
                title="Attach files"
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-300 border-2 border-blue-700 shadow-md hover:shadow-lg text-white flex items-center justify-center gap-3"
            >
                <HiUpload className="text-2xl" />
                <span className="text-base font-semibold">Upload</span>
            </button>


            {/* Overlay and Popup */}
            {showBox && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => setShowBox(false)}
                        className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity"
                        aria-label="Close popup"
                    ></div>

                    {/* Centered Popup Box */}
                    <div className="fixed inset-0 flex justify-center items-center z-50 p-2">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto p-6 space-y-5 relative border border-blue-200">
                            {/* Close Button */}
                            <button
                                onClick={() => setShowBox(false)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
                                aria-label="Close"
                            >
                                &times;
                            </button>

                            {/* Remark Input */}
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

                            {/* File Upload */}
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

                            {/* Preview (optional) */}
                            {previews?.length > 0 && (
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

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => setShowBox(false)}
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
        </div>
    );
};

export default FileToBase64;

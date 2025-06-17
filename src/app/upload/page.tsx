// components/FileToBase64.tsx
import React, { useState, ChangeEvent } from "react";

const FileToBase64 = ({
  onBase64ListReady,
}: {
  onBase64ListReady: (b64List: string[]) => void;
}) => {
  const [previews, setPreviews] = useState<string[]>([]);

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
              reject("อ่านไฟล์ไม่สำเร็จ");
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    Promise.all(promises)
      .then((base64List) => {
        setPreviews(base64List);
        onBase64ListReady(base64List); // ส่ง base64 ทั้งหมดให้ parent ใช้งาน
      })
      .catch((err) => {
        console.error("เกิดข้อผิดพลาดในการแปลงไฟล์:", err);
      });
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        accept="image/*,application/pdf"
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
      />
      <div className="mt-2 flex gap-2 flex-wrap">
        {previews.map((src, idx) =>
          src.startsWith("data:image") ? (
            <img
              key={idx}
              src={src}
              alt={`preview-${idx}`}
              className="w-24 h-24 object-cover rounded"
            />
          ) : (
            <div key={idx} className="text-sm text-gray-600">
              📄 ไฟล์ PDF แนบแล้ว
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FileToBase64;

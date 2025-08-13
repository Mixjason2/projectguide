"use client";
import { useEffect, useState } from "react";

export default function AddToHomeScreenButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(true); // เริ่มให้ปุ่มแสดงเลย

  useEffect(() => {
    const checkIfInstalled = () => {
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (isIOS && (window.navigator as any).standalone === true);

      if (isStandalone) {
        setShowButton(false); // ซ่อนปุ่มถ้าติดตั้งแล้ว (เปิดจาก shortcut)
        return true;
      }
      return false;
    };

    if (!checkIfInstalled()) {
      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        // ไม่ต้องตั้ง showButton = true เพราะตอนแรกเราตั้ง true อยู่แล้ว
      };

      window.addEventListener("beforeinstallprompt", handler);

      // ลบ event listener ตอน component unmount
      return () => {
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIOS) {
      alert("📱 สำหรับ iPhone: กดปุ่ม Share แล้วเลือก 'Add to Home Screen'");
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      setDeferredPrompt(null);

      if (outcome === "accepted") {
        setShowButton(false); // ซ่อนปุ่มหลังติดตั้ง
      }
    } else {
      alert(
        "📌 สำหรับ Android: กรุณาใช้เมนูของเบราว์เซอร์เพื่อเพิ่มไปที่หน้าจอหลัก"
      );
    }
  };

  if (!showButton) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
    >
      📌 เพิ่มไปที่หน้าจอหลัก
    </button>
  );
}

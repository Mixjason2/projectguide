"use client";
import { useEffect, useState } from "react";

export default function AddToHomeScreenButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const checkIfInstalled = () => {
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (isIOS && (window.navigator as any).standalone === true);

      if (isStandalone) {
        setShowButton(false); // ซ่อนปุ่มถ้าติดตั้งแล้ว
        return true;
      }
      return false;
    };

    if (!checkIfInstalled()) {
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowButton(true);
      });
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

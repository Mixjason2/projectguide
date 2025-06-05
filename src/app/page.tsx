"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import './globals.css';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername") || "";
    const savedPassword = localStorage.getItem("savedPassword") || "";
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    setLoading(true);
    try {
      const res = await fetch("https://operation.dth.travel:7082/api/guide/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Username: username,
          Password: password,
          asmdb: "Assignment_TH"
        }),
      });
      const data = await res.json();
      if (data.status) {
        setMessage("เข้าสู่ระบบสำเร็จ!");
        router.push("/home");
      } else {
        setMessage("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (err) {
      setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-white shadow-xl rounded-xl">
        <div className="card-body">
          <h2 className="card-title justify-center mb-6 text-2xl font-bold text-gray-800">เข้าสู่ระบบ</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-base font-bold mb-1 text-gray-800">ชื่อผู้ใช้</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered w-full text-base"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-base font-bold mb-1 text-gray-800">รหัสผ่าน</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full text-base"
                required
              />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <label htmlFor="rememberMe" className="flex items-center cursor-pointer">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox checkbox-primary"
              />
              <span className="ml-2 text-base text-gray-800">จำฉันไว้</span>
              </label>
            </div>
            <div className="bg-white p-6 rounded-lg">
              
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-lg font-bold"
              style={{
                minHeight: "3rem",
                boxShadow: "0 2px 8px 0 rgba(37,99,235,0.10)",
                border: "none"
              }}
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
            </div>
          </form>
          {message && (
            <p className={`mt-4 text-sm text-center ${message.includes("สำเร็จ") ? "text-black-600" : "text-red-500"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

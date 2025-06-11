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

    // Validate username/password (only a-z, A-Z, 0-9)
    const validPattern = /^[a-zA-Z0-9]+$/;
    if (!validPattern.test(username)) {
      setMessage("Username must contain only letters or numbers.");
      return;
    }
    if (!validPattern.test(password)) {
      setMessage("Password must contain only letters or numbers.");
      return;
    }

    // setLoading(true);
    try {
      // Send data to API
      const res = await fetch("https://operation.dth.travel:7082/api/guide/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Username: username,
          Password: password,
          asmdb: "Assignment_TH",
          connection: "[AS-DTGTHA]" // เพิ่มบรรทัดนี้
        }),
      });
      const data = await res.json();

      // Show result from API to user
      if (data.status && data.token) {
        setMessage("Login successful!");
        // เก็บ token ลง localStorage
        localStorage.setItem("token", data.token);

        if (rememberMe) {
          localStorage.setItem("savedUsername", username);
          localStorage.setItem("savedPassword", password);
        } else {
          localStorage.removeItem("savedUsername");
          localStorage.removeItem("savedPassword");
        }
        // เก็บ token ไว้ใน localStorage หรือ sessionStorage ถ้าต้องการ
        localStorage.setItem("token", data.token);
        router.push("/home");
      } else {
        setMessage("Incorrect username or password.");
      }
    } catch (err) {
      setMessage("Failed to connect to the server.");
    }
    // setLoading(false);
  };

  return (
<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#2d4392" }}>
  <div className="card w-full max-w-3xl bg-white shadow-xl rounded-xl relative overflow-hidden">
    {/* มุมบนขวาสีเขียวเป็นวงกลมโค้งลง */}
<div
  style={{
    position: "absolute",
    top: 0,
    right: 0,
    width: "160px",
    height: "160px",
    backgroundColor: "#95c941",
    borderBottomLeftRadius: "160px",
    boxShadow: "-8px 8px 20px rgba(149, 201, 65, 0.25)",
    zIndex: 10,
  }}
>
</div>
    <div className="card-body relative z-10">
      <h2 className="card-title justify-center mb-6 text-2xl font-bold text-gray-800">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="username" className="block text-base font-bold mb-1 text-gray-800">Username</label>
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
          <label htmlFor="password" className="block text-base font-bold mb-1 text-gray-800">Password</label>
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
              className="accent-[#95c941] w-5 h-5"
            />
            <span className="ml-2 text-base text-gray-800">Remember me</span>
          </label>
        </div>

        <div className="bg-white p-6 rounded-lg">
          <button
            type="submit"
            disabled={loading}
            className="w-full text-lg font-bold transition duration-200"
            style={{
              backgroundColor: "#2D3E92",
              color: "#ffffff",
              minHeight: "3rem",
              boxShadow: "0 4px 14px rgba(45, 62, 146, 0.25)",
              border: "none",
              borderRadius: "0.5rem"
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#3D50B2"; // สีอ่อนลง
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2D3E92"; // กลับมาสีเดิม
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
      {message && (
        <p className={`mt-4 text-sm text-center ${message.includes("successful") ? "text-black-600" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  </div>
</div>

  );
}

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
    height: "170px",

  }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    
    viewBox="0 0 300 190"
    width="180"
    height="155"
     style={{  transform: "translateX(-25px) scale(2.2)", transformOrigin: "top right",  width: "100%", height: "auto", display: "block" }}
  >
    <path
      fill="#95c941"
      d="M251.5,65.5c0.8,1.2,1.9,2,3.3,2.4c0.8,0.3,1.8,0.4,3,0.4h8.3V49.2h-8.3c-2.9,0-5.1,1.2-6.4,3.6 
        c-1,1.8-1.5,3.9-1.5,6.5c0,1,0.1,2.1,0.4,3.2S250.9,64.6,251.5,65.5"
    ></path>
    <path
      fill="#95c941"
      stroke="#030303"stroke-width="0.2"
      d="M242.6,63.3c-2.5,0-4.5-2-4.5-4.5s2-4.5,4.5-4.5s4.5,2,4.5,4.5S245.1,63.3,242.6,63.3"
    ></path>
    <path
      fill="#2D3E92"
      d="M227.8,36c-0.9,1.2-1.3,2.5-1.3,3.9c0,0.8,0.2,1.8,0.5,3l2.6,7.9l18.2-5.9l-2.6-7.9c-0.9-2.8-2.7-4.4-5.4-5 
        c-2-0.4-4.2-0.2-6.6,0.5c-0.9,0.3-1.9,0.8-2.9,1.3C229.4,34.3,228.5,35.1,227.8,36"
    ></path>
    <path
      fill="#2D3E92"
      d="M227.1,26.8c-0.8-2.4,0.5-4.9,2.9-5.7c2.4-0.8,4.9,0.5,5.7,2.9s-0.5,4.9-2.9,5.7 
        C230.5,30.5,227.9,29.2,227.1,26.8"
    ></path>
    <path
      fill="#95c941"
      d="M248.6,4.4c-1.4-0.5-2.7-0.5-4.1-0.1c-0.8,0.2-1.7,0.7-2.6,1.4l-6.7,4.9l11.2,15.5l6.7-4.9 
        c2.3-1.7,3.4-3.9,3.1-6.7c-0.2-2-1.1-4.1-2.6-6.1c-0.6-0.8-1.3-1.6-2.1-2.3C250.7,5.3,249.7,4.7,248.6,4.4"
    ></path>
    <path
      fill="#95c941"
      d="M257.1,0.9c2-1.5,4.9-1,6.3,1c1.5,2,1,4.8-1,6.3s-4.9,1-6.3-1C254.6,5.2,255.1,2.3,257.1,0.9"
    ></path>
    <path
      fill="#95c941"
      d="M285.1,14.3c0-1.4-0.4-2.8-1.2-3.9c-0.5-0.7-1.2-1.4-2.1-2.1L275,3.5L263.8,19l6.7,4.9c2.3,1.7,4.8,2,7.3,0.9 
        c1.9-0.8,3.5-2.3,5-4.3c0.6-0.8,1.1-1.7,1.6-2.8C284.8,16.6,285.1,15.4,285.1,14.3"
    ></path>
    <path
      fill="#95c941"
      d="M291,21.3c2,1.5,2.5,4.3,1,6.3s-4.3,2.5-6.3,1s-2.5-4.3-1-6.3S289,19.9,291,21.3"
    ></path>
    <path
      fill="#95c941"
      d="M286.9,52.1c1.4-0.4,2.5-1.2,3.3-2.4c0.5-0.7,0.9-1.6,1.3-2.7l2.5-7.9l-18.2-5.9l-2.5,7.9 
        c-0.9,2.8-0.4,5.2,1.4,7.2c1.4,1.5,3.3,2.7,5.7,3.5c1,0.3,2,0.5,3.1,0.6C284.7,52.6,285.8,52.5,286.9,52.1"
    ></path>
    <path
      fill="#95c941"
      d="M282.1,59.9c-0.8,2.4-3.3,3.7-5.7,2.9s-3.7-3.3-2.9-5.7s3.3-3.7,5.7-2.9C281.5,55,282.8,57.5,282.1,59.9"
    ></path>
  </svg>
</div>
    <div className="card-body relative z-10">
<div className="flex flex-col items-center justify-center p-0 m-0 leading-none min-h-[150px]">
  <div className="w-[12rem] max-w-full mx-auto">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 150"
      className="w-full h-auto block mx-auto"
    >
      <g>
        <path
          d="M57.9,102.7H28.1V33.6h29.8c4.3,0.1,7.8,0.6,10.7,1.5c4.8,1.6,8.8,4.5,11.8,8.8c2.4,3.4,4,7.2,4.9,11.2c0.9,4,1.3,7.8,1.3,11.4c0,9.2-1.8,17-5.5,23.3C76,98.4,68.3,102.7,57.9,102.7z M68.6,51.3c-2.2-3.8-6.6-5.6-13.2-5.6H42.1v45.1h13.3c6.8,0,11.6-3.4,14.2-10.1c1.5-3.7,2.2-8.1,2.2-13.2C71.9,60.5,70.8,55.1,68.6,51.3z"
          fill="#2D3E92"

        />
      </g>
      <g>
        <path
          d="M146.7,33.6v12.2h-20.7v56.9h-14.5V45.9H90.8V33.6H146.7z"
          fill="#2D3E92"
        />
      </g>
      <g>
        <path
          d="M196.1,102.7V71.9h-27v30.8h-14.3V33.6h14.3V60h27V33.6h14.3v69.1H196.1z"
          fill="#2D3E92"
        />
      </g>

      {/* TRAVEL */}
      <g>
        <path
          d="M84.9,118.2v2.4h-6.8v17.7h-2.7v-17.7h-6.8v-2.4H84.9z"
          fill="#95c941"
          stroke="#95c941"
          strokeWidth="0.8"
        />
      </g>
      <g>
        <path
          d="M86.7,118.2h9.1c1.5,0,2.7,0.2,3.7,0.7c1.9,0.9,2.8,2.4,2.8,4.7c0,1.2-0.2,2.2-0.7,3c-0.5,0.8-1.2,1.4-2.1,1.8c0.8,0.3,1.4,0.7,1.8,1.3s0.6,1.4,0.7,2.5l0.1,2.7c0,0.8,0.1,1.3,0.2,1.7c0.2,0.6,0.5,1,0.9,1.2v0.5h-3.3c-0.1-0.2-0.2-0.4-0.2-0.7s-0.1-0.8-0.1-1.6l-0.2-3.3c-0.1-1.3-0.5-2.2-1.4-2.6c-0.5-0.2-1.3-0.4-2.4-0.4h-6v8.6h-2.7V118.2z M95.5,127.4c1.2,0,2.2-0.3,2.9-0.8c0.7-0.5,1.1-1.4,1.1-2.8c0-1.4-0.5-2.4-1.5-2.9c-0.5-0.3-1.3-0.4-2.2-0.4h-6.5v6.9H95.5z"
          fill="#95c941"
          stroke="#95c941"
          strokeWidth="0.8"
        />
      </g>
      <g>
        <path
          d="M111.9,118.2h3.1l7.3,20.1h-3l-2-6h-7.9l-2.2,6h-2.8L111.9,118.2z M116.4,130.1l-3-8.9l-3.2,8.9H116.4z"
          fill="#95c941"
          stroke="#95c941"
          strokeWidth="0.8"
        />
      </g>
      <g>
        <path
          d="M123.5,118.2l5.8,17.1l5.7-17.1h3l-7.3,20.1h-2.9l-7.3-20.1H123.5z"
          fill="#95c941"
          stroke="#95c941"
          strokeWidth="0.8"
        />
      </g>
      <g>
        <path
          d="M139.8,118.2h14.6v2.5h-11.9v6.1h11v2.3h-11v6.8h12.1v2.4h-14.8V118.2z"
          fill="#95c941"
          stroke="#95c941"
          strokeWidth="0.8"
        />
      </g>
      <g>
        <path
          d="M156.9,118.2h2.7v17.7h10.1v2.4h-12.8V118.2z"
          fill="#95c941"
          stroke="#95c941"
          strokeWidth="0.8"
        />
      </g>
    </svg>
  </div>
</div>



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

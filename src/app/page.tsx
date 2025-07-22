"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FormControl, InputLabel, NativeSelect } from "@mui/material";
import Swal from 'sweetalert2';
import './globals.css';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [connection, setConnection] = useState("[AS-DTGTHA]"); // ค่าเริ่มต้นสำหรับการเชื่อมต่อ
  const [, setGuideEmail] = useState("");
  const [, setEmailOP] = useState<{ key: number; Email: string }[]>([]);


  const connectionOptions = [
    { label: "TH", value: "[AS-DTGTHA]", name: "Thailand", flag: "🇹🇭" },
    { label: "MY", value: "[AS-DTGKUL]", name: "Malaysia", flag: "🇲🇾" },
    { label: "SL", value: "[AS-DTGSLK]", name: "Sri Lanka", flag: "🇱🇰" },
    { label: "SG", value: "[AS-DTGSIN]", name: "Singapore", flag: "🇸🇬" },
    { label: "VN", value: "[AS-DTGVNM]", name: "Vietnam", flag: "🇻🇳" },
    // { label: "STG", value: "[AS-DTGTHA-Test]", name: "Staging (TH Test)", flag: "🧪" },
    // { label: "TH_Test", value: "[AS-DTGTHA]", name: "Thailand (Test)", flag: "🧪🇹🇭" },
  ];


  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername") || "";
    const savedPassword = localStorage.getItem("savedPassword") || "";
    const savedConnection = localStorage.getItem("savedConnection") || "";

    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }

    if (savedConnection) {
      setConnection(savedConnection);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // Validate username/password (only a-z, A-Z, 0-9)
    const validPattern = /^[a-zA-Z0-9]+$/;
    if (!validPattern.test(username)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Username",
        text: "Username must contain only letters or numbers.",
      });
      return;
    }
    if (!validPattern.test(password)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Password",
        text: "Password must contain only letters or numbers.",
      });
      return;
    }

    // ✅ ใช้ .find() กับ array
    const selectedOption = connectionOptions.find((opt) => opt.value === connection);
    if (!selectedOption) {
      Swal.fire({
        icon: "error",
        title: "Invalid Connection",
        text: "Invalid connection selected.",
      });
      return;
    }

    const selectedLabel = selectedOption.label || "TH";
    const asmdbValue = `Assignment_${selectedLabel}`;
    console.log("asmdbValue:", asmdbValue);
    setLoading(true);
    try {
      // Send data to API
      const res = await fetch("https://operation.dth.travel:7082/api/guide/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Username: username,
          Password: password,
          asmdb: asmdbValue,
          connection: connection
        }),
      });
      const data = await res.json();

      // Show result from API to user
      // แก้ไขใน handleSubmit ตรงส่วน login สำเร็จ
      if (data.status && data.token) {
        Swal.fire({
          icon: "success",
          title: "Login successful!",
          text: "You have successfully logged in.",
          timer: 1500,
          showConfirmButton: false,
        });

        // เก็บ token และ refresh token
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);

        // เก็บ asmdb (ที่เราสร้างไว้ก่อนส่ง request)
        localStorage.setItem("asmdb", asmdbValue);

        // เก็บ connection options (อาจจะไม่จำเป็นแต่ถ้าต้องการเก็บ)
        localStorage.setItem("connectionOptions", JSON.stringify(connectionOptions));

        // เก็บ username/password/connection ถ้าเลือก rememberMe
        if (rememberMe) {
          localStorage.setItem("savedUsername", username);
          localStorage.setItem("savedPassword", password);
          localStorage.setItem("savedConnection", connection);
        } else {
          localStorage.removeItem("savedUsername");
          localStorage.removeItem("savedPassword");
          localStorage.removeItem("savedConnection");
        }

        setGuideEmail(data.guideEmail);
        setEmailOP(data.emailOP || []);

        // แก้ให้ log แสดงผลหลัง set state
        console.log("guideEmail:", data.guideEmail);
        (data.emailOP || []).forEach((item: { key: number; Email: string }) => {
          console.log(`key: ${item.key}, Email: ${item.Email}`);
        });

        router.push("/home");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Incorrect username or password.",
        });
      }
    } catch (err) {
      console.error(err); // ใช้งานตัวแปร err ที่ถูกจับมา
      Swal.fire({
        icon: "error",
        title: "Connection Error",
        text: "Failed to connect to the server.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#2d4392" }}>
      <div className="card w-full max-w-3xl bg-white shadow-xl rounded-xl relative overflow-hidden">
        {/* SVG มุมขวาบนของ card */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 30 375 175"
          style={{
            width: "auto",
            height: "auto",
            display: "block",
          }}
        >

          <g transform="translate(-40, 30) scale(1.4) ">
            <path fill="#95c941" d="M251.5,65.5c0.8,1.2,1.9,2,3.3,2.4c0.8,0.3,1.8,0.4,3,0.4h8.3V49.2h-8.3c-2.9,0-5.1,1.2-6.4,3.6 c-1,1.8-1.5,3.9-1.5,6.5c0,1,0.1,2.1,0.4,3.2S250.9,64.6,251.5,65.5" />
            <path fill="#95c941" d="M242.6,63.3c-2.5,0-4.5-2-4.5-4.5s2-4.5,4.5-4.5s4.5,2,4.5,4.5S245.1,63.3,242.6,63.3" />
            <path fill="#2D3E92" d="M227.8,36c-0.9,1.2-1.3,2.5-1.3,3.9c0,0.8,0.2,1.8,0.5,3l2.6,7.9l18.2-5.9l-2.6-7.9c-0.9-2.8-2.7-4.4-5.4-5 c-2-0.4-4.2-0.2-6.6,0.5c-0.9,0.3-1.9,0.8-2.9,1.3C229.4,34.3,228.5,35.1,227.8,36" />
            <path fill="#2D3E92" d="M227.1,26.8c-0.8-2.4,0.5-4.9,2.9-5.7c2.4-0.8,4.9,0.5,5.7,2.9s-0.5,4.9-2.9,5.7 C230.5,30.5,227.9,29.2,227.1,26.8" />
            <path fill="#95c941" d="M248.6,4.4c-1.4-0.5-2.7-0.5-4.1-0.1c-0.8,0.2-1.7,0.7-2.6,1.4l-6.7,4.9l11.2,15.5l6.7-4.9 c2.3-1.7,3.4-3.9,3.1-6.7c-0.2-2-1.1-4.1-2.6-6.1c-0.6-0.8-1.3-1.6-2.1-2.3C250.7,5.3,249.7,4.7,248.6,4.4" />
            <path fill="#95c941" d="M257.1,0.9c2-1.5,4.9-1,6.3,1c1.5,2,1,4.8-1,6.3s-4.9,1-6.3-1C254.6,5.2,255.1,2.3,257.1,0.9" />
            <path fill="#95c941" d="M285.1,14.3c0-1.4-0.4-2.8-1.2-3.9c-0.5-0.7-1.2-1.4-2.1-2.1L275,3.5L263.8,19l6.7,4.9c2.3,1.7,4.8,2,7.3,0.9 c1.9-0.8,3.5-2.3,5-4.3c0.6-0.8,1.1-1.7,1.6-2.8C284.8,16.6,285.1,15.4,285.1,14.3" />
            <path fill="#95c941" d="M291,21.3c2,1.5,2.5,4.3,1,6.3s-4.3,2.5-6.3,1s-2.5-4.3-1-6.3S289,19.9,291,21.3" />
            <path fill="#95c941" d="M286.9,52.1c1.4-0.4,2.5-1.2,3.3-2.4c0.5-0.7,0.9-1.6,1.3-2.7l2.5-7.9l-18.2-5.9l-2.5,7.9 c-0.9,2.8-0.4,5.2,1.4,7.2c1.4,1.5,3.3,2.7,5.7,3.5c1,0.3,2,0.5,3.1,0.6C284.7,52.6,285.8,52.5,286.9,52.1" />
            <path fill="#95c941" d="M282.1,59.9c-0.8,2.4-3.3,3.7-5.7,2.9s-3.7-3.3-2.9-5.7s3.3-3.7,5.7-2.9C281.5,55,282.8,57.5,282.1,59.9" />
          </g>

          <g transform="translate(60, 65) scale(1.0)">
            <path fill="#2D3E92" d="M57.9,102.7H28.1V33.6h29.8c4.3,0.1,7.8,0.6,10.7,1.5c4.8,1.6,8.8,4.5,11.8,8.8c2.4,3.4,4,7.2,4.9,11.2c0.9,4,1.3,7.8,1.3,11.4c0,9.2-1.8,17-5.5,23.3C76,98.4,68.3,102.7,57.9,102.7z M68.6,51.3c-2.2-3.8-6.6-5.6-13.2-5.6H42.1v45.1h13.3c6.8,0,11.6-3.4,14.2-10.1c1.5-3.7,2.2-8.1,2.2-13.2C71.9,60.5,70.8,55.1,68.6,51.3z" />
            <path fill="#2D3E92" d="M146.7,33.6v12.2h-20.7v56.9h-14.5V45.9H90.8V33.6H146.7z" />
            <path fill="#2D3E92" d="M196.1,102.7V71.9h-27v30.8h-14.3V33.6h14.3V60h27V33.6h14.3v69.1H196.1z" />
          </g>
          <g transform="translate(60, 64) scale(1.0)">
            <path fill="#95c941" stroke="#95c941" strokeWidth="0.8" d="M84.9,118.2v2.4h-6.8v17.7h-2.7v-17.7h-6.8v-2.4H84.9z" />
            <path fill="#95c941" stroke="#95c941" strokeWidth="0.8" d="M86.7,118.2h9.1c1.5,0,2.7,0.2,3.7,0.7c1.9,0.9,2.8,2.4,2.8,4.7c0,1.2-0.2,2.2-0.7,3c-0.5,0.8-1.2,1.4-2.1,1.8c0.8,0.3,1.4,0.7,1.8,1.3s0.6,1.4,0.7,2.5l0.1,2.7c0,0.8,0.1,1.3,0.2,1.7c0.2,0.6,0.5,1,0.9,1.2v0.5h-3.3c-0.1-0.2-0.2-0.4-0.2-0.7s-0.1-0.8-0.1-1.6l-0.2-3.3c-0.1-1.3-0.5-2.2-1.4-2.6c-0.5-0.2-1.3-0.4-2.4-0.4h-6v8.6h-2.7V118.2z M95.5,127.4c1.2,0,2.2-0.3,2.9-0.8c0.7-0.5,1.1-1.4,1.1-2.8c0-1.4-0.5-2.4-1.5-2.9c-0.5-0.3-1.3-0.4-2.2-0.4h-6.5v6.9H95.5z" />
            <path fill="#95c941" stroke="#95c941" strokeWidth="0.8" d="M111.9,118.2h3.1l7.3,20.1h-3l-2-6h-7.9l-2.2,6h-2.8L111.9,118.2z M116.4,130.1l-3-8.9l-3.2,8.9H116.4z" />
            <path fill="#95c941" stroke="#95c941" strokeWidth="0.8" d="M123.5,118.2l5.8,17.1l5.7-17.1h3l-7.3,20.1h-2.9l-7.3-20.1H123.5z" />
            <path fill="#95c941" stroke="#95c941" strokeWidth="0.8" d="M139.8,118.2h14.6v2.5h-11.9v6.1h11v2.3h-11v6.8h12.1v2.4h-14.8V118.2z" />
            <path fill="#95c941" stroke="#95c941" strokeWidth="0.8" d="M156.9,118.2h2.7v17.7h10.1v2.4h-12.8V118.2z" />
          </g>
        </svg>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ✅ DROPDOWN ใส่ไว้ที่นี่ */}
          <div className="flex justify-end mt-2">
            <FormControl
              size="small"
              variant="standard"
              className="w-fit"
            >
              <InputLabel htmlFor="connectionSelect">Connection</InputLabel>
              <NativeSelect
                id="connectionSelect"
                value={connection}
                onChange={(e) => setConnection(e.target.value)}
                inputProps={{
                  name: "connection",
                  id: "connectionSelect",
                }}
              >
                {connectionOptions.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.flag} {option.name}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          </div>
          <div>
            <label htmlFor="username" className="block text-base font-bold mb-1 text-gray-800">Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
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
              autoComplete="current-password"
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
              onClick={() => {
                if (!loading) {
                  // Handle sign in
                }
              }}
              className={`relative px-6 sm:px-8 py-3 text-sm sm:text-lg font-semibold rounded-full shadow-xl transition-all duration-300 ease-in-out
      ${loading
                  ? 'bg-gradient-to-r from-[#6DD5ED] to-[#2193B0] animate-pulse text-white cursor-wait'
                  : 'bg-gradient-to-br from-[#2D3E92] via-[#3549A7] to-[#1C2E78] text-white hover:brightness-110 hover:shadow-[0_8px_30px_rgba(45,62,146,0.35)] active:scale-95'
                } flex items-center justify-center gap-2 sm:gap-3 group min-w-[200px]`}
            >
              {loading ? (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-white text-center">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                    <path
                      d="M4 12a8 8 0 018-8v8z"
                      fill="currentColor"
                      className="opacity-75"
                    />
                  </svg>
                  <span className="font-medium tracking-wide leading-tight break-words">
                    Please wait... Logging in
                  </span>
                </div>
              ) : (
                <span className="font-bold tracking-wide transition group-hover:tracking-wider text-sm sm:text-base">
                  Sign In
                </span>
              )}
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

  );
}





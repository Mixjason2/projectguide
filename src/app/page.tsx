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

    setLoading(true);
    try {
      // Call your own Next.js API route instead of direct external API
      const res = await fetch("/api/guide/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Username: username,
          Password: password,
          asmdb: "Assignment_TH",
          connection : "[AS-DTGTHA]"
        }),
      });
      const data = await res.json();

      // Show result from API to user
      if (data.status) {
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
        router.push("/home");
      } else {
        setMessage("Incorrect username or password.");
      }
    } catch (err) {
      setMessage("Failed to connect to the server.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-3xl bg-white shadow-xl rounded-xl">
        <div className="card-body">
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
                  className="checkbox checkbox-primary"
                />
                <span className="ml-2 text-base text-gray-800">Remember me</span>
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
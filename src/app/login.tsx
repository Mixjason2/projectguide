"use client";

export default function HomePage() {
    return (
        <div className="login-card" style={{ maxWidth: 600, margin: "100px auto", padding: 32, border: "1px solid #ccc", borderRadius: 12, textAlign: "center" }}>
            <h1>ยินดีต้อนรับสู่ระบบ</h1>
            <p>นี่คือหน้าหลักของแอปพลิเคชันตัวอย่าง</p>
            <a href="/" style={{ color: "#1976d2", textDecoration: "underline" }}>กลับหน้า Login</a>
        </div>
    );
}
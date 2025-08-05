// components/AuthGuard.tsx
"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Not Logged In",
        text: "Please log in to continue.",
        confirmButtonText: "Go to Login Page",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        router.push("/"); // ✅ Change this to your actual login path, e.g. "/login"
      });
    }
  }, [router]);

  return <>{children}</>;
}

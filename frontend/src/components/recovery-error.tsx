"use client";
import { useEffect } from "react";
export function RecoveryError() {
  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    if (fragment.get("error_code") === "otp_expired") {
      window.location.replace("/forgot-password?error=invalid_link");
    }
  }, []);
  return null;
}

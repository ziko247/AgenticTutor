"use client";
import Link from "next/link";
import { useRef, useEffect } from "react";
import { ChevronDown, CircleUserRound, Settings, LogOut } from "lucide-react";
import { signOut } from "@/features/auth/actions";

export function AccountMenu({ name }: { name: string }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node))
        ref.current.open = false;
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);
  function close() {
    if (ref.current) ref.current.open = false;
  }
  return (
    <details
      className="account-menu"
      ref={ref}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) close();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          close();
          ref.current?.querySelector("summary")?.focus();
        }
      }}
    >
      <summary>
        <CircleUserRound size={20} aria-hidden="true" />
        <span>{name}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </summary>
      <div className="account-options">
        <Link href="/dashboard/profile" onClick={close}>
          <CircleUserRound size={17} aria-hidden="true" /> Mon profil
        </Link>
        <Link href="/dashboard/settings" onClick={close}>
          <Settings size={17} aria-hidden="true" /> Paramètres
        </Link>
        <form action={signOut}>
          <button type="submit">
            <LogOut size={17} aria-hidden="true" />
            Se déconnecter
          </button>
        </form>
      </div>
    </details>
  );
}

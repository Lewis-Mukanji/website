"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else setError((await res.json().catch(() => ({}))).error ?? "Could not sign in.");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5">
      <div className="glow-green breathe pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2" />
      <form onSubmit={submit} className="relative w-full max-w-sm border hairline bg-[var(--panel)] p-8">
        <div className="relative mx-auto h-28 w-28">
          <Image src="/images/logo.jpg" alt="Nourished by Mitchell" fill sizes="112px" className="object-contain" />
        </div>
        <h1 className="display mt-4 text-center text-3xl">
          Mitchell&apos;s <em>dashboard</em>
        </h1>
        <label className="label mt-8" htmlFor="pw">Password</label>
        <input id="pw" type="password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button className="btn btn-gold mt-6 w-full" disabled={busy || !password}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

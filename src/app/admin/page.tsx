"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./admin.module.css";

export default function AdminPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((response) => response.json())
      .then((body: { authenticated?: boolean }) => {
        if (body.authenticated) window.location.assign("/");
        else setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  if (!ready) return <main className={styles.login}>Loading…</main>;
  return <Login onSuccess={() => window.location.assign("/")} />;
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "That password is not correct.");
      setPending(false);
      return;
    }
    onSuccess();
  }

  return (
    <main className={styles.login}>
      <form className={styles.loginCard} onSubmit={onSubmit}>
        <p className={styles.brand}>PrimeFix</p>
        <h1>Sign in</h1>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Password</span>
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        {error ? <p className={styles.error}>{error}</p> : null}
        <button className={styles.save} type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Continue"}
        </button>
      </form>
    </main>
  );
}

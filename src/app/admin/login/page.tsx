"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Error de acceso" }));
      setError(data.error || "Error de acceso");
      return;
    }

    const redirectTo =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("from") || "/admin"
        : "/admin";
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-white/10 rounded-3xl p-8 bg-ink/80">
        <h1 className="text-3xl font-display">Acceso admin</h1>
        <p className="text-fog text-sm mt-2">
          Inicia sesión para gestionar el contenido de Black Gum.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm text-fog">
            Correo
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="block text-sm text-fog">
            Contraseña
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error ? <p className="text-sm text-ember">{error}</p> : null}
          <button
            type="submit"
            className="w-full bg-gum text-bone px-6 py-3 rounded-full text-sm uppercase tracking-[0.2em]"
            disabled={loading}
          >
            {loading ? "Accediendo..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}


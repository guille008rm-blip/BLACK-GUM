"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type BookingMode = "hourly" | "daily";

interface BookingModalProps {
  productSlug: string;
  productName: string;
  open: boolean;
  onClose: () => void;
}

const MIN_HOURLY_HOURS = 4;

function formatEur(cents: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR"
  }).format(cents / 100);
}

function computeLocalPrice(mode: BookingMode, start: string, end: string) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  const diffMs = e.getTime() - s.getTime();
  if (diffMs <= 0) return 0;

  if (mode === "hourly") {
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    return hours * 2500;
  }

  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return days * 15000;
}

function computeDurationLabel(mode: BookingMode, start: string, end: string) {
  if (!start || !end) return "";
  const s = new Date(start);
  const e = new Date(end);
  const diffMs = e.getTime() - s.getTime();
  if (diffMs <= 0) return "";

  if (mode === "hourly") {
    const hours = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;
    return `${hours}h`;
  }

  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return `${days} dia${days > 1 ? "s" : ""}`;
}

export default function BookingModal({
  productSlug,
  productName,
  open,
  onClose
}: BookingModalProps) {
  const [mode, setMode] = useState<BookingMode>("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setError("");
      setAvailable(null);
      setLoading(false);
      setChecking(false);
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [open]);

  const getStartEnd = useCallback(() => {
    if (mode === "daily") return { start: startDate, end: endDate };
    return { start: startDateTime, end: endDateTime };
  }, [mode, startDate, endDate, startDateTime, endDateTime]);

  const priceCents = (() => {
    const { start, end } = getStartEnd();
    if (mode === "daily" && start && end) {
      return computeLocalPrice(mode, `${start}T10:00`, `${end}T10:00`);
    }
    return computeLocalPrice(mode, start, end);
  })();

  const durationLabel = (() => {
    const { start, end } = getStartEnd();
    if (mode === "daily" && start && end) {
      return computeDurationLabel(mode, `${start}T10:00`, `${end}T10:00`);
    }
    return computeDurationLabel(mode, start, end);
  })();

  const checkAvailability = useCallback(async () => {
    const { start, end } = getStartEnd();
    if (!start || !end) return;

    setChecking(true);
    setAvailable(null);
    setError("");

    try {
      const params = new URLSearchParams({
        slug: productSlug,
        start,
        end,
        mode
      });
      const res = await fetch(`/api/rentals/availability?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al comprobar disponibilidad");
        setAvailable(false);
      } else {
        setAvailable(data.available);
        if (!data.available) {
          setError("No disponible en las fechas seleccionadas");
        }
      }
    } catch {
      setError("Error de conexion");
    } finally {
      setChecking(false);
    }
  }, [getStartEnd, productSlug, mode]);

  useEffect(() => {
    const { start, end } = getStartEnd();
    if (!start || !end) {
      setAvailable(null);
      return;
    }
    const timer = setTimeout(() => checkAvailability(), 500);
    return () => clearTimeout(timer);
  }, [startDate, endDate, startDateTime, endDateTime, mode, checkAvailability, getStartEnd]);

  const validate = (): string | null => {
    const { start, end } = getStartEnd();
    if (!start || !end) return "Selecciona fecha de inicio y fin.";

    if (mode === "hourly") {
      const s = new Date(start);
      const e = new Date(end);
      const diffH = (e.getTime() - s.getTime()) / (1000 * 60 * 60);
      if (diffH < MIN_HOURLY_HOURS) return `Minimo ${MIN_HOURLY_HOURS} horas.`;
    }

    if (mode === "daily") {
      if (new Date(end) <= new Date(start)) return "La fecha de fin debe ser posterior.";
    }

    if (!fullName.trim()) return "Introduce tu nombre completo.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Email no valido.";
    }
    if (!phone.trim()) return "Introduce tu telefono.";

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (available === false) {
      setError("No disponible en las fechas seleccionadas.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { start, end } = getStartEnd();
      const res = await fetch("/api/rentals/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: productSlug,
          start,
          end,
          mode,
          customer: {
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim()
          },
          notes: notes.trim() || undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al crear la reserva");
        setLoading(false);
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setError("Error de conexion. Intentalo de nuevo.");
      setLoading(false);
    }
  };

  if (!open) return null;

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div
      ref={sectionRef}
      className="w-full scroll-mt-24 mt-10 rounded-2xl border border-white/10 bg-ink/95 p-6 md:p-8 shadow-2xl"
      aria-label={`Reservar ${productName}`}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-display font-bold text-bone">Reservar</h2>
          <span className="text-sm text-ember font-medium">{productName}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-fog hover:text-bone transition-colors text-2xl leading-none p-1 -mt-1"
          aria-label="Cerrar"
        >
          x
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="rounded-full border border-ember/30 bg-ember/10 px-4 py-2">
          <p className="text-xs text-ember font-semibold uppercase tracking-wider whitespace-nowrap">
            Solo recogida en estudio
          </p>
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            type="button"
            onClick={() => setMode("daily")}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-200 ${
              mode === "daily"
                ? "border-ember/60 bg-ember/20 text-bone shadow-[0_10px_20px_rgba(241,169,58,0.18)]"
                : "border-white/15 text-fog hover:border-ember/40 hover:text-bone"
            }`}
          >
            Por dias
          </button>
          <button
            type="button"
            onClick={() => setMode("hourly")}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-200 ${
              mode === "hourly"
                ? "border-ember/60 bg-ember/20 text-bone shadow-[0_10px_20px_rgba(241,169,58,0.18)]"
                : "border-white/15 text-fog hover:border-ember/40 hover:text-bone"
            }`}
          >
            Por horas
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-[0.14em] text-fog/70 font-semibold">Fechas</h3>

          {mode === "daily" ? (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Fecha inicio"
                type="date"
                value={startDate}
                min={todayStr}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label="Fecha fin"
                type="date"
                value={endDate}
                min={startDate || todayStr}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Inicio"
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
              />
              <Input
                label="Fin"
                type="datetime-local"
                value={endDateTime}
                min={startDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
              />
            </div>
          )}

          {mode === "hourly" && (
            <p className="text-xs text-fog/70">Minimo {MIN_HOURLY_HOURS} horas</p>
          )}
          {mode === "daily" && (
            <p className="text-xs text-fog/70">Recogida y devolucion a las 10:00 (Europe/Madrid)</p>
          )}

          {durationLabel && priceCents > 0 && (
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-fog">Duracion</span>
                <span className="text-bone font-semibold">{durationLabel}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-fog">Total estimado</span>
                <span className="text-ember font-bold">{formatEur(priceCents)}</span>
              </div>
              {checking && (
                <p className="text-xs text-fog/70 mt-2">Comprobando disponibilidad...</p>
              )}
              {available === true && !checking && (
                <p className="text-xs text-green-400 mt-2">Disponible</p>
              )}
              {available === false && !checking && (
                <p className="text-xs text-gum mt-2">No disponible</p>
              )}
            </div>
          )}

          <Input
            label="Notas (opcional)"
            type="text"
            placeholder="Setup especial, accesorios o notas de entrega"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-[0.14em] text-fog/70 font-semibold">
            Tus datos
          </h3>

          <Input
            label="Nombre completo"
            type="text"
            placeholder="Tu nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="tu@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Telefono"
            type="tel"
            placeholder="+34 612 345 678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {error && (
            <div className="rounded-xl border border-gum/40 bg-gum/10 px-4 py-3">
              <p className="text-sm text-gum">{error}</p>
            </div>
          )}

          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            disabled={loading || available === false}
            onClick={handleSubmit}
          >
            {loading ? "Procesando..." : "Pagar y reservar"}
          </Button>

          <p className="text-xs text-fog/60 text-center">
            Seras redirigido a Stripe para completar el pago. El bloqueo se mantiene 15 minutos.
          </p>
        </div>
      </div>
    </div>
  );
}

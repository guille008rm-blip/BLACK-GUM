"use client";

/**
 * PAQUETE A LA CARTA - CUSTOM PACKAGE CONFIGURATOR
 * 
 * PRICING & ADD-ONS CONFIGURATION:
 * - Edit the PRICING_CONFIG object below to adjust base prices and add-on costs
 * - Add new add-ons by extending the addOnCategories and pricing objects
 * - All prices are in EUR
 * - Base price calculation: (videos_count * price_per_video) + (video_length_factor * base_multiplier)
 * - Total = base_price + selected_add_ons + (discounts applied)
 * 
 * STORAGE: Uses localStorage key "packConfigurator" - persists across refreshes
 * DISCOUNTS: Automatic lot discounts (4+ videos: -5%, 8+ -10%) + subscription discount
 */

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

// ============================================================================
// PRICING & CONFIGURATION
// ============================================================================

const PRICING_CONFIG = {
  // Base price structure
  base: {
    pricePerVideo: 450, // EUR per video
    lengthMultipliers: {
      "15": 0.8,
      "30": 1,
      "60": 1.3,
      "90": 1.6,
      custom: 1.5
    }
  },

  // Add-on categories and pricing
  addOns: {
    // CONTENIDO (Content)
    contenido: [
      {
        id: "script-idea-only",
        name: "Guion",
        category: "contenido",
        description: "Guión",
        tiers: [
          { id: "idea", label: "Solo idea", price: 0 },
          { id: "full", label: "Guión completo", price: 180 }
        ],
        defaultTier: "idea",
        icon: "script"
      },
      {
        id: "recording-type",
        name: "Grabación",
        category: "contenido",
        description: "Tipo de grabación",
        tiers: [
          { id: "studio", label: "Estudio", price: 0 },
          { id: "onsite", label: "En ubicación", price: 350 }
        ],
        defaultTier: "studio",
        icon: "camera"
      }
    ],

    // PRODUCCIÓN (Production)
    produccion: [
      {
        id: "color-grading",
        name: "Corrección de color",
        category: "produccion",
        description: "¿Color sí o no?",
        tiers: [
          { id: "none", label: "No", price: 0 },
          { id: "yes", label: "Sí", price: 190 }
        ],
        defaultTier: "none",
        icon: "palette",
        tooltip: "Corrección de color completa del lote"
      }
    ],

    // POSTPRODUCCIÓN (Post-production)
    postproduccion: [
      {
        id: "grafismos",
        name: "Grafismos",
        category: "postproduccion",
        description: "¿Con grafismos?",
        tiers: [
          { id: "none", label: "No", price: 0 },
          { id: "yes", label: "Sí", price: 220 }
        ],
        defaultTier: "none",
        icon: "sparkles",
        tooltip: "Incluye animaciones, rótulos y llamadas visuales"
      },
      {
        id: "sound-design",
        name: "Sonorización",
        category: "postproduccion",
        description: "¿Con sonido trabajado?",
        tiers: [
          { id: "none", label: "No", price: 0 },
          { id: "yes", label: "Sí", price: 160 }
        ],
        defaultTier: "none",
        icon: "volume",
        tooltip: "Mezcla, limpieza, fx y acabado sonoro"
      },
      {
        id: "subtitles",
        name: "Subtítulos",
        category: "postproduccion",
        description: "Tipo de subtítulos",
        tiers: [
          { id: "none", label: "No", price: 0 },
          { id: "auto", label: "Automáticos", price: 40 },
          { id: "integrated", label: "Integrados", price: 120 }
        ],
        defaultTier: "none",
        icon: "text",
        tooltip: "Automáticos por IA o subtítulo integrado en pieza"
      }
    ],

    // CRECIMIENTO (Growth)
    crecimiento: [
      {
        id: "seo",
        name: "SEO",
        category: "crecimiento",
        description: "Optimización SEO",
        tiers: [
          { id: "none", label: "Ninguno", price: 0 },
          { id: "basic", label: "Básico", price: 90 },
          { id: "advanced", label: "Avanzado", price: 220 }
        ],
        defaultTier: "none",
        icon: "search",
        tooltip: "Optimización de títulos, descripciones y etiquetas"
      },
      {
        id: "analytics",
        name: "Seguimiento y analítica",
        category: "crecimiento",
        description: "Reportes de datos",
        tiers: [
          { id: "none", label: "Ninguno", price: 0 },
          { id: "monthly", label: "Reporte mensual", price: 95 },
          { id: "weekly", label: "Reporte semanal", price: 210 }
        ],
        defaultTier: "none",
        icon: "chart",
        tooltip: "Seguimiento de métricas y reportes de rendimiento"
      },
      {
        id: "community-management",
        name: "Gestión de comunidad",
        category: "crecimiento",
        description: "Gestión comunitaria",
        tiers: [
          { id: "none", label: "Ninguno", price: 0 },
          { id: "light", label: "Ligero", price: 180 },
          { id: "standard", label: "Estándar", price: 350 }
        ],
        defaultTier: "none",
        icon: "users",
        tooltip: "Gestión de comentarios y engagement en redes"
      }
    ],

    // EXTRAS
    extras: [
      {
        id: "revisions",
        name: "Revisiones",
        category: "extras",
        description: "Rondas de revisión",
        tiers: [
          { id: "2", label: "2 rondas (incluidas)", price: 0 },
          { id: "3", label: "3 rondas", price: 90 },
          { id: "4", label: "4 rondas", price: 190 },
          { id: "unlimited", label: "Ilimitadas", price: 420 }
        ],
        defaultTier: "2",
        icon: "check",
        tooltip: "Las 2 primeras rondas van incluidas"
      },
      {
        id: "fast-delivery",
        name: "Entrega Rápida",
        category: "extras",
        description: "Velocidad de entrega",
        tiers: [
          { id: "standard", label: "Estándar (7d)", price: 0 },
          { id: "72h", label: "72h", price: 300 },
          { id: "48h", label: "48h", price: 550 },
          { id: "24h", label: "24h", price: 900 }
        ],
        defaultTier: "standard",
        icon: "zap",
        tooltip: "Aceleración de tiempos de entrega"
      },
      {
        id: "publishing",
        name: "Publicación",
        category: "extras",
        description: "Publicación y programación",
        tiers: [
          { id: "none", label: "Ninguna", price: 0 },
          { id: "schedule", label: "Programación", price: 80 },
          { id: "upload", label: "Carga + programación", price: 160 }
        ],
        defaultTier: "none",
        icon: "upload",
        tooltip: "Publicación y programación en redes sociales"
      },
      {
        id: "export-masters",
        name: "Exportar Másters",
        category: "extras",
        description: "Archivos máster",
        tiers: [
          { id: "none", label: "Ninguno", price: 0 },
          { id: "prores", label: "ProRes + Proyecto", price: 180 }
        ],
        defaultTier: "none",
        icon: "download",
        tooltip: "ProRes 422 HQ y archivos de proyecto editable"
      },
      {
        id: "storage",
        name: "Almacenamiento",
        category: "extras",
        description: "Duración del backup",
        tiers: [
          { id: "30", label: "30 días", price: 0 },
          { id: "90", label: "90 días", price: 60 },
          { id: "1y", label: "1 año", price: 150 }
        ],
        defaultTier: "30",
        icon: "cloud",
        tooltip: "Almacenamiento en nube y copias de seguridad"
      }
    ]
  }
};

// Category order and display info
const CATEGORY_ORDER = [
  { id: "contenido", label: "📝 Contenido", icon: "📝" },
  { id: "produccion", label: "🎬 Producción", icon: "🎬" },
  { id: "postproduccion", label: "✨ Postproducción", icon: "✨" },
  { id: "crecimiento", label: "📈 Crecimiento", icon: "📈" },
  { id: "extras", label: "⚡ Extras", icon: "⚡" }
];

// ============================================================================
// TYPES
// ============================================================================

interface AddOnConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  tooltip?: string;
  price?: number;
  perVideo?: boolean;
  oneTime?: boolean;
  tiers?: Array<{ id: string; label: string; price: number }>;
  defaultTier?: string;
}

interface ConfigState {
  videosCount: number;
  videoLength: "15" | "30" | "60" | "90" | "custom";
  customLength?: number;
  aspectRatio: "9:16" | "1:1" | "16:9";
  deliveryFrequency: "once" | "weekly" | "biweekly" | "monthly";
  selectedAddOns: Record<string, string | boolean>; // id -> tierId or boolean
}

interface PricingBreakdown {
  basePrice: number;
  addOnsPrices: Record<string, number>;
  oneTimeFees: Record<string, number>;
  discounts: Record<string, number>;
  total: number;
}

// ============================================================================
// COMPONENTS
// ============================================================================

// Inline SVG Icons
const IconSet = {
  script: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  camera: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  palette: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  sparkles: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  brand: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  scissors: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  volume: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0113 2.343v17.314a1 1 0 01-1.707.707L5.586 15z" />
    </svg>
  ),
  text: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  image: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  music: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v9.28c-.47-.46-1.12-.75-1.84-.75-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V7h3V3h-3z" />
    </svg>
  ),
  search: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  chart: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  users: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.048M12 4.354a4 4 0 100 8.048m0-8.048a4.004 4.004 0 00-4 4.048m0 0A4 4 0 1012 4.354m0 0a4.004 4.004 0 014 4.048m-8.048 4.048A4 4 0 014 12m0 0v8a2 2 0 002 2h12a2 2 0 002-2v-8m-12 0h12" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  zap: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  upload: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  download: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  cloud: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6" />
    </svg>
  )
};

// Get icon component
function getIcon(iconName: string) {
  return IconSet[iconName as keyof typeof IconSet] || null;
}

// Tooltip Component
function Tooltip({ text }: { text: string }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        className="inline-flex items-center justify-center w-5 h-5 text-xs text-ember/70 hover:text-ember border border-ember/30 rounded-full hover:bg-ember/10 transition-all"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        aria-label="Información"
      >
        i
      </button>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-ember/95 text-ink text-xs rounded-lg whitespace-nowrap z-10 pointer-events-none">
          {text}
        </div>
      )}
    </div>
  );
}

// Number Stepper
function NumberStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  label
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  return (
    <div className="space-y-3">
      {label && <label className="text-xs uppercase tracking-widest text-fog">{label}</label>}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 flex items-center justify-center border border-ember/45 rounded-lg bg-gradient-to-r from-ember/15 to-gum/15 text-ember hover:from-ember hover:to-gum hover:text-ink hover:border-ember/70 transition-all active:scale-95"
          aria-label="Disminuir"
        >
          −
        </button>
        <span className="text-lg font-semibold text-bone w-12 text-center">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 flex items-center justify-center border border-ember/45 rounded-lg bg-gradient-to-r from-ember/15 to-gum/15 text-ember hover:from-ember hover:to-gum hover:text-ink hover:border-ember/70 transition-all active:scale-95"
          aria-label="Aumentar"
        >
          +
        </button>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-ember/20 rounded-full appearance-none cursor-pointer accent-ember"
        aria-label={label}
      />
    </div>
  );
}

// Segmented Control for Tiers
function SegmentedControl({
  options,
  value,
  onChange,
  label,
  tooltip
}: {
  options: Array<{ id: string; label: string; price: number }>;
  value: string;
  onChange: (id: string) => void;
  label: string;
  tooltip?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-widest text-fog">{label}</label>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-all ${
              value === option.id
                ? "bg-gradient-to-r from-ember to-gum text-ink border border-ember/70 shadow-sm shadow-ember/10"
                : "border border-ember/30 text-bone bg-ink/30 hover:border-ember/60 hover:bg-gradient-to-r hover:from-ember/15 hover:to-gum/15"
            }`}
            aria-pressed={value === option.id}
          >
            {option.label}
            {option.price > 0 && <span className="ml-1 text-xs opacity-75">+€{option.price}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// Add-On Toggle Chip
function AddOnChip({
  addon,
  isSelected,
  onToggle,
  tierValue,
  onTierChange
}: {
  addon: AddOnConfig;
  isSelected: boolean;
  onToggle: () => void;
  tierValue?: string;
  onTierChange?: (tierId: string) => void;
}) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onToggle}
        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between gap-2 ${
          isSelected
            ? "bg-gradient-to-r from-ember to-gum text-ink border border-ember/70 shadow-sm shadow-ember/10"
            : "border border-ember/30 text-bone bg-ink/25 hover:border-ember/60 hover:bg-gradient-to-r hover:from-ember/15 hover:to-gum/15"
        }`}
        aria-pressed={isSelected}
      >
        <div className="flex items-center gap-2">
          <span className="flex-shrink-0">{getIcon(addon.icon)}</span>
          <span>{addon.name}</span>
        </div>
        {addon.tiers && addon.tiers.length > 0 && (
          <span className="text-xs opacity-75">▼</span>
        )}
      </button>
      {isSelected && addon.tiers && addon.tiers.length > 0 && tierValue && onTierChange && (
        <div className="ml-3 space-y-2">
          <SegmentedControl
            options={addon.tiers}
            value={tierValue as string}
            onChange={onTierChange}
            label={`${addon.name} - Nivel`}
            tooltip={addon.tooltip}
          />
        </div>
      )}
    </div>
  );
}

// Category Collapsible Section
function CategorySection({
  category,
  addOns,
  state,
  onStateChange
}: {
  category: (typeof CATEGORY_ORDER)[0];
  addOns: AddOnConfig[];
  state: ConfigState;
  onStateChange: (updates: Partial<ConfigState>) => void;
}) {
  const [isOpen, setIsOpen] = useState(category.id !== "extras");

  return (
    <div className="rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-all"
      >
        <span className="font-semibold text-bone text-sm">{category.label}</span>
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
      </button>
      {isOpen && (
        <div className="px-4 py-4 space-y-3 border-t border-white/15">
          {addOns.map((addon) => {
            const isSelected = state.selectedAddOns[addon.id];
            const tierValue = (state.selectedAddOns[`${addon.id}:tier`] as string) || addon.defaultTier;

            return (
              <AddOnChip
                key={addon.id}
                addon={addon}
                isSelected={isSelected as boolean}
                onToggle={() => {
                  const newSelectedAddOns = { ...state.selectedAddOns };
                  newSelectedAddOns[addon.id] = !isSelected;
                  // Initialize tier if not set
                  if (!isSelected && addon.tiers) {
                    newSelectedAddOns[`${addon.id}:tier`] = addon.defaultTier || addon.tiers[0].id;
                  }
                  onStateChange({ selectedAddOns: newSelectedAddOns });
                }}
                tierValue={tierValue}
                onTierChange={(tierId) => {
                  const newSelectedAddOns = { ...state.selectedAddOns };
                  newSelectedAddOns[`${addon.id}:tier`] = tierId;
                  onStateChange({ selectedAddOns: newSelectedAddOns });
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// Price Breakdown Summary
function PriceSummary({ breakdown }: { breakdown: PricingBreakdown }) {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex justify-between text-fog">
        <span>Base</span>
        <span>€{breakdown.basePrice.toFixed(2)}</span>
      </div>

      {Object.entries(breakdown.addOnsPrices).length > 0 && (
        <>
          {Object.entries(breakdown.addOnsPrices).map(([name, price]) => (
            <div key={name} className="flex justify-between text-fog text-xs">
              <span className="ml-4">{name}</span>
              <span>+€{price.toFixed(2)}</span>
            </div>
          ))}
        </>
      )}

      {Object.entries(breakdown.oneTimeFees).length > 0 && (
        <>
          <div className="border-t border-white/15 my-2 pt-2">
            {Object.entries(breakdown.oneTimeFees).map(([name, price]) => (
              <div key={name} className="flex justify-between text-fog text-xs">
                <span className="ml-4">{name} <span className="text-xs opacity-60">(único)</span></span>
                <span>+€{price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {Object.entries(breakdown.discounts).length > 0 && (
        <>
          <div className="border-t border-white/15 my-2 pt-2">
            {Object.entries(breakdown.discounts).map(([name, discount]) => (
              <div key={name} className="flex justify-between text-gum text-xs">
                <span className="ml-4">{name}</span>
                <span>-€{Math.abs(discount).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="border-t border-ember/40 pt-3 flex justify-between font-semibold text-base">
        <span className="text-bone">Total</span>
        <span className="text-ember text-lg">€{breakdown.total.toFixed(2)}</span>
      </div>
    </div>
  );
}

// Modal Form
function ProposalModal({
  isOpen,
  onClose,
  config,
  pricing
}: {
  isOpen: boolean;
  onClose: () => void;
  config: ConfigState;
  pricing: PricingBreakdown;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    notes: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate
    if (!formData.name || !formData.email) {
      alert("Por favor completa nombre y email");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const frequencyLabel =
        config.deliveryFrequency === "once"
          ? "única"
          : config.deliveryFrequency === "weekly"
          ? "semanal"
          : config.deliveryFrequency === "biweekly"
          ? "quincenal"
          : "mensual";

      const selectedAddOns = CATEGORY_ORDER.flatMap((category) => {
        const addOnsInCategory =
          PRICING_CONFIG.addOns[
            category.id as keyof typeof PRICING_CONFIG.addOns
          ] as AddOnConfig[];

        return addOnsInCategory
          .filter((addOn) => Boolean(config.selectedAddOns[addOn.id]))
          .map((addOn) => {
            if (!addOn.tiers) return addOn.name;

            const tierId = config.selectedAddOns[`${addOn.id}:tier`] as
              | string
              | undefined;
            const tier = addOn.tiers.find((item) => item.id === tierId);
            return tier ? `${addOn.name} (${tier.label})` : addOn.name;
          });
      });

      const summaryLines = [
        "Solicitud enviada desde Paquete a la Carta.",
        `Configuración: ${config.videosCount} vídeos, ${config.videoLength}s, formato ${config.aspectRatio}, entrega ${frequencyLabel}.`,
        `Add-ons: ${selectedAddOns.length ? selectedAddOns.join(", ") : "ninguno"}.`,
        `Precio estimado: €${pricing.total.toFixed(2)}.`,
        formData.company ? `Empresa: ${formData.company}.` : "",
        formData.notes ? `Notas: ${formData.notes}` : ""
      ].filter(Boolean);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          projectType: "Paquete a la Carta",
          projectSummary: summaryLines.join("\n"),
          budget: `€${pricing.total.toFixed(2)} (estimado)`
        })
      });

      if (!response.ok) {
        throw new Error("No se pudo enviar la propuesta");
      }

      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setFormData({ name: "", email: "", company: "", notes: "" });
      }, 2000);
    } catch {
      setSubmitError("No se pudo enviar la propuesta. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card variant="solid" padding="lg" className="w-full max-w-md">
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-bone mb-2">Pedir Propuesta</h3>
            <p className="text-sm text-fog">Completa el formulario y nos pondremos en contacto</p>
          </div>

          {isSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="text-4xl">✓</div>
              <p className="text-bone font-semibold">¡Propuesta enviada!</p>
              <p className="text-sm text-fog">Nos contactaremos pronto</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg">
                  <p className="text-sm text-red-200">{submitError}</p>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-widest text-fog mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-ember/10 border border-ember/30 rounded-lg text-bone placeholder-fog/40 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/30 transition-all"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-fog mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-ember/10 border border-ember/30 rounded-lg text-bone placeholder-fog/40 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/30 transition-all"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-fog mb-2">
                  Empresa
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 bg-ember/10 border border-ember/30 rounded-lg text-bone placeholder-fog/40 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/30 transition-all"
                  placeholder="Tu empresa"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-fog mb-2">
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-ember/10 border border-ember/30 rounded-lg text-bone placeholder-fog/40 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/30 transition-all resize-none h-24"
                  placeholder="Deja un mensaje..."
                />
              </div>

              <div className="border-t border-white/15 pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-ember/30 text-bone rounded-lg hover:bg-ember/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-ember text-ink font-semibold rounded-lg hover:bg-ember/90 active:scale-95 transition-all"
                >
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PackConfigurator() {
  // State
  const [state, setState] = useState<ConfigState>({
    videosCount: 4,
    videoLength: "30",
    aspectRatio: "1:1",
    deliveryFrequency: "monthly",
    selectedAddOns: {
      revisions: true,
      "revisions:tier": "2"
    }
  });

  const [pricing, setPricing] = useState<PricingBreakdown>({
    basePrice: 0,
    addOnsPrices: {},
    oneTimeFees: {},
    discounts: {},
    total: 0
  });

  const [showModal, setShowModal] = useState(false);
  const [showSummaryBreakdown, setShowSummaryBreakdown] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("packConfigurator");
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch {
        // Invalid stored config — ignore
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("packConfigurator", JSON.stringify(state));
    }
  }, [state, isMounted]);

  // Calculate pricing
  useEffect(() => {
    const breakdown: PricingBreakdown = {
      basePrice: 0,
      addOnsPrices: {},
      oneTimeFees: {},
      discounts: {},
      total: 0
    };

    // Base price calculation
    const lengthMultiplier =
      PRICING_CONFIG.base.lengthMultipliers[state.videoLength as keyof typeof PRICING_CONFIG.base.lengthMultipliers] || 1;
    breakdown.basePrice = state.videosCount * PRICING_CONFIG.base.pricePerVideo * lengthMultiplier;

    // Add-ons
    CATEGORY_ORDER.forEach((cat) => {
      const addOnsInCategory = PRICING_CONFIG.addOns[cat.id as keyof typeof PRICING_CONFIG.addOns];
      if (addOnsInCategory) {
        addOnsInCategory.forEach((addon: AddOnConfig) => {
          if (state.selectedAddOns[addon.id]) {
            if (addon.tiers) {
              const tierValue = state.selectedAddOns[`${addon.id}:tier`] as string;
              const tier = addon.tiers.find((t) => t.id === tierValue);
              if (tier) {
                const price = addon.perVideo
                  ? tier.price * state.videosCount
                  : tier.price;
                breakdown.addOnsPrices[addon.name] =
                  (breakdown.addOnsPrices[addon.name] || 0) + price;
              }
            } else if (addon.price !== undefined) {
              const price = addon.perVideo
                ? addon.price * state.videosCount
                : addon.price;
              if (addon.oneTime) {
                breakdown.oneTimeFees[addon.name] = price;
              } else {
                breakdown.addOnsPrices[addon.name] = price;
              }
            }
          }
        });
      }
    });

    // Discounts
    let totalBeforeDiscount = breakdown.basePrice + Object.values(breakdown.addOnsPrices).reduce((a, b) => a + b, 0) + Object.values(breakdown.oneTimeFees).reduce((a, b) => a + b, 0);

    // Lot discount
    if (state.videosCount >= 8) {
      breakdown.discounts["Descuento 8+ vídeos"] = -totalBeforeDiscount * 0.1;
    } else if (state.videosCount >= 4) {
      breakdown.discounts["Descuento 4+ vídeos"] = -totalBeforeDiscount * 0.05;
    }

    // Subscription discount
    if (state.deliveryFrequency === "monthly") {
      let subscriptionDiscount = totalBeforeDiscount * 0.08;
      breakdown.discounts["Descuento suscripción"] = -subscriptionDiscount;
    }

    // Calculate total
    breakdown.total =
      breakdown.basePrice +
      Object.values(breakdown.addOnsPrices).reduce((a, b) => a + b, 0) +
      Object.values(breakdown.oneTimeFees).reduce((a, b) => a + b, 0) +
      Object.values(breakdown.discounts).reduce((a, b) => a + b, 0);

    setPricing(breakdown);
  }, [state]);

  if (!isMounted) return null;

  // Get all add-ons grouped by category
  const addOnsByCategory = CATEGORY_ORDER.map((cat) => ({
    ...cat,
    addOns: (PRICING_CONFIG.addOns[cat.id as keyof typeof PRICING_CONFIG.addOns] as AddOnConfig[]) || []
  }));
  const selectedAddOnsCount = Object.keys(state.selectedAddOns).filter(
    (k) => !k.includes(":tier") && state.selectedAddOns[k]
  ).length;

  const applyPreset = (preset: "basic" | "top") => {
    if (preset === "basic") {
      setState({
        videosCount: 4,
        videoLength: "30",
        aspectRatio: "1:1",
        deliveryFrequency: "monthly",
        selectedAddOns: {
          revisions: true,
          "revisions:tier": "2"
        }
      });
      return;
    }

    setState({
      videosCount: 4,
      videoLength: "60",
      aspectRatio: "9:16",
      deliveryFrequency: "monthly",
      selectedAddOns: {
        "script-idea-only": true,
        "script-idea-only:tier": "full",
        "recording-type": true,
        "recording-type:tier": "onsite",
        "color-grading": true,
        "color-grading:tier": "yes",
        grafismos: true,
        "grafismos:tier": "yes",
        "sound-design": true,
        "sound-design:tier": "yes",
        subtitles: true,
        "subtitles:tier": "integrated",
        seo: true,
        "seo:tier": "advanced",
        analytics: true,
        "analytics:tier": "weekly",
        "community-management": true,
        "community-management:tier": "standard",
        revisions: true,
        "revisions:tier": "unlimited",
        "fast-delivery": true,
        "fast-delivery:tier": "48h",
        publishing: true,
        "publishing:tier": "upload",
        "export-masters": true,
        "export-masters:tier": "prores",
        storage: true,
        "storage:tier": "1y"
      }
    });
  };

  return (
    <>
      <section id="paquete-a-la-carta" className="py-20 md:py-32 relative scroll-mt-20">
        <Container maxWidth="xl">
          <div>
            <div className="mb-16">
              <SectionTitle
                title="Paquete a la Carta"
                subtitle="Configura tu paquete de producción personalizado. Elige entre opciones modulares y obtén un presupuesto instantáneo."
                center={true}
              />
              <div className="mt-6 mx-auto max-w-xl grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => applyPreset("basic")}
                  className="px-4 py-3 rounded-xl border border-white/20 text-fog hover:text-bone hover:border-ember/50 hover:bg-ember/10 transition-all"
                >
                  Ver rango básico
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("top")}
                  className="px-4 py-3 rounded-xl border border-ember/55 bg-gradient-to-r from-ember/20 to-gum/20 text-bone hover:from-ember/30 hover:to-gum/30 transition-all"
                >
                  Ver rango top
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT: Configurator */}
            <div className="lg:col-span-2 space-y-6">
              {/* Core Inputs */}
              <Card variant="glass" padding="lg">
                <div className="space-y-6">
                  <NumberStepper
                    value={state.videosCount}
                    onChange={(v) => setState({ ...state, videosCount: v })}
                    min={1}
                    max={20}
                    label="Número de vídeos"
                  />

                  <SegmentedControl
                    options={[
                      { id: "15", label: "15s", price: 0 },
                      { id: "30", label: "30s", price: 0 },
                      { id: "60", label: "60s", price: 0 },
                      { id: "90", label: "90s", price: 0 }
                    ]}
                    value={state.videoLength}
                    onChange={(v) => setState({ ...state, videoLength: v as any })}
                    label="Duración de vídeo"
                  />

                  <SegmentedControl
                    options={[
                      { id: "9:16", label: "9:16", price: 0 },
                      { id: "1:1", label: "1:1", price: 0 },
                      { id: "16:9", label: "16:9", price: 0 }
                    ]}
                    value={state.aspectRatio}
                    onChange={(v) => setState({ ...state, aspectRatio: v as any })}
                    label="Formato (aspect ratio)"
                  />

                  <SegmentedControl
                    options={[
                      { id: "once", label: "Una vez", price: 0 },
                      { id: "weekly", label: "Semanal", price: 0 },
                      { id: "biweekly", label: "Quincenal", price: 0 },
                      { id: "monthly", label: "Mensual", price: 0 }
                    ]}
                    value={state.deliveryFrequency}
                    onChange={(v) => setState({ ...state, deliveryFrequency: v as any })}
                    label="Frecuencia de entrega"
                  />
                </div>
              </Card>

              {/* Add-ons by Category */}
              <div className="space-y-4">
                {addOnsByCategory.map((cat) => (
                  <CategorySection
                    key={cat.id}
                    category={cat}
                    addOns={cat.addOns}
                    state={state}
                    onStateChange={(updates) => setState({ ...state, ...updates })}
                  />
                ))}
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={() => {
                  setState({
                    videosCount: 4,
                    videoLength: "30",
                    aspectRatio: "1:1",
                    deliveryFrequency: "monthly",
                    selectedAddOns: {
                      revisions: true,
                      "revisions:tier": "2"
                    }
                  });
                }}
                className="w-full px-4 py-2 text-sm text-fog hover:text-bone border border-ember/20 rounded-lg hover:border-ember/40 hover:bg-ember/5 transition-all"
              >
                Restablecer configuración
              </button>
            </div>

            {/* RIGHT: Summary */}
            <div className="space-y-6">
              <Card
                variant="solid"
                padding="lg"
                className="lg:sticky lg:top-24"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-bone mb-4">Tu Configuración</h3>
                    <ul className="space-y-2 text-sm text-fog">
                      <li className="flex items-start gap-2">
                        <span className="text-ember">•</span>
                        <span>
                          <strong className="text-bone">{state.videosCount}</strong> vídeos
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ember">•</span>
                        <span>
                          <strong className="text-bone">{state.videoLength}s</strong> de duración
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ember">•</span>
                        <span>
                          Formato <strong className="text-bone">{state.aspectRatio}</strong>
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ember">•</span>
                        <span>
                          Entrega{" "}
                          <strong className="text-bone">
                            {state.deliveryFrequency === "once"
                              ? "única"
                              : state.deliveryFrequency === "weekly"
                              ? "semanal"
                              : state.deliveryFrequency === "biweekly"
                              ? "quincenal"
                              : "mensual"}
                          </strong>
                        </span>
                      </li>
                      {selectedAddOnsCount > 0 && (
                        <li className="flex items-start gap-2 pt-2 border-t border-white/15">
                          <span className="text-ember">•</span>
                          <span>
                            <strong className="text-bone">{selectedAddOnsCount}</strong>{" "}
                            add-ons seleccionados
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="border-t border-white/15 pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-fog">Total estimado</span>
                      <span className="text-2xl font-display text-ember">€{pricing.total.toFixed(2)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSummaryBreakdown((prev) => !prev)}
                      className="w-full px-4 py-2 text-xs uppercase tracking-[0.16em] border border-white/20 rounded-lg text-fog hover:text-bone hover:border-ember/55 hover:bg-ember/10 transition-all"
                    >
                      {showSummaryBreakdown ? "Ocultar desglose" : "Ver desglose completo"}
                    </button>
                    {showSummaryBreakdown && <PriceSummary breakdown={pricing} />}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-ember to-gum text-ink font-bold rounded-full hover:shadow-md hover:shadow-ember/20 active:scale-95 transition-all"
                  >
                    Pedir Propuesta
                  </button>

                  <div className="border-t border-white/15 pt-4 text-xs text-fog space-y-2">
                    <p>
                      <strong className="text-bone">Tiempo estimado:</strong> 2-4 semanas (desde
                      aprobación de guión)
                    </p>
                    <p>Los plazos pueden variar según complejidad y entregas rápidas aplicadas.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          </div>
        </Container>
      </section>

      {/* Proposal Modal */}
      <ProposalModal isOpen={showModal} onClose={() => setShowModal(false)} config={state} pricing={pricing} />
    </>
  );
}

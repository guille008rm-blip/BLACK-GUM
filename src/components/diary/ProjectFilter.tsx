'use client';

interface ProjectFilterProps {
  projects: string[];
  active: string | null;
  onChange: (project: string | null) => void;
}

export default function ProjectFilter({ projects, active, onChange }: ProjectFilterProps) {
  return (
    <div className="sticky top-[60px] md:top-[72px] z-30 bg-ink/80 backdrop-blur-md border-b border-white/5">
      <div className="px-6 md:px-12 lg:px-20 max-w-[1920px] mx-auto py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => onChange(null)}
          className={`shrink-0 text-xs uppercase tracking-[0.12em] px-4 py-1.5 rounded-full border transition-all duration-200 ${
            active === null
              ? 'bg-ember/15 border-ember/40 text-ember font-semibold'
              : 'border-white/10 text-fog/60 hover:text-bone hover:border-white/20'
          }`}
        >
          Todos
        </button>
        {projects.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`shrink-0 text-xs uppercase tracking-[0.12em] px-4 py-1.5 rounded-full border transition-all duration-200 ${
              active === p
                ? 'bg-ember/15 border-ember/40 text-ember font-semibold'
                : 'border-white/10 text-fog/60 hover:text-bone hover:border-white/20'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

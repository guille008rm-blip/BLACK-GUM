export default function DiaryLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink">
      <div className="flex flex-col items-center gap-6">
        {/* Pulsing logo mark */}
        <div
          className="w-16 h-16 rounded-full border-2 border-ember/40"
          style={{
            animation: 'pulse-ring 1.4s ease-in-out infinite',
            background: 'radial-gradient(circle, rgba(241,169,58,0.15) 0%, transparent 70%)',
          }}
        />
        <p className="text-[10px] uppercase tracking-[0.2em] text-fog/40">
          Cargando portfolio
        </p>
      </div>
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

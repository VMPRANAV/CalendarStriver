export const SpiralBinder = () => (
  /* Adjusting -top-4 to -top-3 and ensuring it sits on the container edge */
  <div className="absolute -top-3 left-0 right-0 flex justify-around px-12 z-30 pointer-events-none">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="flex flex-col items-center">
        {/* The Metal Ring */}
        <div className="h-8 w-2.5 rounded-full border border-[var(--border)] bg-[linear-gradient(to_right,#64748b,#cbd5e1,#475569)] shadow-lg" />
        {/* The Hole in the Paper */}
        <div className="w-3 h-3 -mt-2 rounded-full bg-[var(--bg)] shadow-inner border border-[var(--border)]" />
      </div>
    ))}
  </div>
);

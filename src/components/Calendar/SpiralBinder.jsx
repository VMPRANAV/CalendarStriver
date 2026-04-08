export const SpiralBinder = () => (
  /* Adjusting -top-4 to -top-3 and ensuring it sits on the container edge */
  <div className="absolute -top-3 left-0 right-0 flex justify-around px-12 z-30 pointer-events-none">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="flex flex-col items-center">
        {/* The Metal Ring */}
        <div className="w-2.5 h-8 bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500 rounded-full shadow-lg border border-gray-300" />
        {/* The Hole in the Paper */}
        <div className="w-3 h-3 -mt-2 rounded-full bg-[var(--bg)] shadow-inner border border-[var(--border)]" />
      </div>
    ))}
  </div>
);
import CalendarRoot from './components/Calendar/CalendarRoot';

function App() {
  return (
    <main className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6">
      {/* Decorative background element for a "wall" look */}
      <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <div className="relative z-10 w-full max-w-5xl">
        <CalendarRoot />
      </div>
    </main>
  );
}

export default App;
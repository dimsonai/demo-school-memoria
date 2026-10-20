export default function Footer() {
  return (
    <footer className="w-full bg-[#1a365d] text-white py-12 mt-10">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <div className="text-4xl mb-4">🎓</div>
        <h3 className="font-serif text-3xl mb-3">11 «А» класс</h3>
        <p className="text-[#90cdf4] italic mb-6">
          «Школьные годы чудесные, с дружбою, с книгою, с песнею...»
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70 mb-8">
          <span>📍 Севастополь</span>
          <span>•</span>
          <span>🏫 Школа №3</span>
          <span>•</span>
          <span>📅 2016 — 2027</span>
        </div>
        
        <div className="pt-6 border-t border-white/10">
          <p className="text-xs text-white/50 uppercase tracking-widest">
            © 2027 • Создано с любовью на всю жизнь
          </p>
        </div>
      </div>
    </footer>
  );
}

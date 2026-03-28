import Image from "next/image";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="생성 서비스"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <div>
          <h1 className="text-lg font-bold text-slate-800 leading-tight">
            생성 서비스
          </h1>
          <p className="text-xs text-slate-400">CREATION SERVICE</p>
        </div>
      </div>
    </header>
  );
}

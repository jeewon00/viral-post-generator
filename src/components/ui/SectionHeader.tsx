interface SectionHeaderProps {
  number: number;
  title: string;
  subtitle: string;
}

export function SectionHeader({ number, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-3 pb-3 border-b border-slate-200">
      <div className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
        {number}
      </div>
      <div>
        <h3 className="font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

interface RadioGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: boolean;
}

export function RadioGroup({
  label,
  options,
  value,
  onChange,
  required,
  error,
}: RadioGroupProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition cursor-pointer ${
              value === opt
                ? "bg-cyan-600 text-white border-cyan-600"
                : "bg-white text-slate-600 border-slate-300 hover:border-cyan-400"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-1">필수 항목입니다.</p>
      )}
    </div>
  );
}

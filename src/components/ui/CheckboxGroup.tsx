interface CheckboxGroupProps {
  label: string;
  options: string[];
  values: string[];
  onChange: (v: string[]) => void;
  required?: boolean;
  error?: boolean;
}

export function CheckboxGroup({
  label,
  options,
  values,
  onChange,
  required,
  error,
}: CheckboxGroupProps) {
  const toggle = (opt: string) => {
    if (values.includes(opt)) {
      onChange(values.filter((v) => v !== opt));
    } else {
      onChange([...values, opt]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
        <span className="font-normal text-slate-400 ml-1">(복수 선택)</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition cursor-pointer ${
              values.includes(opt)
                ? "bg-cyan-600 text-white border-cyan-600"
                : "bg-white text-slate-600 border-slate-300 hover:border-cyan-400"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-1">최소 1개를 선택해주세요.</p>
      )}
    </div>
  );
}

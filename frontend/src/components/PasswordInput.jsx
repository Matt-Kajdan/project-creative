import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * A password input with a toggle button to show/hide the password.
 * Accepts all standard input props (value, onChange, placeholder, disabled, minLength, etc.)
 * plus an optional `inputClassName` to override the input's class.
 */
export function PasswordInput({ inputClassName, ...props }) {
  const [show, setShow] = useState(false);

  const defaultClass =
    "w-full px-4 py-3 pr-12 rounded-xl border border-slate-200/80 bg-white/70 text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300/70";

  return (
    <div className="relative">
      <input
        {...props}
        type={show ? "text" : "password"}
        className={inputClassName ?? defaultClass}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 transition-colors"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

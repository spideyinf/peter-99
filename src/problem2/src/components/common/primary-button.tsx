import { forwardRef, type ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

const PrimaryButton = forwardRef<HTMLButtonElement, Props>(
  ({ className = "", children, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      {...props}
      className={`flex items-center gap-2 rounded-xl bg-gray-700/80 hover:bg-gray-700 border border-gray-600/60 hover:border-gray-500 px-3 py-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  ),
);

PrimaryButton.displayName = "PrimaryButton";

export default PrimaryButton;

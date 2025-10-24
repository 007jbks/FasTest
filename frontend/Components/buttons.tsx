interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className, ...props }: ButtonProps) {
  const baseClasses =
    "bg-white hover:bg-gray-900 hover:text-white text-black font-bold py-2 px-4 rounded";
  return (
    <button className={`${baseClasses} ${className || ""}`} {...props}>
      {children}
    </button>
  );
}

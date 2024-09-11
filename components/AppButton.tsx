import React from "react";

interface ButtonProps {
  variant?: "create" | "cancel"; // Define your variants
  children: React.ReactNode;
  onClick?: () => void;
  className?: string; // Additional class names if needed
  type?: "button" | "submit" | "reset"; // Add the type prop for button
  disabled?: boolean; // Add the disabled prop
}

const Button: React.FC<ButtonProps> = ({
  variant = "create", // Default variant
  children,
  onClick,
  className = "",
  type = "button", // Default type is "button"
  disabled = false, // Default to not disabled
}) => {
  // Tailwind styles for each variant
  const variantStyles: Record<typeof variant, string> = {
    create: "bg-green-500 hover:bg-green-600 text-white",
    cancel: "bg-red-500 hover:bg-red-600 text-white",
  };

  // Default styles (common button styles like padding, border-radius)
  const baseStyles = "py-2 px-4 rounded-lg focus:outline-none focus:ring";

  return (
    <button
      type={type} // Pass the type prop
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled} // Apply disabled prop
    >
      {children}
    </button>
  );
};

export default Button;

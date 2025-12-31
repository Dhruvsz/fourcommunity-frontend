
import { RefObject } from "react";

// Scroll to top utility function
export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? "smooth" : "auto",
  });
};

// Button variants without any shadow or border effects
export const enhancedButtonVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-300",
  outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground transition-all duration-300",
  ghost: "hover:bg-accent hover:text-accent-foreground transition-all duration-300",
};

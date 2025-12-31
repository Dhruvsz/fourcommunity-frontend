
import { RefObject } from "react";

// Disabled mouse gradient hook - no longer applies any effects
export const useMouseGradient = (
  ref: RefObject<HTMLElement>,
  options = {
    intensity: 0.1,
    color: "rgba(59,130,246,0.1)",
    radius: 300,
  }
) => {
  // This hook is now disabled to remove all box-like effects
  return;
};

// Disabled global mouse gradient - no longer applies any effects
export const useGlobalMouseGradient = (
  options = {
    intensity: 0.08,
    color: "rgba(59,130,246,0.08)",
    radius: 300,
  }
) => {
  // This hook is now disabled to remove all box-like effects
  return;
};

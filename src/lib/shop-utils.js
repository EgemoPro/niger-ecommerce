
import { cn } from "@/lib/utils";

/**
 * Creates animation delay styles for staggered animations
 */
export function createAnimationDelay(index, baseDelay = 0.2) {
  return { animationDelay: `${baseDelay * (index + 1)}s` };
}

/**
 * Creates class names for conditional styles
 */
export function createConditionalClasses(
  baseClasses,
  conditionalClasses
) {
  return cn(
    baseClasses,
    Object.entries(conditionalClasses)
      .filter(([_, condition]) => condition)
      .map(([className]) => className)
      .join(" ")
  );
}

// ============================================
// Alternative: ScrollToTop Hook
// File: shared/hooks/useScrollToTop.ts
// ============================================
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface UseScrollToTopOptions {
  smooth?: boolean;
  delay?: number;
  enabled?: boolean;
}

/**
 * Custom hook to scroll to top on route change
 * Useful for conditional scroll behavior
 */
export const useScrollToTop = (options: UseScrollToTopOptions = {}) => {
  const { smooth = false, delay = 0, enabled = true } = options;
  const { pathname } = useLocation();

  useEffect(() => {
    if (!enabled) return;

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: smooth ? "smooth" : "auto",
      });
    };

    if (delay > 0) {
      const timeoutId = setTimeout(scrollToTop, delay);
      return () => clearTimeout(timeoutId);
    } else {
      scrollToTop();
    }
  }, [pathname, smooth, delay, enabled]);
};

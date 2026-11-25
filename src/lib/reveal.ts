import { useEffect, useRef } from "react";

/**
 * Reveals elements with the `reveal` class as they scroll into view.
 * Attach the returned ref to a container; every descendant marked
 * `reveal` (optionally with `reveal-delay-N`) fades/rises in once.
 */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>(".reveal");
    if (targets.length === 0) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      targets.forEach((el) => el.classList.add("reveal-visible"));
      return;
    }

    const pending = new Set<HTMLElement>(targets);
    const reveal = (el: HTMLElement) => {
      el.classList.add("reveal-visible");
      pending.delete(el);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    // Sweep on scroll: anything already above the viewport (e.g. after a
    // jump to the bottom of the page) is revealed instead of staying hidden.
    const sweep = () => {
      for (const el of pending) {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
          reveal(el);
          observer.unobserve(el);
        }
      }
    };

    targets.forEach((el) => observer.observe(el));
    sweep();
    window.addEventListener("scroll", sweep, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", sweep);
    };
  }, []);

  return ref;
}

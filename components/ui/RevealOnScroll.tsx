"use client";

import { useEffect } from "react";

export function RevealOnScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (!elements.length) return;

    root.classList.add("reveal-ready");
    const remaining = new Set(elements);
    let frame: number | null = null;

    const reveal = (element: HTMLElement) => {
      element.classList.add("is-visible");
      remaining.delete(element);
    };

    const revealVisible = () => {
      const triggerLine = window.innerHeight * 0.88;

      remaining.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top <= triggerLine && rect.bottom >= 0) {
          reveal(element);
        }
      });
    };

    const scheduleRevealVisible = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        revealVisible();
      });
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach(reveal);
      return () => root.classList.remove("reveal-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12
      }
    );

    elements.forEach((element) => observer.observe(element));
    revealVisible();
    window.addEventListener("scroll", scheduleRevealVisible, { passive: true });
    window.addEventListener("resize", scheduleRevealVisible);

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      observer.disconnect();
      window.removeEventListener("scroll", scheduleRevealVisible);
      window.removeEventListener("resize", scheduleRevealVisible);
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}

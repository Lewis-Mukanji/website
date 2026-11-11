"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Fades elements with the `reveal` class in as they scroll into view.
 *  Anything already scrolled past (e.g. after a fast flick) is shown too. */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    let raf = 0;
    const check = () => {
      const limit = window.innerHeight - 40;
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)").forEach((el) => {
        if (el.getBoundingClientRect().top < limit) el.classList.add("is-visible");
      });
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };
    check();
    const mo = new MutationObserver(onScroll);
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}

"use client";

import { usePathname } from "next/navigation";
import { whatsappLink } from "@/lib/site";

export default function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Mitchell on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full border border-green/40 bg-black/80 py-2 pl-2 pr-2 backdrop-blur-md transition-all hover:border-green md:bottom-8 md:right-8 md:pr-5"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green text-black">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36A9.4 9.4 0 0 1 2.6 12.05C2.6 6.84 6.84 2.6 12.06 2.6c2.52 0 4.9.99 6.68 2.77a9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.45-9.45 9.45m8.04-17.5A11.3 11.3 0 0 0 12.05.67C5.79.67.68 5.78.68 12.05c0 2 .52 3.96 1.52 5.68L.58 23.33l5.73-1.5a11.33 11.33 0 0 0 5.74 1.46h.01c6.26 0 11.37-5.1 11.37-11.37 0-3.04-1.18-5.89-3.33-8.04" />
        </svg>
      </span>
      <span className="hidden text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-ink md:inline">Chat on WhatsApp</span>
    </a>
  );
}

// lib/ga.js
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export function gtagEvent(name, params = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function" && GA_ID) {
    window.gtag("event", name, params);
  }
}

export function gtagPageview(url) {
  if (typeof window !== "undefined" && typeof window.gtag === "function" && GA_ID) {
    window.gtag("config", GA_ID, { page_path: url });
  }
}

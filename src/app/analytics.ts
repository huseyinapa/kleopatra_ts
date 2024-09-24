"use client";

import { useEffect } from "react";
import { initializeGA } from "@/utils/google-analytics";

declare global {
  interface Window {
    GA_INITIALIZED?: boolean;
  }
}

export default function GoogleAnalytics(): JSX.Element | null {
  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initializeGA();
      window.GA_INITIALIZED = true;
    }
  }, []);

  return null;
}

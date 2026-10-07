"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Inner component — reads the query param and toggles chrome        */
/* ------------------------------------------------------------------ */

function HealthcareChromeController() {
  const searchParams = useSearchParams();
  const fromQuishub = searchParams.get("from") === "quishub";

  useEffect(() => {
    // Only run the isolation when the visitor came in cold (no ?from=quishub)
    if (fromQuishub) return;

    // Tag the html element so our CSS can hide root-layout chrome
    document.documentElement.setAttribute("data-standalone", "healthcare");

    // Force light theme so the medical platinum look is preserved
    // (saves the user's original preference so we can restore it on leave)
    const previousTheme = document.documentElement.dataset.theme;
    document.documentElement.dataset.theme = "light";

    return () => {
      document.documentElement.removeAttribute("data-standalone");
      if (previousTheme) {
        document.documentElement.dataset.theme = previousTheme;
      }
    };
  }, [fromQuishub]);

  return null;
}

/* ------------------------------------------------------------------ */
/*  Layout export                                                      */
/* ------------------------------------------------------------------ */

export default function HealthcareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Suspense boundary required for useSearchParams in App Router */}
      <Suspense fallback={null}>
        <HealthcareChromeController />
      </Suspense>

      <div className="theme-platinum bg-quishub-light text-quishub-black">{children}</div>
    </>
  );
}

"use client";

import dynamicImport from "next/dynamic";
import config from "@/sanity.config";

const NextStudio = dynamicImport(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  { ssr: false }
);

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}

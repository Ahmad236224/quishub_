import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services - Quishub",
  description:
    "Build software, automate operations, connect systems, improve existing software and apply AI to real workflows, with Quishub.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights & Engineering Blog | Quishub",
  description:
    "Architectural teardowns, real-world case studies, and engineering playbooks from the Quishub team — healthcare AI, PropTech, SaaS architecture, and production engineering.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

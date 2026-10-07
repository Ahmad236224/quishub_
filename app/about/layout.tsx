import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Quishub",
  description:
    "Quishub is a small software team in Pakistan. You talk to the people designing and building your system.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

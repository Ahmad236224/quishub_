import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Quishub",
  description:
    "Tell Quishub how the process works today. Book a free 30-minute call or send us a message.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

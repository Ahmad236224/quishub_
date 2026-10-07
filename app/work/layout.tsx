import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work - Quishub",
  description:
    "NurMed, Senteez, PakLawAssist and FictionPub: software products Quishub built and still runs, in healthcare, hospitality, legal and publishing.",
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

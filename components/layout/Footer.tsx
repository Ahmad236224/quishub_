"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/brand/Logo";
import Arrow from "@/components/system/Arrow";
import { products } from "@/lib/content/work";

const company = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/healthcare?from=quishub", label: "Healthcare" },
  { href: "/blog", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

const linkCls = "link-draw pb-0.5 text-[15px] text-ink-2 hover:text-ink";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/studio") || pathname.startsWith("/healthcare")) return null;

  return (
    <footer className="border-t border-line bg-background">
      <div className="wrap pb-10 pt-16 md:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <Link href="/" aria-label="Quishub home" className="inline-block">
              <Logo className="h-8" />
            </Link>
            <p className="mt-6 max-w-[30ch] font-ui text-[20px] leading-snug tracking-[-0.01em] text-ink">
              Software for the work your business still does by hand.
            </p>
          </div>

          <nav aria-label="Products" className="md:col-span-2">
            <p className="label-mono">Products</p>
            <ul className="mt-5 space-y-3">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} className={linkCls}>
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company" className="md:col-span-2">
            <p className="label-mono">Company</p>
            <ul className="mt-5 space-y-3">
              {company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 md:col-span-3">
            <p className="label-mono">Get in touch</p>
            <a href="mailto:hello@quishub.com" className="mt-5 block font-ui text-[18px] text-ink">
              <span className="link-draw pb-0.5">hello@quishub.com</span>
            </a>
            <Link href="/contact" className="group mt-5 inline-flex items-center gap-2 font-ui text-[15px] font-medium text-ink">
              <span className="link-draw pb-0.5">Start a project</span>
              <Arrow className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 font-mono text-[12px] text-mute md:mt-20 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Quishub. Based in Pakistan.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-ink">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-ink">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

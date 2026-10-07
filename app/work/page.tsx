import Image from "next/image";
import Link from "next/link";
import Label from "@/components/system/Label";
import ButtonLink from "@/components/system/ButtonLink";
import Reveal from "@/components/system/Reveal";
import CTA from "@/components/sections/CTA";
import { products, proofIndex, type Product } from "@/lib/content/work";
import { cn } from "@/lib/utils";

function Entry({ p, i }: { p: Product; i: number }) {
  const flip = i % 2 === 1;
  return (
    <article id={p.slug} className="scroll-mt-24 border-t border-line py-20 md:py-28">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className={cn("lg:col-span-5", flip && "lg:order-2")}>
          <p className="flex items-baseline gap-3">
            <span className="font-mono text-[12px] text-mute">{String(i + 1).padStart(2, "0")}</span>
            <span className="label-mono">
              {p.industry} · {p.region}
            </span>
          </p>
          <h2 className="mt-5 font-display text-display-xl font-semibold">{p.name}</h2>
          <p className="mt-4 max-w-[26ch] font-ui text-[clamp(1.25rem,2vw,1.625rem)] leading-snug tracking-[-0.015em] text-ink-2">{p.headline}</p>

          <dl className="mt-10 space-y-6">
            <div>
              <dt className="label-mono">The problem</dt>
              <dd className="mt-2 max-w-[48ch] text-[16px] leading-relaxed text-ink-2">{p.problem}</dd>
            </div>
            <div>
              <dt className="label-mono">What we built</dt>
              <dd className="mt-2 max-w-[48ch] text-[16px] leading-relaxed text-ink-2">{p.summary}</dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            <ButtonLink href={`/work/${p.slug}`} variant="text">
              Read the case study
            </ButtonLink>
            <ButtonLink href={p.live.href} variant="text" external className="text-mute">
              {p.live.label}
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.1} className={cn("lg:col-span-7", flip && "lg:order-1")}>
          <Link href={`/work/${p.slug}`} className="group block" aria-label={`${p.name} case study`}>
            <div className="overflow-hidden rounded-lg border border-line bg-surface-2">
              <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
                <span className="h-2 w-2 rounded-full bg-line-2" />
                <span className="h-2 w-2 rounded-full bg-line-2" />
                <span className="ml-2 font-mono text-[11px] text-mute">{p.live.label}</span>
              </div>
              <div className="relative aspect-[1348/620] overflow-hidden">
                <Image
                  src={p.image}
                  alt={`${p.name}, live product`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 760px"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </Link>
          <dl className="mt-6 grid grid-cols-3 gap-5">
            {p.facts.map((f) => (
              <div key={f.label} className="flex flex-col-reverse gap-1.5 border-t border-line pt-4">
                <dt className="font-mono text-[11px] leading-snug text-mute">{f.label}</dt>
                <dd className="font-ui text-[clamp(1.125rem,1.8vw,1.5rem)] font-medium leading-none tracking-[-0.02em]">{f.value}</dd>
              </div>
            ))}
          </dl>
          <ol className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11.5px] text-mute" aria-label={`${p.name} pipeline`}>
            {p.pipeline.map((s, j) => (
              <li key={s}>
                <span className="text-ink">{String(j + 1).padStart(2, "0")}</span> {s}
              </li>
            ))}
          </ol>
          {p.quote && (
            <figure className="mt-8 border-l border-ink pl-5">
              <blockquote className="text-[16px] leading-relaxed text-ink-2">&ldquo;{p.quote.text}&rdquo;</blockquote>
              <figcaption className="mt-3 font-mono text-[11.5px] text-mute">{p.quote.by}</figcaption>
            </figure>
          )}
        </Reveal>
      </div>
    </article>
  );
}

export default function WorkPage() {
  return (
    <>
      <section className="pb-16 pt-[128px] md:pb-24 md:pt-[180px]">
        <div className="wrap">
          <Label>Work</Label>
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <h1 className="max-w-[14ch] font-display text-display-2xl font-semibold lg:col-span-8">
              Products we built and still run.
            </h1>
            <p className="max-w-[36ch] text-lede text-mute lg:col-span-4 lg:self-end">
              Each started as work somebody did by hand. All of them are live, and we keep improving them.
            </p>
          </div>

          <nav aria-label="Products" className="mt-16 border-t border-ink md:mt-24">
            <ul>
              {proofIndex.map((r) => (
                <li key={r.product}>
                  <a
                    href={r.product === "Nuworo" ? "/work/paklawassist" : `#${r.slug}`}
                    className="group grid grid-cols-2 gap-x-6 gap-y-1 border-b border-line py-4 transition-colors hover:bg-surface-2 md:grid-cols-12 md:items-baseline"
                  >
                    <span className="font-ui text-[17px] font-medium md:col-span-3">{r.product}</span>
                    <span className="text-right font-mono text-[12px] text-mute md:col-span-3 md:text-left">{r.industry}</span>
                    <span className="col-span-2 text-[15px] text-ink-2 md:col-span-6">{r.result}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <div className="wrap">
        {products.map((p, i) => (
          <Entry key={p.slug} p={p} i={i} />
        ))}
      </div>

      <CTA />
    </>
  );
}

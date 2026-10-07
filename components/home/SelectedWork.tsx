import Label from "@/components/system/Label";
import ButtonLink from "@/components/system/ButtonLink";
import Reveal from "@/components/system/Reveal";
import { clientQuotes, productBySlug, proofIndex, upworkRating, type Product } from "@/lib/content/work";
import { cn } from "@/lib/utils";
import NurMedVisual from "./work/NurMedVisual";
import SenteezVisual from "./work/SenteezVisual";
import PakLawVisual from "./work/PakLawVisual";
import FictionPubVisual from "./work/FictionPubVisual";

function Feature({ p, visual, flip }: { p: Product; visual: React.ReactNode; flip?: boolean }) {
  return (
    <article className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
      <Reveal className={cn("lg:col-span-5 lg:pt-2", flip && "lg:order-2")}>
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-ui text-[20px] font-medium text-ink">{p.name}</span>
          <span className="label-mono">
            {p.industry} · {p.region}
          </span>
        </p>
        <h3 className="mt-5 max-w-[18ch] font-display text-display-lg font-semibold">{p.headline}</h3>
        <p className="mt-5 max-w-[44ch] text-lede text-ink-2">{p.summary}</p>
        <dl className="mt-10 grid grid-cols-3 gap-5 border-t border-line pt-6">
          {p.facts.map((f) => (
            <div key={f.label} className="flex flex-col-reverse gap-1.5">
              <dt className="font-mono text-[11px] leading-snug text-mute">{f.label}</dt>
              <dd className="font-ui text-[clamp(1.25rem,2vw,1.625rem)] font-medium leading-none tracking-[-0.02em] text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          <ButtonLink href={`/work/${p.slug}`} variant="text">
            Read the {p.name} story
          </ButtonLink>
          <ButtonLink href={p.live.href} variant="text" external className="text-mute">
            {p.live.label}
          </ButtonLink>
        </div>
      </Reveal>
      <Reveal delay={0.1} className={cn("lg:col-span-7", flip && "lg:order-1")}>
        {visual}
      </Reveal>
    </article>
  );
}

export default function SelectedWork() {
  return (
    <section aria-labelledby="work-title" className="border-t border-line">
      <div className="wrap pb-20 pt-24 md:pb-28 md:pt-36">
        <Label index="03">Selected work</Label>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
          <h2 id="work-title" className="font-display text-display-xl font-semibold lg:col-span-8">
            Four products we built and still run.
          </h2>
          <p className="max-w-[36ch] text-lede text-mute lg:col-span-4 lg:self-end">
            Each one started as work somebody was doing by hand. All four are live.
          </p>
        </div>

        <div className="mt-20 md:mt-28">
          <Feature p={productBySlug.nurmed} visual={<NurMedVisual />} />
        </div>
      </div>

      <div data-theme="dark" className="bg-background py-24 text-ink md:py-32">
        <div className="wrap">
          <Feature p={productBySlug.senteez} visual={<SenteezVisual />} flip />
        </div>
      </div>

      <div className="wrap space-y-28 py-24 md:space-y-36 md:py-32">
        <Feature p={productBySlug.paklawassist} visual={<PakLawVisual />} />
        <Feature p={productBySlug.fictionpub} visual={<FictionPubVisual />} flip />
      </div>

      <div className="wrap pb-24 md:pb-36">
        <Reveal>
          <Label>Where our software runs</Label>
          <div className="mt-6 border-t border-ink">
            <div className="hidden grid-cols-12 gap-6 border-b border-line py-3 md:grid" aria-hidden="true">
              <span className="label-mono col-span-3">Industry</span>
              <span className="label-mono col-span-2">Product</span>
              <span className="label-mono col-span-4">Problem</span>
              <span className="label-mono col-span-3">Result</span>
            </div>
            <ul>
              {proofIndex.map((r) => (
                <li key={r.product}>
                  <a
                    href={`/work/${r.slug}`}
                    className="group grid grid-cols-2 gap-x-6 gap-y-1 border-b border-line py-5 transition-colors hover:bg-surface-2 md:grid-cols-12 md:items-baseline md:py-6"
                  >
                    <span className="font-mono text-[12px] text-mute md:col-span-3">{r.industry}</span>
                    <span className="text-right font-ui text-[17px] font-medium text-ink md:col-span-2 md:text-left">{r.product}</span>
                    <span className="col-span-2 text-[15px] text-ink-2 md:col-span-4">{r.problem}</span>
                    <span className="col-span-2 font-ui text-[15px] text-ink md:col-span-3">{r.result}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-4">
            <Label>From client work</Label>
            <p className="mt-5 font-ui text-[clamp(2.5rem,5vw,4rem)] font-medium leading-none tracking-[-0.03em]">{upworkRating}</p>
            <p className="mt-3 max-w-[26ch] text-[15px] leading-relaxed text-mute">Rating on Upwork, where we also build for other teams.</p>
          </Reveal>
          {clientQuotes.map((q, i) => (
            <Reveal key={q.by} delay={0.08 * (i + 1)} as="figure" className="md:col-span-4">
              <blockquote className="font-ui text-[clamp(1.125rem,1.6vw,1.375rem)] leading-snug tracking-[-0.01em] text-ink">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <figcaption className="mt-5 font-mono text-[11.5px] text-mute">
                {q.by} · {q.context}
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

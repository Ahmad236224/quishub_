import Link from "next/link";
import Label from "@/components/system/Label";
import ButtonLink from "@/components/system/ButtonLink";
import Reveal from "@/components/system/Reveal";
import Arrow from "@/components/system/Arrow";
import FlowDiagram, { type FlowEdge, type FlowNode } from "@/components/diagram/FlowDiagram";
import CTA from "@/components/sections/CTA";
import { productBySlug, products, type Product } from "@/lib/content/work";

type Item = { title: string; description: string };

export type Block =
  | { kind: "steps" | "list"; title: string; intro?: string; items: Item[] }
  | { kind: "table"; title: string; intro?: string; headers: string[]; rows: string[][] }
  | { kind: "quote"; text: string; by: string };

type Props = {
  slug: Product["slug"];
  eyebrow: string;
  subtitle: string;
  overview: React.ReactNode[];
  pipelineIntro?: string;
  blocks: Block[];
  deployments: { title?: string; intro?: string; items: { label: string; value: string }[] };
};

function pipeline(steps: string[], vertical: boolean) {
  const gap = vertical ? 62 : 150;
  const nodes: FlowNode[] = steps.map((s, i) => ({
    id: s,
    label: s,
    x: vertical ? 110 : 70 + i * gap,
    y: vertical ? 30 + i * gap : 40,
    note: String(i + 1).padStart(2, "0"),
    notePos: vertical ? "left" : "above",
    tone: i === steps.length - 1 ? "ink" : "default",
  }));
  const edges: FlowEdge[] = steps.slice(1).map((s, i) => ({ from: steps[i], to: s, live: true, route: vertical ? "v" : "h" }));
  return {
    nodes,
    edges,
    width: vertical ? 220 : 140 + (steps.length - 1) * gap,
    height: vertical ? 60 + (steps.length - 1) * gap : 70,
  };
}

function SectionShell({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-16 md:py-24">
      <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-4">
          <h2 className="max-w-[18ch] font-display text-display-md font-semibold">{title}</h2>
          {intro && <p className="mt-4 max-w-[40ch] text-[15.5px] leading-relaxed text-mute">{intro}</p>}
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-8">
          {children}
        </Reveal>
      </div>
    </section>
  );
}

export default function CaseStudyLayout({ slug, eyebrow, subtitle, overview, pipelineIntro, blocks, deployments }: Props) {
  const p = productBySlug[slug];
  const next = products[(products.findIndex((x) => x.slug === slug) + 1) % products.length];
  const h = pipeline(p.pipeline, false);
  const v = pipeline(p.pipeline, true);

  return (
    <>
      <section className="pb-16 pt-[120px] md:pb-24 md:pt-[164px]">
        <div className="wrap">
          <Link href="/work" className="group inline-flex items-center gap-2 font-mono text-[12px] text-mute hover:text-ink">
            <Arrow className="rotate-180 transition-transform group-hover:-translate-x-0.5" /> All work
          </Link>
          <Label className="mt-10">{eyebrow}</Label>
          <h1 className="mt-5 font-display text-display-2xl font-semibold">{p.name}</h1>
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <p className="max-w-[26ch] font-ui text-[clamp(1.375rem,2.4vw,2rem)] leading-snug tracking-[-0.015em] text-ink-2 lg:col-span-7">{subtitle}</p>
            <div className="lg:col-span-4 lg:col-start-9">
              <dl className="grid grid-cols-3 gap-4 border-t border-ink pt-5 lg:grid-cols-1 lg:gap-0 lg:pt-0">
                {p.facts.map((f) => (
                  <div key={f.label} className="flex flex-col-reverse gap-1.5 lg:border-b lg:border-line lg:py-4">
                    <dt className="font-mono text-[11px] leading-snug text-mute">{f.label}</dt>
                    <dd className="font-ui text-[clamp(1.25rem,2vw,1.75rem)] font-medium leading-none tracking-[-0.02em]">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <ButtonLink href={p.live.href} variant="text" external className="mt-5 text-[14.5px]">
                {p.live.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <SectionShell title="Overview">
        <div className="max-w-[62ch] space-y-5 text-[17px] leading-relaxed text-ink-2">
          {overview.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </SectionShell>

      <section className="border-t border-line bg-[var(--bg-alt)] py-16 md:py-24">
        <div className="wrap">
          <Label>How it works</Label>
          {pipelineIntro && <p className="mt-5 max-w-[60ch] text-[16px] leading-relaxed text-ink-2">{pipelineIntro}</p>}
          <figure className="mt-10 rounded-lg border border-line bg-surface-2 px-6 py-8 md:px-10">
            <FlowDiagram className="hidden md:block" {...h} title={`${p.name} pipeline`} />
            <FlowDiagram className="mx-auto max-w-[260px] md:hidden" {...v} title={`${p.name} pipeline`} />
          </figure>
        </div>
      </section>

      {blocks.map((b, i) => {
        if (b.kind === "quote") {
          return (
            <section key={i} className="border-t border-line py-16 md:py-24">
              <Reveal className="wrap">
                <figure className="max-w-[46ch]">
                  <blockquote className="font-display text-display-md font-semibold">&ldquo;{b.text}&rdquo;</blockquote>
                  <figcaption className="mt-6 font-mono text-[12px] text-mute">{b.by}</figcaption>
                </figure>
              </Reveal>
            </section>
          );
        }
        if (b.kind === "table") {
          return (
            <SectionShell key={i} title={b.title} intro={b.intro}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-ink">
                      {b.headers.map((hd) => (
                        <th key={hd} scope="col" className="label-mono py-3 pr-4 font-normal">
                          {hd}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r) => (
                      <tr key={r[0]} className="border-b border-line">
                        {r.map((c, j) => (
                          <td key={j} className={j === 0 ? "py-4 pr-4 font-ui text-[15.5px] font-medium" : "py-4 pr-4 text-[15px] text-ink-2"}>
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionShell>
          );
        }
        return (
          <SectionShell key={i} title={b.title} intro={b.intro}>
            <ol className="border-t border-ink">
              {b.items.map((it, j) => (
                <li key={it.title} className="grid grid-cols-1 gap-2 border-b border-line py-6 md:grid-cols-[2.5rem_14rem_1fr] md:gap-6">
                  <span className="font-mono text-[12px] text-mute">{b.kind === "steps" ? String(j + 1).padStart(2, "0") : "—"}</span>
                  <p className="font-ui text-[17px] font-medium">{it.title}</p>
                  <p className="text-[15.5px] leading-relaxed text-ink-2">{it.description}</p>
                </li>
              ))}
            </ol>
          </SectionShell>
        );
      })}

      <SectionShell title={deployments.title ?? "Live today"} intro={deployments.intro}>
        <ul className="border-t border-ink">
          {deployments.items.map((d) => (
            <li key={d.label} className="grid grid-cols-1 gap-1 border-b border-line py-5 md:grid-cols-[14rem_1fr] md:gap-6">
              <span className="font-ui text-[16px] font-medium">{d.label}</span>
              <span className="text-[15.5px] text-ink-2">{d.value}</span>
            </li>
          ))}
        </ul>
      </SectionShell>

      <section className="border-t border-line">
        <Link href={`/work/${next.slug}`} className="group wrap flex flex-col gap-3 py-16 md:flex-row md:items-end md:justify-between md:py-20">
          <div>
            <p className="label-mono">Next product</p>
            <p className="mt-3 font-display text-display-lg font-semibold">{next.name}</p>
            <p className="mt-2 text-[16px] text-mute">{next.headline}</p>
          </div>
          <Arrow className="h-8 w-8 text-ink transition-transform duration-300 group-hover:translate-x-2" />
        </Link>
      </section>

      <CTA />
    </>
  );
}

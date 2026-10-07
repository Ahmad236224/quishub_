import Label from "@/components/system/Label";
import ButtonLink from "@/components/system/ButtonLink";
import Reveal from "@/components/system/Reveal";
import FlowDiagram from "@/components/diagram/FlowDiagram";
import HeroMedia from "@/components/hero/HeroMedia";
import { darkHeroTheme } from "@/components/hero/darkHero";
import SystemProcess from "@/components/home/SystemProcess";
import CTA from "@/components/sections/CTA";
import { situations } from "@/lib/content/services";
import { problems } from "@/lib/content/problems";
import { productBySlug } from "@/lib/content/work";

const diagramFor = Object.fromEntries(problems.map((p) => [p.id, p.after]));

export default function ServicesPage() {
  return (
    <>
      <section
        data-theme="dark"
        data-nav-theme="dark"
        style={darkHeroTheme}
        className="relative isolate overflow-hidden bg-background text-ink xl:flex xl:min-h-[min(820px,100svh)] xl:items-center"
      >
        <div className="wrap relative z-[2] w-full pb-12 pt-[128px] md:pb-14 md:pt-[180px] xl:py-[150px]">
          <div className="xl:max-w-[45%]">
            <Label>Services</Label>
            <h1 className="mt-6 max-w-[14ch] font-display text-[clamp(2.75rem,5.2vw,5rem)] font-semibold leading-[0.99] tracking-[-0.04em]">
              Start with the problem. We&apos;ll build the system.
            </h1>
            <p className="mt-7 max-w-[40ch] text-lede text-ink-2">
              Most projects begin in one of these five places. Every one ends the same way: software running in production, doing the work.
            </p>
          </div>
        </div>

        {/* Below the copy on smaller screens; on desktop it fills the right 58% edge to edge. */}
        <div className="relative xl:absolute xl:inset-y-0 xl:right-0 xl:w-[58%]">
          <HeroMedia
            poster="/videos/hero/hero-poster.jpg"
            video={{ webm: "/videos/hero/hero-loop.webm", mp4: "/videos/hero/hero-loop.mp4" }}
            alt="Abstract close-up of a digital eye made of light and data"
            objectPosition="right center"
            className="aspect-[1440/992] xl:aspect-auto xl:h-full"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,#0a0a0a_0%,rgba(10,10,10,0.6)_12%,transparent_32%)] xl:bg-[linear-gradient(to_bottom,rgba(10,10,10,0.75)_0%,transparent_14%),linear-gradient(to_right,#0a0a0a_0%,rgba(10,10,10,0.9)_8%,rgba(10,10,10,0.45)_22%,transparent_38%)]"
          />
        </div>
      </section>

      <section className="pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="wrap">
          <nav aria-label="Situations" className="border-t border-ink">
            <ol>
              {situations.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 border-b border-line py-5 transition-colors hover:bg-surface-2 md:grid-cols-12">
                    <span className="font-mono text-[12px] text-mute md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-ui text-[clamp(1.25rem,2vw,1.625rem)] font-medium tracking-[-0.015em] md:col-span-4">{s.title}</span>
                    <span className="col-span-3 col-start-2 text-[15px] text-mute md:col-span-6 md:col-start-auto">{s.problem}</span>
                    <span aria-hidden="true" className="hidden text-right font-mono text-[14px] text-mute transition-transform group-hover:translate-y-0.5 md:col-span-1 md:block">↓</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {situations.map((s, i) => {
        const diagram = diagramFor[s.diagram];
        const related = s.related ? productBySlug[s.related.slug] : null;
        return (
          <section key={s.id} id={s.id} className="scroll-mt-20 border-t border-line py-20 md:py-28" aria-labelledby={`${s.id}-title`}>
            {s.aliases.map((a) => (
              <span key={a} id={a} className="block scroll-mt-20" aria-hidden="true" />
            ))}
            <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
              <Reveal className="lg:col-span-6">
                <Label index={String(i + 1).padStart(2, "0")}>Situation</Label>
                <h2 id={`${s.id}-title`} className="mt-5 font-display text-display-lg font-semibold">
                  {s.title}
                </h2>
                <p className="mt-6 max-w-[34ch] font-ui text-[clamp(1.25rem,1.9vw,1.5rem)] leading-snug tracking-[-0.01em] text-ink">{s.problem}</p>
                <p className="mt-5 max-w-[50ch] text-[16px] leading-relaxed text-ink-2">{s.body}</p>

                <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div>
                    <p className="label-mono">For example</p>
                    <ul className="mt-3 space-y-2 text-[15px] text-ink-2">
                      {s.examples.map((e) => (
                        <li key={e} className="border-b border-line pb-2">{e}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="label-mono">What we bring</p>
                    <ul className="mt-3 space-y-2 text-[15px] text-ink-2">
                      {s.capabilities.map((c) => (
                        <li key={c} className="border-b border-line pb-2">{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
                {diagram && (
                  <figure className="rounded-lg border border-line bg-surface-2 px-6 pb-4 pt-5">
                    <figcaption className="label-mono">What it looks like as a system</figcaption>
                    <FlowDiagram className="mx-auto mt-4 max-w-[340px]" {...diagram} width={280} title={`${s.title}: an example workflow`} />
                  </figure>
                )}
                {related && s.related && (
                  <div className="mt-6 border-t border-ink pt-5">
                    <p className="label-mono">Related work</p>
                    <p className="mt-2 font-ui text-[19px] font-medium">{related.name}</p>
                    <p className="mt-1.5 max-w-[42ch] text-[15px] leading-relaxed text-mute">{s.related.note}</p>
                    <ButtonLink href={`/work/${related.slug}`} variant="text" className="mt-4 text-[14.5px]">
                      Read the case study
                    </ButtonLink>
                  </div>
                )}
                {s.proof && (
                  <div className="mt-6 border-t border-ink pt-5">
                    <p className="label-mono">From recent work</p>
                    <ul className="mt-3 space-y-3">
                      {s.proof.map((p) => (
                        <li key={p} className="text-[15px] leading-relaxed text-ink-2">{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {s.healthcare && (
                  <div className="mt-6 border-t border-line pt-5">
                    <p className="text-[15px] leading-relaxed text-mute">Running a clinic or practice?</p>
                    <ButtonLink href="/healthcare?from=quishub" variant="text" className="mt-2 text-[14.5px]">
                      See our healthcare workflows
                    </ButtonLink>
                  </div>
                )}
              </Reveal>
            </div>
          </section>
        );
      })}

      <SystemProcess index="" />
      <CTA />
    </>
  );
}

import ButtonLink from "@/components/system/ButtonLink";
import HeroMedia from "@/components/hero/HeroMedia";
import { darkHeroTheme } from "@/components/hero/darkHero";

export default function WorkflowHero() {
  return (
    <section
      data-theme="dark"
      data-nav-theme="dark"
      style={darkHeroTheme}
      className="relative isolate overflow-hidden bg-background text-ink xl:flex xl:min-h-[min(880px,100svh)] xl:items-center"
    >
      <div className="wrap relative z-[2] w-full pb-12 pt-[132px] md:pb-14 md:pt-[172px] xl:py-[150px]">
        <div className="xl:max-w-[45%]">
          <h1 className="max-w-[13ch] font-display text-[clamp(2.75rem,5.2vw,5rem)] font-semibold leading-[0.99] tracking-[-0.04em]">
            Software for the work your business still does by hand.
          </h1>
          <p className="mt-7 max-w-[42ch] text-lede text-ink-2">
            Quishub builds software, automation, and AI systems around the way your business actually operates.
          </p>

          <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
            <ButtonLink href="/contact" className="font-semibold hover:bg-white">
              Tell us what&apos;s slowing you down
            </ButtonLink>
            <ButtonLink href="/work" variant="text" className="font-semibold [&_svg]:text-[#a99cff]">
              Explore our work
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Below the copy on smaller screens; on desktop it fills the right 58% edge to edge, top to bottom. */}
      <div className="relative xl:absolute xl:inset-y-0 xl:right-0 xl:w-[58%]">
        <HeroMedia
          poster="/videos/hero/veo-poster.jpg"
          video={{ webm: "/videos/hero/veo-loop.webm", mp4: "/videos/hero/veo-loop.mp4" }}
          alt="Abstract mechanism of glass and metal with strands of violet light running into its core"
          objectPosition="60% center"
          className="aspect-video xl:aspect-auto xl:h-full"
        />
        {/* Dissolve into the black: from above on stacked layouts, from the copy's side on desktop. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,#0a0a0a_0%,rgba(10,10,10,0.6)_12%,transparent_32%)] xl:bg-[linear-gradient(to_bottom,rgba(10,10,10,0.75)_0%,transparent_14%),linear-gradient(to_right,#0a0a0a_0%,rgba(10,10,10,0.9)_8%,rgba(10,10,10,0.45)_22%,transparent_38%)]"
        />
      </div>
    </section>
  );
}

import Label from "@/components/system/Label";
import Reveal from "@/components/system/Reveal";
import TeamEditorial from "@/components/home/TeamEditorial";
import SystemProcess from "@/components/home/SystemProcess";
import TechStack from "@/components/home/TechStack";
import CTA from "@/components/sections/CTA";

const principles = [
  {
    name: "Say no",
    text: "We'd rather turn a project down than ship something we're not proud of. Every system we build has our name on it.",
  },
  {
    name: "After launch",
    text: "We design for what comes after the first release, and make the decisions on day one that save months of rework later.",
  },
  {
    name: "Straight answers",
    text: "We tell you what's possible, what isn't, and what you actually need, even when that isn't what you hoped to hear.",
  },
  {
    name: "Local, global",
    text: "We're based in Pakistan. Our systems run with government institutions, healthcare providers and international platforms.",
  },
];

const numbers = [
  { value: "2", label: "Government deployments" },
  { value: "5+", label: "Live production systems" },
  { value: "5.0", label: "Rating on Upwork" },
  { value: "4+", label: "Industries" },
];

export default function AboutPage() {
  return (
    <>
      <section className="pb-20 pt-[128px] md:pb-28 md:pt-[180px]">
        <div className="wrap">
          <Label>About</Label>
          <h1 className="mt-6 max-w-[16ch] font-display text-display-2xl font-semibold">
            A small team that builds the whole system.
          </h1>
          <div className="mt-12 grid grid-cols-1 gap-8 md:mt-16 lg:grid-cols-12 lg:gap-10">
            <p className="max-w-[40ch] text-lede text-ink-2 lg:col-span-5 lg:col-start-6">
              The people you talk to are the people who build. We don&apos;t hand projects to a separate delivery team, and we don&apos;t outsource the hard parts.
            </p>
            <p className="max-w-[40ch] text-lede text-mute lg:col-span-5 lg:col-start-6">
              We&apos;ve built and run our own products in healthcare, legal, hospitality and publishing. So when we build for you, we&apos;re not guessing what production demands.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-line py-20 md:py-28" aria-labelledby="principles-title">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Label>How we work with you</Label>
            <h2 id="principles-title" className="mt-5 max-w-[14ch] font-display text-display-md font-semibold">
              Four things we don&apos;t compromise on.
            </h2>
          </div>
          <ol className="border-t border-ink lg:col-span-8">
            {principles.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 0.05} className="grid grid-cols-1 gap-3 border-b border-line py-7 md:grid-cols-[12rem_1fr] md:gap-10">
                <p className="flex items-baseline gap-3">
                  <span className="font-mono text-[12px] text-mute">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-ui text-[17px] font-medium">{p.name}</span>
                </p>
                <p className="max-w-[52ch] font-ui text-[clamp(1.125rem,1.6vw,1.375rem)] leading-snug tracking-[-0.01em] text-ink-2">{p.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="wrap mt-20 md:mt-28">
          <dl className="grid grid-cols-2 border-t border-line md:grid-cols-4">
            {numbers.map((n) => (
              <div key={n.label} className="flex flex-col-reverse gap-2 border-b border-line py-6 pr-4 md:border-b-0">
                <dt className="font-mono text-[11.5px] text-mute">{n.label}</dt>
                <dd className="font-ui text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.03em]">{n.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <TeamEditorial index="" />
      <SystemProcess index="" />
      <TechStack />
      <CTA />
    </>
  );
}

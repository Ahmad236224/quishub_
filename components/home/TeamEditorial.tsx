import Image from "next/image";
import Label from "@/components/system/Label";
import Reveal from "@/components/system/Reveal";
import Arrow from "@/components/system/Arrow";
import { founders, team, type Person } from "@/lib/content/team";

function Portrait({ person, sizes, priority }: { person: Person; sizes: string; priority?: boolean }) {
  return (
    <figure>
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[#e6ddcb]">
        <Image
          src={person.image}
          alt={person.name}
          width={person.size[0]}
          height={person.size[1]}
          sizes={sizes}
          priority={priority}
          className="absolute h-auto max-w-none"
          style={{ width: `${person.frame.w}%`, left: `${person.frame.left}%`, top: `${person.frame.top}%` }}
        />
      </div>
      <figcaption className="mt-4">
        <p className="font-ui text-[17px] font-medium leading-tight text-ink">{person.name}</p>
        <p className="mt-1.5 font-mono text-[11.5px] leading-snug text-mute">{person.role}</p>
        {person.linkedin && (
          <a
            href={person.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw mt-2 inline-flex items-center gap-1 font-mono text-[11.5px] text-ink-2"
            aria-label={`${person.name} on LinkedIn`}
          >
            LinkedIn <Arrow direction="up-right" />
          </a>
        )}
      </figcaption>
    </figure>
  );
}

export default function TeamEditorial({ index = "05" }: { index?: string }) {
  return (
    <section aria-labelledby="team-title" className="border-t border-line bg-[var(--bg-alt)] py-24 md:py-36">
      <div className="wrap">
        <Label index={index}>The team</Label>
        <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 id="team-title" className="max-w-[16ch] font-display text-display-lg font-semibold">
              There isn&apos;t an account-manager layer.
            </h2>
            <p className="mt-6 max-w-[38ch] text-lede text-ink-2">
              You talk to the people designing and building your system. A small team based in Pakistan: the people on your first call are the people who build it.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:col-span-7">
            {founders.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <Portrait person={p} sizes="(max-width: 1024px) 50vw, 400px" />
              </Reveal>
            ))}
          </div>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-x-6 lg:mt-20 lg:grid-cols-5">
          {team.map((p, i) => (
            <Reveal as="li" key={p.name} delay={i * 0.05}>
              <Portrait person={p} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

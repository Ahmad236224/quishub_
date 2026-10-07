import Label from "@/components/system/Label";
import { stack, type StackCategory } from "@/lib/content/stack";
import { cn } from "@/lib/utils";

type Variant = "feature" | "list" | "wide" | "strip";

// Composition, not a uniform grid: AI leads, infrastructure runs wide, payments closes as a strip.
const layout: { category: string; variant: Variant; className: string }[] = [
  { category: "AI & automation", variant: "feature", className: "md:col-span-2 lg:col-span-7" },
  { category: "Frontend", variant: "list", className: "lg:col-span-5" },
  { category: "Backend", variant: "list", className: "lg:col-span-4" },
  { category: "Data", variant: "list", className: "lg:col-span-4" },
  { category: "Mobile", variant: "list", className: "lg:col-span-4" },
  { category: "Cloud & DevOps", variant: "wide", className: "md:col-span-2 lg:col-span-8" },
  { category: "Workflow tools", variant: "list", className: "lg:col-span-4" },
  { category: "Payments & comms", variant: "strip", className: "lg:col-span-7" },
  { category: "Testing", variant: "list", className: "md:col-span-2 lg:col-span-5" },
];

const byCategory = new Map(stack.map((s) => [s.category, s]));

/** Logo drawn as a mask so it takes the text colour: plum at rest, violet on hover. */
function Mark({ icon, className }: { icon: string; className?: string }) {
  const mask = `url(${icon}) center / contain no-repeat`;
  return <span aria-hidden className={cn("block shrink-0 bg-current", className)} style={{ WebkitMask: mask, mask }} />;
}

const markMotion =
  "text-mute transition-[color,transform] duration-300 ease-out group-hover/item:-translate-y-0.5 group-hover/item:text-[var(--quishub-purple)]";

function Item({ name, icon, size = "h-[18px] w-[18px]", className }: { name: string; icon: string; size?: string; className?: string }) {
  return (
    <li className={cn("group/item flex items-center gap-2.5", className)}>
      <Mark icon={icon} className={cn(size, markMotion)} />
      <span className="font-ui text-[15.5px] leading-snug text-ink">{name}</span>
    </li>
  );
}

function Tile({ data, variant, className }: { data: StackCategory; variant: Variant; className: string }) {
  const { category, blurb, items } = data;
  const strip = variant === "strip";

  return (
    <article
      aria-label={category}
      className={cn(
        "flex flex-col rounded-[18px] border border-[rgba(24,16,35,0.10)] p-6 md:p-7",
        "transition-[border-color,box-shadow,transform] duration-300 ease-out",
        "hover:-translate-y-px hover:border-[rgba(124,58,237,0.26)] hover:shadow-[0_14px_32px_-22px_rgba(24,16,35,0.28)]",
        variant === "feature" ? "bg-[#eeeae3] md:p-9" : "bg-[#f8f6f2]",
        strip && "lg:flex-row lg:items-center lg:gap-10",
        className
      )}
    >
      <header className={cn(strip && "lg:w-[38%] lg:shrink-0")}>
        <h3 className="label-mono text-ink-2">{category}</h3>
        {variant === "feature" ? (
          <p className="mt-5 max-w-[22ch] font-display text-display-md font-semibold text-ink">{blurb}</p>
        ) : (
          <p className="mt-2.5 max-w-[36ch] text-[14.5px] leading-relaxed text-mute">{blurb}</p>
        )}
      </header>

      {variant === "feature" && (
        // A loose, slightly staggered cluster rather than a list: the middle column sits a step lower.
        <ul className="mt-auto grid grid-cols-2 gap-2.5 pt-10 sm:grid-cols-3 sm:gap-3 sm:pb-3">
          {items.map((it) => (
            <Item
              key={it.name}
              {...it}
              size="h-[22px] w-[22px]"
              className="rounded-xl border border-[rgba(24,16,35,0.08)] bg-[#f8f6f2] px-4 py-3.5 transition-colors duration-300 hover:border-[rgba(124,58,237,0.22)] sm:[&:nth-child(3n+2)]:translate-y-3"
            />
          ))}
        </ul>
      )}

      {variant === "list" && (
        <ul className="mt-auto grid grid-cols-2 gap-x-5 gap-y-3.5 pt-8">
          {items.map((it) => (
            <Item key={it.name} {...it} />
          ))}
        </ul>
      )}

      {variant === "wide" && (
        // Reads like a rack: each tool in its own bay.
        <ul className="mt-auto grid grid-cols-2 gap-y-6 pt-9 sm:grid-cols-5">
          {items.map((it) => (
            <li key={it.name} className="group/item flex flex-col gap-3 border-l border-[rgba(24,16,35,0.10)] pl-4">
              <Mark icon={it.icon} className={cn("h-5 w-5", markMotion)} />
              <span className="font-ui text-[15px] leading-snug text-ink">{it.name}</span>
            </li>
          ))}
        </ul>
      )}

      {strip && (
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3.5 lg:mt-0">
          {items.map((it) => (
            <Item key={it.name} {...it} />
          ))}
        </ul>
      )}
    </article>
  );
}

export default function TechStack() {
  return (
    <section aria-labelledby="stack-title" className="border-t border-line py-24 md:py-36">
      <div className="wrap">
        <Label>Technology</Label>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
          <h2 id="stack-title" className="max-w-[20ch] font-display text-display-lg font-semibold lg:col-span-8">
            Tools we use to build systems that hold up in the real world.
          </h2>
          <p className="max-w-[40ch] text-lede text-mute lg:col-span-4 lg:self-end">
            From product interfaces to infrastructure, automation and AI, we choose the stack around the problem, not the trend.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-3 md:mt-20 md:grid-cols-2 lg:grid-cols-12 lg:gap-4">
          {layout.map(({ category, variant, className }) => {
            const data = byCategory.get(category);
            return data ? <Tile key={category} data={data} variant={variant} className={className} /> : null;
          })}
        </div>
      </div>
    </section>
  );
}

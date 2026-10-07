import Label from "@/components/system/Label";
import ButtonLink from "@/components/system/ButtonLink";
import Magnetic from "@/components/system/Magnetic";
import FlowDiagram, { type FlowEdge, type FlowNode } from "@/components/diagram/FlowDiagram";

const nodes: FlowNode[] = [
  { id: "today", label: "How it works today", x: 150, y: 30, tone: "muted" },
  { id: "call", label: "A 30-minute call", x: 150, y: 100 },
  { id: "map", label: "We map the workflow", x: 150, y: 170 },
  { id: "sw", label: "What should become software", x: 150, y: 240, tone: "ink" },
];
const edges: FlowEdge[] = [
  { from: "today", to: "call", route: "v", dashed: true },
  { from: "call", to: "map", route: "v", live: true },
  { from: "map", to: "sw", route: "v", live: true },
];

export default function CTA({ index }: { index?: string; variant?: "light" | "dark" }) {
  return (
    <section data-theme="dark" className="bg-background text-ink" id="contact" aria-labelledby="cta-title">
      <div className="wrap grid grid-cols-1 gap-16 py-28 md:py-40 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Label index={index}>Start a project</Label>
          <h2 id="cta-title" className="mt-6 max-w-[14ch] font-display text-display-xl font-semibold">
            What&apos;s still being done manually?
          </h2>
          <p className="mt-6 max-w-[44ch] text-lede text-mute">
            Tell us how the process works today. We&apos;ll help you figure out what should become software.
          </p>
          <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
            <Magnetic>
              <ButtonLink href="/contact">Show us the workflow</ButtonLink>
            </Magnetic>
            <ButtonLink href="mailto:hello@quishub.com" variant="text" arrow={false}>
              hello@quishub.com
            </ButtonLink>
          </div>
          <p className="mt-10 font-mono text-[12px] text-mute">30-minute call · We reply within 24 hours · No obligation</p>
        </div>
        <div className="flex items-center lg:col-span-4 lg:col-start-9">
          <FlowDiagram nodes={nodes} edges={edges} width={300} height={270} title="From how it works today to what should become software" className="mx-auto max-w-[320px]" />
        </div>
      </div>
    </section>
  );
}

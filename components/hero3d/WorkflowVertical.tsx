import { byId } from "./model";

const inputs = ["Email", "Phone call", "Web form"];
const steps = [
  { id: "intake", label: "Intake" },
  { id: "validate", label: "Validate" },
  { id: "process", label: "Process" },
  { id: "review", label: "Human review", note: "if needed" },
  { id: "done", label: "Complete" },
];

// Mobile: a readable vertical workflow in the same visual language, no WebGL.
export default function WorkflowVertical() {
  return (
    <ol className="border-t border-line pt-6">
      <li className="pb-5">
        <p className="label-mono">Inputs</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {inputs.map((l) => (
            <span key={l} className="inline-flex h-9 items-center rounded-md border border-line-2 bg-surface-2 px-3 font-ui text-[14px] font-medium">
              {l}
            </span>
          ))}
        </div>
      </li>
      {steps.map((s) => {
        const final = s.id === "done";
        return (
          <li key={s.id} className="relative border-l border-line-2 pb-5 pl-5 last:border-transparent last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full border border-ink ${final ? "bg-ink" : "bg-background"}`}
            />
            <p className="flex items-baseline gap-2">
              <span className="font-ui text-[15px] font-semibold">{s.label}</span>
              {s.note && <span className="font-mono text-[11px] text-mute">· {s.note}</span>}
            </p>
            <p className="mt-1 text-[14.5px] leading-relaxed text-ink-2">{byId[s.id].desc}</p>
          </li>
        );
      })}
    </ol>
  );
}

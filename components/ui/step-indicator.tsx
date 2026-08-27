import clsx from "clsx";
import { FrameworkStage, TierId } from "@/lib/types";
import { getFlowSteps } from "@/lib/flow/steps";

const STAGES: { id: FrameworkStage; label: string }[] = [
  { id: "targeting", label: "Targeting" },
  { id: "persistence", label: "Persistence" },
  { id: "conversion", label: "Conversion" },
  { id: "closing", label: "Closing" },
];

export function StepIndicator({
  tier,
  activeStage,
}: {
  tier: TierId;
  activeStage: FrameworkStage | null;
}) {
  const stagesInTier = new Set(
    getFlowSteps(tier)
      .map((s) => s.stage)
      .filter((s): s is FrameworkStage => s !== null)
  );

  return (
    <ol
      className="flex items-center gap-1 sm:gap-4 overflow-x-auto"
      aria-label="Positioning framework progress"
    >
      {STAGES.map((stage, i) => {
        const inTier = stagesInTier.has(stage.id);
        const isActive = activeStage === stage.id;
        return (
          <li key={stage.id} className="flex items-center gap-1 sm:gap-4 shrink-0">
            <span
              className={clsx(
                "flex items-center gap-1.5 text-[11px] sm:text-sm font-body tracking-wide whitespace-nowrap",
                !inTier && "opacity-35",
                isActive ? "text-gold font-semibold" : "text-ice/80"
              )}
            >
              <span
                className={clsx(
                  "flex h-2 w-2 shrink-0 rounded-full",
                  isActive ? "bg-gold" : inTier ? "bg-ice/50" : "bg-ice/20"
                )}
              />
              {stage.label}
            </span>
            {i < STAGES.length - 1 && <span className="h-px w-3 sm:w-8 bg-ice/20 shrink-0" />}
          </li>
        );
      })}
    </ol>
  );
}

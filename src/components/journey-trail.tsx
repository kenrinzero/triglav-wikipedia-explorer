/**
 * JourneyTrail — the breadcrumb trail of the user's exploration.
 * Shows every search query in order, colored by which path the user followed.
 * Clicking a breadcrumb re-runs that search. "Start over" clears the trail.
 */

import type { PathId } from "@/lib/wikipedia";
import { RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

/** A single step in the user's rabbit-hole journey */
export interface JourneyStep {
  /** The query that was searched */
  query: string;
  /** Which path the user followed to reach this step (null for the initial search) */
  pathId: PathId | null;
}

interface JourneyTrailProps {
  /** The ordered list of journey steps */
  steps: JourneyStep[];
  /** Called when the user clicks a breadcrumb to re-run that search */
  onJumpTo: (query: string) => void;
  /** Called when the user clicks "Start over" to reset everything */
  onReset: () => void;
}

/**
 * Maps a pathId (or null for the initial search) to a text color class.
 * The initial query gets the default foreground color.
 */
function stepColor(pathId: PathId | null): string {
  if (pathId === "svarog") return "text-svarog";
  if (pathId === "perun") return "text-perun";
  if (pathId === "veles") return "text-veles";
  return "text-foreground";
}

export function JourneyTrail({ steps, onJumpTo, onReset }: JourneyTrailProps) {
  if (steps.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-3 rounded-md bg-secondary/50 border border-border">
      {/* Label for the trail */}
      <span className="text-xs font-heading tracking-wider text-muted-foreground mr-1">
        Journey:
      </span>

      {steps.map((step, index) => (
        <span key={`${step.query}-${index}`} className="flex items-center gap-1">
          {/* Arrow separator between steps (skip before the first) */}
          {index > 0 && (
            <span className="text-muted-foreground text-xs">→</span>
          )}
          {/* Clickable breadcrumb — colored by the path it came from */}
          <button
            onClick={() => onJumpTo(step.query)}
            className={`text-xs font-medium hover:underline underline-offset-2 cursor-pointer transition-colors ${stepColor(step.pathId)}`}
          >
            {step.query}
          </button>
        </span>
      ))}

      {/* Start over button — clears the entire journey */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="ml-auto h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <RotateCcw className="h-3 w-3 mr-1" />
        Start over
      </Button>
    </div>
  );
}

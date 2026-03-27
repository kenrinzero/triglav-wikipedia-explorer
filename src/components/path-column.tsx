/**
 * PathColumn — one of Triglav's three heads.
 * Displays a themed header (name + tagline) and 3 result cards.
 * Shows a loading skeleton while fetching, or a "silent" message if no results.
 */

import type { ArticleResult, PathId } from "@/lib/wikipedia";
import { ResultCard } from "@/components/result-card.tsx";

interface PathColumnProps {
  /** Identifier for which head/path this column represents */
  pathId: PathId;
  /** The display name of this head (e.g. "Svarog's Forge") */
  name: string;
  /** A short flavor tagline displayed under the head name */
  tagline: string;
  /** The search results to display — null means still loading */
  results: ArticleResult[] | null;
  /** Whether results are currently being fetched */
  isLoading: boolean;
  /** Called when a user clicks a result title to dive deeper */
  onDive: (title: string) => void;
}

/**
 * Maps pathId to the Tailwind text color class for the column header.
 */
const HEADER_COLORS: Record<PathId, string> = {
  svarog: "text-svarog",
  perun: "text-perun",
  veles: "text-veles",
};

/**
 * Maps pathId to a decorative border-top color for the column.
 */
const TOP_BORDER: Record<PathId, string> = {
  svarog: "border-t-2 border-svarog/40",
  perun: "border-t-2 border-perun/40",
  veles: "border-t-2 border-veles/40",
};

export function PathColumn({
  pathId,
  name,
  tagline,
  results,
  isLoading,
  onDive,
}: PathColumnProps) {
  return (
    <div className={`flex flex-col gap-4 ${TOP_BORDER[pathId]} pt-4`}>
      {/* Column header: head name and tagline */}
      <div>
        <h2 className={`font-heading text-lg font-bold tracking-wide ${HEADER_COLORS[pathId]}`}>
          {name}
        </h2>
        <p className="mt-0.5 text-xs italic text-muted-foreground">{tagline}</p>
      </div>

      {/* Content area: loading skeletons, results, or empty state */}
      {isLoading ? (
        /* Three skeleton cards pulse while the oracle deliberates */
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-28 rounded-md bg-muted animate-oracle-pulse"
              style={{ animationDelay: `${i * 300}ms` }}
            />
          ))}
        </div>
      ) : results && results.length > 0 ? (
        /* Render result cards with staggered fade-in animation */
        <div className="flex flex-col gap-3">
          {results.map((article, index) => (
            <ResultCard
              key={article.title}
              article={article}
              pathId={pathId}
              onDive={onDive}
              index={index}
            />
          ))}
        </div>
      ) : (
        /* Empty state: the head has nothing to say */
        <p className="py-8 text-center text-sm italic text-muted-foreground">
          The head is silent...
        </p>
      )}
    </div>
  );
}

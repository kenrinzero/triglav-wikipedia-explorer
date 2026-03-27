/**
 * ResultCard — displays a single Wikipedia article result.
 * Shows the title (clickable to dive deeper), a short extract,
 * and a link to the full Wikipedia page.
 *
 * This file uses PascalCase naming to match the exact import path
 * used by path-column.tsx in case-sensitive build environments.
 */

import type { ArticleResult, PathId } from "@/lib/wikipedia";
import { ExternalLink } from "lucide-react";

interface ResultCardProps {
  /** The article data to display */
  article: ArticleResult;
  /** Which path this card belongs to — determines accent color */
  pathId: PathId;
  /** Called when the user clicks the title to dive deeper into the rabbit hole */
  onDive: (title: string) => void;
  /** Staggered animation delay index (0, 1, 2) for the fade-in effect */
  index: number;
}

/**
 * Maps a pathId to Tailwind classes for border, hover glow, and title color.
 * These classes reference the custom utilities defined in index.css.
 */
const PATH_STYLES: Record<PathId, { border: string; glow: string; text: string }> = {
  svarog: { border: "border-svarog/30", glow: "hover:glow-svarog", text: "text-svarog" },
  perun: { border: "border-perun/30", glow: "hover:glow-perun", text: "text-perun" },
  veles: { border: "border-veles/30", glow: "hover:glow-veles", text: "text-veles" },
};

export function ResultCard({ article, pathId, onDive, index }: ResultCardProps) {
  const styles = PATH_STYLES[pathId];

  return (
    <div
      className={`rounded-md border bg-card p-4 transition-all duration-300 ${styles.border} ${styles.glow} animate-fade-in-up`}
      style={{ animationDelay: `${index * 120}ms`, opacity: 0 }}
    >
      <button
        onClick={() => onDive(article.title)}
        className={`cursor-pointer text-left font-heading text-base font-semibold leading-tight ${styles.text} underline-offset-2 hover:underline`}
      >
        {article.title}
      </button>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {article.extract}
      </p>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        Read on Wikipedia
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}

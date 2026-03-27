/**
 * Index page — the main Triglav experience.
 *
 * State management:
 * - `journey`: array of JourneyStep objects tracking every search the user has made
 * - `results`: a record mapping each PathId to its array of ArticleResults (or null while loading)
 * - `isLoading`: boolean indicating whether a search is in progress
 * - `hasSearched`: boolean to toggle between the landing oracle message and the results view
 *
 * Flow:
 * 1. User types a query → handleSearch fires
 * 2. handleSearch adds a JourneyStep and kicks off 3 parallel Wikipedia searches (one per path)
 * 3. Results populate into PathColumns which render ResultCards
 * 4. Clicking a ResultCard title calls handleDive, which feeds the title back as a new search
 */

import { useState, useCallback } from "react";
import { SearchInput } from "@/components/search-input";
import { PathColumn } from "@/components/path-column";
import { JourneyTrail, type JourneyStep } from "@/components/journey-trail";
import { searchPath, type ArticleResult, type PathId } from "@/lib/wikipedia";

/** The three heads of Triglav — configuration for each path column */
const PATHS: Array<{ id: PathId; name: string; tagline: string }> = [
  {
    id: "svarog",
    name: "Svarog's Forge",
    tagline: "The celestial head — creation, light, beauty",
  },
  {
    id: "perun",
    name: "Perun's Strike",
    tagline: "The thunder head — direct, unfiltered, true",
  },
  {
    id: "veles",
    name: "Veles' Depths",
    tagline: "The underworld head — trickery, shadow, forbidden knowledge",
  },
];

export default function Index() {
  /* Journey trail: every query the user has searched, in order */
  const [journey, setJourney] = useState<JourneyStep[]>([]);

  /* Search results for each of the three paths — null means "not yet loaded" */
  const [results, setResults] = useState<Record<PathId, ArticleResult[] | null>>({
    svarog: null,
    perun: null,
    veles: null,
  });

  /* Loading flag — true while any search is in flight */
  const [isLoading, setIsLoading] = useState(false);

  /* Has the user searched at least once? Controls landing vs results view */
  const [hasSearched, setHasSearched] = useState(false);

  /**
   * Core search handler.
   * Adds a journey step and fires 3 parallel Wikipedia searches.
   * `sourcePath` indicates which head the user followed to get here (null for manual search).
   */
  const handleSearch = useCallback(
    async (query: string, sourcePath: PathId | null = null) => {
      setIsLoading(true);
      setHasSearched(true);

      /* Add this query to the journey trail */
      setJourney((prev) => [...prev, { query, pathId: sourcePath }]);

      /* Reset results to null (triggers loading skeletons) */
      setResults({ svarog: null, perun: null, veles: null });

      /* Fire all three path searches in parallel for speed */
      const [svarogResults, perunResults, velesResults] = await Promise.all([
        searchPath(query, "svarog"),
        searchPath(query, "perun"),
        searchPath(query, "veles"),
      ]);

      setResults({
        svarog: svarogResults,
        perun: perunResults,
        veles: velesResults,
      });
      setIsLoading(false);
    },
    []
  );

  /**
   * Rabbit hole dive — when a user clicks a result title, feed it back as a new search.
   * We tag it with the pathId so the journey trail shows which head they followed.
   */
  const handleDive = useCallback(
    (title: string, pathId: PathId) => {
      handleSearch(title, pathId);
    },
    [handleSearch]
  );

  /** Jump to a previous breadcrumb — re-runs that search as a fresh query */
  const handleJumpTo = useCallback(
    (query: string) => {
      handleSearch(query, null);
    },
    [handleSearch]
  );

  /** Reset everything — clear journey and results, return to landing state */
  const handleReset = useCallback(() => {
    setJourney([]);
    setResults({ svarog: null, perun: null, veles: null });
    setHasSearched(false);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header area: app title and search input */}
      <header className="flex flex-col items-center gap-6 px-4 pt-12 pb-6">
        {/* App title — large, serif, letter-spaced for that ancient oracle feel */}
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-[0.25em] text-foreground">
          TRIGLAV
        </h1>

        {/* Landing oracle message — shown only before the first search */}
        {!hasSearched && (
          <p className="max-w-md text-center text-sm leading-relaxed text-muted-foreground italic">
            Triglav sees all — past, present, and shadow. Speak a word, and the
            three heads will reveal what lies beyond.
          </p>
        )}

        {/* Search input — always visible */}
        <SearchInput onSearch={(q) => handleSearch(q, null)} isLoading={isLoading} />
      </header>

      {/* Journey trail — shown once the user has searched at least once */}
      {journey.length > 0 && (
        <div className="px-4 md:px-8 pb-4">
          <JourneyTrail steps={journey} onJumpTo={handleJumpTo} onReset={handleReset} />
        </div>
      )}

      {/* Results area: three columns (or stacked on mobile) */}
      {hasSearched && (
        <main className="flex-1 px-4 md:px-8 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {PATHS.map((path) => (
              <PathColumn
                key={path.id}
                pathId={path.id}
                name={path.name}
                tagline={path.tagline}
                results={results[path.id]}
                isLoading={isLoading}
                onDive={(title) => handleDive(title, path.id)}
              />
            ))}
          </div>
        </main>
      )}
    </div>
  );
}

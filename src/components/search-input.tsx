/**
 * SearchInput — the oracle's ear.
 * A centered search bar where the user types a word or concept.
 * On submit it fires onSearch with the trimmed query string.
 */

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  /** Called when the user submits a search query */
  onSearch: (query: string) => void;
  /** Whether a search is currently in progress (disables input) */
  isLoading: boolean;
}

export function SearchInput({ onSearch, isLoading }: SearchInputProps) {
  /* Local state for the controlled input value */
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      onSearch(trimmed);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      {/* 
        The input container: a bordered box styled like an ancient artifact.
        ring color uses the gold --ring token for focus state.
      */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isLoading}
          placeholder="Enter a word or concept..."
          className="w-full rounded-md border border-border bg-secondary px-4 py-3 pr-12 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:opacity-50"
        />
        {/* Search icon button sits inside the input visually */}
        <button
          type="submit"
          disabled={isLoading || value.trim().length === 0}
          className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}

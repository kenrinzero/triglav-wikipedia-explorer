/**
 * Wikipedia API utilities for Triglav.
 * Uses the MediaWiki Action API for search and the REST API for page summaries.
 * No API key required — these are public endpoints.
 */

/** Shape of a single search result returned by the MediaWiki search API */
interface WikiSearchResult {
  title: string;
  pageid: number;
  snippet: string;
}

/** Shape of the data we surface in the UI for each article */
export interface ArticleResult {
  title: string;
  extract: string;
  url: string;
}

/** Which mythological head / path this result belongs to */
export type PathId = "svarog" | "perun" | "veles";

/**
 * Keywords appended to the user's query for each path.
 * Perun uses no keywords — it's the "true" unfiltered path.
 * Svarog adds celestial/creative terms; Veles adds shadowy/occult terms.
 */
const PATH_KEYWORDS: Record<PathId, string[]> = {
  svarog: ["celebration", "festival", "beauty", "harmony", "art", "heritage"],
  perun: [],
  veles: ["occult", "conspiracy", "cult", "disaster", "forbidden", "paranormal"],
};

/**
 * Search Wikipedia for articles matching a query on a specific path.
 * Picks a random keyword from the path's list (if any) and appends it.
 * Returns up to `limit` ArticleResult objects.
 */
export async function searchPath(
  query: string,
  path: PathId,
  limit = 3
): Promise<ArticleResult[]> {
  const keywords = PATH_KEYWORDS[path];
  /* For Svarog and Veles, append a random keyword to skew results thematically */
  const suffix =
    keywords.length > 0
      ? " " + keywords[Math.floor(Math.random() * keywords.length)]
      : "";
  const fullQuery = `${query}${suffix}`;

  /* Build the MediaWiki search URL — srsearch does full-text search */
  const searchUrl = new URL("https://en.wikipedia.org/w/api.php");
  searchUrl.searchParams.set("action", "query");
  searchUrl.searchParams.set("list", "search");
  searchUrl.searchParams.set("srsearch", fullQuery);
  searchUrl.searchParams.set("srlimit", String(limit));
  searchUrl.searchParams.set("format", "json");
  searchUrl.searchParams.set("origin", "*"); // CORS

  const response = await fetch(searchUrl.toString());
  if (!response.ok) return [];

  const data: { query?: { search?: WikiSearchResult[] } } =
    await response.json();
  const results = data.query?.search ?? [];

  /* For each search hit, fetch a short extract via the REST summary endpoint */
  const articles = await Promise.all(
    results.map(async (result) => {
      try {
        const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(result.title)}`;
        const summaryResponse = await fetch(summaryUrl);
        if (!summaryResponse.ok) {
          return {
            title: result.title,
            extract: stripHtml(result.snippet),
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
          };
        }
        const summary: { extract?: string; content_urls?: { desktop?: { page?: string } } } =
          await summaryResponse.json();
        return {
          title: result.title,
          extract: summary.extract
            ? truncateExtract(summary.extract)
            : stripHtml(result.snippet),
          url:
            summary.content_urls?.desktop?.page ??
            `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
        };
      } catch {
        return {
          title: result.title,
          extract: stripHtml(result.snippet),
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
        };
      }
    })
  );

  return articles;
}

/** Strip HTML tags from a snippet string (MediaWiki returns <span> highlights) */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/** Truncate an extract to roughly two sentences for card display */
function truncateExtract(text: string): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (!sentences) return text;
  return sentences.slice(0, 2).join(" ").trim();
}

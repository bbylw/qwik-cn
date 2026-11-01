import { advancedDocs } from "./advanced";
import { conceptDocs } from "./concepts";
import { coreDocs } from "./core";
import { routerDocs } from "./router";
import { startDocs } from "./start";
import { DOC_SECTIONS, type Doc, type DocBlock, type DocSectionId } from "./types";

export const ALL_DOCS: Doc[] = [
  ...startDocs,
  ...conceptDocs,
  ...coreDocs,
  ...routerDocs,
  ...advancedDocs,
];

export const DOC_GROUPS = DOC_SECTIONS.map((section) => ({
  ...section,
  docs: ALL_DOCS.filter((doc) => doc.section === section.id),
}));

const docMap = new Map(ALL_DOCS.map((doc) => [doc.slug, doc]));

export function getDoc(slug: string): Doc | undefined {
  return docMap.get(slug);
}

export function getDocNeighbors(slug: string) {
  const index = ALL_DOCS.findIndex((doc) => doc.slug === slug);
  return {
    previous: index > 0 ? ALL_DOCS[index - 1] : undefined,
    next:
      index >= 0 && index < ALL_DOCS.length - 1
        ? ALL_DOCS[index + 1]
        : undefined,
  };
}

export function getSectionDocs(section: DocSectionId) {
  return ALL_DOCS.filter((doc) => doc.section === section);
}

export function getDocUrl(doc: Doc) {
  return `/docs/${doc.slug}/`;
}

export function getDocIndex(slug: string) {
  return ALL_DOCS.findIndex((doc) => doc.slug === slug) + 1;
}

export function docReadingTime(doc: Doc) {
  let chars = (doc.description + doc.title).length;
  for (const block of doc.blocks) {
    chars += blockText(block).length;
  }
  return Math.max(2, Math.round(chars / 380));
}

function blockText(block: DocBlock): string {
  switch (block.type) {
    case "p":
    case "h2":
    case "h3":
    case "quote":
      return block.text;
    case "list":
      return block.items.join(" ");
    case "code":
      return block.title ?? "";
    case "callout":
      return `${block.title} ${block.text}`;
    case "table":
      return `${block.head.join(" ")} ${block.rows.flat().join(" ")}`;
    case "steps":
      return block.items.map((item) => `${item.title} ${item.text}`).join(" ");
    default:
      return "";
  }
}

export interface SearchEntry {
  slug: string;
  title: string;
  description: string;
  section: DocSectionId;
  keywords: string[];
  headings: string[];
  paragraphs: string[];
}

const searchIndex: SearchEntry[] = ALL_DOCS.map((doc) => ({
  slug: doc.slug,
  title: doc.title,
  description: doc.description,
  section: doc.section,
  keywords: doc.keywords ?? [],
  headings: doc.blocks
    .filter(
      (block): block is Extract<DocBlock, { type: "h2" | "h3" }> =>
        block.type === "h2" || block.type === "h3"
    )
    .map((block) => block.text),
  paragraphs: doc.blocks
    .filter(
      (block): block is Extract<DocBlock, { type: "p" }> =>
        block.type === "p"
    )
    .map((block) => block.text.replace(/`([^`]+)`/g, "$1")),
}));

export interface SearchResult {
  entry: SearchEntry;
  score: number;
  snippet: string;
}

export function searchDocs(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const results: SearchResult[] = [];

  for (const entry of searchIndex) {
    let score = 0;
    const haystackTitle = entry.title.toLowerCase();
    const haystackDescription = entry.description.toLowerCase();
    const haystackKeywords = entry.keywords.join(" ").toLowerCase();
    const haystackHeadings = entry.headings.join(" ").toLowerCase();
    const haystackBody = entry.paragraphs.join(" ").toLowerCase();

    for (const term of terms) {
      if (haystackTitle.includes(term)) score += 12;
      if (haystackKeywords.includes(term)) score += 8;
      if (haystackHeadings.includes(term)) score += 5;
      if (haystackDescription.includes(term)) score += 4;
      if (haystackBody.includes(term)) score += 2;
      if (entry.slug.includes(term)) score += 3;
    }

    if (score === 0) continue;

    const lowerDescription = entry.description.toLowerCase();
    const foundTerm = terms.find((term) => lowerDescription.includes(term));
    let snippet = entry.description;
    if (!foundTerm) {
      const paragraph = entry.paragraphs.find((item) =>
        terms.some((term) => item.toLowerCase().includes(term))
      );
      if (paragraph) {
        snippet =
          paragraph.length > 96 ? `${paragraph.slice(0, 96)}…` : paragraph;
      }
    }

    results.push({ entry, score, snippet });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

export { DOC_SECTIONS, DOC_OVERVIEW } from "./types";
export type { Doc, DocBlock, DocSectionId } from "./types";

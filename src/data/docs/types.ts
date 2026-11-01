export type DocSectionId =
  | "start"
  | "concepts"
  | "core"
  | "router"
  | "advanced";

export type DocBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "code"; code: string; lang?: string; title?: string }
  | {
      type: "callout";
      tone: "note" | "warn" | "tip";
      title: string;
      text: string;
    }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "demo"; kind: "counter" }
  | { type: "divider" };

export interface Doc {
  slug: string;
  section: DocSectionId;
  title: string;
  navTitle?: string;
  description: string;
  keywords?: string[];
  blocks: DocBlock[];
}

export interface DocSection {
  id: DocSectionId;
  title: string;
  en: string;
}

export const DOC_SECTIONS: DocSection[] = [
  { id: "start", title: "开始", en: "START" },
  { id: "concepts", title: "心智模型", en: "MENTAL MODEL" },
  { id: "core", title: "核心 API", en: "CORE" },
  { id: "router", title: "路由与数据", en: "ROUTER & DATA" },
  { id: "advanced", title: "进阶", en: "ADVANCED" },
];

export const DOC_OVERVIEW = {
  title: "文档总览",
  description: "认识 Qwik v2 的概念、核心 API、路由与数据模型。",
  href: "/docs/",
};

export function headingId(index: number) {
  return `section-${index}`;
}

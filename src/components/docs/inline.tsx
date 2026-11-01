import type { JSXOutput } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";

const INLINE_RE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

export function renderInline(text: string): JSXOutput[] {
  const nodes: JSXOutput[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(INLINE_RE.source, "g");

  while ((match = re.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const raw = match[0];
    if (raw.startsWith("`")) {
      nodes.push(<code class="inline-code">{raw.slice(1, -1)}</code>);
    } else if (raw.startsWith("**")) {
      nodes.push(<strong>{raw.slice(2, -2)}</strong>);
    } else {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(raw);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        if (href.startsWith("http")) {
          nodes.push(
            <a href={href} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          );
        } else {
          nodes.push(<Link href={href}>{label}</Link>);
        }
      } else {
        nodes.push(raw);
      }
    }

    lastIndex = match.index + raw.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

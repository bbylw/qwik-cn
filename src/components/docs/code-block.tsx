import { CopyButton } from "../site/copy-button";

const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "default",
  "const",
  "let",
  "var",
  "function",
  "return",
  "async",
  "await",
  "if",
  "else",
  "for",
  "of",
  "in",
  "new",
  "throw",
  "try",
  "catch",
  "finally",
  "typeof",
  "as",
  "type",
  "interface",
  "extends",
  "implements",
  "true",
  "false",
  "null",
  "undefined",
  "this",
  "class",
  "void",
  "yield",
  "switch",
  "case",
  "break",
  "continue",
  "while",
  "satisfies",
]);

const TOKEN_RE =
  /(?<comment>\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(?<string>'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|(?<word>[A-Za-z_$][\w$]*)|(?<number>\b\d+(?:\.\d+)?\b)|(?<punct>[{}()[\];,.])/g;

type Token = { text: string; cls?: string };

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(TOKEN_RE.source, "g");
  while ((match = re.exec(code))) {
    if (match.index > lastIndex) {
      tokens.push({ text: code.slice(lastIndex, match.index) });
    }
    const groups = match.groups ?? {};
    const text = match[0];
    if (groups.comment) {
      tokens.push({ text, cls: "tok-comment" });
    } else if (groups.string) {
      tokens.push({ text, cls: "tok-string" });
    } else if (groups.number) {
      tokens.push({ text, cls: "tok-number" });
    } else if (groups.word) {
      const after = code.slice(match.index + text.length);
      const before = code.slice(0, match.index);
      if (KEYWORDS.has(text)) {
        tokens.push({ text, cls: "tok-keyword" });
      } else if (/^\s*\(/.test(after)) {
        tokens.push({
          text,
          cls: text.endsWith("$") ? "tok-fn tok-symbol" : "tok-fn",
        });
      } else if (
        (before.endsWith("<") || before.endsWith("</")) &&
        /^[A-Za-z]/.test(text)
      ) {
        tokens.push({ text, cls: "tok-tag" });
      } else {
        tokens.push({ text });
      }
    } else if (groups.punct) {
      tokens.push({ text, cls: "tok-punct" });
    } else {
      tokens.push({ text });
    }
    lastIndex = match.index + text.length;
  }
  if (lastIndex < code.length) {
    tokens.push({ text: code.slice(lastIndex) });
  }
  return tokens;
}

/**
 * 普通函数而非 `component$`：代码块是无状态的纯展示，
 * 若作为组件边界，`code` 会被写进 qwik/json 序列化数据里，
 * 导致每段示例在 HTML 中出现两遍。
 */
export function CodeBlock(props: {
  code: string;
  lang?: string;
  title?: string;
  compact?: boolean;
}) {
  const tokens = tokenize(props.code);
  const lang = props.lang ?? "tsx";
  return (
    <figure class={`code-block ${props.compact ? "code-block-compact" : ""}`}>
      <figcaption class="code-head">
        <span class="code-sq" aria-hidden="true"></span>
        <span class="code-lang mono">{lang}</span>
        {props.title ? (
          <span class="code-title mono">{props.title}</span>
        ) : (
          <span class="code-title mono">code</span>
        )}
        <CopyButton text={props.code} label="复制代码" compact />
      </figcaption>
      <pre
        class="code-pre"
        tabIndex={0}
        aria-label={props.title ? `${props.title} 代码示例` : "代码示例"}
      >
        <code>
          {tokens.map((token, index) =>
            token.cls ? (
              <span key={index} class={token.cls}>
                {token.text}
              </span>
            ) : (
              <span key={index}>{token.text}</span>
            )
          )}
        </code>
      </pre>
    </figure>
  );
}

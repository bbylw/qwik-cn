import { component$, useSignal, useVisibleTask$ } from "@qwik.dev/core";

export interface TocItem {
  id: string;
  text: string;
}

export const DocToc = component$((props: { items: TocItem[] }) => {
  const active = useSignal(props.items[0]?.id ?? "");

  useVisibleTask$(({ cleanup }) => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(".doc-h2[id]")
    );
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            active.value = entry.target.id;
          }
        }
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 }
    );

    for (const heading of headings) {
      observer.observe(heading);
    }

    cleanup(() => observer.disconnect());
  });

  if (props.items.length < 2) return null;

  return (
    <nav class="doc-toc" aria-label="本页目录">
      <div class="doc-toc-head">
        <span class="label">本页目录</span>
        <span class="mono doc-toc-count">
          {String(props.items.length).padStart(2, "0")}
        </span>
      </div>
      <ol class="doc-toc-list">
        {props.items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              class="doc-toc-link"
              data-active={active.value === item.id ? "true" : "false"}
              aria-current={active.value === item.id ? "location" : undefined}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
      <a class="doc-toc-top mono" href="#top">
        回到顶部
      </a>
    </nav>
  );
});

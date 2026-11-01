import {
  $,
  component$,
  useComputed$,
  useOnDocument,
  useSignal,
  useVisibleTask$,
} from "@qwik.dev/core";
import { Link, useNavigate } from "@qwik.dev/router";
import { searchDocs } from "../../data/docs";
import { DOC_SECTIONS } from "../../data/docs/types";

export const SearchDialog = component$(() => {
  const open = useSignal(false);
  const query = useSignal("");
  const activeIndex = useSignal(0);
  const inputRef = useSignal<HTMLInputElement>();
  const triggerRef = useSignal<HTMLButtonElement>();
  const results = useComputed$(() => searchDocs(query.value, 7));
  const nav = useNavigate();

  const openSearch = $(() => {
    open.value = true;
    query.value = "";
    activeIndex.value = 0;
  });

  const closeSearch = $(() => {
    open.value = false;
  });

  useOnDocument(
    "keydown",
    $((event) => {
      const keyEvent = event as KeyboardEvent;
      if ((keyEvent.metaKey || keyEvent.ctrlKey) && keyEvent.key === "k") {
        keyEvent.preventDefault();
        if (open.value) {
          closeSearch();
        } else {
          openSearch();
        }
      }
      if (keyEvent.key === "Escape" && open.value) {
        keyEvent.preventDefault();
        closeSearch();
      }
    })
  );

  useVisibleTask$(({ track, cleanup }) => {
    const isOpen = track(open);
    if (!isOpen) return;

    const input = inputRef.value;
    input?.focus();
    input?.select();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    cleanup(() => {
      document.body.style.overflow = previousOverflow;
      triggerRef.value?.focus();
    });
  });

  const move = $((delta: number) => {
    const count = results.value.length;
    if (!count) return;
    activeIndex.value = (activeIndex.value + delta + count) % count;
  });

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        class="search-trigger"
        aria-label="搜索文档"
        onClick$={openSearch}
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <circle cx="8.6" cy="8.6" r="5.4" />
          <path d="m12.7 12.7 4 4" />
        </svg>
        <span class="search-trigger-label">搜索文档</span>
        <kbd class="mono">Ctrl K</kbd>
      </button>

      {open.value ? (
        <div class="search-overlay" onClick$={closeSearch}>
          <div
            class="search-panel"
            role="dialog"
            aria-modal="true"
            aria-label="搜索文档"
            onClick$={(event) => event.stopPropagation()}
            onKeyDown$={(event) => {
              if (event.key !== "Tab") return;
              const focusables = Array.from(
                (event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(
                  "input, a[href]"
                )
              );
              if (!focusables.length) return;
              const first = focusables[0];
              const last = focusables[focusables.length - 1];
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
              }
            }}
          >
            <div class="search-head">
              <span class="label">搜索 / SEARCH</span>
              <button
                type="button"
                class="search-close mono"
                onClick$={closeSearch}
              >
                ESC
              </button>
            </div>

            <div class="search-field">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
              >
                <circle cx="8.6" cy="8.6" r="5.4" />
                <path d="m12.7 12.7 4 4" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={query.value}
                placeholder="搜索概念、API 或问题…"
                aria-label="搜索文档"
                role="combobox"
                aria-expanded={results.value.length > 0}
                aria-controls="search-results"
                aria-autocomplete="list"
                aria-activedescendant={
                  results.value.length
                    ? `search-result-${activeIndex.value}`
                    : undefined
                }
                onInput$={(event) => {
                  query.value = (event.target as HTMLInputElement).value;
                  activeIndex.value = 0;
                }}
                onKeyDown$={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    move(1);
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    move(-1);
                  } else if (event.key === "Enter") {
                    const result = results.value[activeIndex.value];
                    if (result) {
                      event.preventDefault();
                      open.value = false;
                      nav(`/docs/${result.entry.slug}/`);
                    }
                  }
                }}
              />
            </div>

            {query.value.trim() === "" ? (
              <div class="search-empty">
                <p class="search-empty-title">从哪里开始？</p>
                <div class="search-chips">
                  {["可恢复", "routeLoader", "server$", "序列化", "QRL"].map(
                    (term) => (
                      <button
                        key={term}
                        type="button"
                        class="search-chip mono"
                        onClick$={() => {
                          query.value = term;
                          activeIndex.value = 0;
                          inputRef.value?.focus();
                        }}
                      >
                        {term}
                      </button>
                    )
                  )}
                </div>
                <div class="search-quick">
                  <Link href="/docs/getting-started/" onClick$={closeSearch}>
                    快速开始
                  </Link>
                  <Link href="/docs/concepts/think-qwik/" onClick$={closeSearch}>
                    心智模型
                  </Link>
                  <Link href="/docs/routing/" onClick$={closeSearch}>
                    文件路由
                  </Link>
                </div>
              </div>
            ) : results.value.length ? (
              <ul class="search-results" id="search-results" role="listbox">
                {results.value.map((result, index) => {
                  const section = DOC_SECTIONS.find(
                    (item) => item.id === result.entry.section
                  );
                  return (
                    <li
                      key={result.entry.slug}
                      id={`search-result-${index}`}
                      role="option"
                      aria-selected={activeIndex.value === index}
                      class="search-result"
                      data-active={activeIndex.value === index ? "true" : "false"}
                      onMouseEnter$={() => {
                        activeIndex.value = index;
                      }}
                      onClick$={() => {
                        open.value = false;
                        nav(`/docs/${result.entry.slug}/`);
                      }}
                    >
                      <span class="search-result-kicker mono">
                        {section?.en} / {result.entry.title}
                      </span>
                      <span class="search-result-title">
                        {result.entry.title}
                      </span>
                      <span class="search-result-snippet">
                        {result.snippet}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div class="search-empty">
                <p class="search-empty-title">没有找到「{query.value}」</p>
                <p class="search-empty-note">
                  试试更短的词，例如「信号」「路由」「流式」，或者浏览左侧目录。
                </p>
              </div>
            )}

            <div class="search-foot mono">
              <span>↑ ↓ 选择</span>
              <span>Enter 打开</span>
              <span>Esc 关闭</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
});

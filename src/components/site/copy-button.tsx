import { component$, useSignal } from "@qwik.dev/core";

export const CopyButton = component$(
  (props: { text: string; label?: string; compact?: boolean }) => {
    const copied = useSignal(false);
    const label = props.label ?? "复制";

    return (
      <button
        type="button"
        class={`copy-btn ${props.compact ? "copy-btn-compact" : ""} ${
          copied.value ? "is-copied" : ""
        }`}
        aria-label={`${label}：${props.text}`}
        onClick$={async () => {
          try {
            await navigator.clipboard.writeText(props.text);
            copied.value = true;
            setTimeout(() => {
              copied.value = false;
            }, 1600);
          } catch {
            copied.value = false;
          }
        }}
      >
        <svg
          viewBox="0 0 16 16"
          width="13"
          height="13"
          fill="none"
          stroke="currentColor"
          stroke-width="1.3"
          aria-hidden="true"
        >
          <rect x="5.2" y="5.2" width="8.2" height="8.2" rx="1" />
          <path d="M10.8 5V3.4c0-.6-.5-1.1-1.1-1.1H3.4c-.6 0-1.1.5-1.1 1.1v6.3c0 .6.5 1.1 1.1 1.1H5" />
        </svg>
        <span aria-live="polite">{copied.value ? "已复制" : label}</span>
      </button>
    );
  }
);

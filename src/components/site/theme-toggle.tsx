import { component$ } from "@qwik.dev/core";

export const ThemeToggle = component$(() => {
  return (
    <button
      type="button"
      class="theme-toggle icon-btn"
      aria-label="切换颜色主题"
      title="切换颜色主题"
      onClick$={() => {
        const root = document.documentElement;
        const next = root.dataset.theme === "dark" ? "light" : "dark";
        root.dataset.theme = next;
        try {
          localStorage.setItem("qwik-theme", next);
        } catch {
          /* storage can be unavailable in private modes */
        }
      }}
    >
      <svg
        class="theme-icon theme-icon-sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
      </svg>
      <svg
        class="theme-icon theme-icon-moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        aria-hidden="true"
      >
        <path d="M20 14.4A8.2 8.2 0 0 1 9.6 4a8.2 8.2 0 1 0 10.4 10.4Z" />
      </svg>
    </button>
  );
});

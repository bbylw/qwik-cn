import {
  $,
  component$,
  Slot,
  useOnDocument,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@qwik.dev/core";
import { useLocation } from "@qwik.dev/router";
import { DocsSidebar } from "../../components/docs/docs-sidebar";
import { SearchDialog } from "../../components/docs/search-dialog";

export default component$(() => {
  const loc = useLocation();
  const drawerOpen = useSignal(false);

  useTask$(({ track }) => {
    track(() => loc.url.pathname);
    drawerOpen.value = false;
  });

  useOnDocument(
    "keydown",
    $((event) => {
      if ((event as KeyboardEvent).key === "Escape" && drawerOpen.value) {
        drawerOpen.value = false;
      }
    })
  );

  useVisibleTask$(({ track, cleanup }) => {
    const isOpen = track(drawerOpen);
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>(".docs-drawer-close")
        ?.focus({ preventScroll: true });
    });
    cleanup(() => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
      document
        .querySelector<HTMLElement>(".docs-menu-toggle")
        ?.focus({ preventScroll: true });
    });
  });

  return (
    <div class="docs-shell container container-wide">
      <aside
        class="docs-sidebar-panel"
        id="docs-sidebar"
        data-open={drawerOpen.value ? "true" : "false"}
      >
        <DocsSidebar
          onClose$={$(() => {
            drawerOpen.value = false;
          })}
        />
      </aside>

      <div class="docs-main">
        <div class="docs-toolbar">
          <button
            type="button"
            class="docs-menu-toggle"
            aria-label={drawerOpen.value ? "关闭文档目录" : "打开文档目录"}
            aria-expanded={drawerOpen.value}
            aria-controls="docs-sidebar"
            onClick$={() => {
              drawerOpen.value = !drawerOpen.value;
            }}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span class="mono">目录</span>
          </button>
          <span class="docs-toolbar-crumb mono">QWIK DOCS / V2</span>
          <SearchDialog />
        </div>

        <Slot />
      </div>

      <button
        type="button"
        class="docs-scrim"
        data-open={drawerOpen.value ? "true" : "false"}
        aria-label="关闭文档目录"
        tabIndex={drawerOpen.value ? 0 : -1}
        onClick$={() => {
          drawerOpen.value = false;
        }}
      ></button>
    </div>
  );
});

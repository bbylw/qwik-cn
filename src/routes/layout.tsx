import { component$, Slot } from "@qwik.dev/core";
import { SiteFooter } from "../components/site/footer";
import { SiteHeader } from "../components/site/header";

export default component$(() => {
  return (
    <div class="site-shell">
      <a class="skip-link" href="#main">
        跳到正文
      </a>
      <SiteHeader />
      <main id="main" class="site-main">
        <Slot />
      </main>
      <SiteFooter />
    </div>
  );
});

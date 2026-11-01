import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";
import { Link } from "@qwik.dev/router";

export default component$(() => {
  return (
    <section class="notfound">
      <div class="notfound-main">
        <div class="notfound-status-row">
          <p class="label">SIGNAL LOST</p>
          <span class="mono notfound-status">404 / NOT FOUND</span>
        </div>
        <h1>
          这个地址
          <br />
          <span>没有续接点。</span>
        </h1>
        <p class="notfound-lede">
          URL 可能已经移动，或者从未存在。页面没有水合失败，只是这里确实没有内容。
        </p>
        <div class="notfound-actions">
          <Link class="btn" href="/">
            回到首页
          </Link>
          <Link class="btn btn-ghost" href="/docs/">
            浏览文档
          </Link>
        </div>
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: "页面不存在 · Qwik 中文",
};

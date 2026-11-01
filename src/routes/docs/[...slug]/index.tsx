import { component$ } from "@qwik.dev/core";
import type {
  DocumentHead,
  RequestHandler,
  StaticGenerateHandler,
} from "@qwik.dev/router";
import { useLocation } from "@qwik.dev/router";
import { DocArticle } from "../../../components/docs/doc-page";
import { ALL_DOCS, getDoc } from "../../../data/docs";
import { NotFoundView } from "../../404";

/**
 * 静态生成时枚举所有文档 slug。
 * 缺少这个导出，SSG 只会预渲染 `/`、`/docs/` 与 404，19 篇文档全部漏掉。
 */
export const onStaticGenerate: StaticGenerateHandler = () => {
  return {
    params: ALL_DOCS.map((doc) => ({ slug: doc.slug })),
  };
};

/**
 * 用 `status(404)` 而不是 `throw error(404)`：
 * 后者在 SSR 阶段会中断渲染，返回一段没有布局的裸错误响应，
 * 用户点错链接时看不到站点导航与样式。
 */
export const onGet: RequestHandler = ({ params, status }) => {
  if (!getDoc(params.slug)) {
    status(404);
  }
};

export default component$(() => {
  const loc = useLocation();
  const slug = String(loc.params.slug ?? "");
  if (!getDoc(slug)) {
    return <NotFoundView />;
  }
  return <DocArticle slug={slug} />;
});

export const head: DocumentHead = ({ params }) => {
  const doc = getDoc(params.slug ?? "");
  if (!doc) {
    return {
      title: "文档不存在 · Qwik 中文",
      meta: [{ name: "robots", content: "noindex" }],
    };
  }
  return {
    title: `${doc.title} · Qwik 中文文档`,
    meta: [
      { name: "description", content: doc.description },
      { property: "og:title", content: `${doc.title} · Qwik 中文文档` },
      { property: "og:description", content: doc.description },
      { property: "og:type", content: "article" },
    ],
  };
};

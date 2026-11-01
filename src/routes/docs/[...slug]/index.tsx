import { component$ } from "@qwik.dev/core";
import type { DocumentHead, RequestHandler } from "@qwik.dev/router";
import { useLocation } from "@qwik.dev/router";
import { DocArticle } from "../../../components/docs/doc-page";
import { getDoc } from "../../../data/docs";

export const onGet: RequestHandler = ({ params, error }) => {
  if (!getDoc(params.slug)) {
    throw error(404, "文档不存在");
  }
};

export default component$(() => {
  const loc = useLocation();
  return <DocArticle slug={String(loc.params.slug ?? "")} />;
});

export const head: DocumentHead = ({ params }) => {
  const doc = getDoc(params.slug ?? "");
  if (!doc) {
    return { title: "文档不存在 · Qwik 中文" };
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

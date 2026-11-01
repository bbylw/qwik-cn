import { createRenderer } from "@qwik.dev/router";
import Root from "./root";

export default createRenderer((opts) => {
  return {
    jsx: <Root />,
    options: {
      ...opts,
      containerAttributes: {
        lang: "zh-CN",
        ...opts.containerAttributes,
      },
      // 只保留兜底 title。description 交给各路由的 `head` 提供：
      // Qwik 对 meta 是追加语义，这里再放一份会让每个页面都输出两条 description。
      serverData: {
        ...opts.serverData,
        documentHead: {
          title: "Qwik 中文 · 可恢复的 Web 框架",
        },
      },
    },
  };
});

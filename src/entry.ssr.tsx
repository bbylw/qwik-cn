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
      serverData: {
        ...opts.serverData,
        documentHead: {
          title: "Qwik 中文 · 可恢复的 Web 框架",
          meta: [
            {
              name: "description",
              content:
                "Qwik 是面向现代 Web 的可恢复框架：HTML 立即可用，交互按需加载，应用规模增长而启动成本不变。",
            },
          ],
        },
      },
    },
  };
});

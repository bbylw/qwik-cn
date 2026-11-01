<br>
<p align="center">
  <img alt="Qwik 标志" width="400" src="https://raw.githubusercontent.com/QwikDev/qwik/main/packages/docs/public/logos/qwik.svg" />
</p>
<br>
<p align="center">
   <a href="https://github.com/QwikDev/qwik/actions/workflows/ci.yml"><img src="https://github.com/QwikDev/qwik/actions/workflows/ci.yml/badge.svg?event=push" alt="Qwik CI"></a>
</p>
<br>
<br>

<h1 align="center">零成本打造即时加载的 Web 应用</h1>

<b>
  这是 Qwik v2 的分支，目前处于 beta 阶段。如需 v1，请查看 `v1`
  分支。
</b>

Qwik 提供最快的页面加载速度，无论你的网站有多复杂。Qwik 之所以如此之快，是因为它能让功能完备、可交互的网站在几乎不加载 JavaScript 的情况下完成首屏，并[从服务端中断的地方无缝续接](https://next.qwik.dev/docs/concepts/resumable/)。

随着用户与网站的交互，只有必要的部分才会按需加载。正是这种[精准的懒加载](https://next.qwik.dev/docs/concepts/progressive/)让 Qwik 如此迅捷。

## 快速开始

```sh
npm create qwik@beta
# 或
pnpm create qwik@beta
# 或
yarn create qwik@beta
# 或
bun create qwik@beta
```

- 了解[可恢复（resumable）与可重放（replayable）](https://next.qwik.dev/docs/concepts/resumable/)应用之间的区别。
- 学习 Qwik 高层次的[心智模型](https://next.qwik.dev/docs/concepts/think-qwik/)。

## 每夜构建版本

我们使用 pkg.pr.new 为每个 PR 及各分支提供可用的包。使用以下 URLs 代替版本号，即可获取最新的构建产物：

- https://pkg.pr.new/QwikDev/qwik/@qwik.dev/core@main
- https://pkg.pr.new/QwikDev/qwik/@qwik.dev/router@main
- https://pkg.pr.new/QwikDev/qwik/@qwik.dev/react@main
- https://pkg.pr.new/QwikDev/qwik/@qwik.dev/devtools@main

## 资源

- [文档](https://next.qwik.dev/)
- [示例](https://next.qwik.dev/examples/introduction/hello-world/)
- [教程](https://next.qwik.dev/tutorial/welcome/overview/)
- [视频](https://next.qwik.dev/media/#videos)
- [播客](https://next.qwik.dev/media/#podcasts)
- [演讲](https://next.qwik.dev/media/#presentations)
- [博客](https://next.qwik.dev/media/#blogs)

## 社区

- 在 [@QwikDev](https://twitter.com/QwikDev) 联系我们
- 加入我们的 [Discord](https://qwik.dev/chat) 社区
- 加入所有[其他社区群组](https://next.qwik.dev/ecosystem/#community)

## 开发

- 请参阅 [Contributing.md](https://github.com/QwikDev/qwik/blob/main/CONTRIBUTING.md)，了解如何从源码构建 Qwik 并参与贡献！

## 相关项目

- [Partytown](https://partytown.qwik.dev/)：将耗费资源的第三方脚本移出主线程，放入 Web Worker 中执行 🎉。
- [Mitosis](https://github.com/BuilderIO/mitosis)：一次编写组件，处处运行。可编译为 Vue、React、Solid、Angular、Svelte 等。
- [Builder](https://github.com/BuilderIO/builder)：面向 React、Vue、Angular 等的拖拽式页面构建器与 CMS。

<br>
<br>

<table align="center">
  <tr align="center">
    <td>特别赞助商</td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://www.builder.io/m/developers" rel="noopener">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://i.imgur.com/eT9FjKT.png">
          <img width="250" alt="特别赞助商 Builder.io" src="https://i.imgur.com/32mv01X.png">
        </picture>
      </a>
    </td>
  </tr>
  <tr align="center">
    <td>赞助商</td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://kunaico.com/" target="_blank" rel="noopener">
        <img width="250" src="https://raw.githubusercontent.com/QwikDev/qwik/main/.github/assets/kunaico.svg" alt="Kunaico 标志">
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="http://hirez.io/" target="_blank" rel="noopener">
        <picture>
          <source srcset="https://i.imgur.com/DHhJM0J.png" media="(prefers-color-scheme: dark)">
          <source srcset="https://i.imgur.com/DIbsvQC.png" media="(prefers-color-scheme: light)">
          <img width="250" src="https://i.imgur.com/DIbsvQC.png" alt="Hirez 标志">
        </picture>
      </a>    
    </td>
  </tr>
</table>

import { component$, useSignal } from "@qwik.dev/core";
import { CodeBlock } from "../docs/code-block";

const EXAMPLES = [
  {
    id: "loader",
    label: "数据加载",
    title: "src/routes/products/index.tsx",
    code: `import { component$ } from '@qwik.dev/core';
import { routeLoader$ } from '@qwik.dev/router';

export const useProducts = routeLoader$(async ({ url }) => {
  const category = url.searchParams.get('category');
  return db.products.list({ category });
});

export default component$(() => {
  const products = useProducts();
  return <ProductGrid items={products.value} />;
});`,
    note: "loader 只在服务端执行，结果随 HTML 一起序列化。",
  },
  {
    id: "action",
    label: "表单变更",
    title: "src/routes/products/index.tsx",
    code: `import { component$ } from '@qwik.dev/core';
import { Form, routeAction$, routeLoader$ } from '@qwik.dev/router';

export const useCreateProduct = routeAction$(async (data) => {
  const product = await db.products.create(data);
  return { success: true, product };
}, { invalidate: [useProducts] });

export default component$(() => {
  const createProduct = useCreateProduct();
  return (
    <Form action={createProduct}>
      <input name="name" placeholder="产品名称" />
      <button type="submit">创建</button>
      {createProduct.value?.success && <p>已创建</p>}
    </Form>
  );
});`,
    note: "原生 Form 提交，没有 JavaScript 也能工作。",
  },
  {
    id: "server",
    label: "服务端 RPC",
    title: "src/lib/payments.ts",
    code: `import { server$ } from '@qwik.dev/router';

export const chargeOrder = server$(
  async function (orderId: string) {
    const order = await db.orders.find(orderId);
    return payments.capture(order);
  }
);

// 在事件处理中直接调用，类型完整保留
const receipt = await chargeOrder(orderId);`,
    note: "server$ 是类型安全的 RPC，客户端永远看不到函数体。",
  },
];

export const RouterTabs = component$(() => {
  const active = useSignal(EXAMPLES[0].id);
  const current =
    EXAMPLES.find((example) => example.id === active.value) ?? EXAMPLES[0];

  return (
    <div class="router-demo">
      <div class="router-tabs" role="group" aria-label="Qwik Router 示例">
        {EXAMPLES.map((example) => (
          <button
            type="button"
            key={example.id}
            class="router-tab"
            aria-pressed={active.value === example.id}
            onClick$={() => {
              active.value = example.id;
            }}
          >
            <span class="router-tab-label">{example.label}</span>
            <span class="router-tab-dot" aria-hidden="true"></span>
          </button>
        ))}
      </div>
      <div class="router-panel">
        <CodeBlock code={current.code} title={current.title} />
        <p class="router-note mono">{current.note}</p>
      </div>
    </div>
  );
});

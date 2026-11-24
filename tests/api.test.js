// Rode com: npm test (precisa de internet: parte dos testes chama a API de verdade)
const test = require("node:test");
const assert = require("node:assert/strict");
require("../js/api.js");

const { Api } = globalThis;
const CAMPOS = ["id", "title", "price", "category", "rating", "stock", "thumbnail"];

test("lista traz 20 produtos com os campos que o card usa", async () => {
  const { produtos, total } = await Api.listar();
  assert.equal(produtos.length, 20);
  assert.ok(total >= 20);
  for (const produto of produtos) {
    for (const campo of CAMPOS) assert.ok(campo in produto, `falta ${campo} no produto ${produto.id}`);
  }
});

test("busca por nome encontra produtos e respeita o limite de 20", async () => {
  const { produtos, total } = await Api.buscar("phone");
  assert.ok(total > 20, "a busca precisa ter mais de 20 resultados para provar o limite");
  assert.equal(produtos.length, 20);
});

test("busca sem resultado devolve lista vazia", async () => {
  const { produtos, total } = await Api.buscar("produtoquenaoexiste");
  assert.deepEqual(produtos, []);
  assert.equal(total, 0);
});

test("consulta por categoria só traz produtos dela", async () => {
  const { produtos } = await Api.porCategoria("laptops");
  assert.ok(produtos.length > 0);
  assert.ok(produtos.every((p) => p.category === "laptops"));
});

test("consulta por código traz o produto certo", async () => {
  const produto = await Api.porId(1);
  assert.equal(produto.id, 1);
  assert.ok(produto.description);
});

test("código que não existe gera erro 404", async () => {
  await assert.rejects(Api.porId(99999), (erro) => erro instanceof Api.ErroApi && erro.status === 404);
});

test("lista de categorias não vem vazia", async () => {
  const categorias = await Api.categorias();
  assert.ok(categorias.includes("beauty"));
});

// Daqui para baixo: sem internet.

test("limite de 20 vale mesmo se a API mandar mais", async (t) => {
  const muitos = Array.from({ length: 30 }, (_, i) => ({ id: i }));
  t.mock.method(globalThis, "fetch", async () => Response.json({ products: muitos, total: 30 }));
  const { produtos } = await Api.listar();
  assert.equal(produtos.length, 20);
});

test("sem internet a mensagem de erro é clara", async (t) => {
  t.mock.method(globalThis, "fetch", async () => {
    throw new TypeError("fetch failed");
  });
  await assert.rejects(Api.listar(), { name: "ErroApi", message: "Não foi possível falar com a API." });
});

test("endereço da busca protege espaços e símbolos", () => {
  assert.equal(Api.montarUrl("/search", { q: "a&b c" }), "https://dummyjson.com/products/search?q=a%26b+c");
});

test("preço final aplica o desconto", () => {
  assert.equal(Api.precoFinal({ price: 9.99, discountPercentage: 10.48 }), 8.94);
  assert.equal(Api.precoFinal({ price: 50 }), 50);
});

// Rode com: npm test (precisa de internet)
const test = require("node:test");
const assert = require("node:assert/strict");
require("../js/api.js");
require("../js/traducao.js");

const { Api, Traducao } = globalThis;

test("entende acento, maiúscula e plural", () => {
  assert.deepEqual(Traducao.interpretar(" Relógios "), { termo: "watch" });
  assert.deepEqual(Traducao.interpretar("CELULARES"), { categoria: "smartphones" });
  assert.deepEqual(Traducao.interpretar("Tênis"), { termo: "shoes" });
});

test("palavra desconhecida segue como foi digitada", () => {
  assert.deepEqual(Traducao.interpretar("iPhone 13"), { termo: "iPhone 13" });
  assert.deepEqual(Traducao.interpretar("constructor"), { termo: "constructor" });
});

test("toda palavra em português encontra pelo menos um produto", async () => {
  const alvos = new Map(Object.values(Traducao.PALAVRAS).map((a) => [JSON.stringify(a), a]));
  for (const alvo of alvos.values()) {
    const { produtos } = alvo.termo ? await Api.buscar(alvo.termo) : await Api.porCategoria(alvo.categoria);
    assert.ok(produtos.length >= 1, "sem produtos para " + JSON.stringify(alvo));
    assert.ok(produtos.length <= 20);
  }
});

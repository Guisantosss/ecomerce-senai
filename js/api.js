// Conversa com a API de produtos (https://dummyjson.com).
// Não mexe na tela: só busca e devolve dados. Por isso dá para testar no Node.
(function (global) {
  "use strict";

  const BASE = "https://dummyjson.com/products";
  const LIMITE = 20;
  const ESPERA_MAXIMA = 10000;
  const CAMPOS = "title,price,discountPercentage,category,brand,rating,stock,thumbnail";

  class ErroApi extends Error {
    constructor(mensagem, status) {
      super(mensagem);
      this.name = "ErroApi";
      this.status = status;
    }
  }

  function montarUrl(caminho, parametros) {
    const url = new URL(BASE + caminho);
    for (const [nome, valor] of Object.entries(parametros || {})) {
      url.searchParams.set(nome, valor);
    }
    return url.toString();
  }

  async function pedir(url, sinal) {
    const controle = new AbortController();
    const cancelar = () => controle.abort();
    let estourou = false;
    const relogio = setTimeout(() => {
      estourou = true;
      controle.abort();
    }, ESPERA_MAXIMA);

    if (sinal) {
      if (sinal.aborted) cancelar();
      sinal.addEventListener("abort", cancelar, { once: true });
    }

    try {
      const resposta = await fetch(url, { signal: controle.signal });
      if (!resposta.ok) {
        throw new ErroApi("A API respondeu com o código " + resposta.status + ".", resposta.status);
      }
      return await resposta.json();
    } catch (erro) {
      if (estourou) throw new ErroApi("A API demorou demais para responder.");
      if (erro.name === "AbortError" || erro instanceof ErroApi) throw erro;
      throw new ErroApi("Não foi possível falar com a API.");
    } finally {
      clearTimeout(relogio);
      if (sinal) sinal.removeEventListener("abort", cancelar);
    }
  }

  async function pedirLista(caminho, parametros, sinal) {
    const url = montarUrl(caminho, { ...parametros, limit: LIMITE, select: CAMPOS });
    const dados = await pedir(url, sinal);
    // O corte garante o limite mesmo se a API ignorar o "limit".
    return { produtos: dados.products.slice(0, LIMITE), total: dados.total };
  }

  global.Api = {
    LIMITE,
    ErroApi,
    montarUrl,
    listar: (sinal) => pedirLista("", {}, sinal),
    buscar: (termo, sinal) => pedirLista("/search", { q: termo }, sinal),
    porCategoria: (slug, sinal) => pedirLista("/category/" + encodeURIComponent(slug), {}, sinal),
    porId: (id, sinal) => pedir(montarUrl("/" + encodeURIComponent(id)), sinal),
    categorias: (sinal) => pedir(montarUrl("/category-list"), sinal),
    precoFinal: (produto) =>
      Math.round(produto.price * (100 - (produto.discountPercentage || 0))) / 100,
  };
})(globalThis);

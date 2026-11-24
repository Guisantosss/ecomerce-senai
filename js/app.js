// Monta a tela: cards, busca, categorias e janela de detalhes.
(function () {
  "use strict";

  const CATEGORIAS = {
    beauty: "Beleza",
    fragrances: "Perfumes",
    furniture: "Móveis",
    groceries: "Mercado",
    "home-decoration": "Decoração",
    "kitchen-accessories": "Cozinha",
    laptops: "Notebooks",
    "mens-shirts": "Camisas masculinas",
    "mens-shoes": "Calçados masculinos",
    "mens-watches": "Relógios masculinos",
    "mobile-accessories": "Acessórios para celular",
    motorcycle: "Motos",
    "skin-care": "Cuidados com a pele",
    smartphones: "Celulares",
    "sports-accessories": "Esportes",
    sunglasses: "Óculos de sol",
    tablets: "Tablets",
    tops: "Blusas",
    vehicle: "Carros",
    "womens-bags": "Bolsas",
    "womens-dresses": "Vestidos",
    "womens-jewellery": "Joias",
    "womens-shoes": "Calçados femininos",
    "womens-watches": "Relógios femininos",
  };
  const SUGESTOES = ["phone", "laptop", "perfume", "watch"];
  const ESTOQUE_BAIXO = 10;

  const tela = {
    form: document.querySelector("#busca"),
    campo: document.querySelector("#campo-busca"),
    categoria: document.querySelector("#categoria"),
    situacao: document.querySelector("#situacao"),
    prateleira: document.querySelector("#prateleira"),
    aviso: document.querySelector("#aviso"),
    janela: document.querySelector("#detalhes"),
    janelaCorpo: document.querySelector("#detalhes-corpo"),
  };

  let pedidoAtual = null;
  let pedidoDetalhe = null;
  let esperaDigitacao = null;

  const dinheiro = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD" });
  const decimal = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  // Usa sempre textContent: texto vindo da API nunca vira HTML.
  function criar(tag, classe, texto) {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }

  function nomeCategoria(slug) {
    return CATEGORIAS[slug] || slug.replace(/-/g, " ");
  }

  function textoEstoque(estoque) {
    if (estoque <= 0) return "Esgotado";
    if (estoque === 1) return "Última unidade";
    if (estoque <= ESTOQUE_BAIXO) return "Últimas " + estoque + " unidades";
    return estoque + " em estoque";
  }

  function criarFoto(endereco, descricao) {
    const moldura = criar("div", "foto");
    const img = criar("img");
    img.alt = descricao;
    img.addEventListener("error", () => moldura.replaceChildren(criar("span", "sem-foto", "Sem foto")));
    img.src = endereco;
    moldura.append(img);
    return moldura;
  }

  function criarPreco(produto) {
    const final = Api.precoFinal(produto);
    const bloco = criar("p", final >= 1000 ? "preco preco-longo" : "preco");
    const temDesconto = final < produto.price;

    if (temDesconto) {
      const antes = criar("span", "preco-antes");
      antes.append(
        criar("span", "so-leitor", "De "),
        criar("s", "", dinheiro.format(produto.price)),
        criar("span", "so-leitor", " por ")
      );
      bloco.append(antes);
      const porcento = Math.round(produto.discountPercentage);
      if (porcento >= 1) bloco.append(criar("span", "desconto", "-" + porcento + "%"));
    }

    const partes = dinheiro.formatToParts(final);
    const pegar = (tipos) => partes.filter((p) => tipos.includes(p.type)).map((p) => p.value).join("");
    const agora = criar("strong", "preco-agora");
    agora.append(
      criar("span", "moeda", pegar(["currency"]) + " "),
      criar("span", "inteiro", pegar(["integer", "group"])),
      criar("span", "centavos", pegar(["decimal", "fraction"]))
    );
    bloco.append(agora);
    return bloco;
  }

  function criarCard(produto) {
    const item = criar("li", "card");
    const etiqueta = criar("div", "etiqueta");
    const corpo = criar("div", "etiqueta-corpo");
    const baixo = produto.stock <= ESTOQUE_BAIXO;

    const botao = criar("button", "botao", "Ver detalhes");
    botao.type = "button";
    botao.setAttribute("aria-label", "Ver detalhes de " + produto.title);
    botao.addEventListener("click", () => abrirDetalhes(produto.id));

    corpo.append(
      criar("h2", "nome", produto.title),
      criar("p", "marca", produto.brand || nomeCategoria(produto.category)),
      criar("p", "nota", "Nota " + decimal.format(produto.rating) + " de 5"),
      criar("p", baixo ? "estoque estoque-baixo" : "estoque", textoEstoque(produto.stock)),
      botao
    );
    etiqueta.append(criarPreco(produto), corpo);
    item.append(criarFoto(produto.thumbnail, produto.title), etiqueta);
    return item;
  }

  function mostrarCarregando() {
    tela.aviso.hidden = true;
    tela.prateleira.hidden = false;
    tela.prateleira.setAttribute("aria-busy", "true");
    tela.situacao.textContent = "Buscando produtos…";
    const vagas = Array.from({ length: Api.LIMITE }, () => {
      const vaga = criar("li", "card card-vazio");
      vaga.setAttribute("aria-hidden", "true");
      vaga.append(criar("div", "foto"), criar("div", "etiqueta"));
      return vaga;
    });
    tela.prateleira.replaceChildren(...vagas);
  }

  function mostrarAviso(titulo, texto, acoes) {
    tela.prateleira.hidden = true;
    tela.prateleira.replaceChildren();
    const botoes = criar("div", "aviso-acoes");
    for (const acao of acoes) {
      const botao = criar("button", "botao", acao.texto);
      botao.type = "button";
      botao.addEventListener("click", acao.fazer);
      botoes.append(botao);
    }
    tela.aviso.replaceChildren(criar("h2", "", titulo), criar("p", "", texto), botoes);
    tela.aviso.hidden = false;
  }

  function mostrarProdutos({ produtos, total }) {
    tela.prateleira.setAttribute("aria-busy", "false");

    if (produtos.length === 0) {
      tela.situacao.textContent = "Nenhum produto encontrado.";
      mostrarAviso(
        "Nada na prateleira com esse nome",
        "Os produtos estão cadastrados em inglês. Tente uma destas buscas:",
        SUGESTOES.map((termo) => ({
          texto: termo,
          fazer: () => {
            tela.campo.value = termo;
            tela.campo.focus();
            consultar();
          },
        }))
      );
      return;
    }

    tela.aviso.hidden = true;
    tela.prateleira.hidden = false;
    if (produtos.length < total) {
      tela.situacao.textContent = "Mostrando " + produtos.length + " de " + total + " produtos";
    } else {
      tela.situacao.textContent = total === 1 ? "1 produto encontrado" : total + " produtos encontrados";
    }
    tela.prateleira.replaceChildren(...produtos.map(criarCard));
  }

  async function consultar() {
    clearTimeout(esperaDigitacao);
    if (pedidoAtual) pedidoAtual.abort();
    const pedido = (pedidoAtual = new AbortController());
    const termo = tela.campo.value.trim();
    const categoria = tela.categoria.value;

    mostrarCarregando();
    try {
      let resultado;
      if (termo) resultado = await Api.buscar(termo, pedido.signal);
      else if (categoria) resultado = await Api.porCategoria(categoria, pedido.signal);
      else resultado = await Api.listar(pedido.signal);
      if (pedido === pedidoAtual) mostrarProdutos(resultado);
    } catch (erro) {
      if (pedido !== pedidoAtual || erro.name === "AbortError") return;
      tela.prateleira.setAttribute("aria-busy", "false");
      tela.situacao.textContent = "Não foi possível carregar os produtos.";
      mostrarAviso("Os produtos não carregaram", erro.message + " Confira sua internet e tente de novo.", [
        { texto: "Tentar de novo", fazer: consultar },
      ]);
    }
  }

  function criarLinha(nome, valor) {
    const linha = criar("div");
    linha.append(criar("dt", "", nome), criar("dd", "", valor));
    return linha;
  }

  async function abrirDetalhes(id) {
    if (pedidoDetalhe) pedidoDetalhe.abort();
    const pedido = (pedidoDetalhe = new AbortController());
    tela.janelaCorpo.replaceChildren(criar("p", "carregando", "Buscando o produto…"));
    if (!tela.janela.open) tela.janela.showModal();

    try {
      const produto = await Api.porId(id, pedido.signal);
      if (pedido !== pedidoDetalhe) return;
      const dados = criar("dl", "ficha");
      if (produto.brand) dados.append(criarLinha("Marca", produto.brand));
      dados.append(
        criarLinha("Categoria", nomeCategoria(produto.category)),
        criarLinha("Nota", decimal.format(produto.rating) + " de 5"),
        criarLinha("Estoque", textoEstoque(produto.stock)),
        criarLinha("Código", produto.sku)
      );
      const texto = criar("div", "detalhes-texto");
      const descricao = criar("p", "descricao", produto.description);
      descricao.lang = "en";
      texto.append(criar("h2", "", produto.title), criarPreco(produto), descricao, dados);
      tela.janelaCorpo.replaceChildren(
        criarFoto((produto.images && produto.images[0]) || produto.thumbnail, produto.title),
        texto
      );
    } catch (erro) {
      if (pedido !== pedidoDetalhe || erro.name === "AbortError") return;
      const botao = criar("button", "botao", "Tentar de novo");
      botao.type = "button";
      botao.addEventListener("click", () => abrirDetalhes(id));
      tela.janelaCorpo.replaceChildren(criar("p", "carregando", erro.message), botao);
    }
  }

  async function carregarCategorias() {
    try {
      const lista = await Api.categorias();
      const opcoes = lista
        .map((slug) => ({ slug, nome: nomeCategoria(slug) }))
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
      for (const { slug, nome } of opcoes) {
        const opcao = criar("option", "", nome);
        opcao.value = slug;
        tela.categoria.append(opcao);
      }
    } catch {
      // Sem a lista de categorias, a busca por nome continua funcionando.
      tela.categoria.disabled = true;
    }
  }

  tela.form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    consultar();
  });

  // Espera a pessoa parar de digitar para não fazer um pedido por letra.
  tela.campo.addEventListener("input", () => {
    tela.categoria.value = "";
    clearTimeout(esperaDigitacao);
    esperaDigitacao = setTimeout(consultar, 400);
  });

  tela.categoria.addEventListener("change", () => {
    tela.campo.value = "";
    consultar();
  });

  tela.janela.addEventListener("click", (evento) => {
    if (evento.target === tela.janela) tela.janela.close();
  });
  tela.janela.addEventListener("close", () => {
    if (pedidoDetalhe) pedidoDetalhe.abort();
  });

  carregarCategorias();
  consultar();
})();

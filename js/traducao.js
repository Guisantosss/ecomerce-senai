// Troca palavras comuns em português pelo que a API entende (ela é em inglês).
// "termo" vira busca por nome; "categoria" vira consulta por categoria.
(function (global) {
  "use strict";

  const PALAVRAS = {
    celular: { categoria: "smartphones" },
    telefone: { categoria: "smartphones" },
    notebook: { categoria: "laptops" },
    computador: { categoria: "laptops" },
    perfume: { categoria: "fragrances" },
    maquiagem: { categoria: "beauty" },
    beleza: { categoria: "beauty" },
    movel: { categoria: "furniture" },
    moveis: { categoria: "furniture" },
    mesa: { categoria: "furniture" },
    joia: { categoria: "womens-jewellery" },
    carro: { categoria: "vehicle" },
    moto: { categoria: "motorcycle" },
    cozinha: { categoria: "kitchen-accessories" },
    decoracao: { categoria: "home-decoration" },
    esporte: { categoria: "sports-accessories" },
    bola: { categoria: "sports-accessories" },
    comida: { categoria: "groceries" },
    mercado: { categoria: "groceries" },
    blusa: { categoria: "tops" },
    relogio: { termo: "watch" },
    tenis: { termo: "shoes" },
    sapato: { termo: "shoes" },
    camisa: { termo: "shirt" },
    vestido: { termo: "dress" },
    bolsa: { termo: "bag" },
    oculos: { termo: "sunglasses" },
    batom: { termo: "lipstick" },
    fone: { termo: "headphones" },
    carregador: { termo: "charger" },
    cama: { termo: "bed" },
    sofa: { termo: "sofa" },
    cadeira: { termo: "chair" },
    faca: { termo: "knife" },
    carne: { termo: "meat" },
    maca: { termo: "apple" },
    leite: { termo: "milk" },
    ovo: { termo: "egg" },
    arroz: { termo: "rice" },
    brinco: { termo: "earring" },
  };

  // "Relógios" -> "relogios": minúsculas e sem acento.
  function simplificar(texto) {
    return texto.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function interpretar(texto) {
    const base = simplificar(texto);
    for (const forma of [base, base.replace(/s$/, ""), base.replace(/es$/, "")]) {
      if (Object.hasOwn(PALAVRAS, forma)) return PALAVRAS[forma];
    }
    return { termo: texto.trim() };
  }

  global.Traducao = { PALAVRAS, interpretar };
})(globalThis);

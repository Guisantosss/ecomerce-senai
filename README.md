# Gôndola

Catálogo de produtos feito com HTML, CSS e JavaScript puro. Os dados vêm da API pública [DummyJSON](https://dummyjson.com/docs/products).

![Tela do catálogo com os cards de produtos](docs/tela.png)

- **Versão:** 0.2.1 ([histórico](CHANGELOG.md))
- **Link do projeto:** https://github.com/Guisantosss/ecomerce-senai
- **Equipe:** a preencher

## O que o site faz

- Mostra até 20 produtos em cards, com foto, preço com desconto, nota e estoque.
- Busca por nome e por categoria. Uma busca substitui a outra, porque a API não combina as duas.
- Abre os detalhes de um produto, consultando a API pelo código dele.
- Avisa quando não há resultado ou quando a API não responde.

## Como abrir

Dê dois cliques em `index.html`. É preciso ter internet.

Para abrir em um servidor local, com Python instalado:

```
npm start
```

Depois acesse http://localhost:5500.

## Como testar

Com Node 22 ou mais novo:

```
npm test
```

Os casos e o resultado estão em [docs/teste-da-api.md](docs/teste-da-api.md).

## Arquivos

| Arquivo | Função |
|---|---|
| `index.html` | Estrutura da página |
| `css/estilo.css` | Visual dos cards e da página |
| `js/api.js` | Consultas à API e limite de 20 produtos |
| `js/app.js` | Montagem dos cards, da busca e dos detalhes |
| `tests/api.test.js` | Testes da API |
| `docs/git-flow.md` | Como a equipe usa as branches |
| `docs/teste-da-api.md` | Teste da API |

## Como contribuir

O projeto usa git-flow. Leia [docs/git-flow.md](docs/git-flow.md) antes do primeiro commit.

## Limitações conhecidas

- Nomes e descrições dos produtos vêm em inglês, então a busca também é em inglês.
- Os preços estão em dólar, como a API envia.
- O projeto supõe que o preço da API é o valor antes do desconto.

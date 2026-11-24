# Teste da API

- **API:** https://dummyjson.com/products
- **Data:** 24/11/2026
- **Como repetir:** `npm test`
- **Resultado:** 11 testes, 11 aprovados

## Por que a DummyJSON

| API | Resposta | Busca por nome | Limite de itens |
|---|---|---|---|
| DummyJSON | 200 | Sim (`/search?q=`) | Sim (`limit`) |
| Fake Store API | 200 | Não | Sim (`limit`) |
| Platzi Fake Store | Não respondeu no teste | Não avaliada | Não avaliada |

## Consultas usadas

| Consulta | Endereço |
|---|---|
| Lista | `/products?limit=20` |
| Busca por nome | `/products/search?q=phone&limit=20` |
| Por categoria | `/products/category/laptops?limit=20` |
| Por código | `/products/1` |
| Lista de categorias | `/products/category-list` |

## Casos testados

| Caso | Esperado | Resultado |
|---|---|---|
| Lista inicial | 20 produtos, com os campos do card | Aprovado |
| Buscar "phone" | Mais de 20 encontrados, 20 mostrados | Aprovado |
| Buscar nome que não existe | Lista vazia | Aprovado |
| Categoria "laptops" | Só notebooks | Aprovado |
| Código 1 | Produto 1 | Aprovado |
| Código 99999 | Erro 404 | Aprovado |
| Lista de categorias | Contém "beauty" | Aprovado |
| API manda 30 produtos | Site usa 20 | Aprovado |
| Sem internet | Mensagem de erro clara | Aprovado |
| Busca com espaço e símbolo | Endereço montado certo | Aprovado |
| Preço com desconto | Valor final correto | Aprovado |

Os sete primeiros chamam a API de verdade. Os quatro últimos rodam sem internet.

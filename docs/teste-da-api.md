# Teste da API

- **API:** https://dummyjson.com/products
- **Data:** 24/11/2026
- **Como repetir:** `npm test`
- **Resultado:** 13 testes, 13 aprovados

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
| Lista de categorias (só no teste) | `/products/category-list` |

## Casos testados

| Caso | Esperado | Resultado |
|---|---|---|
| Lista inicial | 20 produtos, com os campos do card | Aprovado |
| Buscar "phone" | Mais de 20 encontrados, 20 mostrados | Aprovado |
| Buscar nome que não existe, com espaço e símbolo | Lista vazia | Aprovado |
| Categoria "laptops" | Só notebooks | Aprovado |
| Código 1 | Produto 1, com os campos dos detalhes | Aprovado |
| Código 99999 | Erro 404 | Aprovado |
| Categorias da tela | Iguais às da API | Aprovado |
| Cada palavra em português | Encontra ao menos um produto | Aprovado |
| API manda 30 produtos | Site usa 20 | Aprovado |
| Sem internet | Mensagem de erro clara | Aprovado |
| API lenta demais | Mensagem própria | Aprovado |
| Acento, maiúscula e plural | Palavra reconhecida | Aprovado |
| Palavra fora da lista | Vai para a API como foi digitada | Aprovado |

Os oito primeiros chamam a API de verdade. Os outros cinco rodam sem internet.

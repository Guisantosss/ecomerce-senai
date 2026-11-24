# Git-flow do projeto

Git-flow é um combinado sobre para que serve cada branch (linha de trabalho).

| Branch | Para que serve | Sai de | Volta para |
|---|---|---|---|
| `main` | Versões prontas, cada uma com sua tag | | |
| `gh-pages` | Cópia da `main` que o GitHub Pages mostra no site | `main` | |
| `develop` | Próxima versão em construção | `main` | |
| `feature/nome` | Uma tarefa nova | `develop` | `develop` |
| `release/x.y.z` | Ajustes finais de uma versão | `develop` | `main` e `develop` |
| `hotfix/x.y.z` | Correção urgente do que já foi lançado | `main` | `main` e `develop` |

Ninguém faz commit direto na `main`, na `develop` nem na `gh-pages`.

## Fazer uma tarefa

```
git switch develop
git pull
git switch -c feature/nome-da-tarefa
git add .
git commit -m "feat: descreve o que foi feito"
git push -u origin feature/nome-da-tarefa
```

Depois abra um pull request (pedido de revisão) de `feature/nome-da-tarefa` para `develop`. O colega revisa e aceita.

## Lançar uma versão

1. Crie a branch: `git switch develop` e `git switch -c release/0.3.0`.
2. Atualize o número em `package.json`, `README.md` e no rodapé de `index.html`. Anote as mudanças no `CHANGELOG.md`.
3. Rode `npm test` e faça o commit.
4. Junte nas duas branches e crie a tag:

```
git switch main
git merge --no-ff release/0.3.0
git tag -a v0.3.0 -m "Versão 0.3.0"
git switch develop
git merge --no-ff release/0.3.0
git branch -d release/0.3.0
git push origin main develop --follow-tags
git push origin main:gh-pages
```

A última linha publica a versão no site. Espere de 1 a 3 minutos.

## Número da versão

O formato é `maior.menor.correção`:

- **maior:** mudança que quebra o que já funcionava.
- **menor:** função nova.
- **correção:** conserto de erro.

## Mensagens de commit

| Início | Quando usar |
|---|---|
| `feat:` | Função nova |
| `fix:` | Correção |
| `docs:` | Documentação |
| `style:` | Visual |
| `test:` | Testes |
| `chore:` | Configuração e versão |

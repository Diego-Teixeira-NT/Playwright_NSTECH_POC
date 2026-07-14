# Playwright_NSTECH

Testes automatizados com [Playwright](https://playwright.dev/) + TypeScript para o sistema MultiTMS — suporte a múltiplos ambientes.

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- Acesso ao sistema MultiTMS com um usuário válido

## Configuração

1. Instale as dependências:
   ```
   npm install
   ```

2. Crie os arquivos `.env.<ambiente>` na raiz do projeto (baseado em `.env.example`) com as credenciais de acesso:
   ```
   BASE_URL=https://<url-do-ambiente>
   LOGIN_USERNAME=seu_usuario
   LOGIN_PASSWORD=sua_senha
   ```

   Nenhum arquivo `.env.*` é versionado (estão no `.gitignore`).

## Ambientes disponíveis

| Ambiente     | Arquivo          | URL                                           |
|--------------|------------------|-----------------------------------------------|
| Torre        | `.env.torre`     | https://torre.multihomo.com.br                |
| Danone       | `.env.danone`    | https://danonehomo.multiembarcador.com.br     |
| Unilever     | `.env.unilever`  | https://unilever.multihomo.com.br             |
| Boticário    | `.env.boticario` | https://boticario.multihomo.com.br            |
| Ypê          | `.env.ype`       | https://ype.multihomo.com.br                  |
| Minerva Foods| `.env.minerva`   | https://minervafoods.multihomo.com.br         |
| Grupo SC     | `.env.gruposc`   | https://gruposc.multihomo.com.br              |

## Estrutura do projeto

```
tests/
├── login.spec.ts          # Teste de login
├── menus.smoke.spec.ts    # Smoke test: valida disponibilidade de todas as telas via URL (#hash)
├── usuarios.spec.ts        # Testes de cadastro, edição e exclusão de usuário (CPF) via interface
├── usuarios.api.spec.ts    # Mesmos testes de cadastro, edição e exclusão, porém via API (validação no front)
└── helpers/
    ├── login.ts             # Login e validação da página inicial
    ├── menus.ts             # Navegação pelo menu (Administrativo > Usuários)
    ├── form.ts              # Preenchimento de campos do formulário
    ├── cadastro.ts          # Cadastro de usuário CPF
    ├── pesquisa.ts          # Pesquisa de usuários pelo nome
    ├── verificacao.ts        # Verifica e exclui usuário existente (evita duplicidade)
    ├── cpf.ts                # Geração de CPF válido
    └── api.ts                # Chamadas diretas à API (Usuario/Pesquisa, Adicionar, Atualizar, ExcluirPorCodigo)
```

## Rodando os testes

Rodar todos os testes (todos os navegadores):
```
npx playwright test
```

Rodar um arquivo específico:
```
npx playwright test tests/usuarios.spec.ts
```

Rodar em modo visual (navegador visível):
```
npx playwright test tests/usuarios.spec.ts --headed
```

Rodar apenas no Chromium:
```
npx playwright test tests/usuarios.spec.ts --project=chromium
```

Rodar sem paralelismo (**obrigatório** para `usuarios.spec.ts` e `usuarios.api.spec.ts`, pois os testes de criar/editar/excluir compartilham o mesmo registro e podem colidir se rodados em paralelo):
```
npx playwright test tests/usuarios.spec.ts --project=chromium --headed --workers=1
npx playwright test tests/usuarios.api.spec.ts --project=chromium --headed --workers=1
```

> ⚠️ Sem `--workers=1`, os testes de `usuarios.spec.ts` e `usuarios.api.spec.ts` podem falhar por concorrência (um teste exclui o usuário enquanto outro está cadastrando/editando).

Rodar o smoke test de menus (450 telas, pode usar workers paralelos pois é read-only):
```
npx playwright test tests/menus.smoke.spec.ts --project=chromium --workers=4
```

> O smoke test navega via URL (`#hash`) e funciona em qualquer ambiente. Recomendado `--workers=4` para concluir em ~15 minutos.

### Smoke test por ambiente (local)

Use os scripts do `package.json` passando o ambiente e o número de workers desejado após `--`:

```
npm run smoke:torre -- --workers=4
npm run smoke:danone -- --workers=2
npm run smoke:boticario -- --workers=1 --headed
npm run smoke:unilever -- --workers=4 --project=chromium
```

> Tudo após o `--` é repassado diretamente ao Playwright, permitindo combinar qualquer flag (`--workers`, `--headed`, `--project`, etc.).

### Smoke test via pipeline (CI/CD)

Na pipeline, defina as variáveis de ambiente diretamente como secrets/variables e execute:
```
npm run smoke -- --workers=4
```

As variáveis necessárias são: `BASE_URL`, `LOGIN_USERNAME`, `LOGIN_PASSWORD`.

## Testes disponíveis

- **Smoke test de menus** (`menus.smoke.spec.ts`): navega pelas ~450 telas do MultiTMS via URL e verifica ausência de erros HTTP (404/500), Internal Server Error e loading infinito. Organizado por menu com suporte a folding no VS Code (`#region`).
- **Validar login com sucesso** (`login.spec.ts`): faz login e valida a mensagem de boas-vindas.
- **Criar um usuário CPF** (`usuarios.spec.ts`): acessa Administrativo > Usuários, remove cadastros anteriores com o mesmo nome, cria um novo usuário com CPF válido e confirma o cadastro.
- **Editar um usuário CPF** (`usuarios.spec.ts`): cria o usuário e edita o campo Nome, validando a atualização.
- **Excluir um usuário CPF** (`usuarios.spec.ts`): cria o usuário e em seguida o exclui, validando a exclusão.
- **Criar/Editar/Excluir um usuário CPF via API** (`usuarios.api.spec.ts`): realiza as mesmas operações de cadastro, edição e exclusão chamando diretamente os endpoints da API (`Usuario/Adicionar`, `Usuario/Atualizar`, `Usuario/ExcluirPorCodigo`, `Usuario/Pesquisa`), reaproveitando a sessão autenticada do navegador. A validação de cada operação é feita na interface (front-end), via tela de Usuários.

## Relatórios

Os testes geram dois relatórios automaticamente a cada execução.

### Playwright HTML

```
npx playwright show-report
```

### Allure

Os resultados são coletados em `allure-results/` durante a execução. Para gerar e abrir o relatório:

```
npm run allure:report
```

Ou em etapas separadas:
```
npm run allure:generate   # gera o relatório em allure-report/
npm run allure:open       # abre no browser
```

> `allure-results/` e `allure-report/` não são versionados (estão no `.gitignore`).

## Autor

Diego Teixeira

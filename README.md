# Playwright_NSTECH

Testes automatizados com [Playwright](https://playwright.dev/) + TypeScript para o sistema MultiTMS (https://varejo.multihomo.com.br).

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- Acesso ao sistema MultiTMS com um usuário válido

## Configuração

1. Instale as dependências:
   ```
   npm install
   ```

2. Crie um arquivo `.env` na raiz do projeto (baseado em `.env.example`) com as credenciais de acesso:
   ```
   BASE_URL=https://varejo.multihomo.com.br
   LOGIN_USERNAME=seu_usuario
   LOGIN_PASSWORD=sua_senha
   ```

   O arquivo `.env` não é versionado (está no `.gitignore`).

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

> O smoke test navega via URL (`#hash`) e funciona em qualquer ambiente — basta ajustar `BASE_URL` no `.env`. Recomendado `--workers=4` para concluir em ~15 minutos.

## Testes disponíveis

- **Smoke test de menus** (`menus.smoke.spec.ts`): navega pelas ~450 telas do MultiTMS via URL e verifica ausência de erros HTTP (404/500), Internal Server Error e loading infinito. Organizado por menu com suporte a folding no VS Code (`#region`).
- **Validar login com sucesso** (`login.spec.ts`): faz login e valida a mensagem de boas-vindas.
- **Criar um usuário CPF** (`usuarios.spec.ts`): acessa Administrativo > Usuários, remove cadastros anteriores com o mesmo nome, cria um novo usuário com CPF válido e confirma o cadastro.
- **Editar um usuário CPF** (`usuarios.spec.ts`): cria o usuário e edita o campo Nome, validando a atualização.
- **Excluir um usuário CPF** (`usuarios.spec.ts`): cria o usuário e em seguida o exclui, validando a exclusão.
- **Criar/Editar/Excluir um usuário CPF via API** (`usuarios.api.spec.ts`): realiza as mesmas operações de cadastro, edição e exclusão chamando diretamente os endpoints da API (`Usuario/Adicionar`, `Usuario/Atualizar`, `Usuario/ExcluirPorCodigo`, `Usuario/Pesquisa`), reaproveitando a sessão autenticada do navegador. A validação de cada operação é feita na interface (front-end), via tela de Usuários.

## Relatório

Após a execução, o relatório HTML pode ser aberto com:
```
npx playwright show-report
```

## Autor

Diego Teixeira

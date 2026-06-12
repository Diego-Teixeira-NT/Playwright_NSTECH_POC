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
├── usuarios.spec.ts        # Testes de cadastro, edição e exclusão de usuário (CPF)
└── helpers/
    ├── login.ts             # Login e validação da página inicial
    ├── menus.ts             # Navegação pelo menu (Administrativo > Usuários)
    ├── form.ts              # Preenchimento de campos do formulário
    ├── cadastro.ts          # Cadastro de usuário CPF
    ├── pesquisa.ts          # Pesquisa de usuários pelo nome
    ├── verificacao.ts        # Verifica e exclui usuário existente (evita duplicidade)
    └── cpf.ts                # Geração de CPF válido
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

Rodar sem paralelismo (recomendado para `usuarios.spec.ts`, pois os testes de criar/editar/excluir compartilham o mesmo registro):
```
npx playwright test tests/usuarios.spec.ts --project=chromium --headed --workers=1
```

## Testes disponíveis

- **Validar login com sucesso** (`login.spec.ts`): faz login e valida a mensagem de boas-vindas.
- **Criar um usuário CPF** (`usuarios.spec.ts`): acessa Administrativo > Usuários, remove cadastros anteriores com o mesmo nome, cria um novo usuário com CPF válido e confirma o cadastro.
- **Editar um usuário CPF** (`usuarios.spec.ts`): cria o usuário e edita o campo Nome, validando a atualização.
- **Excluir um usuário CPF** (`usuarios.spec.ts`): cria o usuário e em seguida o exclui, validando a exclusão.

## Relatório

Após a execução, o relatório HTML pode ser aberto com:
```
npx playwright show-report
```

## Autor

Diego Teixeira

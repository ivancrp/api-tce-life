# TCE-Life Backend

Este é o backend da aplicação TCE-Life, um sistema de gestão de saúde.

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```
3. Configure as variáveis de ambiente copiando o arquivo `.env.example` para `.env` e ajustando conforme necessário
4. Execute as migrações do banco de dados:
```bash
npm run prisma:migrate
```
5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Configuração da Autenticação com Google

Para configurar corretamente a autenticação com Google, siga estes passos:

### 1. Criar um projeto no Google Cloud Console

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API Google+ e/ou Google Identity

### 2. Configurar as credenciais OAuth

1. No menu lateral, vá para "APIs e Serviços" > "Credenciais"
2. Clique em "Criar Credenciais" > "ID do Cliente OAuth"
3. Selecione "Aplicativo Web"
4. Dê um nome ao seu aplicativo (ex: "TCE-Life")
5. Em "Origens JavaScript autorizadas", adicione:
   - `http://localhost:5173` (para desenvolvimento local)
   - `http://localhost:3000` (se estiver usando esta porta)
   - Os domínios de produção, se aplicável
6. Em "URIs de redirecionamento autorizados", adicione:
   - `http://localhost:5173` (para desenvolvimento local)
   - `http://localhost:3000` (se estiver usando esta porta)
   - Os domínios de produção, se aplicável
7. Clique em "Criar"

### 3. Configurar as variáveis de ambiente

Após criar as credenciais, você receberá um ID do Cliente e um Segredo do Cliente. Adicione-os ao arquivo `.env`:

```
GOOGLE_CLIENT_ID=seu-id-do-cliente-aqui
GOOGLE_CLIENT_SECRET=seu-segredo-do-cliente-aqui
```

### 4. Configuração de consentimento OAuth

1. No menu lateral, vá para "APIs e Serviços" > "Tela de consentimento OAuth"
2. Selecione o tipo de usuário (Externo ou Interno)
3. Preencha as informações necessárias como nome do aplicativo, email de contato, etc.
4. Adicione os escopos necessários (pelo menos `email` e `profile`)
5. Adicione os domínios autorizados (seu domínio de produção)
6. Salve as configurações

### 5. Verifique o status do projeto

Certifique-se de que seu projeto esteja "em produção" e não em modo de teste, especialmente se estiver usando usuários externos.

### Resolução de Problemas Comuns

#### "OAuth client was not found. Erro 401: invalid_client"

Este erro geralmente ocorre quando:

1. **ID do Cliente incorreto**: Verifique se o ID do cliente no arquivo `.env` está correto
2. **Domínio não autorizado**: Verifique se o domínio que está acessando o aplicativo está nas origens JavaScript autorizadas
3. **Projeto em modo de teste**: Se o projeto estiver em modo de teste, apenas os usuários de teste conseguirão autenticar

#### "Redirect URI mismatch"

Este erro ocorre quando a URI de redirecionamento não está configurada corretamente:

1. Verifique se a origem da sua aplicação está listada nas "Origens JavaScript autorizadas"
2. Verifique se não há discrepâncias entre HTTP e HTTPS (eles são considerados diferentes)

## Comandos Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Compila o projeto
- `npm start`: Inicia o servidor em modo de produção
- `npm run prisma:migrate`: Executa as migrações do banco de dados
- `npm run prisma:generate`: Gera o cliente Prisma
- `npm run prisma:seed`: Popula o banco de dados com dados iniciais 
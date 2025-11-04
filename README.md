# 📱 Todo App - React Native & Django REST

Olá! Este é um aplicativo de gerenciamento de tarefas completo que eu desenvolvi usando React Native para o app mobile e Django REST Framework para a API. O projeto tem autenticação segura, cada usuário vê apenas suas próprias tarefas, e uma interface moderna com suporte a modo escuro.

## 📋 Índice resumido

- [Sobre o Projeto](#-o-que-é-este-projeto)
- [Funcionalidades](#-o-que-você-pode-fazer)
- [Tecnologias](#️-o-que-eu-usei-pra-fazer-isso)
- [Instalação](#-vamos-começar-instalação-passo-a-passo)
- [Como Usar](#-como-usar-o-app)
- [Testes](#-testes)
- [API](#-documentação-da-api)
- [Problemas Comuns](#-problemas-comuns-e-como-resolver)

## 🎯 O que é este projeto?

Este projeto foi feito como um desafio técnico para mostrar conhecimentos em desenvolvimento full-stack. Basicamente, você tem:

- **App Mobile**: Feito com React Native e Expo
- **API Backend**: Django + Django REST Framework
- **Autenticação**: JWT
- **Segurança**: Cada usuário só vê suas próprias tarefas
- **UX**: Interface moderna com modo escuro/claro

## ✨ O que você pode fazer?

### Autenticação
Você pode se cadastrar, fazer login, recuperar sua senha se esquecer, e fazer logout.

### Gerenciamento de Tarefas
Aqui é onde a mágica acontece:
- Criar tarefas com título e descrição
- Ver todas as suas tarefas
- Editar tarefas
- Marcar como concluída
- Reabrir se mudar de ideia
- Excluir quando não precisar mais
- **Se você for admin**: pode designar tarefas para outros usuários
- Filtrar por status (todas, pendentes, concluídas)
- Filtrar por data de criação

### Gerenciamento de Usuários (Apenas Admin)
Se você for administrador, também pode:
- Ver todos os usuários do sistema
- Excluir usuários (exceto a si mesmo)
- Identificar quais usuários são administradores

### Interface
- Modo escuro/claro
- Design limpo e fácil de usar
- Feedback visual quando você faz alguma ação
- Indicador de carregamento
- Mensagens de erro claras

## 🛠️ O que eu usei pra fazer isso?

### Backend (Python/Django)
Usei Django porque é poderoso e tem tudo que preciso: Django REST Framework para API, SimpleJWT para autenticação, e algumas outras bibliotecas como drf-spectacular que gera documentação automática. As principais são:

- Django 5.2.7
- Django REST Framework 3.16.1
- djangorestframework-simplejwt 5.5.1
- django-cors-headers 4.9.0
- django-filter 25.2
- drf-spectacular 0.28.0
- python-decouple 3.8

### Frontend (React Native/Expo)
React Native com Expo porque é a forma mais rápida de fazer app mobile. TypeScript para evitar erros, e Axios para fazer as chamadas da API. As principais tecnologias:

- React Native 0.81.5
- Expo ~54.0.0
- React Navigation 6.x
- Axios 1.7.7
- AsyncStorage 2.2.0
- TypeScript 5.3.3

## 📋 O que você precisa ter instalado

Antes de começar, precisa ter algumas coisas instaladas:

### Para o Backend
- **Python 3.10 ou superior** - Se não tiver, baixe aqui: https://www.python.org/downloads/
- **pip** - Geralmente já vem com Python
- **Git** - Para clonar o repositório (se não tiver: https://git-scm.com/downloads)

### Para o Frontend
- **Node.js 18 ou superior** - Baixa aqui: https://nodejs.org/
- **npm** - Vem junto com Node.js
- **Um celular ou emulador**:
  - **Android**: Pode usar um celular físico com Expo Go ou Android Studio
  - **iPhone**: Pode usar um iPhone físico ou Xcode no Mac

## 🚀 Vamos começar! Instalação passo a passo

Primeiro, vamos baixar o projeto:

```bash
git clone https://github.com/Duduzinhoextrem/app-emprego.git
cd app-emprego
```

### 2. Configurar o Backend

#### 📋 O que o Backend faz

O backend é uma API REST que fornece autenticação e gerenciamento de tarefas.

#### 2.1. Primeiro, vamos verificar se você tem Python

Digite isso no terminal:

```bash
python --version
```

Se aparecer algo como "Python 3.10.x" ou superior, está correto.

Se der erro ou aparecer uma versão muito antiga:
1. Baixa o Python aqui: https://www.python.org/downloads/
2. **Importante**: Durante a instalação, marque a opção "Add Python to PATH" (é muito importante!)
3. Depois de instalar, fecha e abre o terminal de novo

#### 2.2. Vamos entrar na pasta do backend

```bash
cd backend
```

#### 2.3. Criar um ambiente virtual

O ambiente virtual isola as dependências do projeto. Crie assim:

```bash
# Windows
python -m venv venv

# Linux/Mac
python3 -m venv venv
```

A criação da pasta `venv` pode levar alguns segundos.

#### 2.4. Ativar o ambiente virtual

Agora vamos "entrar" no ambiente virtual:

```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

Quando funcionar, você vai ver `(venv)` aparecendo no começo da linha, tipo assim:
```
(venv) PS C:\caminho\para\seu\projeto\backend>
```

Se apareceu o `(venv)`, está tudo correto.

#### 2.5. Atualizar o pip (opcional mas recomendado)

```bash
python -m pip install --upgrade pip
```

Isso pode levar alguns segundos.

#### 2.6. Instalar todas as dependências

Agora vem a parte que demora um pouco:

```bash
pip install -r requirements.txt
```

Isso vai instalar todas as bibliotecas que o projeto precisa. Pode levar alguns minutos.

Quando terminar, se apareceu "Successfully installed" no final, está tudo correto.

#### 2.7. Configurar o arquivo .env

Agora vamos configurar as variáveis de ambiente. Primeiro, vamos copiar o arquivo de exemplo:

```bash
# Windows
copy env.example .env

# Linux/Mac
cp env.example .env
```

Agora abre o arquivo `.env` com qualquer editor de texto (Notepad, VSCode, até o Bloco de Notas serve) e configure assim:

```env
SECRET_KEY=sua-chave-secreta-super-longa-e-aleatoria
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,SEU_IP_LOCAL

# JWT
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# CORS
CORS_ALLOW_ALL_ORIGINS=True
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**Atenção!** Você precisa descobrir seu IP local e colocar no lugar de `SEU_IP_LOCAL`. Faz assim:
- **Windows**: Abre outro terminal e digita `ipconfig`, procura por "Endereço IPv4" (geralmente é tipo `192.168.x.x`)
- **Linux/Mac**: Digita `ifconfig`, procura por "inet"

Depois que descobrir seu IP (geralmente é algo como `192.168.x.x`), coloque ali no `ALLOWED_HOSTS`. Isso é importante para o app do celular conseguir se conectar.

#### 2.8. Criar o banco de dados

Agora vamos criar as tabelas do banco de dados (o Django usa SQLite por padrão, que é perfeito pra desenvolvimento):

```bash
python manage.py migrate
```

Se tudo der certo, você vai ver um monte de "OK" aparecendo na tela, tipo:
```
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying users.0001_initial... OK
  Applying tasks.0001_initial... OK
  ...
```

Isso cria o arquivo `db.sqlite3` com todas as tabelas.

#### 2.9. Popular com dados de teste (opcional, mas recomendado)

Isso cria alguns usuários e tarefas de exemplo para você testar.

```bash
python populate_data.py
```

Depois de rodar isso, você vai ter:
- **Admin**: usuário `admin` com senha `admin123`
- **João**: usuário `joao` com senha `senha123`
- **Maria**: usuário `maria` com senha `senha123`
- E algumas tarefas de exemplo pra cada um


#### 2.10. Ligar o servidor

Vamos iniciar o servidor:

```bash
python manage.py runserver 0.0.0.0:8000
```

**Importante**: Use `0.0.0.0:8000` e não `127.0.0.1`! O `0.0.0.0` permite que outros dispositivos na mesma rede (tipo seu celular) consigam acessar o backend.

Se deu certo, você vai ver algo assim:
```
Watching for file changes with StatReloader
Performing system checks...
System check identified no issues (0 silenced).
Django version 5.2.7, using settings 'config.settings'
Starting development server at http://0.0.0.0:8000/
Quit the server with CTRL-BREAK.
```

O backend está rodando. Deixe esse terminal aberto e vamos para o próximo passo.

**Dica**: Se precisar parar o servidor, é só apertar `CTRL + C` (ou `CTRL + BREAK` no Windows).

### 3. Configurar o Frontend

#### ⚠️ Atenção: Abrir um Terminal Novo!

**NÃO feche o terminal do backend!** Ele precisa continuar rodando. Você vai precisar dos dois terminais abertos ao mesmo tempo.

Para abrir um terminal novo:
1. Pressiona **Windows + X**
2. Escolhe "Windows PowerShell" ou "Terminal"
3. Deixa o terminal do backend aberto em segundo plano (só minimiza ele)

#### 3.1. Vamos entrar na pasta do frontend

```bash
cd caminho/para/seu/projeto/frontend

# Ou se você já está na pasta raiz do projeto:
cd frontend
```

#### 3.2. Verificar se tem Node.js

Primeiro, vamos ver se você tem Node instalado:

```bash
node --version
```

Se aparecer algo como `v18.x.x` ou superior, está correto.

Se der erro ou aparecer uma versão muito antiga:
1. Baixa o Node.js aqui: https://nodejs.org/ (pega a versão LTS que é a mais estável)
2. Instala normalmente
3. **Fecha e abre o PowerShell de novo** (isso é importante!)
4. Testa de novo com `node --version`

#### 3.3. Verificar o npm

O npm geralmente vem junto com o Node:

```bash
npm --version
```

Se aparecer `v9.x.x` ou superior, está correto.

#### 3.4. Limpar cache (só se você já tentou instalar antes)

Se você já tentou instalar e deu algum problema, melhor limpar tudo antes:

```bash
# Windows
rd /s /q node_modules
rd /s /q .expo
rd /s /q dist
del package-lock.json

# Linux/Mac
rm -rf node_modules .expo dist package-lock.json
```

Se der algum erro tipo "não encontrado", pode ignorar.

#### 3.5. Instalar todas as dependências

Agora vem a parte que pode demorar um pouco (mas vale a pena):

```bash
npm install --legacy-peer-deps
```

Isso pode levar alguns minutos. Quando terminar, você vai ver algo como:
```
added 727 packages in 5m
```

**Dica**: Se der algum erro de "peer dependencies", tenta com:
```bash
npm install --force
```

Isso força a instalação mesmo assim.

#### 3.6. Verificar se instalou tudo

Depois que terminar, vamos ver se criou a pasta `node_modules`:

```bash
# Windows
dir

# Linux/Mac
ls
```

Se você ver uma pasta chamada `node_modules`, está tudo correto.

#### 3.7. Configurar a URL da API

Agora precisa editar o arquivo `frontend/src/services/api.ts` e colocar o mesmo IP que você usou no backend. Abre o arquivo e procura por essa linha:

```typescript
const API_URL = 'http://SEU_IP_LOCAL:8000/api';
```

Troca o `SEU_IP_LOCAL` pelo IP que você descobriu antes. Por exemplo, se seu IP é `192.168.1.100`, fica assim:

```typescript
const API_URL = 'http://192.168.1.100:8000/api';
```

**Lembrete**: É o mesmo IP que você colocou no `ALLOWED_HOSTS` do arquivo `.env` do backend.

#### 3.8. Ligar o Expo

Vamos iniciar o Expo:

```bash
npx expo start --clear
```

Aguarda uns segundinhos... Vai aparecer um QR Code bem grande na tela! Tipo assim:

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

█▀▀▀▀▀█ ▀▀█▄  █▀▀▀▀▀█
█ ███ █ ▄▄▀█  █ ███ █
█ ▀▀▀ █ █▀█▄  █ ▀▀▀ █
...
```

O QR Code apareceu. Agora vamos configurar o celular.

**Lembrete**: Deixe esse terminal aberto também. Não feche nem o terminal do backend nem esse do Expo. Você vai ter os dois rodando ao mesmo tempo.

### 4. Configurar o Expo Go no Celular

#### 4.1. Baixar o Expo Go

Agora vamos pegar o celular! Primeiro, precisa instalar o app Expo Go:

**Se você tem Android:**
1. Abra a Google Play Store
2. Busque por "Expo Go"
3. Instale o app

**Se você tem iPhone:**
1. Abra a App Store
2. Busque por "Expo Go"
3. Instale o app

**Links diretos (se preferir):**
- Android: https://play.google.com/store/apps/details?id=host.exp.exponent
- iPhone: https://apps.apple.com/app/expo-go/id982107779

#### 4.2. Verificar se tá na mesma WiFi

**Isso é MUITO importante!** Seu celular e seu computador precisam estar na mesma rede WiFi. Se não estiverem, não vai funcionar.

**Como verificar no computador:**
Abre um terminal e digita:
```bash
ipconfig
```
Procura por "Endereço IPv4" - vai ser algo tipo `192.168.x.x`. Anota o nome da rede WiFi também.

**Como verificar no celular:**
- Android: Vai em Configurações > WiFi e vê o nome da rede conectada
- iPhone: Vai em Ajustes > WiFi e vê o nome da rede conectada

Os dois (celular e PC) precisam estar conectados na **mesma rede WiFi**! Se não estiverem, conecta ambos na mesma rede antes de continuar.

#### 4.3. Escanear o QR Code

Agora a parte divertida! Vamos escanear o QR Code que apareceu no terminal:

**Se você tem Android:**
1. Abre o app **Expo Go**
2. Toque em "Scan QR Code" (ou "Escanear QR Code")
3. Aponte a câmera pra o QR Code que tá no PowerShell
4. Aguarda ele carregar...

**Se você tem iPhone:**
1. Abre o app **Câmera** normal (não o Expo Go!)
2. Aponte pra o QR Code no terminal
3. Vai aparecer uma notificação embaixo - toque nela
4. O Expo Go vai abrir automaticamente

Isso pode levar alguns segundos na primeira vez. Se aparecer a tela de login do app, você conseguiu.

### 5. Usar o App

#### 5.1. Fazer login

Quando o app abrir, você vai ver a tela de login bem bonitinha. Se você rodou o `populate_data.py` antes, pode usar essas credenciais de teste:

- **João**: usuário `joao` / senha `senha123`
- **Maria**: usuário `maria` / senha `senha123`
- **Admin**: usuário `admin` / senha `admin123` (esse tem mais permissões)

É só digitar e fazer login! 🔐

#### 5.2. Explorar o app

Depois que entrar, você vai ver suas tarefas. Daí você pode:

- Ver todas as suas tarefas na tela principal
- Criar tarefa nova (botão `+`)
- Marcar como concluída (toque no checkbox)
- Editar tarefa
- Excluir tarefa
- Filtrar tarefas (Todas, Pendentes, Concluídas, Data)
- Mudar para o modo escuro (botão no header)
- Sair

#### 5.3. Criar sua própria conta

Se preferir criar sua própria conta (o que eu recomendo):

1. Na tela de login, toque em "Cadastre-se"
2. Preenche os campos obrigatórios (tem um asterisco * do lado)
3. Toque em "Cadastrar"
4. Pronto! Você já entra logado automaticamente, nem precisa fazer login depois!

### 6. Testar se tudo tá funcionando

#### 6.1. Testar a API no navegador do computador

Abre seu navegador e tenta acessar:
- **Documentação Swagger**: http://localhost:8000/api/docs/
- **Django Admin**: http://localhost:8000/admin/ (login com `admin` / `admin123`)

Se abrir e você conseguir ver as coisas, o backend está funcionando.

#### 6.2. Testar a API no navegador do celular

Abre o navegador do seu celular (Chrome, Safari, etc) e tenta acessar:
- http://SEU_IP_LOCAL:8000/api/docs/
- (Troca SEU_IP_LOCAL pelo IP que você descobriu antes, exemplo: http://192.168.1.100:8000/api/docs/)

Se abrir a documentação, significa que a conexão entre celular e computador está funcionando.

#### 6.3. Hot Reload (a mágica do desenvolvimento)

O Expo tem hot reload, o que significa que:
1. Se você mudar algum código, o app atualiza automaticamente no celular (sem precisar recompilar tudo)
2. No terminal do frontend, você vai ver logs de tudo que acontece quando usa o app
3. Se você "sacudir" o celular, abre um menu de debug útil quando algo der errado

É bem prático para desenvolver.

## 📱 Como Usar o App (Guia Rápido)

### Primeira vez usando

1. **Criar conta nova**: Toque em "Não tem conta? Cadastre-se" e preencha os dados
2. **Ou fazer login**: Se já tem conta, digite usuário e senha
3. **Criar tarefas**: Botão `+` no canto inferior direito
4. **Gerenciar tarefas**: 
   - Toque numa tarefa para marcar como concluída (ou reabrir se já tiver concluído)
   - Toque no ícone para editar
   - Toque no ícone para excluir
5. **Filtrar tarefas**: Botões no topo para filtrar (Todas, Pendentes, Concluídas, ou por Data)
6. **Mudar tema**: Botão no header para alternar entre modo claro e escuro
7. **Gerenciar usuários (Admin)**: Botão 👥 no header para acessar a tela de gerenciamento de usuários

### Se você for Admin

Se você logar como admin, vai poder:
- Designar tarefas para outros usuários
- Ver todas as tarefas do sistema
- Gerenciar usuários: acesse a tela de gerenciamento pelo botão 👥 no header
- Excluir usuários (protegido: não pode excluir a si mesmo)

### Esqueci a senha

Se esquecer:
1. Na tela de login, toque em "Esqueci minha senha"
2. Digite seu email
3. O sistema vai gerar um token (em desenvolvimento, o token aparece num alerta)
4. Copie esse token e use na tela de redefinição
5. Crie uma senha nova (precisa ter no mínimo 8 caracteres)

## 🧪 Testes

### Backend

Pra rodar os testes automatizados do backend:

```bash
cd backend
python manage.py test
```

Se passar tudo, você vai ver uma mensagem tipo "OK" ou "PASSED". Se der algum erro, ele mostra qual teste falhou e por quê.

### Frontend

O frontend não tem testes automatizados ainda, então é tudo manual mesmo. Usa o app e vai testando as funcionalidades! É até mais divertido assim 😄

## 📚 Documentação da API

A API tem uma documentação automática bem legal usando Swagger! Você pode acessar enquanto o backend tá rodando:

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc** (formato alternativo): http://localhost:8000/api/redoc/

Lá você consegue ver todos os endpoints e testar direto pelo navegador.

### Endpoints principais

**Autenticação:**
- `POST /api/auth/register/` - Criar conta nova
- `POST /api/auth/login/` - Fazer login
- `GET /api/auth/profile/` - Ver seu perfil
- `POST /api/auth/token/refresh/` - Renovar token (automático)
- `POST /api/auth/request-password-reset/` - Pedir reset de senha
- `POST /api/auth/reset-password/` - Redefinir senha

**Usuários:**
- `GET /api/auth/users/` - Listar usuários (qualquer usuário autenticado)
- `DELETE /api/auth/users/{id}/` - Excluir usuário (apenas admin)

**Tarefas:**
- `GET /api/tasks/` - Ver suas tarefas (pode filtrar também)
- `POST /api/tasks/` - Criar tarefa nova
- `PATCH /api/tasks/{id}/` - Editar tarefa
- `DELETE /api/tasks/{id}/` - Deletar tarefa
- `POST /api/tasks/{id}/complete/` - Marcar como concluída
- `POST /api/tasks/{id}/reopen/` - Reabrir tarefa concluída

## 🔧 Estrutura do Projeto

```
todo-app/
├── backend/                 # API Django
│   ├── config/             # Configurações do Django
│   │   ├── settings.py     # Configurações principais
│   │   ├── urls.py         # URLs principais
│   │   └── ...
│   ├── tasks/              # App de tarefas
│   │   ├── models.py       # Modelos de dados
│   │   ├── views.py        # Views/ViewSets
│   │   ├── serializers.py  # Serializers
│   │   ├── urls.py         # URLs das tarefas
│   │   └── ...
│   ├── users/               # App de usuários
│   │   ├── models.py       # Modelos de usuário
│   │   ├── views.py        # Views de autenticação
│   │   ├── serializers.py  # Serializers de usuário
│   │   └── ...
│   ├── manage.py           # Script de gerenciamento Django
│   ├── requirements.txt    # Dependências Python
│   ├── env.example         # Exemplo de variáveis de ambiente
│   └── populate_data.py   # Script para popular dados de teste
│
└── frontend/               # App React Native
    ├── src/
    │   ├── contexts/       # Contextos (Auth, Theme)
    │   ├── screens/        # Telas do app
    │   ├── navigation/     # Configuração de navegação
    │   ├── services/       # Serviços de API
    │   └── types/          # Definições TypeScript
    ├── App.tsx             # Componente principal
    ├── package.json        # Dependências Node
    └── ...
```

## 🐛 Problemas Comuns (e como resolver)

### O app não consegue conectar ao backend

Geralmente é fácil de resolver:

1. **Verifique se o backend está rodando** - Olhe no terminal, precisa estar mostrando "Starting development server"
2. **Confirme que usou `0.0.0.0:8000`** - Se usou `127.0.0.1`, o celular não vai conseguir acessar
3. **Confira o IP no arquivo api.ts** - Precisa ser o mesmo IP que você colocou no `.env`
4. **Mesma WiFi** - Celular e PC precisam estar na mesma rede
5. **Firewall** - Às vezes o Windows bloqueia. Tente desativar temporariamente o firewall/antivírus
6. **Android**: Verifique se o app Expo Go tem permissão de rede nas configurações

### Erro de CORS no console

Se aparece "CORS policy" no erro:
- Abre o arquivo `.env` do backend
- Confirma que tem `CORS_ALLOW_ALL_ORIGINS=True`
- Se não tiver, adiciona essa linha e reinicia o servidor

### Token expirando muito rápido

Se você tem que fazer login toda hora, pode aumentar o tempo de expiração. No `.env` do backend:

```env
JWT_ACCESS_TOKEN_LIFETIME=60      # minutos (1 hora)
JWT_REFRESH_TOKEN_LIFETIME=1440   # minutos (24 horas)
```

Aumenta esses valores se quiser que dure mais tempo.

### Expo Go não conecta

Se o QR Code não funciona ou o app não carrega:

1. Verifique se está na mesma rede WiFi
2. Tente usar `npx expo start --tunnel` (é mais lento, mas às vezes funciona melhor)
3. Reinicie o Expo Go no celular
4. Limpe o cache: `npx expo start --clear`

Se mesmo com o IP correto não conectar, tente reiniciar o Expo Go e limpar o cache.

### Erro ao abrir no emulador Android

Se você vê um erro tipo `Error: args: [-p, host.exp.exponent...]` quando tenta abrir no emulador:

**Solução 1: Instalar Expo Go manualmente no emulador**
1. Abra o emulador Android e aguarde ele inicializar completamente
2. Abra a Google Play Store no emulador
3. Busque por "Expo Go" e instale
4. Depois, volte no terminal e pressione `a` para tentar abrir novamente no Android

**Solução 2: Usar QR Code no emulador**
1. No terminal do Expo, pressione `a` para selecionar Android
2. Se der erro, tente outra abordagem:
   - Abra o Expo Go manualmente no emulador (se já estiver instalado)
   - No Expo Go, toque em "Enter URL manually" ou "Connect manually"
   - Digite a URL que aparece no terminal (tipo: `exp://192.168.x.x:8081`)

**Solução 3: Usar um dispositivo físico**
Se o emulador continuar dando problema, use um celular físico:
1. Conecte seu celular na mesma WiFi do PC
2. Abra o Expo Go no celular
3. Escaneie o QR Code que aparece no terminal

**Solução 4: Reiniciar o emulador**
Às vezes o emulador precisa ser reiniciado:
1. Feche completamente o emulador
2. No Android Studio, abra o AVD Manager
3. Inicie o emulador novamente
4. Aguarde ele inicializar completamente antes de tentar abrir o app

## 📝 Variáveis de Ambiente

### Backend (.env)

Se você quiser entender melhor o arquivo `.env`, aqui está um exemplo completo:

```env
# Django
SECRET_KEY=sua-chave-secreta-super-longa-e-aleatoria
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,192.168.1.100

# JWT
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# CORS
CORS_ALLOW_ALL_ORIGINS=True
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**Lembrete**: Copie o arquivo `env.example` para `.env` e ajuste os valores. O IP que você colocar ali precisa ser o mesmo que você usar no `api.ts` do frontend.

## 👥 Contas de Teste

Depois de rodar `python populate_data.py`, você vai ter essas contas prontas pra usar:

- **Admin**: `admin` / `admin123` (tem permissões especiais)
- **João**: `joao` / `senha123`
- **Maria**: `maria` / `senha123`

Ou você pode criar sua própria conta direto no app!

**Como criar um usuário administrador manualmente:**
```bash
cd backend
python manage.py createsuperuser
```
Siga as instruções que aparecerem no terminal. Depois você pode acessar o Django Admin em http://localhost:8000/admin/ com essas credenciais.

## 🔒 Segurança

O projeto foi feito pensando em segurança:

- Tokens JWT são guardados de forma segura no AsyncStorage
- Toda operação de tarefa precisa estar autenticado
- Cada usuário só vê suas próprias tarefas (privacidade garantida!)
- Exclusão de usuários restrita apenas a administradores
- Administradores não podem excluir a si mesmos (proteção adicional)
- Validação tanto no backend quanto no frontend
- Senhas são criptografadas (nunca em texto plano)
- Sistema de refresh token pra renovar automaticamente quando expira

## 🎨 Modo Escuro

O app tem modo escuro completo e funciona bem.

- Botão no header para alternar
- A preferência fica salva
- Todas as telas foram adaptadas
- As cores foram pensadas para funcionar bem nos dois modos

## 📄 Sobre o Projeto

Desenvolvi esse projeto como um teste técnico. Fique à vontade para explorar o código.

### Registro de Desenvolvimento

Se quiser entender melhor como eu desenvolvi isso, incluindo as decisões que tomei e como usei ferramentas de IA durante o processo, dá uma olhada no arquivo [DESENVOLVIMENTO.md](./DESENVOLVIMENTO.md). Lá tem tudo documentado de forma bem transparente.

### Arquivos Importantes

Se precisar configurar algo, esses são os arquivos principais:
- `backend/env.example` - Exemplo de variáveis de ambiente (copie para `.env`)
- `backend/populate_data.py` - Script para criar dados de teste
- `frontend/src/services/api.ts` - Configuração da API (aqui você coloca seu IP)

## 👨‍💻 Sobre Mim

Desenvolvi isso como parte de um desafio técnico.

## 🙏 Agradecimentos

Não posso deixar de agradecer às ferramentas e comunidades que me ajudaram:

- **Django REST Framework** - A documentação deles me salvou várias vezes quando fiquei travado
- **Expo** - Fez desenvolvimento mobile ficar muito mais simples do que eu imaginava
- **Comunidade React Native** - Sempre tinha alguém que já tinha passado pelo mesmo problema

---

**Alguma dúvida ou encontrou algum bug?** Pode abrir uma issue no repositório ou dar uma olhada no código.


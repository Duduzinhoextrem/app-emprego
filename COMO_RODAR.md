# 🚀 Como Rodar o Projeto Todo App

## 📋 Pré-requisitos

- **Python 3.8+** (para o backend Django)
- **Node.js 18+** e **npm** (para o frontend React Native)
- **Expo Go** instalado no seu celular ([iOS](https://apps.apple.com/app/expo-go/id982107779) ou [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

---

## 🔧 Backend (Django)

### 1. Entre na pasta do backend:
```bash
cd backend
```

### 2. Ative o ambiente virtual (se estiver usando):
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Instale as dependências (se ainda não instalou):
```bash
pip install -r requirements.txt
```

### 4. Aplique as migrações do banco de dados:
```bash
python manage.py migrate
```

### 5. Descubra o seu IP local:
```bash
# Windows (PowerShell)
ipconfig

# Linux/Mac
ifconfig
# ou
ip addr show
```

**Procure pelo endereço IPv4** (geralmente algo como `192.168.x.x` ou `10.0.x.x`)

### 6. Configure o Django para aceitar conexões externas:
Atualize o arquivo `backend/config/settings.py` se necessário, ou rode com o IP:

```bash
python manage.py runserver 0.0.0.0:8000
```

**OU** configure no arquivo `.env` (se existir):
```
ALLOWED_HOSTS=localhost,127.0.0.1,SEU_IP_AQUI
```

### 7. Inicie o servidor Django:
```bash
python manage.py runserver 0.0.0.0:8000
```

O backend estará rodando em: `http://SEU_IP:8000/api`

---

## 📱 Frontend (React Native / Expo)

### 1. Entre na pasta do frontend:
```bash
cd frontend
```

### 2. Instale as dependências:
```bash
npm install
```

### 3. **IMPORTANTE: Configure o IP da API**

Abra o arquivo `frontend/src/services/api.ts` e altere o IP:

```typescript
const API_URL = 'http://SEU_IP:8000/api';  // Substitua SEU_IP pelo IP do passo 5 do backend
```

**Exemplo:**
```typescript
const API_URL = 'http://192.168.1.100:8000/api';
```

### 4. Inicie o Expo:
```bash
npm start
# ou
npx expo start
```

### 5. Escaneie o QR Code:
- Abra o app **Expo Go** no seu celular
- **Android**: Use a câmera ou o app Expo Go para escanear o QR Code
- **iOS**: Use a câmera nativa do iPhone para escanear

### 6. Outros comandos úteis do Expo:

```bash
# Iniciar com tunnel (útil se estiver em redes diferentes)
npx expo start --tunnel

# Limpar cache
npx expo start -c

# Rodar no Android emulador (se tiver instalado)
npx expo start --android

# Rodar no iOS simulator (apenas no Mac)
npx expo start --ios
```

---

## ⚠️ Problemas Comuns

### 1. **Erro de conexão com a API**
- Verifique se o IP está correto no `api.ts`
- Certifique-se que o backend está rodando em `0.0.0.0:8000`
- Ambos (celular e computador) devem estar na mesma rede Wi-Fi
- Verifique se o firewall não está bloqueando a porta 8000

### 2. **CORS Error**
- O CORS já está configurado para permitir todas as origens em desenvolvimento
- Se ainda houver problemas, verifique se `CORS_ALLOW_ALL_ORIGINS = True` em `backend/config/settings.py`

### 3. **Expo Go não conecta**
- Use `npx expo start --tunnel` para criar um túnel
- Ou use `npx expo start --lan` para usar a rede local

### 4. **Erro de dependências**
```bash
# Limpar cache e reinstalar
cd frontend
rm -rf node_modules
npm install
npx expo start -c
```

---

## 📝 Resumo Rápido dos Comandos

**Terminal 1 (Backend):**
```bash
cd backend
venv\Scripts\activate  # Windows
python manage.py runserver 0.0.0.0:8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

**No celular:**
- Abra o Expo Go
- Escaneie o QR Code
- Pronto! 🎉

---

## 🔍 Verificar se está tudo funcionando

1. **Backend:** Acesse `http://localhost:8000/api/docs/` no navegador (documentação Swagger)
2. **Frontend:** O app deve abrir no Expo Go e mostrar a tela de login


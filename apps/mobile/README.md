# Crossclip 📋

<div align="center">

![React Native](https://img.shields.io/badge/React%20Native-0.76-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-52.0-000020?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12.8-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Tamagui](https://img.shields.io/badge/Tamagui-2.0-FF4785?style=for-the-badge)

**Sincronize seus textos entre dispositivos de forma simples e rápida**

[Screenshots](#-screenshots) • [Features](#-features) • [Tecnologias](#-tecnologias) • [Instalação](SETUP.md) • [Guia de Estudos](GUIDE.md)

</div>

---

## 📱 Sobre o Projeto

Crossclip é um aplicativo mobile para Android que permite sincronizar textos copiados entre diferentes dispositivos através da nuvem. Simples, rápido e eficiente - sem complicação.

### ✨ Features

- 🔐 **Autenticação Google** - Login seguro com Firebase Auth
- ☁️ **Sincronização em Tempo Real** - Firestore com listeners para updates instantâneos
- 📋 **Gestão de Clipboard** - Adicione, copie e delete textos facilmente
- 🌓 **Tema Claro/Escuro** - Interface adaptável com persistência de preferência
- 🔄 **Controle de Versão Remoto** - Sistema de update forçado via Firestore
- ⭐ **Review Prompt** - Solicitação inteligente de avaliação na Play Store
- 💾 **Persistência de Sessão** - Login automático com AsyncStorage
- 🎨 **Design Humanizado** - Interface clean com fonte DM Sans e cores aconchegantes

---

## 🖼️ Screenshots

<div align="center">

### Tela de Login
![Tela de Login](docs/screenshots/signin.png)

### Lista de Textos
![Lista de Textos](docs/screenshots/clipboard-light.png)

### Tema Escuro
![Tema Escuro](docs/screenshots/clipboard-dark.png)

</div>

---

## 🛠️ Tecnologias

### Core
- **React Native** - Framework mobile
- **TypeScript** - Tipagem estática
- **Expo** - Toolchain e SDK
- **Expo Router** - Navegação file-based

### UI/UX
- **Tamagui** - Sistema de design e componentes
- **DM Sans** - Tipografia humanizada
- **Lucide Icons** - Ícones minimalistas

### Backend & Auth
- **Firebase Auth** - Autenticação com Google OAuth
- **Firestore** - Banco de dados NoSQL em tempo real
- **AsyncStorage** - Persistência local

### Funcionalidades
- **Expo Clipboard** - Acesso ao clipboard do sistema
- **Expo Store Review** - Solicitação de avaliação
- **Expo Application** - Informações do app

---

## 🚀 Como Usar

### Pré-requisitos
- Node.js 18+
- Android Studio (para emulador ou build)
- Conta Google (Firebase)

### Instalação Rápida
```bash
# Clone o repositório
git clone https://github.com/osamucadev/crossclip.git

# Entre no diretório mobile
cd crossclip/apps/mobile

# Instale as dependências
npm install

# Configure o Firebase (ver SETUP.md)
# Adicione google-services.json e configure .env

# Rode o app
npm run android
```

📖 **Para instruções detalhadas**, consulte o [SETUP.md](SETUP.md)

---

## 📂 Estrutura do Projeto
```
apps/mobile/
├── app/                      # Rotas (Expo Router)
│   ├── _layout.tsx           # Layout raiz com providers
│   ├── index.tsx             # Redirect baseado em auth
│   ├── sign-in.tsx           # Tela de login
│   └── clipboard.tsx         # Lista de textos
├── src/
│   ├── components/           # Componentes reutilizáveis
│   │   └── ThemeToggle.tsx
│   ├── contexts/             # Contextos React
│   │   ├── AuthContext.tsx   # Estado de autenticação
│   │   └── ThemeContext.tsx  # Tema light/dark
│   ├── lib/                  # Integrações externas
│   │   ├── firebase.ts       # Config Firebase
│   │   ├── firestore.ts      # CRUD Firestore
│   │   ├── googleSignIn.ts   # OAuth Google
│   │   ├── versionControl.ts # Update forçado
│   │   └── reviewPrompt.ts   # Review tracking
│   └── ui/
│       └── useAppTheme.ts    # (legado)
├── tamagui.config.ts         # Configuração Tamagui
└── google-services.json      # Credenciais Firebase
```

---

## 🎯 Funcionalidades Principais

### Autenticação
- Login com Google (Firebase Auth)
- Persistência de sessão com AsyncStorage
- Redirect automático baseado em estado de auth

### Sincronização
- CRUD de textos no Firestore
- Listeners em tempo real (subscribeToClips)
- Isolamento por usuário (userId)

### Controle de Versão
- Versão mínima configurável no Firestore (`config/app_version`)
- 7 aberturas antes de forçar update
- Desabilitado em desenvolvimento

### Review Inteligente
- Tracking de interações (push, copy, delete)
- Prompt após 10 interações
- Uma solicitação por instalação

---

## 🔒 Segurança

- Autenticação via Google OAuth 2.0
- Regras de segurança Firestore (isolamento por userId)
- Tokens persistidos localmente com AsyncStorage
- Variáveis de ambiente para credenciais

---

## 🐛 Troubleshooting

Problemas comuns e soluções estão documentados no [SETUP.md](SETUP.md#-troubleshooting).

---

## 📚 Aprendizado

Quer entender como o app funciona por dentro? Consulte o [GUIDE.md](GUIDE.md) para um plano de estudos completo sobre:
- React Native & Expo
- Firebase (Auth + Firestore)
- TypeScript
- State Management
- E muito mais!

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para abrir issues ou pull requests.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Samuel Caetite**

- GitHub: [@osamucadev](https://github.com/osamucadev)
- LinkedIn: [Samuel Caetite](https://linkedin.com/in/samuelcaetite)
- Portfolio: [samuelcaetite.dev](samuelcaetite.dev)

---

<div align="center">

**Feito com 💜 por Samuel Caetite**

</div>
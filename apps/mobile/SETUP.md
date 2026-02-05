# 🚀 Setup - Crossclip Mobile

Guia completo de instalação e configuração do Crossclip para desenvolvimento local.

---

## 📋 Índice

1. [Pré-requisitos](#-pré-requisitos)
2. [Instalação](#-instalação)
3. [Configuração do Firebase](#-configuração-do-firebase)
4. [Configuração do Android](#-configuração-do-android)
5. [Variáveis de Ambiente](#-variáveis-de-ambiente)
6. [Rodando o App](#-rodando-o-app)
7. [Troubleshooting](#-troubleshooting)

---

## 🔧 Pré-requisitos

### Node.js e npm
- **Node.js** 18.0.0 ou superior
- **npm** 9.0.0 ou superior
```bash
# Verificar versões instaladas
node --version
npm --version
```

### Android Studio
1. Baixe e instale o [Android Studio](https://developer.android.com/studio)
2. Durante a instalação, certifique-se de instalar:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)

### Java Development Kit (JDK)
- **JDK 17** (recomendado para React Native 0.76+)
```bash
# Verificar versão
java -version
```

### Expo CLI
```bash
npm install -g expo-cli
```

### Git
```bash
git --version
```

---

## 📦 Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/osamucadev/crossclip.git
cd crossclip/apps/mobile
```

### 2. Instale as Dependências
```bash
npm install
```

Aguarde a instalação de todos os pacotes. Isso pode levar alguns minutos.

---

## 🔥 Configuração do Firebase

### 1. Crie um Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"**
3. Nomeie o projeto (ex: `crossclip`)
4. Desative o Google Analytics (opcional)
5. Clique em **"Criar projeto"**

### 2. Adicione um App Android

1. No painel do projeto, clique no ícone **Android**
2. Preencha:
   - **Nome do pacote Android**: `seuprojeto.seudominio.com` (ou seu package name)
   - **Nome do app**: Crossclip
3. **NÃO clique em "Registrar app" ainda!**

### 3. Configure o SHA-1 (Importante para Google Sign-In)

O Firebase precisa do certificado SHA-1 para autenticação com Google.

#### Obter SHA-1 de Debug
```bash
# Windows (PowerShell)
cd android
.\gradlew signingReport

# macOS/Linux
cd android
./gradlew signingReport
```

Procure por algo assim na saída:
```
Variant: debug
Config: debug
Store: C:\Users\seu-usuario\.android\debug.keystore
Alias: AndroidDebugKey
SHA1: A1:B2:C3:D4:E5:F6:G7:H8:I9:J0:K1:L2:M3:N4:O5:P6:Q7:R8:S9:T0
```

**Copie o valor do SHA1**.

#### Adicionar SHA-1 no Firebase

1. Volte para o Firebase Console
2. Cole o **SHA-1** no campo "Certificado de assinatura do SHA-1 de depuração"
3. Clique em **"Registrar app"**

### 4. Baixe o `google-services.json`

1. O Firebase vai oferecer o download do arquivo `google-services.json`
2. **Baixe o arquivo**
3. **Coloque o arquivo em DOIS lugares** (sim, ambos são necessários):
```
apps/mobile/google-services.json
apps/mobile/android/app/google-services.json
```

> ⚠️ **Importante**: O arquivo precisa estar nos dois lugares. Um é usado pelo Expo, outro pelo Gradle.

### 5. Habilite Autenticação Google

1. No Firebase Console, vá em **Authentication** > **Sign-in method**
2. Clique em **Google**
3. Ative o provedor
4. Escolha um email de suporte
5. Salve

### 6. Configure o Firestore

#### Criar o Banco de Dados

1. Vá em **Firestore Database**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Modo de produção"**
4. Selecione uma localização (ex: `southamerica-east1` para São Paulo)
5. Clique em **"Ativar"**

#### Configurar Regras de Segurança

Vá em **Firestore Database** → **Regras** e cole:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Clips: isolamento por usuário
    match /clips/{clipId} {
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null
        && resource.data.userId == request.auth.uid;
    }
    
    // Config: leitura pública (para version control)
    match /config/{document} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

Clique em **"Publicar"**.

#### Criar Documento de Controle de Versão

1. Vá em **Firestore Database** > **Dados**
2. Clique em **"Iniciar coleção"**
3. ID da coleção: `config`
4. ID do documento: `app_version`
5. Adicione campo:
   - **Nome do campo**: `minimum_version`
   - **Tipo**: string
   - **Valor**: `1.0.0`
6. Salve

### 7. Obtenha as Credenciais do Firebase

1. No Firebase Console, vá em **Configurações do projeto** (ícone de engrenagem)
2. Role até **"Seus apps"**
3. Clique no app Android que você criou
4. Copie os seguintes valores:
```
API Key (apiKey)
Auth Domain (authDomain)
Project ID (projectId)
Storage Bucket (storageBucket)
Messaging Sender ID (messagingSenderId)
App ID (appId)
```

### 8. Configure o Google Web Client ID

1. Ainda em **Configurações do projeto**
2. Role até a seção **Google Cloud Platform (GCP)**
3. Copie o **Web Client ID** (algo como `123456-abcdef.apps.googleusercontent.com`)

---

## 🤖 Configuração do Android

### 1. Configure o SDK Path (local.properties)

O Android Studio precisa saber onde está o Android SDK.

#### Encontrar o Caminho do SDK

Abra o Android Studio > **Settings** (ou **Preferences** no macOS) > **Appearance & Behavior** > **System Settings** > **Android SDK**

Copie o caminho do **Android SDK Location** (ex: `C:\Users\seu-usuario\AppData\Local\Android\Sdk`)

#### Criar o Arquivo

Crie o arquivo `apps/mobile/android/local.properties`:
```properties
# Windows
sdk.dir=C:\\Users\\SEU_USUARIO\\AppData\\Local\\Android\\Sdk

# macOS
sdk.dir=/Users/SEU_USUARIO/Library/Android/sdk

# Linux
sdk.dir=/home/SEU_USUARIO/Android/Sdk
```

> ⚠️ **Windows**: Use barras duplas `\\` no caminho!

### 2. Verifique o `google-services.json`

Confirme que o arquivo está nos dois lugares:
```bash
# Verificar
ls apps/mobile/google-services.json
ls apps/mobile/android/app/google-services.json
```

---

## 🔐 Variáveis de Ambiente

Crie o arquivo `.env` na raiz de `apps/mobile`:
```env
# Firebase Config
EXPO_PUBLIC_FIREBASE_API_KEY=sua-api-key-aqui
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:android:abcdef123456

# Google Sign-In
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=123456-abcdef.apps.googleusercontent.com
```

> ⚠️ **Nunca comite o arquivo `.env`!** Ele já está no `.gitignore`.

---

## ▶️ Rodando o App

### 1. Inicie o Metro Bundler
```bash
npx expo start
```

### 2. Rode no Emulador ou Device

#### Opção A: Android Studio Emulator

1. Abra o Android Studio
2. Vá em **Device Manager**
3. Crie ou inicie um emulador
4. No terminal do Expo, pressione `a`

#### Opção B: Device Físico

1. Habilite o modo desenvolvedor no Android:
   - **Configurações** > **Sobre o telefone**
   - Toque 7 vezes em **Número da versão**
2. Habilite **Depuração USB**
3. Conecte o celular via USB
4. No terminal do Expo, pressione `a`

#### Opção C: Build Direto
```bash
npm run android
```

### 3. Primeira Execução

Na primeira vez, o build pode demorar 5-10 minutos. Aguarde pacientemente.

---

## 🐛 Troubleshooting

### Erro: "SDK location not found"

**Problema**: O Gradle não encontra o Android SDK.

**Solução**:
1. Crie o arquivo `android/local.properties`
2. Adicione `sdk.dir=CAMINHO_DO_SEU_SDK`
3. **Windows**: Use `\\` em vez de `\`
```properties
# Correto (Windows)
sdk.dir=C:\\Users\\samu\\AppData\\Local\\Android\\Sdk

# Errado
sdk.dir=C:\Users\samu\AppData\Local\Android\Sdk
```

---

### Erro: "Google Sign-In failed" ou "Developer Error"

**Problema**: SHA-1 não configurado ou Web Client ID incorreto.

**Solução**:
1. Rode `cd android && ./gradlew signingReport`
2. Copie o SHA-1 do certificado de debug
3. Adicione no Firebase Console (**Configurações do projeto** → **Seus apps** → **SHA certificate fingerprints**)
4. Verifique se o `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` no `.env` está correto
5. Limpe o cache: `npm start -- --clear`

---

### Erro: "ENOENT: no such file or directory, open 'google-services.json'"

**Problema**: Arquivo `google-services.json` não está nos lugares corretos.

**Solução**:
Coloque o arquivo em **ambos** os locais:
```
apps/mobile/google-services.json
apps/mobile/android/app/google-services.json
```

---

### Erro: "Task :app:configureCMakeDebug failed"

**Problema**: Cache corrompido do Gradle ou CMake.

**Solução**:
```bash
cd android
./gradlew clean
cd ..
rm -rf node_modules
npm install
npm run android
```

---

### Erro: "Execution failed for task ':react-native-menu_menu:compileDebugKotlin'"

**Problema**: Conflito de versões do Tamagui/zeego.

**Solução**:
```bash
npm install @react-native-menu/menu@2.0.0
cd android
./gradlew clean
cd ..
npm run android
```

---

### Erro: "Unable to resolve module @tamagui/..."

**Problema**: Dependências do Tamagui não instaladas completamente.

**Solução**:
```bash
npx expo install @tamagui/config tamagui @tamagui/core @tamagui/animations-react-native
npx expo install @tamagui/lucide-icons zeego
npx expo install react-native-reanimated react-native-gesture-handler
npm install
```

---

### Erro: "FirebaseError: Missing or insufficient permissions"

**Problema**: Regras de segurança do Firestore não configuradas.

**Solução**:
1. Vá no Firebase Console > **Firestore Database** > **Regras**
2. Cole as regras fornecidas na [seção de Firestore](#6-configure-o-firestore)
3. Clique em **"Publicar"**

---

### App não abre / Tela branca

**Solução**:
1. Limpe o cache:
```bash
npx expo start --clear
```

2. Reconstrua:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

3. Verifique logs:
```bash
npx react-native log-android
```

---

### Erro: "Java version not supported"

**Problema**: JDK incompatível.

**Solução**:
1. Instale JDK 17
2. Configure `JAVA_HOME`:

**Windows**:
```bash
setx JAVA_HOME "C:\Program Files\Java\jdk-17"
```

**macOS/Linux**:
```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

---

### Dependências com warning de peer dependencies

**Solução**: Geralmente são warnings seguros. Se causar problemas:
```bash
npm install --legacy-peer-deps
```

---

## 🔄 Resetar Completamente o Projeto

Se nada funcionar, reset completo:
```bash
# Deletar node_modules e builds
rm -rf node_modules
rm -rf android/app/build android/build

# Reinstalar
npm install

# Rebuild
npm run android
```

---

## 📱 Build de Produção

### Gerar APK
```bash
cd android
./gradlew assembleRelease
```

APK estará em: `android/app/build/outputs/apk/release/app-release.apk`

### Gerar AAB (Google Play)
```bash
cd android
./gradlew bundleRelease
```

AAB estará em: `android/app/build/outputs/bundle/release/app-release.aab`

---

## ✅ Checklist de Setup

- [ ] Node.js 18+ instalado
- [ ] Android Studio instalado e configurado
- [ ] JDK 17 instalado
- [ ] Projeto Firebase criado
- [ ] App Android adicionado no Firebase
- [ ] SHA-1 configurado no Firebase
- [ ] `google-services.json` nos dois lugares
- [ ] Autenticação Google habilitada
- [ ] Firestore criado com regras
- [ ] Documento `config/app_version` criado
- [ ] `.env` configurado com todas as variáveis
- [ ] `android/local.properties` configurado
- [ ] Emulador Android funcionando ou device conectado
- [ ] App rodando sem erros

---

## 🆘 Precisa de Ajuda?

- **Issues**: Abra uma issue no [GitHub](https://github.com/osamucadev/crossclip/issues)
- **Documentação React Native**: https://reactnative.dev/
- **Documentação Expo**: https://docs.expo.dev/
- **Documentação Firebase**: https://firebase.google.com/docs

---

**Pronto! Agora você deve estar com o app rodando localmente. 🎉**

Se encontrou algum problema não listado aqui, por favor abra uma issue para que possamos atualizar este guia.
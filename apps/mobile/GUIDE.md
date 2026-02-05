# 📚 Guia de Estudos - Crossclip Mobile

Guia completo para entender a arquitetura, tecnologias e conceitos por trás do Crossclip. Ideal para quem quer dominar React Native, Firebase, TypeScript e desenvolvimento mobile.

---

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Estrutura do Projeto](#-estrutura-do-projeto)
3. [Explicação Arquivo por Arquivo](#-explicação-arquivo-por-arquivo)
4. [Fluxo de Dados](#-fluxo-de-dados)
5. [Tecnologias e Pré-requisitos](#-tecnologias-e-pré-requisitos)
6. [Conceitos Importantes](#-conceitos-importantes)
7. [Tarefas Comuns](#-tarefas-comuns)
8. [Plano de Estudos](#-plano-de-estudos)

---

## 🎯 Visão Geral

O Crossclip é um aplicativo React Native que permite sincronizar textos entre dispositivos usando Firebase como backend. A arquitetura segue padrões modernos de desenvolvimento mobile com foco em:

- **Separação de Responsabilidades**: UI, lógica de negócio e integração externa separadas
- **Type Safety**: TypeScript em todo o código
- **State Management**: Context API para estados globais
- **Real-time Sync**: Firestore listeners para sincronização instantânea
- **Autenticação Segura**: Firebase Auth com Google OAuth
- **Design System**: Tamagui para UI consistente

**Stack Principal:**
- React Native 0.76
- TypeScript 5.3
- Expo 52
- Firebase 12.8
- Tamagui 2.0

---

## 📁 Estrutura do Projeto
```
apps/mobile/
├── app/                              # Rotas (Expo Router)
│   ├── _layout.tsx                   # Layout raiz (providers, navegação)
│   ├── index.tsx                     # Página inicial (redirect)
│   ├── sign-in.tsx                   # Tela de login
│   └── clipboard.tsx                 # Lista de clips
│
├── src/
│   ├── components/                   # Componentes reutilizáveis
│   │   └── ThemeToggle.tsx           # Toggle light/dark
│   │
│   ├── contexts/                     # Contextos React
│   │   ├── AuthContext.tsx           # Estado de autenticação global
│   │   └── ThemeContext.tsx          # Tema light/dark com persistência
│   │
│   ├── lib/                          # Integrações e utilitários
│   │   ├── firebase.ts               # Configuração Firebase
│   │   ├── firestore.ts              # CRUD Firestore (clips)
│   │   ├── googleSignIn.ts           # Google OAuth
│   │   ├── versionControl.ts         # Sistema de update forçado
│   │   ├── reviewPrompt.ts           # Tracking de interações para review
│   │   └── clipboardSuggestion.ts    # Listener de clipboard
│   │
│   └── ui/
│       └── useAppTheme.ts            # (legado - removível)
│
├── tamagui.config.ts                 # Config do design system
├── google-services.json              # Credenciais Firebase
├── .env                              # Variáveis de ambiente
└── app.json                          # Configuração Expo
```

---

## 📄 Explicação Arquivo por Arquivo

### Camada de Roteamento (`app/`)

#### **`app/_layout.tsx`** - Layout Raiz
**Propósito:** Inicializar providers, configurar navegação, carregar fontes.

**Responsabilidades:**
1. Carregar fontes (DM Sans)
2. Configurar TamaguiProvider (design system)
3. Configurar AuthProvider (estado de autenticação)
4. Configurar ThemeProvider (tema light/dark)
5. Verificar versão do app (version control)
6. Registrar listener de clipboard

**Conceitos-chave:**
- React Context (múltiplos providers aninhados)
- Expo Router (Stack navigation)
- Custom hooks (`useFonts`)
- Side effects (`useEffect`)
- Dependency injection (providers)

**Por que essa estrutura:**
Centraliza configuração global. Providers no topo garantem que qualquer tela tenha acesso aos contextos.
```typescript
// Estrutura de providers
<ThemeProvider>
  <TamaguiProvider theme={theme}>
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  </TamaguiProvider>
</ThemeProvider>
```

---

#### **`app/index.tsx`** - Página Inicial
**Propósito:** Redirecionar baseado no estado de autenticação.

**Lógica:**
```
SE loading > Retorna null (não renderiza nada)
SE autenticado > Redirect para /clipboard
SENÃO > Redirect para /sign-in
```

**Por que assim:**
Expo Router sempre monta `index.tsx` primeiro. Usamos `<Redirect>` para ir para a tela correta sem mostrar conteúdo desnecessário.

---

#### **`app/sign-in.tsx`** - Tela de Login
**Propósito:** Interface de autenticação com Google.

**Fluxo:**
1. Usuário clica em "Sign in with Google"
2. Chama `signInWithGoogle()` de `lib/googleSignIn.ts`
3. Abre popup OAuth do Google
4. Google retorna token
5. Firebase cria sessão
6. Redireciona para `/clipboard`

**Elementos UI:**
- Header com ThemeToggle
- Botão de login
- Loading state
- Error handling

---

#### **`app/clipboard.tsx`** - Lista de Clips
**Propósito:** Tela principal - CRUD de clips.

**Funcionalidades:**
- Listar clips do Firestore (real-time)
- Adicionar texto do clipboard
- Copiar clip para clipboard
- Deletar clip
- Logout
- Toggle de tema

**Hooks usados:**
- `useState` - Estado local (clips, loading)
- `useEffect` - Subscrição ao Firestore
- Custom hooks - `trackInteraction` para review

**Firestore Integration:**
```typescript
useEffect(() => {
  const unsubscribe = subscribeToClips(setClips);
  return () => unsubscribe(); // Cleanup ao desmontar
}, []);
```

---

### Camada de Contextos (`src/contexts/`)

Contextos gerenciam estado global compartilhado entre telas.

#### **`src/contexts/AuthContext.tsx`** - Autenticação
**Propósito:** Gerenciar estado do usuário autenticado.

**Estado:**
```typescript
{
  user: User | null,      // Objeto do Firebase Auth
  loading: boolean        // Está verificando autenticação?
}
```

**Funcionamento:**
1. Ao montar, registra `onAuthStateChanged` do Firebase
2. Firebase verifica se há sessão salva (AsyncStorage via persistence)
3. Se houver, retorna `user`
4. Atualiza estado automaticamente quando login/logout acontece

**Por que Context:**
Várias telas precisam saber se usuário está logado. Context evita prop drilling.

---

#### **`src/contexts/ThemeContext.tsx`** - Tema
**Propósito:** Gerenciar tema light/dark com persistência.

**Estado:**
```typescript
{
  theme: "light" | "dark",
  toggleTheme: () => void
}
```

**Persistência:**
```typescript
// Ao trocar tema
async function toggleTheme() {
  const newTheme = theme === "light" ? "dark" : "light";
  setTheme(newTheme);
  await AsyncStorage.setItem("app_theme", newTheme); // Salva localmente
}
```

**Inicialização:**
```typescript
useEffect(() => {
  async function loadTheme() {
    const stored = await AsyncStorage.getItem("app_theme");
    if (stored) setTheme(stored);
  }
  loadTheme();
}, []);
```

---

### Camada de Integração (`src/lib/`)

Módulos que comunicam com serviços externos (Firebase, APIs, sistema).

#### **`src/lib/firebase.ts`** - Configuração Firebase
**Propósito:** Inicializar Firebase com credenciais do `.env`.

**Exports:**
```typescript
export const firebaseApp: FirebaseApp
export const auth: Auth  // Com persistência configurada
```

**Persistência:**
```typescript
// React Native precisa de AsyncStorage para persistir sessão
initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage)
});
```

**Por que isso importa:**
Sem persistência, usuário teria que logar toda vez que abre o app.

---

#### **`src/lib/firestore.ts`** - CRUD de Clips
**Propósito:** Funções para manipular clips no Firestore.

**Funções:**

**`subscribeToClips(onChange)`**
```typescript
// Listener em tempo real
const q = query(
  collection(db, "clips"),
  where("userId", "==", user.uid),    // Isolamento por usuário
  orderBy("createdAt", "desc"),       // Mais recentes primeiro
  limit(20)
);

return onSnapshot(q, (snapshot) => {
  const clips = snapshot.docs.map(d => ({
    id: d.id,
    content: d.data().content
  }));
  onChange(clips);  // Atualiza estado no componente
});
```

**Por que `onSnapshot`:**
Firestore envia updates automaticamente quando dados mudam. Sincronização real-time sem polling.

**`addClip(content)`**
```typescript
return addDoc(collection(db, "clips"), {
  userId: user.uid,
  content,
  createdAt: serverTimestamp()  // Timestamp do servidor (não cliente)
});
```

**`deleteClip(id)`**
```typescript
await deleteDoc(doc(db, "clips", id));
```

**Conceitos-chave:**
- Firestore queries (where, orderBy, limit)
- Real-time listeners (onSnapshot)
- Server timestamps (evita problemas de timezone)
- Isolamento de dados por userId

---

#### **`src/lib/googleSignIn.ts`** - Google OAuth
**Propósito:** Autenticar com Google usando Firebase Auth.

**Fluxo OAuth:**
```typescript
export async function signInWithGoogle() {
  // 1. Configura Google Sign-In
  GoogleSignin.configure({
    webClientId: EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
  });

  // 2. Usuário seleciona conta no popup
  const { idToken } = await GoogleSignin.signIn();

  // 3. Cria credencial Firebase
  const credential = GoogleAuthProvider.credential(idToken);

  // 4. Autentica no Firebase
  return signInWithCredential(auth, credential);
}
```

**Por que Web Client ID:**
Google precisa validar que o app tem permissão para usar OAuth. Web Client ID é gerado no Firebase Console.

---

#### **`src/lib/versionControl.ts`** - Update Forçado
**Propósito:** Verificar se app está na versão mínima requerida.

**Lógica:**
```typescript
1. Busca minimum_version do Firestore (doc: config/app_version)
2. Compara com versão atual do app
3. Se versão atual < minimum_version:
   - Incrementa contador de aberturas
   - Se contador >= 3: bloqueia app
   - Senão: exibe aviso
4. Se versão OK: reseta contador
```

**Por que remoto:**
Permite forçar update sem precisar atualizar o app. Útil para bugs críticos.

**Desabilitado em dev:**
```typescript
if (__DEV__) return { mustUpdate: false };
```

---

#### **`src/lib/reviewPrompt.ts`** - Review na Play Store
**Propósito:** Solicitar avaliação após X interações.

**Tracking:**
```typescript
export async function trackInteraction() {
  if (__DEV__) return;  // Desabilitado em dev
  
  const count = await getInteractionCount();
  const newCount = count + 1;
  await AsyncStorage.setItem("interaction_count", newCount.toString());
  
  if (newCount >= 10) {
    await promptForReview();  // Abre popup nativo do Android
  }
}
```

**Chamado em:**
- Push clipboard
- Copiar clip
- Deletar clip

**Uma vez por instalação:**
```typescript
const reviewAsked = await AsyncStorage.getItem("review_asked");
if (reviewAsked === "true") return;
```

---

### Camada de Componentes (`src/components/`)

#### **`src/components/ThemeToggle.tsx`** - Toggle Tema
**Propósito:** Botão para alternar entre light/dark.

**Implementação:**
```typescript
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Pressable onPress={toggleTheme}>
      <ToggleButton>
        {theme === "light" ? <Sun /> : <Moon />}
      </ToggleButton>
    </Pressable>
  );
}
```

**Styled com Tamagui:**
```typescript
const ToggleButton = styled(YStack, {
  width: 44,
  height: 44,
  borderRadius: 22,
  // ...estilos
});
```

---

### Configuração do Design System

#### **`tamagui.config.ts`** - Config do Tamagui
**Propósito:** Definir tokens de design (cores, espaçamentos, tipografia).

**Estrutura:**
```typescript
createTamagui({
  themes: {
    light: {
      background: "#fafaf9",    // Bege claro
      color: "#0c0a09",         // Texto quase preto
      primary: "#6366f1",       // Azul/roxo
      // ...
    },
    dark: {
      background: "#1c1917",    // Cinza escuro
      color: "#fafaf9",         // Texto claro
      primary: "#818cf8",       // Roxo claro
      // ...
    }
  }
});
```

**Uso nos componentes:**
```typescript
<YStack backgroundColor="$background">
  <Text color="$color">Hello</Text>
  <Button backgroundColor="$primary">Click</Button>
</YStack>
```

**Por que Design System:**
- Consistência visual
- Tema dinâmico automático
- IntelliSense para tokens
- Performance otimizada

---

## 🔄 Fluxo de Dados

### 1. Autenticação (Login)
```
[sign-in.tsx]
    │
    └─► handleSignIn()
        │
        ├─► signInWithGoogle() [googleSignIn.ts]
        │   ├─► GoogleSignin.signIn()
        │   │   └─► Popup Google OAuth
        │   │       └─► Retorna idToken
        │   │
        │   ├─► GoogleAuthProvider.credential(idToken)
        │   │
        │   └─► signInWithCredential(auth, credential)
        │       └─► Firebase Auth cria sessão
        │           └─► Salva token no AsyncStorage
        │
        └─► onAuthStateChanged (AuthContext)
            └─► user !== null
                └─► AuthContext atualiza estado
                    └─► index.tsx detecta user
                        └─► <Redirect href="/clipboard" />
```

---

### 2. Sincronização de Clips (Real-time)
```
[clipboard.tsx] - useEffect
    │
    └─► subscribeToClips(setClips) [firestore.ts]
        │
        ├─► query(collection, where, orderBy, limit)
        │
        └─► onSnapshot(query, callback)
            │
            └─► [Firestore Server]
                ├─► Envia snapshot inicial
                │   └─► callback(snapshot) executado
                │       └─► setClips(dados)
                │           └─► Re-render automático
                │
                └─► Detecta mudança nos dados
                    └─► Envia novo snapshot
                        └─► callback(snapshot) executado
                            └─► setClips(dados atualizados)
                                └─► Re-render automático
```

---

### 3. Adicionar Clip
```
[clipboard.tsx]
    │
    └─► handlePushClipboard()
        │
        ├─► Clipboard.getStringAsync()
        │   └─► Lê texto do clipboard do sistema
        │
        ├─► addClip(text) [firestore.ts]
        │   ├─► addDoc(collection("clips"), {
        │   │     userId: user.uid,
        │   │     content: text,
        │   │     createdAt: serverTimestamp()
        │   │   })
        │   │
        │   └─► [Firestore Server]
        │       └─► Cria documento
        │           └─► Notifica listeners (onSnapshot)
        │               └─► clipboard.tsx recebe update
        │                   └─► Re-render com novo clip
        │
        └─► trackInteraction() [reviewPrompt.ts]
            └─► Incrementa contador
                └─► Se >= 10: StoreReview.requestReview()
```

---

### 4. Verificação de Versão (Startup)
```
[_layout.tsx] - useEffect
    │
    └─► checkAppVersion() [versionControl.ts]
        │
        ├─► getDoc(doc("config/app_version")) [Firestore]
        │   └─► minimum_version: "1.0.0"
        │
        ├─► Application.nativeApplicationVersion
        │   └─► "1.0.0"
        │
        ├─► isVersionOutdated(current, minimum)
        │   └─► Compara major.minor.patch
        │
        ├─► SE outdated:
        │   ├─► getOpenCount() [AsyncStorage]
        │   │   └─► "2"
        │   │
        │   ├─► SE count >= 3:
        │   │   └─► Alert: "Atualização obrigatória"
        │   │       └─► Bloqueia app
        │   │
        │   └─► SENÃO:
        │       └─► Alert: "Nova versão disponível"
        │           └─► Permite uso
        │
        └─► SENÃO:
            └─► removeItem("app_open_count_outdated")
```

---

## 🎓 Tecnologias e Pré-requisitos

### 1. **JavaScript/TypeScript**
**Por que:** Linguagem base de todo o projeto.

**Tópicos:**
- ES6+ (arrow functions, destructuring, spread, async/await)
- Promises e async programming
- Type annotations (TypeScript)
- Generics
- Union types
- Interface vs Type
- Type inference

**Recursos:**
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- JavaScript.info: https://javascript.info/

---

### 2. **React & React Hooks**
**Por que:** Framework de UI do app.

**Tópicos:**
- Componentes funcionais
- Props e state
- **Hooks essenciais:**
  - `useState` - Estado local
  - `useEffect` - Side effects (API calls, subscriptions)
  - `useContext` - Consumir contextos
  - `useRef` - Referências mutáveis
- Reconciliation e re-render
- Conditional rendering
- Lists e keys

**Recursos:**
- React Docs (Beta): https://react.dev/
- Kent C. Dodds - Epic React: https://epicreact.dev/

---

### 3. **React Native**
**Por que:** Framework mobile cross-platform.

**Tópicos:**
- Diferenças React vs React Native
- Componentes nativos (View, Text, ScrollView, FlatList)
- Styling (StyleSheet)
- Flexbox (principal layout)
- Platform-specific code
- AsyncStorage
- Linking
- Permissions

**Recursos:**
- React Native Docs: https://reactnative.dev/
- William Candillon - React Native Reanimated: https://www.youtube.com/@wcandillon

---

### 4. **Expo**
**Por que:** Toolchain que facilita desenvolvimento React Native.

**Tópicos:**
- Expo CLI
- Expo Go
- EAS Build
- Expo Router (file-based routing)
- Expo modules (Clipboard, StoreReview, Application)
- Over-the-air updates

**Recursos:**
- Expo Docs: https://docs.expo.dev/
- Expo Router Docs: https://docs.expo.dev/router/introduction/

---

### 5. **Firebase**
**Por que:** Backend-as-a-Service do app.

**Tópicos:**
#### Firebase Auth
- OAuth 2.0 flow
- Google Sign-In
- Token management
- Session persistence

#### Firestore
- NoSQL document database
- Collections e documents
- Queries (where, orderBy, limit)
- Real-time listeners (onSnapshot)
- Batch operations
- Security rules
- Indexes

**Recursos:**
- Firebase Docs: https://firebase.google.com/docs
- Fireship.io - Firebase videos: https://www.youtube.com/@Fireship

---

### 6. **State Management (Context API)**
**Por que:** Gerenciar estado global.

**Tópicos:**
- React Context
- useContext hook
- Provider pattern
- Context composition
- Performance considerations
- Quando usar Context vs prop drilling

**Recursos:**
- Kent C. Dodds - Application State Management: https://kentcdodds.com/blog/application-state-management-with-react

---

### 7. **Styling (Tamagui)**
**Por que:** Design system do app.

**Tópicos:**
- Design tokens
- Styled components
- Theme switching
- Responsive design
- Performance otimization

**Recursos:**
- Tamagui Docs: https://tamagui.dev/

---

### 8. **Async Programming**
**Por que:** Toda comunicação com Firebase é assíncrona.

**Tópicos:**
- Promises
- async/await
- Error handling (try/catch)
- Promise.all
- Race conditions

---

### 9. **React Native Navigation**
**Por que:** Navegação entre telas.

**Tópicos (Expo Router):**
- File-based routing
- Stack navigation
- Redirect
- Route parameters
- Protected routes

**Recursos:**
- Expo Router Docs: https://docs.expo.dev/router/

---

### 10. **Build & Deployment**
**Por que:** Publicar app na Play Store.

**Tópicos:**
- Android Studio
- Gradle
- APK vs AAB
- Signing keys
- Play Console
- Release management
- Over-the-air updates (Expo)

---

## 💡 Conceitos Importantes

### 1. Component Lifecycle
React Native usa mesmos conceitos de React web:
```typescript
useEffect(() => {
  // ComponentDidMount: executa ao montar
  
  return () => {
    // ComponentWillUnmount: cleanup
  };
}, []); // Dependency array vazio = só executa uma vez
```

---

### 2. Real-time Sync (Firestore)
```typescript
// Bad: Polling
setInterval(async () => {
  const clips = await fetchClips();
  setClips(clips);
}, 5000);

// Good: Listener
const unsubscribe = onSnapshot(query, (snapshot) => {
  setClips(snapshot.docs.map(doc => doc.data()));
});
```

**Por que listener é melhor:**
- Menor latência (instant updates)
- Menos requests (só quando muda)
- Menos bateria consumida

---

### 3. Persistência Local
```typescript
// Salvar
await AsyncStorage.setItem("key", "value");

// Ler
const value = await AsyncStorage.getItem("key");

// Deletar
await AsyncStorage.removeItem("key");
```

**Uso:**
- Preferências do usuário (tema, idioma)
- Cache de dados
- Tokens de autenticação

---

### 4. Context Pattern
```typescript
// Criar contexto
const ThemeContext = createContext<ThemeContextType>();

// Provider
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Consumir
function MyComponent() {
  const { theme } = useContext(ThemeContext);
  return <View style={{ backgroundColor: theme === "light" ? "#fff" : "#000" }} />;
}
```

---

### 5. OAuth Flow
```
1. App > Google: "Quero autenticar usuário"
2. Google > Usuário: "Permitir acesso?"
3. Usuário > Google: "Sim"
4. Google > App: Código de autorização
5. App > Google: Troca código por token
6. App > Firebase: Token do Google
7. Firebase: Valida e cria sessão
8. App: Recebe user object
```

---

## 🛠️ Tarefas Comuns

| Tarefa | Arquivos | Passos |
|--------|----------|--------|
| Adicionar campo no clip | `firestore.ts`, Firestore rules | 1. Atualizar type `Clip`<br>2. Adicionar campo em `addClip()`<br>3. Atualizar rules se necessário |
| Nova tela | `app/nova-tela.tsx` | 1. Criar arquivo<br>2. Exportar componente default<br>3. Adicionar no Stack (se necessário) |
| Mudar cor do tema | `tamagui.config.ts` | Atualizar tokens em `themes.light` e `themes.dark` |
| Novo contexto | `src/contexts/MeuContext.tsx` | 1. Criar Context<br>2. Criar Provider<br>3. Adicionar em `_layout.tsx` |
| Nova integração externa | `src/lib/minha-api.ts` | Criar funções e exports |
| Adicionar validação | TypeScript types | Adicionar constraints nos types |
| Mudar navegação | `_layout.tsx` ou telas | Atualizar Stack.Screen ou usar `router.push()` |

---

## 📚 Plano de Estudos

### Fundamentos JavaScript/TypeScript
- [ ] ES6+ features
- [ ] Promises e async/await
- [ ] TypeScript basics (types, interfaces)
- [ ] Generics
- **Projeto prático:** Refatorar função JS para TS com types

---

### React & Hooks
- [ ] Componentes funcionais
- [ ] useState, useEffect, useContext
- [ ] Lifecycle
- [ ] Conditional rendering
- **Projeto prático:** ToDo app com React web

---

### React Native Basics
- [ ] View, Text, ScrollView, FlatList
- [ ] Flexbox layout
- [ ] StyleSheet
- [ ] Platform-specific code
- **Projeto prático:** Converter ToDo para React Native

---

### Expo & Navegação
- [ ] Expo CLI
- [ ] Expo Router
- [ ] Navegação entre telas
- [ ] AsyncStorage
- **Projeto prático:** App multi-tela com persistência

---

### Firebase
- [ ] Firebase Auth (Google Sign-In)
- [ ] Firestore queries
- [ ] Real-time listeners
- [ ] Security rules
- **Projeto prático:** Chat app simples

---

### State Management
- [ ] Context API
- [ ] Provider pattern
- [ ] Custom hooks
- **Projeto prático:** Refatorar app anterior com Context

---

### Styling & UI
- [ ] Tamagui
- [ ] Design tokens
- [ ] Tema dinâmico
- **Projeto prático:** Adicionar design system ao app

---

### Build & Deploy
- [ ] Android Studio
- [ ] Gradle
- [ ] Play Console
- [ ] Release build
- **Projeto prático:** Publicar app de teste na Play Store (internal testing)

---

## 🎯 Próximos Passos

Depois de completar o plano de estudos:

1. **Contribua com o Crossclip**
   - Adicione feature nova (ex: busca de clips)
   - Refatore código legado
   - Escreva testes

2. **Explore Tópicos Avançados**
   - React Native Reanimated (animações)
   - Zustand ou Redux (state management)
   - React Query (cache de API)
   - Detox (testes E2E)

3. **Build seu próprio app**
   - Use Crossclip como base
   - Aplique os conceitos aprendidos
   - Publique na Play Store

---

## 📖 Recursos Extras

### Documentação Oficial
- React Native: https://reactnative.dev/
- Expo: https://docs.expo.dev/
- Firebase: https://firebase.google.com/docs
- TypeScript: https://www.typescriptlang.org/docs/
- Tamagui: https://tamagui.dev/

### Blogs
- Kent C. Dodds
- Dan Abramov (Overreacted)
- React Native Blog

---

## ✅ Checklist de Domínio

Você dominou Crossclip quando conseguir:

- [ ] Explicar o fluxo completo de login
- [ ] Adicionar nova tela sem consultar docs
- [ ] Implementar CRUD em novo recurso
- [ ] Debugar issues no Firebase
- [ ] Explicar o Context API
- [ ] Criar componente estilizado com Tamagui
- [ ] Fazer build de produção
- [ ] Entender Firestore security rules
- [ ] Implementar persistência local
- [ ] Fazer deploy na Play Store

---

**Boa sorte nos estudos! 🚀**

Se tiver dúvidas, abra uma issue no GitHub ou consulte os recursos listados acima.
# Guia para Transformar em APK (Android)

Este projeto já está configurado com o **Capacitor**, o que permite transformar a aplicação web em um aplicativo Android (.apk) nativo com suporte a anúncios (AdMob), notificações locais e feedback tátil (Haptics).

## 1. Pré-requisitos
Antes de gerar o APK, você precisa ter instalado no seu computador:
- **Node.js**
- **Android Studio**
- **Java JDK 17+**

## 2. Preparação do Build
No terminal do seu computador (dentro da pasta do projeto), execute:

```bash
# 1. Instalar as dependências
npm install

# 2. Gerar o build da aplicação web
npm run build

# 3. Sincronizar com o projeto Android
npx cap add android
npx cap sync
```

## 3. Configuração de Monetização (AdMob)
Para que os anúncios reais funcionem, você deve:
1. Abrir o arquivo `android/app/src/main/AndroidManifest.xml`.
2. Adicionar o seu **ID de Aplicativo AdMob** dentro da tag `<application>`:

```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-3586961197855784~XXXXXXXXXX"/>
```

*Nota: Você deve substituir `ca-app-pub...` pelo seu ID real obtido no painel do AdMob.*

## 4. Gerar o APK no Android Studio
1. Abra o **Android Studio**.
2. Vá em **File > Open** e selecione a pasta `android` deste projeto.
3. Aguarde o Gradle sincronizar tudo.
4. Clique em **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
5. O Android Studio irá gerar o arquivo `.apk` que você pode instalar no seu celular.

## 5. Recursos Offline
O aplicativo já conta com:
- **Service Worker**: Cacheia os arquivos principais para que o app abra sem internet.
- **Questões Offline**: Uma base de dados local de questões em `src/pages/Quiz.tsx`.
- **Persistência Local**: Usamos o plugin `@capacitor/preferences` para garantir que seus pontos e vidas não sumam quando o app é fechado.

## 6. Personalização (Ícone e Splash)
Para trocar o ícone do aplicativo:
1. Substitua as imagens na pasta `android/app/src/main/res`.
2. Ou use a ferramenta `@capacitor/assets` para gerar automaticamente a partir de um logo.

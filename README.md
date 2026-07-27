# Snake DeepSeek para Android

Aplicación Android mínima que ejecuta el juego Snake original desde `app/src/main/assets/index.html` dentro de un `WebView` local.

## Características

- Funciona sin conexión.
- No solicita permiso de Internet.
- No incorpora rastreadores ni servicios externos.
- Compatible desde Android 6.0 (API 23).
- APK de depuración generado por GitHub Actions con herramientas oficiales de Android.

## Compilación

El flujo `.github/workflows/build-apk.yml` instala JDK 17, Gradle 8.9 y Android SDK 35, ejecuta `:app:assembleDebug`, verifica el APK con `apksigner` y publica el resultado como artefacto.

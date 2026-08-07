# PROJECT_STATE.md

## Estado
- Producto: Albion Marketrelli.
- Plataforma: Android APK.
- Versión: 1.1.1 (versionCode 3).
- Application ID: `cl.javiersanmartin.albionmarketrelli`.
- minSdk: 26.
- targetSdk / compileSdk: 35.
- Arquitectura: actividad Java mínima + WebViewAssetLoader + aplicación web integrada.

## Alcance
- Servidor América fijo.
- Comparación de Bridgewatch, Martlock, Fort Sterling, Lymhurst, Thetford, Caerleon, Brecilien y Mercado Negro.
- Cinco calidades, búsqueda por nombre/ID, tier/encantamiento, edad de observación y actualización automática cada 30 segundos.
- Mercado Negro excluido de la comparación de compra e incluido en la comparación de venta.
- Catálogo validado con objetos conocidos antes de actualizar la caché.
- Diseño responsive validado en 320, 360, 393 y 412 px.
- Insets procesados mediante AndroidX WindowInsetsCompat para navegación por gestos, tres botones y teclado.
- Arranque defensivo: si WebView falla, la actividad muestra el error en pantalla en vez de cerrarse.

## Corrección 1.1.1
- Sustituido el manejo directo de WindowInsets de plataforma por AndroidX WindowCompat/WindowInsetsCompat.
- Puente JavaScript expuesto mediante clase pública.
- Añadido fallback de diagnóstico de arranque.
- Smoke test de arranque completado correctamente en emulador Android 16 / API 36.
- La actividad realizó arranque en frío, el proceso permaneció activo y no hubo `FATAL EXCEPTION` del paquete en logcat.
- Build validado por GitHub Actions, run `31178009470`.
- SHA-256 APK: `cf81d022d01ceefea0ea8f52f6309a8282977738dca637dc2a6b14c10c1a0ce9`.

## Limitaciones
- Los precios dependen de observaciones remitidas a Albion Online Data Project.
- El APK requiere Internet para catálogo, iconos y precios.
- Los nombres se muestran en inglés según la fuente original.
- Un registro sin observaciones no implica que el objeto sea inexistente o no comerciable.
- La entrega usa firma de depuración de CI. El certificado de 1.1.1 difiere del APK 1.1.0 anterior, por lo que se debe desinstalar 1.1.0 antes de instalar 1.1.1.

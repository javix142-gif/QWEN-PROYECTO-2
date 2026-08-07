# Build aislado de Albion Marketrelli 1.1.0

Esta rama contiene la compilación Android solicitada para **Albion Marketrelli**. El trabajo permanece separado de la aplicación Snake de la rama `main`.

La fuente completa se reconstruye dentro de GitHub Actions desde fragmentos Base64 y se valida antes de compilar.

- SHA-256 de la fuente: `3e5b595b96570b91962b1532521b8b2c301cecee4453dc2fd2ebe4a2cc995b1b`
- Módulo: `albionapp`
- Application ID: `cl.javiersanmartin.albionmarketrelli`
- Versión: `1.1.0` (`versionCode 2`)
- Android mínimo: API 26
- Target SDK: API 35
- Salida: `Albion_Marketrelli-v1.1.0.apk`

## Alcance

- corrección del desbordamiento horizontal;
- insets de barras del sistema, recorte e IME para Android 15;
- ícono personalizado dentro de la interfaz;
- nombre uniforme y agente de usuario `AlbionMarketrelli/1.1.0`;
- catálogo con nombres originales, tier y encantamiento;
- textos precisos sobre registros y ausencia de observaciones;
- Mercado Negro excluido de compras e incluido en órdenes para vender;
- validación automática de objetos conocidos;
- pruebas responsive de 320, 360, 393 y 412 px, navegación por gestos y tres botones.

## Validación de CI

GitHub Actions ejecuta pruebas Node, sintaxis JavaScript, pruebas responsive con navegador real, pruebas unitarias Java, compilación Android y verificación de firma, versión, metadatos y contenido del APK.
